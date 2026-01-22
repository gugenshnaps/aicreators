'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  onSuccess?: (user: { id: string; name: string; username?: string; photo?: string; email?: string }) => void;
}

export default function AuthModal({ isOpen, onClose, mode, onSuccess }: AuthModalProps) {
  const [authMethod, setAuthMethod] = useState<'email' | 'telegram'>('email');
  const [isLogin, setIsLogin] = useState(mode === 'open');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLogin(mode === 'open');
  }, [mode]);

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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const user = {
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email,
            photo: data.user.user_metadata?.avatar_url,
          };
          
          localStorage.setItem('user', JSON.stringify(user));
          onSuccess?.(user);
          resetForm();
          onClose();
        }
      } else {
        // Register
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          const user = {
            id: data.user.id,
            name: name || email.split('@')[0],
            email: data.user.email,
          };
          
          localStorage.setItem('user', JSON.stringify(user));
          onSuccess?.(user);
          resetForm();
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.message === 'Invalid login credentials') {
        setError('Неверный email или пароль');
      } else if (err.message === 'User already registered') {
        setError('Пользователь уже зарегистрирован');
      } else {
        setError(err.message || 'Произошла ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramAuth = (telegramUser: TelegramUser) => {
    const user = {
      id: telegramUser.id.toString(),
      name: [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' '),
      username: telegramUser.username,
      photo: telegramUser.photo_url,
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    onSuccess?.(user);
    onClose();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
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
        className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
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
          className="text-3xl text-center mb-2"
          style={{ fontFamily: 'var(--font-londrina-shadow)', color: '#2F00FF' }}
        >
          {isLogin ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}
        </h2>
        
        <p className="text-gray-500 text-center mb-6">
          {isLogin ? 'Войдите в аккаунт' : 'Создайте аккаунт креатора'}
        </p>

        {/* Auth Method Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
              authMethod === 'email'
                ? 'bg-[#2F00FF] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📧 Email
          </button>
          <button
            onClick={() => setAuthMethod('telegram')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
              authMethod === 'telegram'
                ? 'bg-[#0088cc] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ✈️ Telegram
          </button>
        </div>

        {authMethod === 'email' ? (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как вас зовут?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#2F00FF' }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Загрузка...
                </>
              ) : (
                isLogin ? 'Войти' : 'Зарегистрироваться'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Telegram Login Button */}
            <div className="flex justify-center py-4">
              <TelegramLoginButton
                botName="aicreatorslog_bot"
                onAuth={handleTelegramAuth}
                buttonSize="large"
                cornerRadius={20}
                showUserPic={true}
                lang="ru"
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 text-center">
                🔒 Мы получим только ваше имя и фото профиля.
                <br />
                Доступа к чатам и телефону у нас не будет.
              </p>
            </div>

            {/* Fallback test button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  const testUser: TelegramUser = {
                    id: Date.now(),
                    first_name: 'Тестовый',
                    last_name: 'Креатор',
                    username: 'test_creator',
                    photo_url: '',
                    auth_date: Math.floor(Date.now() / 1000),
                    hash: 'test'
                  };
                  handleTelegramAuth(testUser);
                }}
                className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Войти без Telegram (для теста)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
