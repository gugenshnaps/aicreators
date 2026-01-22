'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface HeaderProps {
  onOpenAuth: (mode: 'open' | 'reg') => void;
  user?: { id: string; name: string; username?: string; photo?: string } | null;
  onLogout?: () => void;
  onAddWork?: () => void;
  onOpenProfile?: () => void;
  onMyWorks?: () => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function Header({ 
  onOpenAuth, 
  user, 
  onLogout, 
  onAddWork, 
  onOpenProfile, 
  onMyWorks,
  selectedCategory,
  onCategoryChange 
}: HeaderProps) {
  const categories = ['VIDEO', 'IMAGE', 'FASHION', 'AVATAR', 'MARKETPLACE'];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white sticky top-0 z-40">
      {/* Top bar - Logo centered, auth on right */}
      <div className="relative flex items-center justify-center px-3 md:px-6 py-2 md:py-3 border-b border-gray-100">
        {/* Logo - centered */}
        <div className="flex items-center justify-center">
          <Image 
            src="/logoaicreators.svg" 
            alt="AI Creators" 
            width={120} 
            height={30}
            className="h-6 md:h-8 w-auto"
            priority
          />
        </div>

        {/* Auth buttons or User menu - absolute right */}
        <div className="absolute right-3 md:right-6 flex items-center">
          {user ? (
            <div className="relative flex items-center gap-2" ref={menuRef}>
              {/* Avatar */}
              <div 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-cover bg-center bg-gray-300"
                style={{ backgroundImage: user.photo ? `url(${user.photo})` : undefined }}
              />
              
              {/* Menu button (hamburger) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg 
                  className="w-6 h-6 text-gray-700" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenProfile?.();
                    }}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Мой профиль
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onMyWorks?.();
                    }}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Мои работы
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onAddWork?.();
                    }}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Добавить работу
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={() => onOpenAuth('open')}
                className="text-lg md:text-2xl tracking-wide hover:opacity-70 transition-opacity px-1 md:px-2 py-1"
                style={{ fontFamily: 'var(--font-londrina-shadow)', color: '#000000' }}
              >
                OPEN
              </button>
              <span 
                className="text-lg md:text-2xl px-0.5 md:px-1"
                style={{ fontFamily: 'var(--font-londrina-shadow)', color: '#000000' }}
              >
                /
              </span>
              <button 
                onClick={() => onOpenAuth('reg')}
                className="text-lg md:text-2xl tracking-wide hover:opacity-70 transition-opacity px-1 md:px-2 py-1"
                style={{ fontFamily: 'var(--font-londrina-shadow)', color: '#000000' }}
              >
                REG
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main title "Creators" */}
      <div className="flex justify-center py-1 md:py-2">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide cursor-pointer hover:opacity-80 transition-opacity"
          style={{ fontFamily: 'var(--font-londrina-shadow)', color: '#2F00FF' }}
          onClick={() => onCategoryChange(null)}
        >
          Creators
        </h1>
      </div>

      {/* Categories - scrollable on mobile */}
      <div className="flex justify-start md:justify-center gap-3 md:gap-6 lg:gap-8 py-2 md:py-3 overflow-x-auto px-3 md:px-6 scrollbar-hide">
        {/* ALL button */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`text-base md:text-lg lg:text-xl tracking-wide transition-all whitespace-nowrap flex-shrink-0 px-3 py-1 rounded-full ${
            selectedCategory === null 
              ? 'bg-black text-white' 
              : 'hover:opacity-70'
          }`}
          style={{ 
            fontFamily: 'var(--font-londrina-shadow)', 
            color: selectedCategory === null ? '#fff' : '#2F00FF' 
          }}
        >
          ALL
        </button>
        
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`text-base md:text-lg lg:text-xl tracking-wide transition-all whitespace-nowrap flex-shrink-0 px-3 py-1 rounded-full ${
              selectedCategory === cat 
                ? 'bg-black text-white' 
                : 'hover:opacity-70'
            }`}
            style={{ 
              fontFamily: 'var(--font-londrina-shadow)', 
              color: selectedCategory === cat ? '#fff' : '#2F00FF' 
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </header>
  );
}
