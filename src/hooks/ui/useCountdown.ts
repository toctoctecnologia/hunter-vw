import { useEffect, useState } from 'react';

/**
 * Countdown hook for lead cards.
 * Calculates an end time five minutes after `createdAt`
 * and returns the remaining time formatted as MM:SS.
 */
export function useCountdown(createdAt: Date | string | number) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const start = new Date(createdAt).getTime();
    const end = start + 5 * 60 * 1000;

    const update = () => {
      const diff = end - Date.now();
      setRemaining(diff > 0 ? diff : 0);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}