import { useState } from "react";
import { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

import { NotificationCard } from "../components/NotificationCard";
import { fetchNotifications } from "../api/notifications";
import { getPriorityInbox } from "../utils/priorityInbox";
import { useViewed } from "../hooks/useViewed";
import { Log } from "@logging/log.js";

export function PriorityInboxPage() {
  const [n, setN] = useState(10);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { viewed, markViewed, markAllViewed, unviewedCount } = useViewed();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all types to compute priority — ponytail: 3 requests in parallel, not sequential
      const [p, r, e] = await Promise.all([
        fetchNotifications({ notification_type: "Placement", limit: 50 }),
        fetchNotifications({ notification_type: "Result", limit: 50 }),
        fetchNotifications({ notification_type: "Event", limit: 50 }),
      ]);
      const all = [
        ...(p.notifications ?? []),
        ...(r.notifications ?? []),
        ...(e.notifications ?? []),
      ];
      setNotifications(all);
      Log("frontend", "info", "page", `Priority inbox loaded ${all.length} total, showing top ${n}`);
    } catch (err) {
      setError(err.message);
      Log("frontend", "error", "page", `Priority inbox fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [n]);

  useEffect(() => { load(); }, [load]);

  const priority = getPriorityInbox(notifications, n);
  const unread = unviewedCount(priority);

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <InboxIcon sx={{ fontSize: 28, color: "primary.main" }} />
          <Typography variant="h5" fontWeight={700}>Priority Inbox</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {unread} unread
        </Typography>
      </Stack>

      <Box mb={2}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Typography variant="body2" color="primary">← All Notifications</Typography>
        </Link>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Show top</InputLabel>
          <Select value={n} label="Show top" onChange={(e) => setN(e.target.value)}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          {"Sorted: Placement > Result > Event, newest first"}
        </Typography>
      </Stack>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      )}

      {!loading && !error && priority.length === 0 && (
        <Alert severity="info">No priority notifications found.</Alert>
      )}

      {!loading && !error && priority.length > 0 && (
        <Stack spacing={1.5}>
          {priority.map((notif) => (
            <NotificationCard
              key={notif.ID}
              notification={notif}
              viewed={viewed.has(notif.ID)}
              onView={markViewed}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
