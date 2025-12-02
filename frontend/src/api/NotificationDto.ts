export interface Notification {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  createdAt: string;
  failReason?: string;
  type?: string;
}
