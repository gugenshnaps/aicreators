'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Work {
  id: string;
  image_url: string;
  title: string;
  category: string;
  views: number;
  created_at: string;
  is_video: boolean;
}

interface MyWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function MyWorksModal({ isOpen, onClose, userId }: MyWorksModalProps) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId && isOpen) {
      loadMyWorks();
    }
  }, [userId, isOpen]);

  const loadMyWorks = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .eq('creator_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading works:', error);
        return;
      }

      setWorks(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (workId: string) => {
    if (confirm('Удалить эту работу?')) {
      try {
        const { error } = await supabase
          .from('works')
          .delete()
          .eq('id', workId);

        if (error) {
          console.error('Error deleting work:', error);
          alert('Ошибка при удалении');
          return;
        }

        // Обновляем локальный список
        setWorks(works.filter(w => w.id !== workId));
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 
          className="text-2xl md:text-3xl text-center mb-6"
          style={{ fontFamily: 'var(--font-londrina-shadow)', color: '#2F00FF' }}
        >
          МОИ РАБОТЫ
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <svg className="animate-spin w-10 h-10 mx-auto text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500">Загрузка...</p>
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 mb-2">У вас пока нет работ</p>
            <p className="text-gray-400 text-sm">Добавьте свою первую работу через меню</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {works.map((work) => (
              <div key={work.id} className="relative group">
                {work.is_video ? (
                  <video 
                    src={work.image_url}
                    className="aspect-square rounded-xl object-cover bg-gray-100 w-full"
                    muted
                  />
                ) : (
                  <div 
                    className="aspect-square rounded-xl bg-cover bg-center bg-gray-100"
                    style={{ backgroundImage: `url(${work.image_url})` }}
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDelete(work.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{work.title || 'Без названия'}</p>
                  <p className="text-xs text-gray-500">{work.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
