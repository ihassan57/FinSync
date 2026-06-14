import React, { useContext, useState } from 'react';
import { FinSyncContext } from '../context/FinSyncContext';
import { ChevronLeft, ChevronRight, Plus, X, Landmark, TrendingUp, AlertTriangle } from 'lucide-react';

const availableCategories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Health', 'Shopping', 'Fuel', 'Other'];

export default function BudgetScreen() {
  const { budgets, addNewBudget } = useContext(FinSyncContext);
  const [selectedMonth, setSelectedMonth] = useState('June 2025');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal form states
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('Monthly');

  // Navigate months
  const months = ['April 2025', 'May 2025', 'June 2025', 'July 2025', 'August 2025'];
  const handlePrevMonth = () => {
    const idx = months.indexOf(selectedMonth);
    if (idx > 0) setSelectedMonth(months[idx - 1]);
  };
  const handleNextMonth = () => {
    const idx = months.indexOf(selectedMonth);
    if (idx < months.length - 1) setSelectedMonth(months[idx + 1]);
  };

  // Computations
  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    
    addNewBudget({
      category,
      budget: Number(amount),
      period
    });

    // Reset Form & Close Modal
    setAmount('');
    setCategory('Food');
    setPeriod('Monthly');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-appBg overflow-y-auto no-scrollbar pb-24 relative select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-borderColor sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-title text-textPrimary">Budgets</h1>
      </div>

      {/* Month Selector */}
      <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-borderColor shadow-sm">
        <button
          onClick={handlePrevMonth}
          className="p-1 text-textSecondary hover:bg-slate-100 rounded-full transition-all disabled:opacity-30"
          disabled={selectedMonth === months[0]}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-label font-bold text-textPrimary">{selectedMonth}</span>
        <button
          onClick={handleNextMonth}
          className="p-1 text-textSecondary hover:bg-slate-100 rounded-full transition-all disabled:opacity-30"
          disabled={selectedMonth === months[months.length - 1]}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* Summary Card */}
        <div className="bg-white p-4 rounded-card border border-borderColor shadow-card flex flex-col">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <span className="text-caption text-textSecondary font-semibold uppercase tracking-wider">Total Budget</span>
            <span className="text-body font-black text-primary">Rs {totalBudget.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-3">
            <div className="flex flex-col border-r border-slate-100 pr-2">
              <span className="text-caption text-textSecondary font-medium">Spent</span>
              <span className="text-label font-bold text-expense">Rs {totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex flex-col pl-2">
              <span className="text-caption text-textSecondary font-medium">Remaining</span>
              <span className={`text-label font-bold ${totalRemaining >= 0 ? 'text-income' : 'text-expense'}`}>
                {totalRemaining < 0 ? '-' : ''}Rs {Math.abs(totalRemaining).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Budget Cards list */}
        <div className="flex flex-col gap-3">
          {budgets.map((b) => {
            const pct = (b.spent / b.budget) * 100;
            const exceededAmount = b.spent - b.budget;
            const isExceeded = exceededAmount > 0;

            // Bar colors
            let barColorClass = 'bg-income';
            if (b.color === 'amber') barColorClass = 'bg-warning';
            if (b.color === 'red') barColorClass = 'bg-expense';

            return (
              <div
                key={b.category}
                className="bg-white p-4 rounded-card border border-borderColor shadow-card flex flex-col gap-2.5"
              >
                {/* Header detail */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl bg-slate-50 w-9 h-9 rounded-full flex items-center justify-center border border-slate-100">
                      {b.icon}
                    </span>
                    <span className="text-body font-bold text-textPrimary">{b.category}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-caption text-textSecondary font-semibold">
                      Rs {b.spent.toLocaleString()} / Rs {b.budget.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    style={{ width: `${Math.min(pct, 100)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${barColorClass}`}
                  ></div>
                </div>

                {/* Footer details */}
                <div className="flex justify-between items-center">
                  <span className="text-caption text-textSecondary font-medium">
                    {pct.toFixed(0)}% used
                  </span>
                  {isExceeded ? (
                    <span className="text-caption text-expense font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Exceeded by Rs {exceededAmount.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-caption text-textSecondary font-medium">
                      Rs {(b.budget - b.spent).toLocaleString()} left
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all z-20 cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Budget Modal Overlay */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-card w-full max-w-[340px] p-5 shadow-2xl border border-borderColor z-10 flex flex-col gap-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-heading text-textPrimary">Add Budget</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-textSecondary hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Category Dropdown */}
              <div>
                <label className="text-label text-textPrimary block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-label text-textPrimary block mb-1">Budget Amount (Rs)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full px-3 py-2 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>

              {/* Period Selector */}
              <div>
                <label className="text-label text-textPrimary block mb-1">Period</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Monthly', 'Weekly'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      className={`py-2 rounded-xl border text-caption font-semibold transition-all ${
                        period === p
                          ? 'bg-blue-50 border-primary text-primary'
                          : 'bg-slate-50 border-borderColor text-textSecondary hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-white border border-borderColor text-textPrimary text-caption font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-white text-caption font-bold rounded-xl hover:bg-primary-dark shadow-md shadow-blue-200"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
