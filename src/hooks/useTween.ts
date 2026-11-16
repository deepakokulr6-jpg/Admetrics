import { useLayoutEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Returns an eased progress value 0 → 1 that replays whenever `key` changes.
 * Runs on requestAnimationFrame (used for SVG / text values that the native
 * driver cannot animate). Jumps straight to 1 when Reduce Motion is on.
 */
export const useTween = (key: unknown, duration: number) => {
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    let frame = 0;
    let cancelled = false;
    setProgress(0);

    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then(reduceMotion => {
        if (cancelled) {
          return;
        }
        if (reduceMotion) {
          setProgress(1);
          return;
        }

        const start = Date.now();
        const step = () => {
          const t = Math.min(1, (Date.now() - start) / duration);
          setProgress(easeOutCubic(t));
          if (t < 1) {
            frame = requestAnimationFrame(step);
          }
        };
        frame = requestAnimationFrame(step);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [key, duration]);

  return progress;
};
