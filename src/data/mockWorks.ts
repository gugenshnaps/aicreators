export interface Work {
  id: string | number;
  imageUrl: string;
  title: string;
  views: string;
  height: number;
  gradient?: string;
  category: string;
  creatorId: string | number;
  creatorName?: string;
  isUserWork?: boolean;
}

export interface Creator {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  workCount: number;
  totalViews: string;
}

// Моковые данные для работ
export const mockWorks: Work[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
    title: '',
    views: '83,6 тыс.',
    height: 320,
    category: 'Пейзаж',
    creatorId: 1,
  },
  {
    id: 2,
    imageUrl: '',
    title: 'ФИЛЬМЫ, КОТОРЫЕ ПОВЛИЯЛИ НА МЫШЛЕНИЕ',
    views: '1 тыс.',
    height: 380,
    gradient: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)',
    category: 'Дизайн',
    creatorId: 2,
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    title: '',
    views: '2,3 тыс.',
    height: 340,
    category: 'Портрет',
    creatorId: 3,
  },
  {
    id: 4,
    imageUrl: '',
    title: '5 EFFECTS GATEKEEPER',
    views: '45 тыс.',
    height: 300,
    gradient: 'linear-gradient(180deg, #f97316 0%, #ea580c 100%)',
    category: 'Эффекты',
    creatorId: 1,
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    title: '',
    views: '1,1 млн',
    height: 360,
    category: 'Техника',
    creatorId: 4,
  },
  {
    id: 6,
    imageUrl: '',
    title: 'НИЧЕГО ЛИШНЕГО.',
    views: '871 тыс.',
    height: 380,
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
    category: 'Минимализм',
    creatorId: 2,
  },
  {
    id: 7,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    title: '',
    views: '337 тыс.',
    height: 320,
    gradient: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
    category: 'Абстракция',
    creatorId: 3,
  },
  {
    id: 8,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    title: '',
    views: '46,3 тыс.',
    height: 340,
    category: 'Видео',
    creatorId: 5,
  },
  {
    id: 9,
    imageUrl: '',
    title: 'IS BROWN',
    views: '534 тыс.',
    height: 300,
    gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    category: 'Типографика',
    creatorId: 1,
  },
  {
    id: 10,
    imageUrl: '',
    title: 'МИКРОФОН ПУШКА',
    views: '12,1 тыс.',
    height: 380,
    gradient: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    category: 'Продуктовый',
    creatorId: 4,
  },
  {
    id: 11,
    imageUrl: '',
    title: 'JOHN',
    views: '267 тыс.',
    height: 320,
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    category: 'Арт',
    creatorId: 2,
  },
  {
    id: 12,
    imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400',
    title: 'Дизайнеры останутся без работы в 2026?',
    views: '89 тыс.',
    height: 340,
    category: 'Статья',
    creatorId: 5,
  },
  {
    id: 13,
    imageUrl: '',
    title: 'DID',
    views: '148 тыс.',
    height: 360,
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    category: 'Лого',
    creatorId: 3,
  },
  {
    id: 14,
    imageUrl: '',
    title: 'NO ONE REALLY',
    views: '62,4 тыс.',
    height: 320,
    gradient: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    category: 'Постер',
    creatorId: 1,
  },
  {
    id: 15,
    imageUrl: '',
    title: 'ОБРАЩАЕМ',
    views: '35,4 тыс.',
    height: 380,
    gradient: 'linear-gradient(135deg, #fef9c3 0%, #fde047 100%)',
    category: 'Реклама',
    creatorId: 4,
  },
  {
    id: 16,
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    title: 'делать видео',
    views: '66,4 тыс.',
    height: 340,
    category: 'Видео',
    creatorId: 2,
  },
];

// Моковые данные для креаторов
export const mockCreators: Creator[] = [
  {
    id: 1,
    name: 'Александр Петров',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    specialty: 'AI Художник',
    workCount: 47,
    totalViews: '2.4 млн',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    specialty: 'Дизайнер карточек',
    workCount: 89,
    totalViews: '5.1 млн',
  },
  {
    id: 3,
    name: 'Дмитрий Козлов',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    specialty: 'Видео креатор',
    workCount: 23,
    totalViews: '890 тыс.',
  },
  {
    id: 4,
    name: 'Анна Смирнова',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    specialty: 'Продуктовый дизайн',
    workCount: 156,
    totalViews: '12.3 млн',
  },
  {
    id: 5,
    name: 'Игорь Волков',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    specialty: '3D Визуализация',
    workCount: 34,
    totalViews: '1.7 млн',
  },
];
