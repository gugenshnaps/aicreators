'use client';

import { useEffect } from 'react';

interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: {
    id: number;
    imageUrl: string;
    title: string;
    views: string;
    height: number;
    gradient?: string;
    category: string;
    creatorId: number | string;
  } | null;
  creator?: {
    id: number | string;
    name: string;
    avatar: string;
    specialty: string;
  };
  onContactClick?: () => void;
  onViewProfileClick?: () => void;
}

export default function WorkModal({ isOpen, onClose, work, creator, onContactClick, onViewProfileClick }: WorkModalProps) {
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

  if (!isOpen || !work) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90" />
      
      {/* Close button - fixed position */}
      <button 
        onClick={onClose}
        className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Modal Content */}
      <div 
        className="relative flex flex-col md:flex-row gap-4 md:gap-6 max-w-6xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image - full size, maintains aspect ratio */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          {work.gradient ? (
            <div 
              className="w-full max-h-[70vh] md:max-h-[80vh] rounded-lg"
              style={{ 
                background: work.gradient,
                aspectRatio: '1/1',
                maxWidth: '100%'
              }}
            >
              {work.title && (
                <div className="w-full h-full flex items-center justify-center p-8">
                  <h2 className="text-white text-2xl md:text-4xl font-bold text-center drop-shadow-lg">
                    {work.title}
                  </h2>
                </div>
              )}
            </div>
          ) : (
            <img
              src={work.imageUrl}
              alt={work.title || 'Работа'}
              className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg"
            />
          )}
        </div>

        {/* Info Panel */}
        <div className="w-full md:w-80 bg-white rounded-2xl p-5 flex flex-col max-h-[40vh] md:max-h-[80vh] overflow-y-auto">
          {/* Creator Info */}
          {creator && (
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div 
                className="w-12 h-12 rounded-full bg-cover bg-center bg-gray-200 ring-2 ring-gray-100 flex-shrink-0"
                style={{ backgroundImage: creator.avatar ? `url(${creator.avatar})` : undefined }}
              />
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{creator.name}</h3>
                <p className="text-sm text-gray-500 truncate">{creator.specialty}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{work.views} просмотров</span>
            </div>
          </div>

          {/* Category */}
          <div className="py-4 border-b border-gray-100">
            <span 
              className="inline-block px-3 py-1 text-sm rounded-full"
              style={{ 
                fontFamily: 'var(--font-londrina-shadow)', 
                color: '#2F00FF',
                backgroundColor: 'rgba(47, 0, 255, 0.1)'
              }}
            >
              {work.category}
            </span>
          </div>

          {/* Title/Description */}
          {work.title && (
            <div className="py-4 border-b border-gray-100">
              <p className="text-gray-800 font-medium">{work.title}</p>
            </div>
          )}

          {/* Description placeholder */}
          <div className="py-4 flex-1">
            <p className="text-gray-600 text-sm">
              Работа создана с использованием AI инструментов.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mt-auto">
            <button 
              onClick={onContactClick}
              className="w-full py-3 px-6 text-white font-medium rounded-full transition-all hover:opacity-90"
              style={{ 
                fontFamily: 'var(--font-londrina-shadow)',
                fontSize: '1.1rem',
                backgroundColor: '#000'
              }}
            >
              НАПИСАТЬ КРЕАТОРУ
            </button>
            
            <button 
              onClick={onViewProfileClick}
              className="w-full py-3 px-6 font-medium rounded-full transition-all hover:bg-gray-100 border-2 border-gray-200"
              style={{ 
                fontFamily: 'var(--font-londrina-shadow)',
                fontSize: '1rem',
                color: '#2F00FF'
              }}
            >
              ВСЕ РАБОТЫ КРЕАТОРА
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
