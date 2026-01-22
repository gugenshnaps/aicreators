'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WorkCard from '@/components/WorkCard';
import WorkModal from '@/components/WorkModal';
import AuthModal from '@/components/AuthModal';
import ProfileModal from '@/components/ProfileModal';
import MyWorksModal from '@/components/MyWorksModal';
import AddWorkModal from '@/components/AddWorkModal';
import ContactModal from '@/components/ContactModal';
import CreatorProfileModal from '@/components/CreatorProfileModal';
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
  isVideo?: boolean;
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

  // Contact modal state
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedCreatorContact, setSelectedCreatorContact] = useState<{name: string; telegram?: string; instagram?: string} | null>(null);

  // Creator profile modal state
  const [creatorProfileModalOpen, setCreatorProfileModalOpen] = useState(false);
  const [selectedCreatorProfile, setSelectedCreatorProfile] = useState<{id: string; name: string; avatar?: string; telegram?: string; instagram?: string} | null>(null);

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

  const handleContactClick = () => {
    if (selectedWork) {
      const work = selectedWork as any;
      
      if (work.isUserWork) {
        // Get creator profile from localStorage
        const savedProfile = localStorage.getItem(`profile_${work.creatorId}`);
        const profile = savedProfile ? JSON.parse(savedProfile) : {};
        
        setSelectedCreatorContact({
          name: work.creatorName || 'Креатор',
          telegram: profile.telegram,
          instagram: profile.instagram,
        });
      } else {
        // Mock creator
        const creator = mockCreators.find(c => c.id === selectedWork.creatorId);
        setSelectedCreatorContact({
          name: creator?.name || 'Креатор',
          telegram: '@creator',
          instagram: '@creator',
        });
      }
      setContactModalOpen(true);
    }
  };

  const handleViewProfileClick = () => {
    if (selectedWork) {
      const work = selectedWork as any;
      
      if (work.isUserWork) {
        const savedProfile = localStorage.getItem(`profile_${work.creatorId}`);
        const profile = savedProfile ? JSON.parse(savedProfile) : {};
        
        // Get avatar from user data if it's the current user
        let avatar = '';
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const currentUser = JSON.parse(savedUser);
          if (currentUser.id === work.creatorId) {
            avatar = currentUser.photo || '';
          }
        }
        
        setSelectedCreatorProfile({
          id: work.creatorId,
          name: work.creatorName || 'Креатор',
          avatar: avatar,
          telegram: profile.telegram,
          instagram: profile.instagram,
        });
        setCreatorProfileModalOpen(true);
      } else {
        const creator = mockCreators.find(c => c.id === selectedWork.creatorId);
        if (creator) {
          setSelectedCreatorProfile({
            id: creator.id.toString(),
            name: creator.name,
            avatar: creator.avatar,
            telegram: '@creator',
            instagram: '@creator',
          });
          setCreatorProfileModalOpen(true);
        }
      }
    }
  };

  const getCreatorForWork = (work: any) => {
    if (work.isUserWork) {
      // Get avatar from user if it's current user
      let avatar = '';
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const currentUser = JSON.parse(savedUser);
        if (currentUser.id === work.creatorId) {
          avatar = currentUser.photo || '';
        }
      }
      
      return {
        id: work.creatorId,
        name: work.creatorName || 'Креатор',
        avatar: avatar,
        specialty: 'AI Креатор',
      };
    }
    return mockCreators.find(c => c.id === work.creatorId);
  };

  // Combine mock works with user works
  const allDisplayWorks = [
    ...userWorks.map((w, index) => ({
      id: w.id, // Keep original ID
      imageUrl: w.imageUrl,
      title: w.title,
      views: `${w.views} просм.`,
      height: 280 + Math.floor(Math.random() * 100),
      category: w.category,
      creatorId: w.creatorId,
      creatorName: w.creatorName,
      gradient: undefined as string | undefined,
      isUserWork: true,
      isVideo: w.isVideo, // Передаём тип файла
    })),
    ...mockWorks.map(w => ({
      ...w,
      isUserWork: false,
      isVideo: false,
    })),
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
              isVideo={work.isVideo}
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
        creator={selectedWork ? getCreatorForWork(selectedWork) : undefined}
        onContactClick={handleContactClick}
        onViewProfileClick={handleViewProfileClick}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        creator={selectedCreatorContact}
      />

      {/* Creator Profile Modal */}
      <CreatorProfileModal
        isOpen={creatorProfileModalOpen}
        onClose={() => setCreatorProfileModalOpen(false)}
        creator={selectedCreatorProfile}
        onWorkClick={(work) => {
          setCreatorProfileModalOpen(false);
          handleWorkClick(work);
        }}
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
