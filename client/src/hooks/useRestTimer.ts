import { useState, useEffect, useCallback } from 'react';

export function useRestTimer(defaultDuration: number = 90) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isActive && timeLeft !== null && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 0) {
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsActive(false);
      playNotificationSound();
    }
  }, [timeLeft]);

  const startTimer = useCallback(() => {
    setTimeLeft(defaultDuration);
    setIsActive(true);
  }, [defaultDuration]);

  const stopTimer = useCallback(() => {
    setTimeLeft(null);
    setIsActive(false);
  }, []);

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  return {
    timeLeft,
    isActive,
    startTimer,
    stopTimer,
  };
}
