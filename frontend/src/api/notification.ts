import api from "./index";
import { Notification } from "./NotificationDto";

export interface SendNotificationRequest {
  userId: number;
  title: string;
  message: string;
}

export interface MarkReadRequest {
  notificationId: number;
}

export const sendNotification = (data: SendNotificationRequest) => {
  return api.post<Notification>("/notifications/send", data);
};

export const getNotificationsByUser = (userId: number) => {
  return api.get<Notification[]>(`/notifications/user/${userId}`);
};

export const getUnreadCount = (userId: number) => {
  return api.get<number>(`/notifications/user/${userId}/unread-count`);
};

export const markNotificationRead = (notificationId: number) => {
  const body: MarkReadRequest = { notificationId };
  return api.post<Notification>("/notifications/mark-read", body);
};
