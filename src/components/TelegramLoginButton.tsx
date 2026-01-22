'use client';

import { useEffect, useRef } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (user: TelegramUser) => void;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: 'write';
  showUserPic?: boolean;
  lang?: string;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void;
    };
  }
}

export default function TelegramLoginButton({
  botName,
  onAuth,
  buttonSize = 'large',
  cornerRadius = 20,
  requestAccess = 'write',
  showUserPic = true,
  lang = 'ru',
}: TelegramLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create global callback function
    window.TelegramLoginWidget = {
      dataOnauth: (user: TelegramUser) => {
        onAuth(user);
      },
    };

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-radius', cornerRadius.toString());
    script.setAttribute('data-request-access', requestAccess);
    script.setAttribute('data-userpic', showUserPic.toString());
    script.setAttribute('data-lang', lang);
    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    script.async = true;

    // Append script to container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, showUserPic, lang, onAuth]);

  return <div ref={containerRef} className="flex justify-center" />;
}
