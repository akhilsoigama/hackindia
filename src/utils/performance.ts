import { useEffect, useState } from 'react';

export type AnyFn<TArgs extends unknown[] = unknown[]> = (...args: TArgs) => void;

export const throttle = <TArgs extends unknown[]>(
  callback: AnyFn<TArgs>,
  waitMs: number,
): AnyFn<TArgs> => {
  let isWaiting = false;
  let lastArgs: TArgs | null = null;

  return (...args: TArgs) => {
    if (isWaiting) {
      lastArgs = args;
      return;
    }

    callback(...args);
    isWaiting = true;

    window.setTimeout(() => {
      isWaiting = false;
      if (lastArgs) {
        callback(...lastArgs);
        lastArgs = null;
      }
    }, waitMs);
  };
};

export const debounce = <TArgs extends unknown[]>(
  callback: AnyFn<TArgs>,
  waitMs: number,
): AnyFn<TArgs> => {
  let timeoutId: number | null = null;

  return (...args: TArgs) => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, waitMs);
  };
};

export const useDebouncedValue = <TValue>(value: TValue, waitMs: number): TValue => {
  const [debouncedValue, setDebouncedValue] = useState<TValue>(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, waitMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [value, waitMs]);

  return debouncedValue;
};
