



// Implemented the main App component to provide structure and context to the application.
import React, { useState, createContext, useContext, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import TipsSection from './components/TipsSection';
import FitnessAISection from './components/FitnessAISection';
import BMICalculatorSection from './components/BMICalculatorSection';
import MealPlannerSection from './components/MealPlannerSection';
import HealthTasksSection from './components/HealthTasksSection';
import SleepTrackerSection from './components/SleepTrackerSection';
import GallerySection from './components/GallerySection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import Chatbot from './components/ChatbotSection';
import AuthModal from './components/AuthModal';
import DailyInsights from './components/DailyInsights';
import SectionWrapper from './components/SectionWrapper';
import { BotMessageSquare, TrendingUp } from './components/Icons';

import type { Language, Theme, User } from './types';
import { translations } from './constants/localization';
import { authService } from './services/authService';
import { gamificationService } from './services/gamificationService';


// --- Language Context ---
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};

// --- Theme Context ---
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

// --- Auth Context ---
interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}


const App: React.FC = () => {
    // Changed default language to 'ar' (Arabic)
    const [language, setLanguageState] = useState<Language>('ar');
    const [theme, setTheme] = useState<Theme>('light');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [streak, setStreak] = useState(0);

    // --- Draggable FAB Logic ---
    const fabRef = useRef<HTMLButtonElement>(null);
    const [fabPosition, setFabPosition] = useState({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const dragStartPosRef = useRef({ x: 0, y: 0 });
    const fabStartPosRef = useRef({ x: 0, y: 0 });
    const hasDraggedRef = useRef(false);

    const handleFabClick = () => {
        if (!hasDraggedRef.current) {
            setIsChatOpen(true);
        }
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        isDraggingRef.current = true;
        // Reset drag flag on new drag start
        setTimeout(() => { hasDraggedRef.current = false; }, 0);

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        dragStartPosRef.current = { x: clientX, y: clientY };
        fabStartPosRef.current = { ...fabPosition };

        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('touchmove', handleDragMove, { passive: false });
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchend', handleDragEnd);
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
        if (!isDraggingRef.current) return;
        
        if (e.type === 'touchmove') {
            e.preventDefault();
        }

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - dragStartPosRef.current.x;
        const deltaY = clientY - dragStartPosRef.current.y;
        
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            hasDraggedRef.current = true;
        }

        setFabPosition({ 
            x: fabStartPosRef.current.x + deltaX, 
            y: fabStartPosRef.current.y + deltaY 
        });
    };

    const handleDragEnd = () => {
        isDraggingRef.current = false;
        
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchend', handleDragEnd);
    };
    // --- End Draggable FAB Logic ---


    useEffect(() => {
        const loggedInUser = authService.getCurrentUser();
        if(loggedInUser) {
            setCurrentUser(loggedInUser);
        }
        
        // Update Streak on load
        setStreak(gamificationService.updateStreak());
    }, []);

    const login = (user: User) => {
        setCurrentUser(user);
        authService.setCurrentUser(user);
        // Streak might update on explicit login if we wanted, but we do it on app load generally.
        setStreak(gamificationService.getStreak());
    }

    const logout = () => {
        setCurrentUser(null);
        authService.clearCurrentUser();
    }


    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);
    
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };
    
    const t = (key: keyof typeof translations.en): string => {
        return translations[language][key] || translations.en[key];
    };

    const languageContextValue = useMemo(() => ({ language, setLanguage, t }), [language]);
    const themeContextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);
    const authContextValue = useMemo(() => ({ currentUser, login, logout }), [currentUser]);


  return (
    <LanguageContext.Provider value={languageContextValue}>
      <ThemeContext.Provider value={themeContextValue}>
        <AuthContext.Provider value={authContextValue}>
            <div className={`font-sans bg-gray-50 dark:bg-gray-950 transition-colors duration-300 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                <Header onLoginClick={() => setIsAuthModalOpen(true)} />
                
                {/* Streak Banner */}
                <div className="fixed top-24 right-4 z-40 hidden md:flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur p-2 rounded-full shadow-lg border border-green-200 dark:border-green-900 animate-fadeIn">
                    <span className="bg-orange-100 p-1 rounded-full"><TrendingUp className="w-5 h-5 text-orange-500"/></span>
                    <span className="font-bold text-gray-800 dark:text-white px-1">{streak} {t('days')}</span>
                </div>

                <main className="pt-24">
                    <SectionWrapper id="hero">
                        <HeroSection onOpenChat={() => setIsChatOpen(true)} />
                    </SectionWrapper>
                    
                    <SectionWrapper id="insights" delay={0.2}>
                        <DailyInsights />
                    </SectionWrapper>

                    <SectionWrapper id="about">
                        <AboutSection />
                    </SectionWrapper>
                    
                    <SectionWrapper id="tips">
                        <TipsSection />
                    </SectionWrapper>
                    
                    <SectionWrapper>
                        <FitnessAISection />
                    </SectionWrapper>
                    
                    <SectionWrapper id="bmi">
                        <BMICalculatorSection />
                    </SectionWrapper>
                    
                    <SectionWrapper id="meal">
                        <MealPlannerSection />
                    </SectionWrapper>
                    
                    <SectionWrapper id="tasks">
                        <HealthTasksSection />
                    </SectionWrapper>

                    <SectionWrapper id="sleep">
                        <SleepTrackerSection />
                    </SectionWrapper>
                    
                    <SectionWrapper>
                        <GallerySection />
                    </SectionWrapper>
                    
                    <SectionWrapper>
                        <TestimonialsSection />
                    </SectionWrapper>
                </main>
                <Footer />
                <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                 {!isChatOpen && (
                    <button
                        ref={fabRef}
                        onClick={handleFabClick}
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                        style={{ transform: `translate(${fabPosition.x}px, ${fabPosition.y}px)` }}
                        className={`fixed bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} z-40 bg-green-600 text-white w-20 h-20 p-4 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2 animate-pulse-shadow cursor-grab active:cursor-grabbing`}
                        aria-label="Open chat assistant"
                    >
                        <BotMessageSquare className="w-10 h-10" />
                    </button>
                )}
                {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
            </div>
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
