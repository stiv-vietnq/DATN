import api from "./index";
import { Notification } from "./NotificationDto";

export interface SendNotificationRequest {
  userId: number;
  title: string;
  message: string;
  failReason?: string;
  type?: string;
}

export interface MarkReadRequest {
  notificationId: number;
}

export const sendNotification = (data: SendNotificationRequest) => {
  return api.post<Notification>("/notifications/send", data);
};

export const getNotificationsByUser = (userId: number, role?: string) => {
  const params: any = {};
  if (role) params.role = role;

  return api.get<Notification[]>(
    `/notifications/user/${userId}`,
    { params }
  );
};

export const getUnreadCount = (userId: number, role?: string) => {
  const params: any = {};
  if (role) params.role = role;

  return api.get<number>(
    `/notifications/user/${userId}/unread-count`,
    { params }
  );
};

export const markNotificationRead = (notificationId: number) => {
  const body: MarkReadRequest = { notificationId };
  return api.post<Notification>("/notifications/mark-read", body);
};
