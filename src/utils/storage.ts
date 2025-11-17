import { Transaction } from '../types';

const STORAGE_KEY = 'buddyTixTracker';

export const loadTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, txn) => {
    return txn.type === 'ticket' ? sum + txn.amount : sum - txn.amount;
  }, 0);
};
