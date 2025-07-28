import React, { useState, useEffect } from 'react';

export function getLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error(`Error parsing stored value for ${key}:`, error);
    return defaultValue;
  }
}

export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return getLocalStorage(key, initialValue);
  });

  useEffect(() => {
    setLocalStorage(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
