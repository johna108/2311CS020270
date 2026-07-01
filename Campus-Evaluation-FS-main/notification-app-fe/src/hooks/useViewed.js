import { useState, useEffect, useCallback } from "react";
import { Log } from "@logging/log.js";

const STORAGE_KEY = "viewed_notifications";

// ponytail: localStorage for viewed state — fine for single-device, multi-device needs a backend
function loadViewed() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); }
  catch { return new Set(); }
}

function saveViewed(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function useViewed() {
  const [viewed, setViewed] = useState(() => loadViewed());

  const markViewed = useCallback((id) => {
    setViewed((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveViewed(next);
      return next;
    });
  }, []);

  const markAllViewed = useCallback((ids) => {
    setViewed((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      saveViewed(next);
      return next;
    });
  }, []);

  const unviewedCount = useCallback(
    (notifications) => notifications.filter((n) => !viewed.has(n.ID)).length,
    [viewed]
  );

  return { viewed, markViewed, markAllViewed, unviewedCount };
}
