'use client';

import Image from 'next/image';

interface HeaderProps {
  onOpenAuth: (mode: 'open' | 'reg') => void;
  user?: { id: string; name: string; username?: string; photo?: string } | null;
  onLogout?: () => void;
}

export default function Header({ onOpenAuth, user, onLogout }: HeaderProps) {
  const categories = ['VIDEO', 'IMAGE', 'FASHION', 'AVATAR', 'MARKETPLACE'];

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

        {/* Auth buttons or User info - absolute right */}
        <div className="absolute right-3 md:right-6 flex items-center">
          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <div 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-cover bg-center ring-2 ring-gray-200"
                style={{ backgroundImage: user.photo ? `url(${user.photo})` : undefined, backgroundColor: '#ddd' }}
              />
              <span 
                className="hidden md:block text-sm font-medium text-gray-700"
              >
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="text-xs md:text-sm text-gray-400 hover:text-gray-600 transition-colors ml-2"
              >
                Выйти
              </button>
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
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide"
          style={{ fontFamily: 'var(--font-londrina-shadow)', color: '#2F00FF' }}
        >
          Creators
        </h1>
      </div>

      {/* Categories - scrollable on mobile */}
      <div className="flex justify-start md:justify-center gap-3 md:gap-6 lg:gap-8 py-2 md:py-3 overflow-x-auto px-3 md:px-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            className="text-base md:text-lg lg:text-xl tracking-wide hover:opacity-70 transition-opacity whitespace-nowrap flex-shrink-0"
            style={{ fontFamily: 'var(--font-londrina-shadow)', color: '#2F00FF' }}
          >
            {cat}
          </button>
        ))}
      </div>
    </header>
  );
}
