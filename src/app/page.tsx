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
import { supabase } from '@/lib/supabase';

type AuthMode = 'open' | 'reg';

interface User {
  id: string;
  name: string;
  username?: string;
  photo?: string;
}

interface Work {
  id: string;
  image_url: string;
  title: string;
  category: string;
  views: number;
  created_at: string;
  creator_id: string;
  creator_name: string;
  is_video: boolean;
}

// Для отображения
interface DisplayWork {
  id: string;
  imageUrl: string;
  title: string;
  views: string;
  height: number;
  category: string;
  creatorId: string;
  creatorName: string;
  gradient?: string;
  isVideo: boolean;
}

export default function Home() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('open');

  // Work modal state
  const [selectedWork, setSelectedWork] = useState<DisplayWork | null>(null);
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

  // Works from Supabase
  const [works, setWorks] = useState<DisplayWork[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load user and works on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    
    loadWorks();
  }, []);

  // Reload works when category changes
  useEffect(() => {
    loadWorks(selectedCategory);
  }, [selectedCategory]);

  // Загрузка работ из Supabase
  const loadWorks = async (category?: string | null) => {
    setLoading(true);
    try {
      let query = supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false });

      // Фильтр по категории
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading works:', error);
        return;
      }

      if (data) {
        const displayWorks: DisplayWork[] = data.map((work: Work) => ({
          id: work.id,
          imageUrl: work.image_url,
          title: work.title || '',
          views: `${work.views} просм.`,
          height: 280 + Math.floor(Math.random() * 120),
          category: work.category,
          creatorId: work.creator_id,
          creatorName: work.creator_name || 'Креатор',
          isVideo: work.is_video,
        }));
        setWorks(displayWorks);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleOpenAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser);
    setAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleWorkClick = (work: DisplayWork) => {
    setSelectedWork(work);
    setWorkModalOpen(true);
  };

  const handleProfileSave = (updatedProfile: { name: string; photo: string; telegram: string; instagram: string }) => {
    if (user) {
      const updatedUser = { ...user, name: updatedProfile.name, photo: updatedProfile.photo };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleWorkAdded = () => {
    loadWorks(selectedCategory); // Перезагружаем работы из Supabase
  };

  const handleContactClick = () => {
    if (selectedWork) {
      // Пока используем данные из работы
      setSelectedCreatorContact({
        name: selectedWork.creatorName || 'Креатор',
        telegram: undefined,
        instagram: undefined,
      });
      setContactModalOpen(true);
    }
  };

  const handleViewProfileClick = () => {
    if (selectedWork) {
      setSelectedCreatorProfile({
        id: selectedWork.creatorId,
        name: selectedWork.creatorName || 'Креатор',
        avatar: undefined,
        telegram: undefined,
        instagram: undefined,
      });
      setCreatorProfileModalOpen(true);
    }
  };

  const getCreatorForWork = (work: DisplayWork) => {
    return {
      id: work.creatorId,
      name: work.creatorName || 'Креатор',
      avatar: '',
      specialty: 'AI Креатор',
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onOpenAuth={handleOpenAuth} 
        user={user}
        onLogout={handleLogout}
        onAddWork={() => setAddWorkModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onMyWorks={() => setMyWorksModalOpen(true)}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <main className="px-0">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="animate-spin w-10 h-10 mx-auto text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-500">Загрузка работ...</p>
            </div>
          </div>
        ) : works.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2">
                {selectedCategory 
                  ? `Нет работ в категории ${selectedCategory}` 
                  : 'Пока нет работ'}
              </p>
              <p className="text-gray-400">
                {selectedCategory 
                  ? 'Попробуйте выбрать другую категорию' 
                  : 'Будьте первым, кто добавит работу!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="masonry-grid">
            {works.map((work) => (
              <WorkCard
                key={work.id}
                id={work.id}
                imageUrl={work.imageUrl}
                title={work.title}
                views={work.views}
                height={work.height}
                gradient={work.gradient}
                isVideo={work.isVideo}
                onClick={() => handleWorkClick(work)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Work Modal */}
      <WorkModal
        isOpen={workModalOpen}
        onClose={() => setWorkModalOpen(false)}
        work={selectedWork ? {
          ...selectedWork,
          views: selectedWork.views,
          height: selectedWork.height,
        } : null}
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
          handleWorkClick(work as DisplayWork);
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
