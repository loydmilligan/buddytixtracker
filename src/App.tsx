import { useState, useEffect } from 'react';
import { Transaction } from './types';
import { loadTransactions, saveTransactions, calculateBalance } from './utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

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
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-3 text-gray-700">Recent Transactions</h2>
            <div className="space-y-2">
              {recentTransactions.map((txn) => (
                <div key={txn.id} className="flex justify-between items-center text-sm border-b pb-2">
                  <div>
                    <div className="font-medium">
                      {txn.type === 'ticket' ? '🎟️ Ticket' : '💵 Payment'}
                    </div>
                    <div className="text-xs text-gray-500">{txn.date}</div>
                  </div>
                  <div className={`font-bold ${txn.type === 'ticket' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'ticket' ? '+' : '-'}${txn.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for Calendar */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>📅 Calendar view coming soon...</p>
          <p className="mt-2">Use Claude Code to build it! 🚀</p>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
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
    </div>
  );
}

export default App;
