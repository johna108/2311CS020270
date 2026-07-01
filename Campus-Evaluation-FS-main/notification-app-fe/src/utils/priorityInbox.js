/**
 * Priority Inbox logic — Stage 1.
 * Sorts notifications by type priority (Placement > Result > Event),
 * then by most recent within same type. Returns top N.
 *
 * @param {Array<{ID:string, Type:string, Message:string, Timestamp:string}>} notifications
 * @param {number} n — number of results (default 10)
 * @returns {Array} top N priority notifications
 */

const TYPE_RANK = { Placement: 0, Result: 1, Event: 2 };

export function getPriorityInbox(notifications, n = 10) {
  return [...notifications]
    .sort((a, b) => {
      const ra = TYPE_RANK[a.Type] ?? 9;
      const rb = TYPE_RANK[b.Type] ?? 9;
      if (ra !== rb) return ra - rb;           // lower rank = higher priority
      return new Date(b.Timestamp) - new Date(a.Timestamp);  // newer first
    })
    .slice(0, n);
}
