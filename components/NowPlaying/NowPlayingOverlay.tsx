import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useState } from 'react';

export function NowPlayingOverlay({
  opened,
  onClose,
  closeDrawer,
  children,
}: {
  opened: boolean;
  onClose: () => void;
  closeDrawer: () => void;
  children: React.ReactNode;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const AnimatedDiv = animated.div as unknown as React.FC<React.HTMLAttributes<HTMLDivElement>>;

  // Spring to handle the y translation
  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useDrag(
    ({ last, velocity: [, vy], direction: [, dy], movement: [, my], cancel, memo = y.get() }) => {
      setIsDragging(true);

      if (my < 0) return; // block upward swipe

      // Handle the drag release or completion
      if (last) {
        // If swiped down fast enough or moved down significantly
        if (my > 100 || (vy > 0.5 && dy > 0)) {
          api.start({
            y: window.innerHeight, // Move down to minimize
            immediate: false,
            config: { tension: 300, friction: 30 },
          });
          setTimeout(onClose, 150); // Give time to animate out
          setTimeout(closeDrawer, 150);
        } else {
          api.start({
            y: 0, // Reset to original position
            immediate: false,
            config: { tension: 300, friction: 30 },
          });
        }
      } else {
        api.start({ y: my, immediate: true });
      }

      return memo; // Return the memoized value of y to avoid resetting
    },
    {
      axis: 'y', // Only allow vertical drag
      filterTaps: true, // Avoid triggering the drag with taps
      pointer: { touch: true, mouse: true }, // Allow both mouse and touch events
      // Use memo to keep track of initial drag position (helps on mobile)
    }
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        touchAction: 'none', // Prevent scroll on touch devices while dragging
        margin: 0, // Ensure no unwanted space or margin
        padding: 0,
        height: '100vh', // Full-screen modal
      }}
    >
      <AnimatedDiv
        {...bind()}
        style={{
          touchAction: 'none', // Ensure no default scroll during drag
          transform: y.to((val) => `translateY(${val}px)`) as unknown as string,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 0,
          height: '100%', // Full modal height
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            width: 50,
            height: 6,
            backgroundColor: '#ccc',
            borderRadius: 3,
            margin: '0 auto 10px',
          }}
        />
        {children}
      </AnimatedDiv>
    </div>
  );
}
