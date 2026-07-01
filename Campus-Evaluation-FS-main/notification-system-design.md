# Notification System Design

## Stage 1: Priority Inbox

### Problem
Users receive a high volume of notifications and miss important ones. A Priority Inbox surfaces the most critical unread notifications first.

### Approach
The Priority Inbox is a pure function `getPriorityInbox(notifications, n)` that:

1. **Accepts** the raw notifications array from the API and a configurable `n` (default 10)
2. **Sorts** by a two-level key:
   - **Primary**: Type priority — `Placement` (rank 0) > `Result` (rank 1) > `Event` (rank 2)
   - **Secondary**: Timestamp descending (most recent first within the same type)
3. **Returns** the top `n` items from the sorted list

### Sorting Algorithm
```
TYPE_RANK = { Placement: 0, Result: 1, Event: 2 }

sort key = (TYPE_RANK[Type], -Timestamp)
```

This is a stable sort — equal-type, equal-time notifications preserve API order.

### Configurable N
The value of `n` is passed as a parameter. Default is 10. The frontend will expose a selector (10 / 15 / 20) in Stage 2.

### Data Source
Uses `GET /notifications` with Bearer auth. No database, no hardcoded data, no self-created notifications. The API returns:
```json
{ "notifications": [{ "ID", "Type", "Message", "Timestamp" }] }
```

### Verification
Tested with mock data matching the API shape:

```
=== Priority Inbox (N=5) ===
1. [Placement] Tesla hiring — 2026-07-01 02:00:00
2. [Placement] Apple hiring — 2026-06-30 09:00:00
3. [Placement] Google hiring — 2026-06-30 08:00:00
4. [Result] mid-sem — 2026-06-30 15:00:00
5. [Result] end-sem — 2026-06-30 10:00:00
```

- All Placement notifications appear first (newest→oldest)
- Then Result notifications (newest→oldest)
- Then Event notifications
- Cutoff at N=5 respected

### Complexity
- Time: O(m log m) where m = total notifications (sort)
- Space: O(m) for the shallow copy
- No pagination needed for the priority calculation — we sort all fetched items then slice.

### File
`notification-app-fe/src/utils/priorityInbox.js`

## Stage 2: Frontend Application

### Architecture
- **React + Vite** with MUI for styling
- **react-router-dom** for two separate pages: `/` (All) and `/priority` (Priority Inbox)
- **Logging Middleware** integrated via `@logging/log.js` alias — all API calls, user actions, and errors logged
- **Viewed/Unread tracking** via `useViewed` hook (localStorage-based)

### Pages

| Route | Component | Purpose |
|---|---|---|
| `/` | `AllNotificationsPage` | Lists all notifications with type filter + pagination |
| `/priority` | `PriorityInboxPage` | Shows top N priority notifications (N configurable: 10/15/20) |

### API Integration
Stage 2 API supports `limit`, `page`, `notification_type` query params:
- `AllNotificationsPage` uses `notification_type` for filter, `page` + `limit=20` for pagination
- `PriorityInboxPage` fetches all 3 types in parallel (`Promise.all`) with `limit=50` each, then applies `getPriorityInbox()`

### Viewed vs Unread
- `useViewed()` hook persists viewed IDs in `localStorage`
- Cards render at full opacity (unread) or 0.55 opacity (viewed)
- Clicking a card marks it viewed
- Each page shows unread count

### Logging Points
Every significant action logs via `Log(stack, level, package, message)`:
- `api`: request start, success count, error status
- `hook`: fetch failures
- `component`: card view actions
- `page`: filter changes, page changes, priority inbox loads

### Responsive Design
MUI `Box` with `maxWidth: 720, mx: auto` centers content. `flexWrap` on filters handles small screens. All components use MUI spacing — no fixed pixel widths.

### File Structure
```
src/
  api/
    config.js          — BASE URL + TOKEN from .env
    notifications.js   — fetchNotifications with params
  components/
    NotificationCard.jsx   — card with viewed/unread state
    NotificationFilter.jsx — type filter toggle buttons
  hooks/
    useNotifications.js   — data fetching hook
    useViewed.js          — viewed/unread localStorage hook
  pages/
    AllNotificationsPage.jsx
    PriorityInboxPage.jsx
  utils/
    priorityInbox.js       — Stage 1 priority logic
  App.jsx                 — router + theme
  main.jsx                — entry point
```
