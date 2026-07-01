import { BASE, TOKEN } from "./config";
import { Log } from "@logging/log.js";

/**
 * Fetch notifications.
 * @param {{ notification_type?: string, page?: number, limit?: number }} opts
 */
export async function fetchNotifications({ notification_type, page, limit } = {}) {
  const params = new URLSearchParams();
  if (notification_type) params.set("notification_type", notification_type);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  const qs = params.toString();
  Log("frontend", "debug", "api", `GET /notifications${qs ? "?" + qs : ""}`);

  const res = await fetch(`${BASE}/notifications${qs ? "?" + qs : ""}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    const msg = `API ${res.status}`;
    Log("frontend", "error", "api", msg);
    throw new Error(msg);
  }
  const data = await res.json();
  Log("frontend", "info", "api", `Fetched ${(data.notifications ?? []).length} notifications`);
  return data;
}
