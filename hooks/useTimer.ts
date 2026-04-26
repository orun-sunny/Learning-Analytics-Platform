import { useState, useEffect } from 'react';

export const useTimer = (initialTimeSeconds: number, onTimeout?: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Reset timer when initialTimeSeconds changes
    setTimeLeft(initialTimeSeconds);
  }, [initialTimeSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      onTimeout?.();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeout]);

  const formatTime = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const pauseTimer = () => setIsActive(false);
  const resumeTimer = () => setIsActive(true);

  return { timeLeft, formatTime, pauseTimer, resumeTimer, isActive };
};
