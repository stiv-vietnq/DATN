import "./NotificationLabel.css";
import { useEffect, useState, useRef } from "react";
import { connectNotificationWS } from "../../websocket/connectNotificationWS";
import {
  getNotificationsByUser,
  markNotificationRead,
} from "../../api/notification";
import { Notification } from "../../api/NotificationDto";

export default function NotificationLabel() {
  const userId = localStorage.getItem("userId")
    ? parseInt(localStorage.getItem("userId")!)
    : 0;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // dùng ref để detect click ngoài

  const loadOld = async () => {
    const data = await getNotificationsByUser(userId);
    setNotifications(data.data);
  };

  const handleRead = async (id: number) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  useEffect(() => {
    loadOld().catch(console.error);

    const client = connectNotificationWS(userId, (newNoti) => {
      setNotifications((prev) => [newNoti, ...prev]);
    });

    return () => {
      client.deactivate();
    };
  }, []);

  console.log(notifications);

  const unreadCount = notifications.filter((n) => n.isRead === false).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  return (
    <div ref={containerRef}>
      <div onClick={() => setOpen((prev) => !prev)}>
        <div className="navbar-container-account-item">Thông báo</div>
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </div>

      {open && (
        <div className="notification-popup">
          <div className="no">Thông báo</div>
          {notifications.length === 0 ? (
            <p className="notification-popup-empty">Không có thông báo</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleRead(n.id)}
                className={
                  n.isRead === true
                    ? "notification-item read"
                    : "notification-item"
                }
              >
                <p className={n.isRead === false ? "unread" : ""}>
                  {n.message}
                </p>
                <small>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
