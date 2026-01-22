'use client';

interface WorkCardProps {
  id: string | number;
  imageUrl: string;
  title: string;
  views: string;
  height?: number;
  gradient?: string;
  isVideo?: boolean;
  onClick?: () => void;
}

export default function WorkCard({ id, imageUrl, title, views, height = 280, gradient, isVideo, onClick }: WorkCardProps) {
  // Определяем видео по расширению если isVideo не передан
  const isVideoFile = isVideo || /\.(mp4|webm|mov|avi)$/i.test(imageUrl || '');
  
  return (
    <div 
      className="masonry-item group cursor-pointer"
      onClick={onClick}
    >
      {/* На мобильной - квадратные, на десктопе - masonry с разной высотой */}
      <div 
        className="work-card relative overflow-hidden transition-all duration-300 hover:opacity-90"
        style={{ '--card-height': `${height}px` } as React.CSSProperties}
      >
        {/* Image, Video or Gradient Background */}
        {gradient ? (
          <div 
            className="absolute inset-0"
            style={{ background: gradient }}
          />
        ) : isVideoFile ? (
          <video
            src={imageUrl}
            className="absolute inset-0 w-full h-full object-cover bg-gray-200"
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-gray-200"
            style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Video indicator */}
        {isVideoFile && (
          <div className="absolute top-1 right-1 md:top-3 md:right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full p-1 md:px-2.5 md:py-1">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Views counter - hidden on mobile for cleaner look */}
        <div className="hidden md:flex absolute bottom-3 left-3 items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
          <svg 
            className="w-4 h-4 text-emerald-400" 
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
          <span className="text-white text-xs font-medium">{views}</span>
        </div>
      </div>
    </div>
  );
}
