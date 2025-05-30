import { Order } from './order.interface';

export interface Phase {
  id_phase: number;
  name: string;
  level: number;
  task_number: number;
  orders?: Order[];
}
