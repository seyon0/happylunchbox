import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const getCardPosition = (index, activeIndex, total = 3) => {
  let diff = index - activeIndex;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
};

const getPositionStyles = (isMobile) => ({
  0: {
    x: 0,
    rotateY: 0,
    scale: 1,
    zIndex: 30,
    opacity: 1,
  },
  [-1]: {
    x: isMobile ? -72 : -130,
    rotateY: isMobile ? 32 : 40,
    scale: isMobile ? 0.86 : 0.84,
    zIndex: 20,
    opacity: 0.7,
  },
  1: {
    x: isMobile ? 72 : 130,
    rotateY: isMobile ? -32 : -40,
    scale: isMobile ? 0.86 : 0.84,
    zIndex: 20,
    opacity: 0.7,
  },
});

const hiddenStyle = {
  x: 0,
  rotateY: 0,
  scale: 0.7,
  zIndex: 0,
  opacity: 0,
};

export const UserPortalCarousel = ({ portals, onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const positionStyles = getPositionStyles(isMobile);

  const goTo = (index) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % portals.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + portals.length) % portals.length);
  };

  const handleDragEnd = (_, info) => {
    const threshold = 60;
    if (info.offset.x < -threshold) goNext();
    else if (info.offset.x > threshold) goPrev();
  };

  const handleCardClick = (index) => {
    const position = getCardPosition(index, activeIndex);
    if (position === 0) {
      onNavigate(portals[index]);
    } else {
      goTo(index);
    }
  };

  const activePortal = portals[activeIndex];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-10 md:mb-14 space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-4xl md:text-5xl text-ink-900 tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Choose Your Portal
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-stone-400 text-sm md:text-base font-medium"
        >
          Swipe or drag to explore — tap the center card to enter
        </motion.p>
      </div>

      <div
        className="relative w-full max-w-4xl mx-auto px-4"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          className="relative h-[380px] md:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
        >
          {portals.map((portal, index) => {
            const position = getCardPosition(index, activeIndex);
            const style = positionStyles[position] ?? hiddenStyle;
            const isCenter = position === 0;

            return (
              <motion.div
                key={portal.id}
                className="absolute w-[220px] sm:w-[250px] md:w-[300px]"
                animate={style}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 28,
                  mass: 0.8,
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  pointerEvents: position === 0 || Math.abs(position) === 1 ? 'auto' : 'none',
                }}
                onClick={() => handleCardClick(index)}
              >
                <motion.div
                  className={`relative rounded-[1.75rem] md:rounded-[2rem] overflow-hidden bg-stone-100 ${
                    isCenter ? 'shadow-2xl' : 'shadow-md'
                  }`}
                  style={{ aspectRatio: '3 / 4' }}
                  whileHover={isCenter ? { scale: 1.02 } : { scale: 0.88 }}
                  whileTap={isCenter ? { scale: 0.98 } : undefined}
                >
                  <img
                    src={portal.image}
                    alt={portal.title}
                    className="absolute inset-0 w-full h-full object-cover object-[center_18%] scale-[1.08] select-none pointer-events-none"
                    draggable={false}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={activePortal.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center text-stone-500 text-sm md:text-base font-medium mt-3 md:mt-4"
          >
            {activePortal.title}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`${activePortal.id}-desc`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="text-center text-stone-400 text-xs md:text-sm max-w-xs mx-auto mt-1.5 leading-relaxed"
          >
            {activePortal.description}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={goPrev}
          className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-400 hover:text-ink-900 hover:border-stone-300 transition-colors shadow-sm"
          aria-label="Previous portal"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {portals.map((portal, index) => (
            <button
              key={portal.id}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-8 bg-brand-500'
                  : 'w-1.5 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Go to ${portal.title}`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-400 hover:text-ink-900 hover:border-stone-300 transition-colors shadow-sm"
          aria-label="Next portal"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
