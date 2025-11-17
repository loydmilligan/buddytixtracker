import { useState, useEffect } from 'react';
import { Transaction } from './types';
import { loadTransactions, saveTransactions, calculateBalance } from './utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const loaded = loadTransactions();
    setTransactions(loaded);
    setBalance(calculateBalance(loaded));
  }, []);

  const addTicket = () => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'ticket',
      amount: 20,
      timestamp: Date.now(),
    };
    
    const updated = [...transactions, newTransaction];
    setTransactions(updated);
    saveTransactions(updated);
    setBalance(calculateBalance(updated));
  };

  const addPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newTransaction: Transaction = {
      id: uuidv4(),
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'payment',
      amount: amount,
      timestamp: Date.now(),
    };

    const updated = [...transactions, newTransaction];
    setTransactions(updated);
    saveTransactions(updated);
    setBalance(calculateBalance(updated));
    setShowPaymentModal(false);
    setPaymentAmount('');
  };

  const deleteTransaction = (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
    setBalance(calculateBalance(updated));
  };

  const startEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditAmount(transaction.amount.toString());
    setShowEditModal(true);
  };

  const saveEditTransaction = () => {
    if (!editingTransaction) return;

    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const updated = transactions.map(t =>
      t.id === editingTransaction.id
        ? { ...t, amount }
        : t
    );

    setTransactions(updated);
    saveTransactions(updated);
    setBalance(calculateBalance(updated));
    setShowEditModal(false);
    setEditingTransaction(null);
    setEditAmount('');
  };

  const getTransactionsForDate = (date: Date): Transaction[] => {
    return transactions.filter(t => isSameDay(parseISO(t.date), date));
  };

  const getMonthDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const recentTransactions = [...transactions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-8 mt-4">
          🎟️ BuddyTixTracker
        </h1>
        
        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 animate-fade-in">
          <p className="text-center text-gray-600 mb-2">Current Balance</p>
          <p className={`text-5xl font-bold text-center ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(balance).toFixed(2)}
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            {balance >= 0 ? 'Buddy owes you' : 'You owe buddy'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={addTicket}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xl font-bold py-6 px-4 rounded-lg shadow-lg transition-colors touch-manipulation"
          >
            <div className="text-3xl mb-1">+</div>
            <div className="text-sm">Add Ticket</div>
            <div className="text-xs opacity-75">$20</div>
          </button>
          
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-xl font-bold py-6 px-4 rounded-lg shadow-lg transition-colors touch-manipulation"
          >
            <div className="text-3xl mb-1">$</div>
            <div className="text-sm">Add Payment</div>
            <div className="text-xs opacity-75">Custom</div>
          </button>
        </div>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 animate-fade-in">
            <h2 className="font-semibold mb-3 text-gray-700">Recent Transactions</h2>
            <div className="space-y-2">
              {recentTransactions.map((txn) => (
                <div key={txn.id} className="flex justify-between items-center text-sm border-b pb-2">
                  <div className="flex-1">
                    <div className="font-medium">
                      {txn.type === 'ticket' ? '🎟️ Ticket' : '💵 Payment'}
                    </div>
                    <div className="text-xs text-gray-500">{txn.date}</div>
                  </div>
                  <div className={`font-bold mr-2 ${txn.type === 'ticket' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'ticket' ? '+' : '-'}${txn.amount.toFixed(2)}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditTransaction(txn)}
                      className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-700 rounded transition-colors touch-manipulation"
                      aria-label="Edit transaction"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTransaction(txn.id)}
                      className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700 rounded transition-colors touch-manipulation"
                      aria-label="Delete transaction"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Toggle */}
        <div className="mt-6">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg shadow transition-colors touch-manipulation"
          >
            📅 {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </button>
        </div>

        {/* Calendar View */}
        {showCalendar && (
          <div className="mt-6 bg-white rounded-lg shadow p-4 animate-fade-in">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={previousMonth}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded transition-colors touch-manipulation"
                aria-label="Previous month"
              >
                ←
              </button>
              <h3 className="font-bold text-lg">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <button
                onClick={nextMonth}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded transition-colors touch-manipulation"
                aria-label="Next month"
              >
                →
              </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-xs font-semibold text-gray-500 py-1">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: getMonthDays()[0].getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days with transactions */}
              {getMonthDays().map(day => {
                const dayTransactions = getTransactionsForDate(day);
                const hasTransactions = dayTransactions.length > 0;
                const dayBalance = dayTransactions.reduce((sum, t) =>
                  sum + (t.type === 'ticket' ? t.amount : -t.amount), 0
                );
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toISOString()}
                    className={`aspect-square p-1 text-sm border rounded ${
                      isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } ${hasTransactions ? 'bg-green-50' : ''}`}
                  >
                    <div className="font-medium text-gray-700">{format(day, 'd')}</div>
                    {hasTransactions && (
                      <div className={`text-xs font-bold ${dayBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {dayBalance >= 0 ? '+' : ''}{dayBalance.toFixed(0)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Month Summary */}
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                <strong>This month:</strong>{' '}
                {transactions.filter(t => {
                  const txDate = parseISO(t.date);
                  return txDate >= startOfMonth(currentMonth) && txDate <= endOfMonth(currentMonth);
                }).length} transactions
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl animate-slide-in">
            <h2 className="text-xl font-bold mb-4">Record Payment</h2>
            <input
              type="number"
              step="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-lg"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentAmount('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addPayment}
                className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl animate-slide-in">
            <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
            <div className="mb-4 text-sm text-gray-600">
              <div className="font-medium">
                {editingTransaction.type === 'ticket' ? '🎟️ Ticket' : '💵 Payment'}
              </div>
              <div className="text-xs">{editingTransaction.date}</div>
            </div>
            <input
              type="number"
              step="0.01"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-lg"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTransaction(null);
                  setEditAmount('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEditTransaction}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
