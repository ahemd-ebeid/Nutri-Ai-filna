
import React, { useState, useEffect } from 'react';
import { useLanguage, useAuth } from '../App';
import type { SleepLog, SleepQuality } from '../types';
import { sleepService } from '../services/sleepService';
import { Moon, Clock, Activity, Plus, ClipboardList, TrendingUp } from './Icons';

const SleepTrackerSection: React.FC = () => {
    const { language, t } = useLanguage();
    const { currentUser } = useAuth();
    const [logs, setLogs] = useState<SleepLog[]>([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState(7);
    const [quality, setQuality] = useState<SleepQuality>('good');
    const [avgSleep, setAvgSleep] = useState("0");

    useEffect(() => {
        if (currentUser) {
            refreshLogs(currentUser.id);
        } else {
            setLogs([]);
        }
    }, [currentUser]);

    const refreshLogs = (userId: number) => {
        const userLogs = sleepService.getLogsByUserId(userId);
        setLogs(userLogs);
        setAvgSleep(sleepService.getAverageSleep(userId));
    };

    const handleAddLog = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        sleepService.addLog({
            userId: currentUser.id,
            date,
            hours,
            quality
        });
        
        refreshLogs(currentUser.id);
    };

    const getBarColor = (q: SleepQuality | null) => {
        if (!q) return 'bg-gray-200 dark:bg-gray-700';
        switch(q) {
            case 'good': return 'bg-gradient-to-t from-green-500 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]';
            case 'average': return 'bg-gradient-to-t from-yellow-400 to-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.4)]';
            case 'poor': return 'bg-gradient-to-t from-red-500 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
            default: return 'bg-gray-200 dark:bg-gray-700';
        }
    };
    
    // Helper to get day name from date string
    const getDayName = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' });
    };

    // Generate last 7 days data including empty days
    const getLast7DaysData = () => {
        const data = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const log = logs.find(l => l.date === dateStr);
            data.push({
                date: dateStr,
                dayName: getDayName(dateStr),
                hours: log ? log.hours : 0,
                quality: log ? log.quality : null
            });
        }
        return data;
    };

    const chartData = getLast7DaysData();
    const maxChartHours = 12;

    return (
        <section className="py-20 bg-indigo-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                     <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4 animate-fadeIn">
                        <Moon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>{t('sleepTrackerTitle')}</h2>
                    <p className="text-gray-600 dark:text-gray-400 animate-fadeIn" style={{ animationDelay: '0.2s' }}>{t('sleepTrackerDescription')}</p>
                </div>

                {!currentUser ? (
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl mx-auto animate-fadeIn">
                        <Moon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">{t('loginToTrackSleep')}</p>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Form Card */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl animate-fadeIn lg:col-span-1">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <Plus className="w-5 h-5 text-indigo-500" />
                                    {t('logSleep')}
                                </h3>
                                <form onSubmit={handleAddLog} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('date')}</label>
                                        <div className="relative">
                                            <input 
                                                type="date" 
                                                value={date} 
                                                onChange={(e) => setDate(e.target.value)}
                                                max={new Date().toISOString().split('T')[0]}
                                                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                                                required
                                            />
                                            <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('hoursSlept')}</label>
                                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">0h</span>
                                                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{hours}h</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">14h</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="14" 
                                                step="0.5" 
                                                value={hours} 
                                                onChange={(e) => setHours(parseFloat(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('sleepQuality')}</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(['good', 'average', 'poor'] as SleepQuality[]).map((q) => (
                                                <button
                                                    key={q}
                                                    type="button"
                                                    onClick={() => setQuality(q)}
                                                    className={`py-3 px-2 rounded-xl text-sm font-bold transition-all transform active:scale-95 ${quality === q 
                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                                >
                                                    {q === 'good' ? t('qualityGood') : q === 'average' ? t('qualityAverage') : t('qualityPoor')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 mt-2">
                                        {t('logSleep')}
                                    </button>
                                </form>
                            </div>

                            {/* Chart/Stats Card */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col animate-fadeIn lg:col-span-2" style={{ animationDelay: '0.1s' }}>
                                <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        <Activity className="w-6 h-6 text-indigo-500" />
                                        {t('last7Days')}
                                    </h3>
                                    <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
                                        <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">{t('avgSleep')}</span>
                                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{avgSleep}</span>
                                        <span className="text-xs text-indigo-500 dark:text-indigo-400 self-end mb-1">{t('hours')}</span>
                                    </div>
                                </div>
                                
                                <div className="flex-grow relative min-h-[250px] w-full mt-4">
                                     {/* Y-Axis Grid Lines */}
                                     <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 pl-8 pb-6">
                                        {[12, 9, 6, 3, 0].map((h) => (
                                            <div key={h} className="relative w-full border-b border-dashed border-gray-200 dark:border-gray-700 h-0 flex items-center">
                                                <span className="absolute -left-8 text-xs font-medium text-gray-400 w-6 text-right">{h}h</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bars */}
                                    <div className="absolute inset-0 flex items-end justify-between pl-8 pb-6 z-10 gap-2 md:gap-4">
                                        {chartData.map((data, index) => (
                                            <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
                                                 {/* Tooltip */}
                                                 <div className={`absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-200`}>
                                                    {data.hours}h • {data.quality ? t(`quality${data.quality.charAt(0).toUpperCase() + data.quality.slice(1)}` as any) : 'No Data'}
                                                </div>
                                                
                                                {/* Bar */}
                                                <div 
                                                    className={`w-full max-w-[40px] rounded-t-lg transition-all duration-700 ease-out relative group-hover:brightness-110 ${getBarColor(data.quality)}`}
                                                    style={{ 
                                                        height: `${Math.min((data.hours / maxChartHours) * 100, 100)}%`,
                                                        minHeight: data.hours > 0 ? '4px' : '0'
                                                    }}
                                                >
                                                    {data.hours === 0 && (
                                                        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full absolute bottom-0"></div>
                                                    )}
                                                </div>
                                                
                                                {/* X-Axis Label */}
                                                <div className="absolute -bottom-6 text-xs font-medium text-gray-500 dark:text-gray-400">{data.dayName}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="mt-8 flex justify-center gap-6 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 py-3 rounded-lg">
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gradient-to-t from-green-500 to-green-400"></div>{t('qualityGood')}</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gradient-to-t from-yellow-400 to-yellow-300"></div>{t('qualityAverage')}</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gradient-to-t from-red-500 to-red-400"></div>{t('qualityPoor')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent History List */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                                <ClipboardList className="w-6 h-6 text-indigo-500" />
                                {t('sleepHistory')}
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="py-4 px-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('date')}</th>
                                            <th className="py-4 px-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('hoursSlept')}</th>
                                            <th className="py-4 px-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('sleepQuality')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="text-center text-gray-500 py-8">No records found</td>
                                            </tr>
                                        ) : (
                                            [...logs].reverse().map((log) => (
                                                <tr key={log.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-indigo-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                                                    <td className="py-4 px-4 text-gray-800 dark:text-gray-200 font-medium">
                                                        {new Date(log.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-800 dark:text-gray-200">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <span className="font-bold">{log.hours}</span> {t('hours')}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm capitalize
                                                            ${log.quality === 'good' ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : 
                                                            log.quality === 'average' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' : 
                                                            'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'}`}>
                                                            {log.quality === 'good' ? t('qualityGood') : log.quality === 'average' ? t('qualityAverage') : t('qualityPoor')}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SleepTrackerSection;
