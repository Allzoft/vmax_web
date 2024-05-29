import { User } from './user.interface';

export interface Notification {
  id_notification: number;
  userIdUser: number;
  isRead: number;
  description: string;
  tittle: string;
  photo: string;
  icon: string;
  color: string;
  user?: User;
  created_at: string;
}
