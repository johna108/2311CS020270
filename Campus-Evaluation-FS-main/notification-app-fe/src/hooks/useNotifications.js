import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "@logging/log.js";

export function useNotifications({ notification_type, page } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications({ notification_type, page });
      setNotifications(data.notifications ?? []);
    } catch (e) {
      setError(e.message);
      Log("frontend", "error", "hook", `Fetch failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [notification_type, page]);

  useEffect(() => { load(); }, [load]);

  return { notifications, loading, error, reload: load };
}
