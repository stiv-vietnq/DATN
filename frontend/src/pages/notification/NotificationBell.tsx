import "./NotificationLabel.css";
import { useEffect, useState, useRef } from "react";
import { connectNotificationWS } from "../../websocket/connectNotificationWS";
import {
  getNotificationsByUser,
  getUnreadCount,
  markNotificationRead,
} from "../../api/notification";
import { Notification } from "../../api/NotificationDto";

export default function NotificationLabel() {
  const userId = localStorage.getItem("userId")
    ? parseInt(localStorage.getItem("userId")!)
    : 0;
  const role = localStorage.getItem("role") || undefined;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadOld = async () => {
    const data = await getNotificationsByUser(userId, role);
    setNotifications(data.data);

    const unread = await getUnreadCount(userId, role);
    setUnreadCount(unread.data);
  };

  const handleRead = async (id: number) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    const unread = await getUnreadCount(userId, role);
    setUnreadCount(unread.data);
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
      <div
        className="notification-wrapper"
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="navbar-container-account-item">
          🔔
        </div>

        {unreadCount > 0 && (
          <span className="unread-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
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
                  n.read === true
                    ? "notification-item read"
                    : "notification-item"
                }
              >
                <div className={`noti-row ${n.failReason ? "has-reason" : ""}`}>
                  <div className={n.read === false ? "unread" : ""}>
                    {n.message}
                  </div>

                  {n.failReason && (
                    <div className="fail-reason">
                      {n.failReason}
                    </div>
                  )}
                </div>

                <small>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
