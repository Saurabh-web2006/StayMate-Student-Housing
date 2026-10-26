import { useEffect, useState } from "react";

function getFallbackValue(fallback) {
  return typeof fallback === "function" ? fallback() : fallback;
}

export function readPersistentValue(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) return JSON.parse(storedValue);
    return getFallbackValue(fallback);
  } catch (error) {
    console.error(`Could not read saved app state for "${key}".`, error);
    return getFallbackValue(fallback);
  }
}

export function savePersistentValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not save app state for "${key}".`, error);
  }
}

export function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => readPersistentValue(key, fallback));

  useEffect(() => {
    savePersistentValue(key, value);
  }, [key, value]);

  return [value, setValue];
}
