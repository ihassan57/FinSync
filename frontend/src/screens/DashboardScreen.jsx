import React, { useContext } from 'react';
import { FinSyncContext } from '../context/FinSyncContext';
import { Bell, Landmark, Wallet, ArrowUpRight, ArrowDownLeft, Fuel, Tv, Utensils, Car, ArrowDown, ArrowUp, Briefcase, ShoppingBag, HelpCircle, AlertCircle, Camera, Share2 } from 'lucide-react';

export default function DashboardScreen() {
  const {
    navigateTo,
    transactions,
    accounts,
    totalBalance,
    totalIncome,
    totalExpenses,
    unreadNotificationsCount,
    setSelectedPendingTransaction,
    setIsCategorySheetOpen
  } = useContext(FinSyncContext);

  // Take the first 5 transactions for recent list
  const recentTransactions = transactions.slice(0, 5);

  // Helper to map category/merchant to Lucide icon
  const getIcon = (category, merchant) => {
    const term = (merchant + ' ' + category).toLowerCase();
    if (term.includes('food') || term.includes('panda')) return <Utensils className="w-5 h-5 text-amber-500" />;
    if (term.includes('salary') || term.includes('income')) return <Briefcase className="w-5 h-5 text-emerald-500" />;
    if (term.includes('uber') || term.includes('transport') || term.includes('car')) return <Car className="w-5 h-5 text-sky-500" />;
    if (term.includes('netflix') || term.includes('entertainment')) return <Tv className="w-5 h-5 text-purple-500" />;
    if (term.includes('fuel') || term.includes('aramco')) return <Fuel className="w-5 h-5 text-orange-500" />;
    if (term.includes('grocery') || term.includes('shopping')) return <ShoppingBag className="w-5 h-5 text-pink-500" />;
    return <HelpCircle className="w-5 h-5 text-slate-400" />;
  };

  const handleTransactionTap = (tx) => {
    if (tx.status === 'pending_review') {
      setSelectedPendingTransaction(tx);
      setIsCategorySheetOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-appBg overflow-y-auto no-scrollbar pb-24">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 pt-6 pb-4 bg-white border-b border-borderColor">
        <h2 className="text-heading text-textPrimary">Good morning, Hassan 👋</h2>
        <button
          onClick={() => navigateTo('notifications', 'forward')}
          className="relative p-2 hover:bg-slate-100 rounded-full transition-all text-slate-700"
        >
          <Bell className="w-6 h-6" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
      </div>

      <div className="px-4 mt-5 flex flex-col gap-4">
        {/* Total Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary p-5 rounded-card shadow-lg text-white">
          {/* Subtle decorative circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-[0.08] rounded-full"></div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white opacity-[0.04] rounded-full"></div>

          <p className="text-caption opacity-90 uppercase tracking-wider font-semibold">Total Balance</p>
          <h1 className="text-3xl font-extrabold mt-1">Rs {totalBalance.toLocaleString()}</h1>
          <p className="text-caption opacity-80 mt-2 font-medium">Across {accounts.length} accounts</p>
        </div>

        {/* Account Chips (Horizontal scrollable row) */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="flex-shrink-0 min-w-[130px] bg-white p-3 rounded-xl shadow-card border border-borderColor flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption text-textSecondary font-semibold truncate max-w-[85px]">{acc.name}</span>
                {acc.type === 'bank' ? (
                  <Landmark className="w-4 h-4 text-primary" />
                ) : (
                  <Wallet className="w-4 h-4 text-secondary" />
                )}
              </div>
              <span className="text-label font-bold text-textPrimary">Rs {acc.balance.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigateTo('ocr', 'forward')}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-borderColor p-3 rounded-xl shadow-card text-label font-bold text-textPrimary active:scale-[0.98] transition-all cursor-pointer"
          >
            <Camera className="w-4.5 h-4.5 text-primary" />
            Scan Receipt
          </button>
          <button
            onClick={() => navigateTo('split', 'forward')}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-borderColor p-3 rounded-xl shadow-card text-label font-bold text-textPrimary active:scale-[0.98] transition-all cursor-pointer"
          >
            <Share2 className="w-4.5 h-4.5 text-secondary" />
            New Split
          </button>
        </div>

        {/* Monthly Summary Stats Card */}
        <div className="grid grid-cols-2 gap-3">
          {/* Income Stat */}
          <div className="bg-white p-4 rounded-card border border-borderColor shadow-card flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-income">
              <ArrowUp className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-caption text-textSecondary font-medium">Income</span>
              <span className="text-body font-bold text-textPrimary">Rs {totalIncome.toLocaleString()}</span>
            </div>
          </div>

          {/* Expenses Stat */}
          <div className="bg-white p-4 rounded-card border border-borderColor shadow-card flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl text-expense">
              <ArrowDown className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-caption text-textSecondary font-medium">Expenses</span>
              <span className="text-body font-bold text-textPrimary">Rs {totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="mt-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-heading text-textPrimary">Recent Transactions</h3>
            <button
              onClick={() => navigateTo('transactions', 'forward')}
              className="text-caption text-primary font-semibold hover:underline"
            >
              See All
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {recentTransactions.map((tx) => {
              const isPending = tx.status === 'pending_review';
              return (
                <div
                  key={tx.id}
                  onClick={() => handleTransactionTap(tx)}
                  className={`bg-white p-3.5 rounded-card border border-borderColor shadow-card flex items-center justify-between transition-all select-none ${
                    isPending ? 'border-amber-200 hover:bg-amber-50/20 cursor-pointer active:scale-[0.99]' : 'active:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    {/* Category icon circle */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                      {getIcon(tx.category, tx.merchant)}
                    </div>
                    
                    {/* Details */}
                    <div className="flex flex-col truncate">
                      <span className="text-body font-bold text-textPrimary truncate">{tx.merchant}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-caption text-textSecondary">{tx.account}</span>
                        <span className="text-caption text-slate-300">•</span>
                        <span className="text-caption text-textSecondary">{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price and Badge */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className={`text-body font-bold ${tx.type === 'credit' ? 'text-income' : 'text-expense'}`}>
                      {tx.type === 'credit' ? '+' : '-'}Rs {tx.amount.toLocaleString()}
                    </span>
                    {isPending ? (
                      <span className="mt-1 px-2 py-0.5 rounded-full bg-pending-bg text-pending-text text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                        <AlertCircle className="w-2.5 h-2.5" />
                        Pending
                      </span>
                    ) : (
                      <span className="text-caption text-textSecondary mt-0.5 font-medium">{tx.category}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scan Receipt Floating Action Button */}
      <button
        onClick={() => navigateTo('ocr', 'forward')}
        className="absolute bottom-24 right-6 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all z-20 cursor-pointer shadow-blue-200"
        aria-label="Scan Receipt"
      >
        <Camera className="w-6 h-6" />
      </button>
    </div>
  );
}
