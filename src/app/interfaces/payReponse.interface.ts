import { Notification } from './notification.interface';
import { Order } from './order.interface';
import { Wallet } from './user.interface';

export interface PayResponse {
  wallet: Wallet;
  order: Order;
  notification: Notification;
}
