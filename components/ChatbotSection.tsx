import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import type { ChatMessage } from '../types';
import { startChatSession } from '../services/geminiService';
import { Bot, Send, User, X, Mic, Image } from './Icons';
import type { Chat } from '@google/genai';

// FIX: Define SpeechRecognition interfaces for TypeScript to avoid errors in browsers that support it.
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
  start(): void;
  stop(): void;
  abort(): void;
}

// Add SpeechRecognition type declaration for window object
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // New state and refs for voice and image input
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  // Initialize chat session
  useEffect(() => {
    if (isOpen && !chat) {
        setChat(startChatSession());
    }
  }, [isOpen, chat]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setUserInput(finalTranscript || interimTranscript);
        };

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
        
        recognitionRef.current = recognition;
    } else {
        console.warn("Speech Recognition not supported by this browser.");
    }
    
    return () => {
        recognitionRef.current?.abort();
    };
  }, []);

  const handleMicClick = () => {
      if (!recognitionRef.current) return;
      if (isListening) {
          recognitionRef.current.stop();
      } else {
          // Explicitly set language before starting to ensure it matches current state
          // Use 'ar-SA' for Arabic and 'en-US' for English
          recognitionRef.current.lang = language === 'ar' ? 'ar-SA' : 'en-US';
          setUserInput('');
          recognitionRef.current.start();
      }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chat) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const imageDataUrl = reader.result as string;

        const userMessage: ChatMessage = {
            sender: 'user',
            text: language === 'ar' ? 'حلل هذه الصورة من فضلك' : 'Please analyze this image',
            image: imageDataUrl,
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const imagePart = { inlineData: { mimeType: file.type, data: base64Data } };
            const textPart = { text: language === 'ar' ? 'ماذا يوجد في هذه الصورة؟ قم بتحليل الطعام وقدم تفصيلاً غذائياً للسعرات الحرارية والماكروز.' : 'What is in this image? Analyze the food and provide a nutritional breakdown of calories and macros.' };
            
            // Pass array of parts to sendMessage
            const response = await chat.sendMessage({ message: [textPart, imagePart] });

            const aiMessage: ChatMessage = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { sender: 'ai', text: error instanceof Error ? error.message : "An unexpected error occurred while analyzing the image." };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    if (e.target) e.target.value = ''; // Reset file input
    reader.readAsDataURL(file);
  };


  const handleSendTextMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: userInput };
    setMessages((prev) => [...prev, newUserMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: currentInput });
      const newAiMessage: ChatMessage = { sender: 'ai', text: response.text };
      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        sender: 'ai',
        text: error instanceof Error ? error.message : "An unexpected error occurred.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-0 ${language === 'ar' ? 'md:left-6 left-0' : 'md:right-6 right-0'} md:bottom-24 w-full md:w-[400px] h-[70vh] md:h-[600px] z-50 transition-all duration-500 ease-out ${isOpen ? 'transform translate-y-0 scale-100 opacity-100' : 'transform translate-y-full scale-95 opacity-0 pointer-events-none'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col h-full">
        <header className="flex justify-between items-center p-4 bg-green-600 text-white rounded-t-lg md:rounded-t-2xl flex-shrink-0">
            <h3 className="font-bold text-lg">{t('chatbotTitle')}</h3>
            <button onClick={onClose} aria-label="Close chat" className="p-1 rounded-full hover:bg-green-700 transition-colors">
                <X className="w-6 h-6" />
            </button>
        </header>
        <div ref={chatContainerRef} className="message-container flex-1 p-4 md:p-6 space-y-5 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 message-item ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'ai' && (
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                )}
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-none ltr:rounded-br-none rtl:rounded-bl-none'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-none ltr:rounded-bl-none rtl:rounded-br-none'
                  }`}
                >
                  {msg.image && <img src={msg.image} alt="User upload" className="rounded-lg mb-2 max-w-full h-auto border border-white/20" />}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                 {msg.sender === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3 message-item">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="max-w-md px-4 py-3 rounded-2xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        <form onSubmit={handleSendTextMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 flex-shrink-0">
            <button type="button" onClick={handleMicClick} className={`p-3 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isListening ? 'text-red-500 animate-pulse' : ''}`} aria-label="Use voice input">
                <Mic className="w-6 h-6" />
            </button>
            <button type="button" onClick={handleImageButtonClick} className="p-3 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Upload image">
                <Image className="w-6 h-6" />
            </button>
             <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={t('chatbotPlaceholder')}
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition"
              aria-label="Send message"
            >
              <Send className="w-6 h-6" />
            </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;