/**
 * Bildirim / Toast bileşeni.
 * Ekranın sağ üst köşesinde bildirimleri gösterir.
 */
import { useNotifications, type Notification } from "@/lib/stores/useNotifications";

const TYPE_COLORS: Record<Notification["type"], string> = {
  success: "#2ECC71",
  error: "#e74c3c",
  warning: "#f39c12",
  info: "#3498db",
  event: "#9b59b6",
};

/** @description Tek bir bildirim kartı */
function ToastCard({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotifications();

  try {
    const borderColor = TYPE_COLORS[notification.type] ?? "#3498db";
    const age = Date.now() - notification.createdAt;
    const duration = notification.duration ?? 4000;
    const progress = Math.min(1, age / duration);

    return (
      <div
        style={{
          background: "rgba(10, 15, 25, 0.95)",
          border: `1px solid ${borderColor}40`,
          borderLeft: `3px solid ${borderColor}`,
          borderRadius: "8px",
          padding: "10px 14px",
          marginBottom: "8px",
          minWidth: "250px",
          maxWidth: "320px",
          animation: "slideIn 0.3s ease-out",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Başlık */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ fontWeight: 700, fontSize: "13px", color: borderColor }}>
            {notification.icon && <span style={{ marginRight: "6px" }}>{notification.icon}</span>}
            {notification.title}
          </span>
          <button
            onClick={() => removeNotification(notification.id)}
            style={{
              background: "transparent",
              border: "none",
              color: "#666",
              cursor: "pointer",
              fontSize: "14px",
              padding: "0 2px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Mesaj */}
        <div style={{ fontSize: "11px", color: "#bbb", lineHeight: 1.4 }}>
          {notification.message}
        </div>

        {/* İlerleme çubuğu */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "2px",
            background: borderColor,
            width: `${(1 - progress) * 100}%`,
            transition: "width 0.5s linear",
          }}
        />
      </div>
    );
  } catch (err) {
    console.error("[ToastCard] render error:", err);
    return null;
  }
}

/** @description Bildirim container bileşeni */
export function NotificationToast() {
  const { notifications } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "16px",
        zIndex: 9999,
        pointerEvents: "auto",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      {notifications.map((n) => (
        <ToastCard key={n.id} notification={n} />
      ))}
    </div>
  );
}
