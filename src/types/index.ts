export interface Transaction {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  type: 'ticket' | 'payment';
  amount: number;
  timestamp: number;
}

export interface AppState {
  transactions: Transaction[];
  balance: number;
}
