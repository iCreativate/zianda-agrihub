"use client";

import { useEffect, useState } from "react";

export function useLocalRegisterCount(storageKey: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? (JSON.parse(raw) as unknown[]) : [];
      setCount(Array.isArray(parsed) ? parsed.length : 0);
    } catch {
      setCount(0);
    }
  }, [storageKey]);

  return count;
}

export function useLocalRegisterItems<T>(storageKey: string) {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? (JSON.parse(raw) as T[]) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  return items;
}
