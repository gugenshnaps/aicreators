'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WorkCard from '@/components/WorkCard';
import WorkModal from '@/components/WorkModal';
import AuthModal from '@/components/AuthModal';
import ProfileModal from '@/components/ProfileModal';
import MyWorksModal from '@/components/MyWorksModal';
import AddWorkModal from '@/components/AddWorkModal';
import { mockWorks, mockCreators, Work } from '@/data/mockWorks';

type AuthMode = 'open' | 'reg';

interface User {
  id: string;
  name: string;
  username?: string;
  photo?: string;
}

interface UserWork {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  views: number;
  createdAt: string;
  creatorId: string;
  creatorName: string;
}

export default function Home() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('open');

  // Work modal state
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [workModalOpen, setWorkModalOpen] = useState(false);

  // Profile modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // My works modal state
  const [myWorksModalOpen, setMyWorksModalOpen] = useState(false);

  // Add work modal state
  const [addWorkModalOpen, setAddWorkModalOpen] = useState(false);

  // User works from localStorage
  const [userWorks, setUserWorks] = useState<UserWork[]>([]);

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
    
    // Load all user works
    loadAllWorks();
  }, []);

  const loadAllWorks = () => {
    const allWorks = localStorage.getItem('all_works');
    if (allWorks) {
      try {
        setUserWorks(JSON.parse(allWorks));
      } catch (e) {
        console.error('Error loading works:', e);
      }
    }
  };

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

  const handleProfileSave = (updatedProfile: { name: string; photo: string; telegram: string; instagram: string }) => {
    if (user) {
      const updatedUser = { ...user, name: updatedProfile.name, photo: updatedProfile.photo };
      setUser(updatedUser);
    }
  };

  const handleWorkAdded = () => {
    loadAllWorks();
  };

  const getCreatorForWork = (creatorId: number) => {
    return mockCreators.find(c => c.id === creatorId);
  };

  // Combine mock works with user works
  const allDisplayWorks = [
    ...userWorks.map((w, index) => ({
      id: 1000 + index,
      imageUrl: w.imageUrl,
      title: w.title,
      views: `${w.views} просм.`,
      height: 280 + Math.floor(Math.random() * 100),
      category: w.category,
      creatorId: 1,
    })),
    ...mockWorks,
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onOpenAuth={handleOpenAuth} 
        user={user}
        onLogout={handleLogout}
        onAddWork={() => setAddWorkModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onMyWorks={() => setMyWorksModalOpen(true)}
      />

      <main className="px-0">
        {/* Masonry Grid */}
        <div className="masonry-grid">
          {allDisplayWorks.map((work) => (
            <WorkCard
              key={work.id}
              id={work.id}
              imageUrl={work.imageUrl}
              title={work.title}
              views={work.views}
              height={work.height}
              gradient={work.gradient}
              onClick={() => handleWorkClick(work as Work)}
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

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onSave={handleProfileSave}
      />

      {/* My Works Modal */}
      <MyWorksModal
        isOpen={myWorksModalOpen}
        onClose={() => setMyWorksModalOpen(false)}
        userId={user?.id || null}
      />

      {/* Add Work Modal */}
      <AddWorkModal
        isOpen={addWorkModalOpen}
        onClose={() => setAddWorkModalOpen(false)}
        userId={user?.id || null}
        userName={user?.name || null}
        onWorkAdded={handleWorkAdded}
      />
    </div>
  );
}
