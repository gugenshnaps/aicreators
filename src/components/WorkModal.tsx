'use client';

import { useEffect } from 'react';
import Image from 'next/image';

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
    creatorId: number;
  } | null;
  creator?: {
    id: number;
    name: string;
    avatar: string;
    specialty: string;
  };
}

export default function WorkModal({ isOpen, onClose, work, creator }: WorkModalProps) {
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-2/3 relative">
            <div 
              className="w-full aspect-[4/5] md:aspect-auto md:h-[70vh]"
              style={work.gradient 
                ? { background: work.gradient }
                : { 
                    backgroundImage: `url(${work.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }
              }
            >
              {work.title && (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <h2 className="text-white text-2xl md:text-4xl font-bold text-center drop-shadow-lg">
                    {work.title}
                  </h2>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel */}
          <div className="md:w-1/3 p-6 flex flex-col">
            {/* Creator Info */}
            {creator && (
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div 
                  className="w-12 h-12 rounded-full bg-cover bg-center ring-2 ring-gray-200"
                  style={{ backgroundImage: `url(${creator.avatar})` }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                  <p className="text-sm text-gray-500">{creator.specialty}</p>
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

            {/* Description placeholder */}
            <div className="py-4 flex-1">
              <p className="text-gray-600 text-sm">
                Работа создана с использованием AI инструментов.
              </p>
            </div>

            {/* Action Button */}
            <button 
              className="w-full py-3 px-6 text-white font-medium rounded-full transition-all hover:opacity-90"
              style={{ 
                fontFamily: 'var(--font-londrina-shadow)',
                fontSize: '1.25rem',
                backgroundColor: '#000'
              }}
            >
              НАПИСАТЬ КРЕАТОРУ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
