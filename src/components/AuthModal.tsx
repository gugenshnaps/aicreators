'use client';

import { useEffect } from 'react';
import TelegramLoginButton from './TelegramLoginButton';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'open' | 'reg';
  onSuccess?: (user: { id: string; name: string; username?: string; photo?: string }) => void;
}

export default function AuthModal({ isOpen, onClose, mode, onSuccess }: AuthModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleTelegramAuth = (telegramUser: TelegramUser) => {
    const user = {
      id: telegramUser.id.toString(),
      name: [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' '),
      username: telegramUser.username,
      photo: telegramUser.photo_url,
    };
    
    // Сохраняем в localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    onSuccess?.(user);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 
          className="text-3xl md:text-4xl text-center mb-2"
          style={{ fontFamily: 'var(--font-londrina-shadow)', color: '#2F00FF' }}
        >
          {mode === 'open' ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}
        </h2>
        
        <p className="text-gray-500 text-center mb-8">
          {mode === 'open' 
            ? 'Войдите через Telegram' 
            : 'Создайте аккаунт креатора'}
        </p>

        {/* Telegram Login Button */}
        <div className="flex justify-center mb-6">
          <TelegramLoginButton
            botName="aicreatorslog_bot"
            onAuth={handleTelegramAuth}
            buttonSize="large"
            cornerRadius={20}
            showUserPic={true}
            lang="ru"
          />
        </div>

        {/* Info */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500 text-center">
            🔒 Мы получим только ваше имя и фото профиля.
            <br />
            Доступа к чатам и телефону у нас не будет.
          </p>
        </div>
      </div>
    </div>
  );
}
