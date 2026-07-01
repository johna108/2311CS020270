import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import { useViewed } from "../hooks/useViewed";
import { Log } from "@logging/log.js";

export function AllNotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { notifications, loading, error } = useNotifications({
    notification_type: filter === "All" ? undefined : filter,
    page,
    limit,
  });
  const { viewed, markViewed, unviewedCount } = useViewed();

  const unread = unviewedCount(notifications);

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(1);
    Log("frontend", "info", "page", `Filter changed to ${f}`);
  };

  const handlePageChange = (_, p) => {
    setPage(p);
    Log("frontend", "info", "page", `Page changed to ${p}`);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <NotificationsIcon sx={{ fontSize: 28, color: "primary.main" }} />
          <Typography variant="h5" fontWeight={700}>All Notifications</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {unread} unread
        </Typography>
      </Stack>

      <Box mb={2}>
        <Link to="/priority" style={{ textDecoration: "none" }}>
          <Typography variant="body2" color="primary">View Priority Inbox →</Typography>
        </Link>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 3 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5}>
          {notifications.map((n) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              viewed={viewed.has(n.ID)}
              onView={markViewed}
            />
          ))}
        </Stack>
      )}

      {!loading && notifications.length === limit && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination count={10} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
        </Box>
      )}
    </Box>
  );
}
