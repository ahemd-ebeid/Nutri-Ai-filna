


import React, { useState, useEffect } from 'react';
import { useLanguage, useTheme, useAuth } from '../App';
import { Leaf, Sun, Moon as MoonIcon, LogOut, User, Menu } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => setLanguage(language === 'en' ? 'ar' : 'en');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setMobileMenuOpen(false);
    }
  };

  const navItems = [
      { name: t('navAbout'), id: 'about' },
      { name: t('navTips'), id: 'tips' },
      { name: t('navBMI'), id: 'bmi' },
      { name: t('navMeals'), id: 'meal' },
      { name: t('navTasks'), id: 'tasks' },
      { name: t('navSleep'), id: 'sleep' },
  ];

  return (
    <>
    <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-4 left-0 right-0 z-50 px-4 md:px-0 flex justify-center transition-all duration-300`}
    >
      <div className={`
        relative w-full max-w-5xl rounded-full backdrop-blur-lg shadow-lg border border-white/20 px-6 py-3 flex justify-between items-center transition-all duration-300
        ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 shadow-xl' : 'bg-white/70 dark:bg-gray-900/70'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="bg-green-100 dark:bg-green-900/50 p-1.5 rounded-full">
            <Leaf className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="hidden md:block text-lg font-bold text-green-800 dark:text-green-300 tracking-tight">{t('appName')}</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
                <button 
                    key={item.id} 
                    onClick={() => scrollToSection(item.id)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800 rounded-full transition-all"
                >
                    {item.name}
                </button>
            ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
           <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                aria-label={theme === 'light' ? t('toggleThemeDark') : t('toggleThemeLight')}
            >
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
                onClick={toggleLanguage}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm"
            >
                {language === 'en' ? 'AR' : 'EN'}
            </button>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

             {currentUser ? (
              <div className="flex items-center gap-2">
                   {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full border border-green-500" />
                  ) : (
                     <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <User className="w-4 h-4 text-green-700 dark:text-green-300" />
                    </div>
                  )}
                  <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors">
                      <LogOut className="w-5 h-5" />
                  </button>
              </div>
            ) : (
              <button
                  onClick={onLoginClick}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg"
              >
                  {t('login')}
              </button>
            )}
             <button className="md:hidden ml-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
        </div>
      </div>
    </motion.header>
    
    {/* Mobile Menu */}
    <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-24 left-4 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-40 p-4 border border-gray-100 dark:border-gray-700 md:hidden"
            >
                <div className="flex flex-col gap-2">
                     {navItems.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => scrollToSection(item.id)}
                            className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 rounded-xl transition-colors font-medium"
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </motion.div>
        )}
    </AnimatePresence>
    </>
  );
};

export default Header;
