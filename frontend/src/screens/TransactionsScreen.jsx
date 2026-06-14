import React, { useContext, useState } from 'react';
import { FinSyncContext } from '../context/FinSyncContext';
import { Search, Utensils, Briefcase, Car, Tv, Fuel, ShoppingBag, Lightbulb, Box, HelpCircle, AlertCircle } from 'lucide-react';

const filterPills = ['All', 'Today', 'This Week', 'This Month', 'Income', 'Expenses'];

export default function TransactionsScreen() {
  const {
    transactions,
    setSelectedPendingTransaction,
    setIsCategorySheetOpen
  } = useContext(FinSyncContext);

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to map category/merchant to Lucide icon
  const getIcon = (category, merchant) => {
    const term = (merchant + ' ' + category).toLowerCase();
    if (term.includes('food') || term.includes('panda')) return <Utensils className="w-5 h-5 text-amber-500" />;
    if (term.includes('salary') || term.includes('income')) return <Briefcase className="w-5 h-5 text-emerald-500" />;
    if (term.includes('uber') || term.includes('transport') || term.includes('car')) return <Car className="w-5 h-5 text-sky-500" />;
    if (term.includes('netflix') || term.includes('entertainment')) return <Tv className="w-5 h-5 text-purple-500" />;
    if (term.includes('fuel') || term.includes('aramco')) return <Fuel className="w-5 h-5 text-orange-500" />;
    if (term.includes('grocery') || term.includes('shopping')) return <ShoppingBag className="w-5 h-5 text-pink-500" />;
    if (term.includes('bill') || term.includes('electricity')) return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    return <HelpCircle className="w-5 h-5 text-slate-400" />;
  };

  // Filter transaction list based on search query & active filter pill
  const filteredTransactions = transactions.filter((t) => {
    // 1. Search Query filter
    const matchesSearch =
      t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.account.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Pill Filter
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Today') return t.groupDate === 'Today';
    if (activeFilter === 'This Week') {
      return t.groupDate === 'Today' || t.groupDate === 'Yesterday' || t.groupDate === 'This Week';
    }
    if (activeFilter === 'This Month') {
      return t.groupDate !== 'Earlier'; // everything within the current month bounds
    }
    if (activeFilter === 'Income') return t.type === 'credit';
    if (activeFilter === 'Expenses') return t.type === 'debit';

    return true;
  });

  // Groups list
  const dateGroups = ['Today', 'Yesterday', 'This Week', 'Earlier'];

  const handleTransactionTap = (tx) => {
    if (tx.status === 'pending_review') {
      setSelectedPendingTransaction(tx);
      setIsCategorySheetOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-appBg overflow-y-auto no-scrollbar pb-24 select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-borderColor sticky top-0 z-10">
        <h1 className="text-title text-textPrimary">Transactions</h1>
        
        {/* Filter Pills Scrollable */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4 py-0.5">
          {filterPills.map((pill) => {
            const isActive = activeFilter === pill;
            return (
              <button
                key={pill}
                onClick={() => setActiveFilter(pill)}
                className={`px-4 py-2 rounded-full text-caption font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-white shadow-sm shadow-blue-150'
                    : 'bg-slate-100 hover:bg-slate-200 text-textSecondary border border-slate-200'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by merchant, category or bank..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white transition-all placeholder-slate-400"
          />
        </div>
      </div>

      {/* Transaction Groups List */}
      <div className="px-4 mt-4 flex flex-col gap-5">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white p-8 rounded-card border border-borderColor text-center mt-6">
            <span className="text-2xl">🔍</span>
            <p className="text-body font-bold text-textPrimary mt-2">No Transactions Found</p>
            <p className="text-caption text-textSecondary mt-1">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          dateGroups.map((group) => {
            const groupTxList = filteredTransactions.filter((t) => t.groupDate === group);
            if (groupTxList.length === 0) return null;

            return (
              <div key={group} className="flex flex-col gap-2.5">
                {/* Group Heading */}
                <h3 className="text-caption font-bold text-textSecondary uppercase tracking-wider pl-1">
                  {group}
                </h3>
                
                {/* Group Items */}
                <div className="flex flex-col gap-2">
                  {groupTxList.map((tx) => {
                    const isPending = tx.status === 'pending_review';
                    return (
                      <div
                        key={tx.id}
                        onClick={() => handleTransactionTap(tx)}
                        className={`bg-white p-3.5 rounded-card border border-borderColor shadow-card flex items-center justify-between transition-all ${
                          isPending
                            ? 'border-amber-200 hover:bg-amber-50/20 cursor-pointer active:scale-[0.99]'
                            : 'active:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          {/* Circle Icon */}
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                            {getIcon(tx.category, tx.merchant)}
                          </div>
                          
                          {/* Info */}
                          <div className="flex flex-col truncate">
                            <span className="text-body font-bold text-textPrimary truncate">{tx.merchant}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-caption text-textSecondary">{tx.account}</span>
                              <span className="text-caption text-slate-300">•</span>
                              <span className="text-caption text-textSecondary">{tx.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Amount & Pending */}
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
            );
          })
        )}
      </div>
    </div>
  );
}
