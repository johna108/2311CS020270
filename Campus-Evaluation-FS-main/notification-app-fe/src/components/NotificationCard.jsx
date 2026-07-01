import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Log } from "@logging/log.js";

const typeColor = { Placement: "info", Result: "success", Event: "warning" };

export function NotificationCard({ notification, viewed, onView }) {
  const { ID, Type, Message, Timestamp } = notification;

  const handleClick = () => {
    if (!viewed) {
      onView(ID);
      Log("frontend", "info", "component", `Marked ${ID} as viewed`);
    }
  };

  return (
    <Card
      variant="outlined"
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        borderLeft: 4,
        borderColor: `${typeColor[Type] || "grey"}.main`,
        opacity: viewed ? 0.55 : 1,
        "&:hover": { boxShadow: 2 },
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography variant="subtitle2" fontWeight={viewed ? 400 : 700}>
            {Message}
          </Typography>
          {Type && <Chip label={Type} size="small" color={typeColor[Type] || "default"} />}
        </Box>
        {Timestamp && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTimeIcon sx={{ fontSize: 14, color: "text.disabled" }} />
            <Typography variant="caption" color="text.disabled">
              {new Date(Timestamp).toLocaleString()}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
