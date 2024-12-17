import { useState, useCallback } from 'react';

/**
 * Custom React hook that provides a timer functionality.
 * It allows the user to start, stop, and track the time left in seconds.
 * 
 * @param {number} defaultTime - The default time in seconds for the timer when it starts.
 * @returns {Object} An object containing the time left, whether the timer is active,
 *                   and functions to start and stop the timer.
 */
export function useRestTimer(defaultTime: number = 90) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const startTimer = useCallback((duration: number = defaultTime) => {
    if (timerId) {
      clearInterval(timerId);
    }
    
    setTimeLeft(duration);
    setIsActive(true);
    
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(id);
          setIsActive(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerId(id);
  }, [defaultTime]);

  const stopTimer = useCallback(() => {
    if (timerId) {
      clearInterval(timerId);
    }
    setTimeLeft(null);
    setIsActive(false);
    setTimerId(null);
  }, []);

  return {
    timeLeft,
    isActive,
    startTimer,
    stopTimer,
  };
}
