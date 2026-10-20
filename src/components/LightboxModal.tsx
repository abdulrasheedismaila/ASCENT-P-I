import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

export interface LightboxMedia {
  url: string;
  mediaType: 'image' | 'video';
  title?: string;
  description?: string;
  location?: string;
}

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: LightboxMedia[];
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  items,
  currentIndex,
  onIndexChange
}) => {
  const currentItem = items[currentIndex];

  const handleNext = useCallback(() => {
    if (items.length > 1) {
      onIndexChange((currentIndex + 1) % items.length);
    }
  }, [currentIndex, items.length, onIndexChange]);

  const handlePrev = useCallback(() => {
    if (items.length > 1) {
      onIndexChange((currentIndex - 1 + items.length) % items.length);
    }
  }, [currentIndex, items.length, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Top bar controls */}
      <div className="flex items-center justify-between z-10 w-full max-w-7xl mx-auto text-white">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/10 text-white/90">
            {currentIndex + 1} / {items.length}
          </span>
          {currentItem.title && (
            <h4 className="text-sm sm:text-base font-semibold truncate max-w-xs sm:max-w-md">
              {currentItem.title}
            </h4>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Media Viewport */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all transform hover:scale-110"
            aria-label="Previous item"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Media Content */}
        <div className="max-w-5xl max-h-[75vh] w-full flex items-center justify-center px-4">
          {currentItem.mediaType === 'video' ? (
            <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
              <video
                src={currentItem.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <img
              src={currentItem.url}
              alt={currentItem.title || 'Ascent Properties Showcase'}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
            />
          )}
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all transform hover:scale-110"
            aria-label="Next item"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Caption & Description Footer */}
      {(currentItem.description || currentItem.location) && (
        <div className="z-10 max-w-3xl mx-auto text-center text-slate-300 text-xs sm:text-sm px-4 py-2 bg-black/40 rounded-lg backdrop-blur-xs">
          {currentItem.description && <p>{currentItem.description}</p>}
          {currentItem.location && (
            <p className="text-blue-400 font-medium mt-1">📍 {currentItem.location}</p>
          )}
        </div>
      )}
    </div>
  );
};
