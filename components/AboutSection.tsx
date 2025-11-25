
import React from 'react';
import { useLanguage } from '../App';
import { Target, Eye, Leaf } from './Icons';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-50 dark:bg-green-900/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 dark:bg-blue-900/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fadeIn">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-200 mb-6">{t('aboutUsTitle')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('aboutUsDescription')}
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 flex flex-col items-start animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-6">
                    <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('missionTitle')}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t('missionText')}
                </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 flex flex-col items-start animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-6">
                    <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('visionTitle')}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t('visionText')}
                </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
