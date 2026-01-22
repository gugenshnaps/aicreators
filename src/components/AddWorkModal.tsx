'use client';

import { useState, useEffect, useRef } from 'react';
import { uploadFile } from '@/lib/supabase';

interface AddWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName: string | null;
  onWorkAdded: () => void;
}

const categories = ['VIDEO', 'IMAGE', 'FASHION', 'AVATAR', 'MARKETPLACE'];

export default function AddWorkModal({ isOpen, onClose, userId, userName, onWorkAdded }: AddWorkModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IMAGE');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Create preview when file is selected
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview('');
    }
  }, [file]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/') || droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
      } else {
        alert('Пожалуйста, загрузите изображение или видео');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !userId) {
      alert('Пожалуйста, выберите файл');
      return;
    }

    setIsLoading(true);

    try {
      // Upload to Supabase
      const imageUrl = await uploadFile('works', file, userId);
      
      if (!imageUrl) {
        throw new Error('Ошибка загрузки файла');
      }

      const isVideo = file.type.startsWith('video/');
      
      const newWork = {
        id: `work_${Date.now()}`,
        imageUrl,
        title,
        category,
        views: 0,
        createdAt: new Date().toISOString(),
        creatorId: userId,
        creatorName: userName || 'Аноним',
        isVideo, // Сохраняем тип файла
      };

      // Save to user's works
      const userWorks = JSON.parse(localStorage.getItem(`works_${userId}`) || '[]');
      userWorks.push(newWork);
      localStorage.setItem(`works_${userId}`, JSON.stringify(userWorks));

      // Save to all works (for main feed)
      const allWorks = JSON.parse(localStorage.getItem('all_works') || '[]');
      allWorks.unshift(newWork);
      localStorage.setItem('all_works', JSON.stringify(allWorks));

      // Reset form
      setFile(null);
      setPreview('');
      setTitle('');
      setCategory('IMAGE');

      onWorkAdded();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при публикации. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setFile(null);
    setPreview('');
    setTitle('');
    setCategory('IMAGE');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={resetAndClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div 
        className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={resetAndClose}
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

        {/* File Upload Area */}
        <div 
          className={`mb-4 border-2 border-dashed rounded-xl transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : preview 
                ? 'border-gray-200' 
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative">
              {file?.type.startsWith('video/') ? (
                <video 
                  src={preview} 
                  className="w-full aspect-video rounded-xl object-cover"
                  controls
                />
              ) : (
                <div 
                  className="w-full aspect-video rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${preview})` }}
                />
              )}
              <button
                onClick={() => setFile(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div 
              className="py-12 px-4 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 font-medium mb-1">
                Перетащите файл сюда
              </p>
              <p className="text-gray-400 text-sm">
                или нажмите для выбора
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Поддерживаются: JPG, PNG, GIF, MP4, WebM
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
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
          disabled={isLoading || !file}
          className="w-full py-3 text-white font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            'Опубликовать'
          )}
        </button>
      </div>
    </div>
  );
}
