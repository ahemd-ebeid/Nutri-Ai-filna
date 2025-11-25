
import React, { useState } from 'react';
import { useLanguage } from '../App';
import { Sparkles, Utensils } from './Icons';

// Localized data for the component
const data = {
    en: {
        tips: [
            "Drink 2 liters of water daily.",
            "Sleep between 7 to 9 hours.",
            "Add vegetables to every meal.",
            "Walk 10 minutes after lunch.",
            "Reduce sugar intake as much as possible.",
            "Start your day with a glass of warm water.",
            "Eat enough protein.",
            "Practice deep breathing 3 times a day."
        ],
        snacks: [
            "Greek yogurt + tablespoon of oats",
            "Apple + tablespoon of peanut butter",
            "Greek yogurt + honey",
            "Handful of almonds or peanuts",
            "Piece of dark chocolate + coffee",
            "Banana + cinnamon"
        ]
    },
    ar: {
        tips: [
            "اشرب 2 لتر ماء يوميًا.",
            "نم بين 7 إلى 9 ساعات.",
            "اضف خضار لكل وجبة.",
            "امشي 10 دقائق بعد الغداء.",
            "قلل السكر قدر الإمكان.",
            "ابدأ يومك بكوب ماء دافئ.",
            "تناول بروتين كافي.",
            "مارس التنفس العميق 3 مرات يومياً."
        ],
        snacks: [
            "لبن رايب + معلقة شوفان",
            "تفاحة + معلقة زبدة فول سوداني",
            "زبادي يوناني + عسل",
            "حفنة لوز أو فول سوداني",
            "قطعة دارك شوكليت + قهوة",
            "موزة + قرفة"
        ]
    }
};

const DailyInsights: React.FC = () => {
    const { language, t } = useLanguage();
    const currentData = data[language];
    
    const [tipIndex, setTipIndex] = useState(0);
    const [snackIndex, setSnackIndex] = useState(0);

    const getNewTip = () => {
        let newIndex = Math.floor(Math.random() * currentData.tips.length);
        while (newIndex === tipIndex) newIndex = Math.floor(Math.random() * currentData.tips.length);
        setTipIndex(newIndex);
    };

    const getNewSnack = () => {
        let newIndex = Math.floor(Math.random() * currentData.snacks.length);
        while (newIndex === snackIndex) newIndex = Math.floor(Math.random() * currentData.snacks.length);
        setSnackIndex(newIndex);
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold text-center text-green-900 dark:text-green-200 mb-8">{t('dailyInsightsTitle')}</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Tip Card */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border-t-4 border-green-500 transform transition hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                            <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('tipOfTheDay')}</h3>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 min-h-[60px]">{currentData.tips[tipIndex]}</p>
                    <button
                        onClick={getNewTip}
                        className="mt-6 w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-md"
                    >
                        {t('newTip')}
                    </button>
                </div>

                {/* Snack Card */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border-t-4 border-yellow-500 transform transition hover:-translate-y-1">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
                            <Utensils className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('snackOfTheDay')}</h3>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 min-h-[60px]">{currentData.snacks[snackIndex]}</p>
                    <button
                        onClick={getNewSnack}
                        className="mt-6 w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-colors shadow-md"
                    >
                        {t('newSnack')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyInsights;
