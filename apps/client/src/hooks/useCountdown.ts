import { useState, useEffect, useCallback } from 'react';

export function useCountdown(initialValue: number, onComplete?: () => void) {
  const [count, setCount] = useState(initialValue);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback((from?: number) => {
    setCount(from ?? initialValue);
    setIsRunning(true);
  }, [initialValue]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (!isRunning || count <= 0) {
      if (isRunning && count <= 0) {
        setIsRunning(false);
        onComplete?.();
      }
      return;
    }

    const timer = setTimeout(() => {
      setCount((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, isRunning, onComplete]);

  return { count, isRunning, start, stop };
}
