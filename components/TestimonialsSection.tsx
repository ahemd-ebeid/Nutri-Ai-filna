import React, { useState, useEffect } from 'react';
import { useLanguage, useAuth } from '../App';
import { Star, User, Quote } from './Icons';
import { testimonialService } from '../services/testimonialService';
import type { Testimonial } from '../types';

const StarRating: React.FC<{ rating: number; onRatingChange?: (rating: number) => void }> = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const isInteractive = !!onRatingChange;

    return (
        <div className={`flex gap-1 ${isInteractive ? 'cursor-pointer' : ''}`} onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}>
            {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= (hoverRating || rating);
                return (
                    <Star
                        key={index}
                        className={`w-5 h-5 transition-colors ${isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                        onClick={isInteractive ? () => onRatingChange(starValue) : undefined}
                        onMouseEnter={isInteractive ? () => setHoverRating(starValue) : undefined}
                    />
                );
            })}
        </div>
    );
};

const TestimonialCard: React.FC<{ name: string; quote: string; avatar: string; rating: number }> = ({ name, quote, avatar, rating }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center h-full transform transition-transform duration-300 hover:-translate-y-2">
    <img src={avatar} alt={name} className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-green-200 dark:border-green-700" />
    <StarRating rating={rating} />
    <p className="text-gray-600 dark:text-gray-400 italic my-4 flex-grow">"{quote}"</p>
    <h4 className="font-bold text-green-800 dark:text-green-300">{name}</h4>
  </div>
);

const AddTestimonialForm: React.FC<{ onAddTestimonial: (testimonial: Testimonial) => void }> = ({ onAddTestimonial }) => {
    const { t } = useLanguage();
    const { currentUser } = useAuth();
    const [quote, setQuote] = useState('');
    const [rating, setRating] = useState(5);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quote.trim() || !currentUser) return;
        
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const newTestimonial = testimonialService.addTestimonial({
                userId: currentUser.id,
                username: currentUser.username,
                quote,
                rating
            });
            setSuccess(t('testimonialSuccessMessage'));
            onAddTestimonial(newTestimonial);
            setQuote('');
            setRating(5);
        } catch (err) {
            setError(err instanceof Error ? (err.message.includes("submitted a review") ? t('testimonialErrorDuplicate') : err.message) : 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-12">
            <h3 className="text-xl font-bold text-center text-green-900 dark:text-green-200 mb-4">{t('addTestimonialTitle')}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder={t('yourExperiencePlaceholder')}
                    className="w-full p-3 h-28 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                    required
                />
                <div className="flex items-center justify-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">{t('ratingLabel')}:</label>
                    <StarRating rating={rating} onRatingChange={setRating} />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                >
                    {isLoading ? '...' : t('submitButton')}
                </button>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}
            </form>
        </div>
    );
};


const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setUserTestimonials(testimonialService.getTestimonials());
  }, []);

  const handleAddTestimonial = (testimonial: Testimonial) => {
    setUserTestimonials(prev => [testimonial, ...prev]);
  };
  
  return (
    <section className="py-20 bg-green-50/50 dark:bg-gray-800/30 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-900 dark:text-green-200 mb-12">{t('testimonialsTitle')}</h2>
        
        {userTestimonials.length === 0 ? (
            <div className="text-center py-16 px-6 bg-gray-50 dark:bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Quote className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Reviews Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Be the first to share your experience with NutriAI!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {userTestimonials.map((testimonial, index) => (
                    <div key={testimonial.id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms`}}>
                        <TestimonialCard 
                            name={testimonial.username} 
                            quote={testimonial.quote} 
                            avatar={testimonial.avatar} 
                            rating={testimonial.rating} 
                        />
                    </div>
                ))}
            </div>
        )}
        
        {currentUser ? (
            <AddTestimonialForm onAddTestimonial={handleAddTestimonial} />
        ) : (
             <div className="text-center mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-2xl mx-auto">
                <User className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">{t('loginToReviewPrompt')}</p>
            </div>
        )}

      </div>
    </section>
  );
};

export default TestimonialsSection;