
import React from 'react';
import { useLanguage } from '../App';

const TipCard: React.FC<{ imgSrc: string; title: string; text: string; alt: string; index: number }> = ({ imgSrc, title, text, alt, index }) => (
    <div 
        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full animate-fadeIn border border-gray-100 dark:border-gray-700"
        style={{ animationDelay: `${index * 200}ms` }}
    >
        <div className="relative h-56 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10"></div>
            <img 
                src={imgSrc} 
                alt={alt} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                loading="lazy" 
            />
            <div className="absolute bottom-4 left-4 right-4 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                 <div className="h-1 w-12 bg-green-500 rounded-full mb-2 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
        </div>
        <div className="p-8 flex flex-col flex-grow relative">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 mb-3">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow text-lg">{text}</p>
        </div>
    </div>
);

const TipsSection: React.FC = () => {
  const { t } = useLanguage();

  const tips = [
    {
      imgSrc: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
      alt: 'A healthy bowl of salad',
      title: t('nutritionTipTitle'),
      text: t('nutritionTipText'),
    },
    {
      imgSrc: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=1887&auto=format&fit=crop',
      alt: 'A glass of water with lemon slices',
      title: t('hydrationTipTitle'),
      text: t('hydrationTipText'),
    },
    {
      imgSrc: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=2070&auto=format&fit=crop',
      alt: 'Person sleeping peacefully',
      title: t('sleepTipTitle'),
      text: t('sleepTipText'),
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
             <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-full text-sm font-semibold mb-4 animate-fadeIn">
                Daily Wellness
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-green-900 dark:text-green-100 mb-6 tracking-tight animate-fadeIn" style={{ animationDelay: '100ms' }}>{t('dailyTipsTitle')}</h2>
            <div className="h-1.5 w-24 bg-green-500 mx-auto rounded-full animate-fadeIn" style={{ animationDelay: '200ms' }}></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {tips.map((tip, index) => (
            <TipCard key={index} {...tip} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
