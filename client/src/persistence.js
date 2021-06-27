import { useState, useEffect } from 'react'

export function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const value = window.localStorage.getItem(key);
    return value !== null
      ? JSON.parse(value)
      : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}
