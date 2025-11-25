
import type { SleepLog, SleepQuality } from '../types';

const SLEEP_KEY = 'nutriai_sleep_logs';

const getLogs = (): SleepLog[] => {
    const logsJson = localStorage.getItem(SLEEP_KEY);
    return logsJson ? JSON.parse(logsJson) : [];
};

const saveLogs = (logs: SleepLog[]) => {
    localStorage.setItem(SLEEP_KEY, JSON.stringify(logs));
};

export const sleepService = {
    getLogsByUserId(userId: number): SleepLog[] {
        const allLogs = getLogs();
        return allLogs
            .filter(log => log.userId === userId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },

    addLog(logData: { userId: number; date: string; hours: number; quality: SleepQuality }): SleepLog {
        const allLogs = getLogs();
        // Check if log exists for date and user, update if so
        const existingIndex = allLogs.findIndex(l => l.userId === logData.userId && l.date === logData.date);
        
        let newLog: SleepLog;

        if (existingIndex !== -1) {
             newLog = { ...allLogs[existingIndex], ...logData };
             allLogs[existingIndex] = newLog;
        } else {
             newLog = {
                id: Date.now(),
                ...logData
            };
            allLogs.push(newLog);
        }

        saveLogs(allLogs);
        return newLog;
    },

    getAverageSleep(userId: number): string {
        const logs = this.getLogsByUserId(userId);
        if (logs.length === 0) return "0";
        const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);
        return (totalHours / logs.length).toFixed(1);
    }
};
