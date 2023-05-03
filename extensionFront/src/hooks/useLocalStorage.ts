import { useEffect, useState } from "react";
export default function useLocalStorage<T>(
  storageKey: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value]);
  return [value, setValue];
}
