'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WorkCard from '@/components/WorkCard';
import WorkModal from '@/components/WorkModal';
import AuthModal from '@/components/AuthModal';
import { mockWorks, mockCreators, Work } from '@/data/mockWorks';

type AuthMode = 'open' | 'reg';

interface User {
  id: string;
  name: string;
  username?: string;
  photo?: string;
}

export default function Home() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('open');

  // Work modal state
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [workModalOpen, setWorkModalOpen] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleOpenAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleWorkClick = (work: Work) => {
    setSelectedWork(work);
    setWorkModalOpen(true);
  };

  const getCreatorForWork = (creatorId: number) => {
    return mockCreators.find(c => c.id === creatorId);
  };

  const handleAddWork = () => {
    // TODO: Открыть модалку добавления работы
    alert('Функция "Добавить работу" — скоро сделаем!');
  };

  const handleOpenProfile = () => {
    // TODO: Открыть страницу профиля
    alert('Функция "Мой профиль" — скоро сделаем!');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onOpenAuth={handleOpenAuth} 
        user={user}
        onLogout={handleLogout}
        onAddWork={handleAddWork}
        onOpenProfile={handleOpenProfile}
      />

      <main className="px-0">
        {/* Masonry Grid */}
        <div className="masonry-grid">
          {mockWorks.map((work) => (
            <WorkCard
              key={work.id}
              id={work.id}
              imageUrl={work.imageUrl}
              title={work.title}
              views={work.views}
              height={work.height}
              gradient={work.gradient}
              onClick={() => handleWorkClick(work)}
            />
          ))}
        </div>
      </main>

      {/* Work Modal */}
      <WorkModal
        isOpen={workModalOpen}
        onClose={() => setWorkModalOpen(false)}
        work={selectedWork}
        creator={selectedWork ? getCreatorForWork(selectedWork.creatorId) : undefined}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
