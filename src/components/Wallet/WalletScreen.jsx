import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Gift, TrendingUp, X, Check, Loader2 } from 'lucide-react';
import { walletAPI } from '../../services/api';

export const WalletScreen = () => {
  const appContext = useApp();
  
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add Money Modal State
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [balRes, txRes] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getTransactions()
      ]);
      setBalance(balRes.balance);
      setTransactions(txRes);
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (addAmount <= 0) return;
    try {
      setIsProcessing(true);
      // Simulate payment gateway delay
      await new Promise(res => setTimeout(res, 1500));
      await walletAPI.addFunds(addAmount);
      setShowAddMoney(false);
      setAddAmount(10);
      await fetchWalletData(); // refresh
    } catch (err) {
      alert(err.message || 'Top up failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalEarned = transactions
    .filter(t => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const getIcon = (reason, type) => {
    if (reason.toLowerCase().includes('order') || reason.toLowerCase().includes('payment')) return '🍱';
    if (reason.toLowerCase().includes('top up')) return '💳';
    if (reason.toLowerCase().includes('refund')) return '↩️';
    if (reason.toLowerCase().includes('bonus') || reason.toLowerCase().includes('loyalty')) return '🎁';
    return type === 'CREDIT' ? '💰' : '💸';
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-28 lg:pb-12 space-y-6">

      {/* Hero Wallet Card */}
      <div
        className="rounded-3xl p-8 text-white shadow-card-elevated relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f2e 60%, #111827 100%)' }}
      >
        {/* Decorative circle */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }}
        />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-sm text-white/80 uppercase tracking-wider">My Wallet</span>
          </div>

          <div className="mb-2">
            <span className="font-heading text-5xl font-black text-white">
              £{balance.toFixed(2)}
            </span>
          </div>
          <p className="text-white/60 text-sm font-medium mb-6">Available Balance</p>

          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="flex-1 bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Total Earned</p>
                <p className="text-white font-heading font-extrabold text-sm">+£{totalEarned.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-red-500/20 flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Total Spent</p>
                <p className="text-white font-heading font-extrabold text-sm">-£{totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Money Button */}
      <button
        onClick={() => setShowAddMoney(true)}
        className="w-full py-4 rounded-2xl font-heading font-extrabold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
      >
        <Plus className="w-4 h-4" />
        Add Money to Wallet
      </button>

      {/* Transaction History */}
      <div className="space-y-3">
        <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
          <Gift className="w-5 h-5 text-brand-500" />
          Transaction History
        </h3>

        <div className="space-y-2">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="bg-white rounded-2xl p-4 border border-cream-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all flex items-center gap-4"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ background: txn.type === 'CREDIT' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}
              >
                {getIcon(txn.reason, txn.type)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-sm text-ink-900 truncate">{txn.reason}</p>
                <p className="text-xs text-stone-400 font-medium mt-0.5">{formatDate(txn.createdAt)}</p>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-1.5 shrink-0">
                {txn.type === 'CREDIT' ? (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5 text-fresh-600" />
                    <span className="font-heading font-extrabold text-fresh-600">+£{txn.amount.toFixed(2)}</span>
                  </>
                ) : (
                  <>
                    <ArrowDownLeft className="w-3.5 h-3.5 text-red-500" />
                    <span className="font-heading font-extrabold text-red-500">-£{txn.amount.toFixed(2)}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center border border-cream-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cream-100 text-stone-400 mx-auto flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-extrabold text-lg text-ink-900">No Transactions Yet</h4>
            <p className="text-xs text-stone-500 font-medium">Your wallet activity will appear here.</p>
          </div>
        )}
      </div>

      {/* Top Up Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl">
            <button onClick={() => !isProcessing && setShowAddMoney(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 transition-colors">
              <X className="w-5 h-5 text-stone-400" />
            </button>
            <h3 className="font-heading text-2xl font-extrabold text-ink-900 mb-2">Top Up Wallet</h3>
            <p className="text-stone-500 text-xs mb-6">Select or enter an amount to add to your lunchbox wallet.</p>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[10, 25, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAddAmount(amt)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${addAmount === amt ? 'bg-saffron-50 border-2 border-saffron-500 text-saffron-700' : 'bg-white border-2 border-cream-200 text-stone-600 hover:border-saffron-200 hover:bg-saffron-50/50'}`}
                >
                  £{amt}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Custom Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-bold text-lg text-stone-400">£</span>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(Number(e.target.value))}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl py-3 pl-10 pr-4 font-heading font-bold text-lg text-ink-900 focus:outline-none focus:border-saffron-500 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleTopUp}
              disabled={isProcessing || addAmount <= 0}
              className="w-full py-4 rounded-xl bg-brand-500 text-white font-heading font-bold flex items-center justify-center gap-2 hover:bg-brand-600 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              {isProcessing ? 'Processing Securely...' : `Pay £${addAmount.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
