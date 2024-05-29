import { State } from './state.interface';
import { Wallet } from './user.interface';

export interface Credit {
  id_credit: number;
  type_credit: string;
  walletIdWallet: number;
  previous_amount: number;
  credit_amount: number;
  stateIdState: number;
  subsequent_amount: number;
  credit_date: Date;
  wallet?: Wallet;
  state?: State;
}
