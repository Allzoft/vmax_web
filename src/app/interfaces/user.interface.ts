import { Order } from './order.interface';
import { Phase } from './phase.interface';

export interface Token {
  access_token: string;
  user: User;
}

export interface User {
  id_user: number;
  name: string;
  uuid: string;
  email: string;
  password?: string;
  code_country: string;
  phone: string;
  photo: string;
  isEnabled: number;
  phaseIdPhase: number;
  walletId: number;
  wallet: Wallet;
  phase?: Phase;
  orders?: Order[];
}

export interface Wallet {
  id_wallet: number;
  balance: number;
  currency: string;
}
