'use client';

import { useState, useEffect } from 'react';

interface AddWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName: string | null;
  onWorkAdded: () => void;
}

const categories = ['VIDEO', 'IMAGE', 'FASHION', 'AVATAR', 'MARKETPLACE'];

export default function AddWorkModal({ isOpen, onClose, userId, userName, onWorkAdded }: AddWorkModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IMAGE');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = () => {
    if (!imageUrl || !userId) {
      alert('Пожалуйста, добавьте ссылку на изображение');
      return;
    }

    setIsLoading(true);

    const newWork = {
      id: `work_${Date.now()}`,
      imageUrl,
      title,
      category,
      views: 0,
      createdAt: new Date().toISOString(),
      creatorId: userId,
      creatorName: userName || 'Аноним',
    };

    // Save to user's works
    const userWorks = JSON.parse(localStorage.getItem(`works_${userId}`) || '[]');
    userWorks.push(newWork);
    localStorage.setItem(`works_${userId}`, JSON.stringify(userWorks));

    // Save to all works (for main feed)
    const allWorks = JSON.parse(localStorage.getItem('all_works') || '[]');
    allWorks.unshift(newWork); // Add to beginning
    localStorage.setItem('all_works', JSON.stringify(allWorks));

    // Reset form
    setImageUrl('');
    setTitle('');
    setCategory('IMAGE');
    setIsLoading(false);

    onWorkAdded();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div 
        className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
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
          ДОБАВИТЬ РАБОТУ
        </h2>

        {/* Preview */}
        <div className="mb-4">
          <div 
            className="w-full aspect-video rounded-xl bg-gray-100 bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
          >
            {!imageUrl && (
              <div className="text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Превью изображения</p>
              </div>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ссылка на изображение *
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Загрузите изображение на imgur.com или другой хостинг и вставьте ссылку
          </p>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание (необязательно)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Краткое описание работы"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категория
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={category === cat ? { backgroundColor: '#2F00FF' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !imageUrl}
          className="w-full py-3 text-white font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#2F00FF' }}
        >
          {isLoading ? 'Публикация...' : 'Опубликовать'}
        </button>
      </div>
    </div>
  );
}
