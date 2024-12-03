import { useState, useCallback } from 'react';

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
