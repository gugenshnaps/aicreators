'use client';

interface CreatorCardProps {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  workCount: number;
  totalViews: string;
}

export default function CreatorCard({ 
  id, 
  name, 
  avatar, 
  specialty, 
  workCount, 
  totalViews 
}: CreatorCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div 
            className="w-16 h-16 rounded-full bg-cover bg-center ring-2 ring-emerald-400 ring-offset-2"
            style={{ backgroundImage: `url(${avatar})` }}
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-500">{specialty}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{workCount}</p>
          <p className="text-xs text-gray-500">работ</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-emerald-600">{totalViews}</p>
          <p className="text-xs text-gray-500">просмотров</p>
        </div>
        <button className="liquid-glass-dark px-4 py-2 text-white text-sm rounded-full">
          Написать
        </button>
      </div>
    </div>
  );
}
