'use client';

interface WorkCardProps {
  id: string | number;
  imageUrl: string;
  title: string;
  views: string;
  height?: number;
  gradient?: string;
  onClick?: () => void;
}

export default function WorkCard({ id, imageUrl, title, views, height = 280, gradient, onClick }: WorkCardProps) {
  return (
    <div 
      className="masonry-item group cursor-pointer"
      onClick={onClick}
    >
      <div 
        className="relative overflow-hidden transition-all duration-300 hover:opacity-90"
        style={{ height: `${height}px` }}
      >
        {/* Image or Gradient Background */}
        {gradient ? (
          <div 
            className="absolute inset-0"
            style={{ background: gradient }}
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-gray-200"
            style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Title overlay (if present) */}
        {title && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h3 className="text-white text-center font-bold text-lg drop-shadow-lg line-clamp-3">
              {title}
            </h3>
          </div>
        )}

        {/* Views counter */}
        <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 flex items-center gap-1 md:gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 md:px-2.5 md:py-1">
          <svg 
            className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path 
              fillRule="evenodd" 
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="text-white text-[10px] md:text-xs font-medium">{views}</span>
        </div>
      </div>
    </div>
  );
}
