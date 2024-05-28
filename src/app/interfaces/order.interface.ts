import { State } from "./state.interface";

export interface Order {
  id_order: number;
  name: string;
  stateIdState: number;
  userIdUser: number;
  photo: string;
  price_per_unit: number;
  quantity: number;
  total_price: number;
  commission: number;
  order_date: string;
  uuid: string;
  loading?: boolean;
  state?: State
}
