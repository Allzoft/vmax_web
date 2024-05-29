import { State } from "./state.interface";
import { Wallet } from "./user.interface";

export interface Retreat {
  id_retreat: number;
  account_name: string;
  account_code: string;
  bank_name: string;
  retreat_date: Date;
  total_retreat: number;
  stateIdState: number;
  walletIdWallet: number;
  state?: State;
  wallet?: Wallet;
}
