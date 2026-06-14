import React, { useContext, useState, useEffect } from 'react';
import { FinSyncContext } from '../context/FinSyncContext';
import { MessageSquare, Tv, Fuel, Utensils, Car, Lightbulb, HeartPulse, ShoppingBag, DollarSign, Box, X, Check } from 'lucide-react';

const categories = [
  { name: 'Food', icon: '🍔', lucideIcon: <Utensils className="w-5 h-5" /> },
  { name: 'Transport', icon: '🚗', lucideIcon: <Car className="w-5 h-5" /> },
  { name: 'Bills', icon: '💡', lucideIcon: <Lightbulb className="w-5 h-5" /> },
  { name: 'Entertainment', icon: '🎬', lucideIcon: <Tv className="w-5 h-5" /> },
  { name: 'Health', icon: '🏥', lucideIcon: <HeartPulse className="w-5 h-5" /> },
  { name: 'Shopping', icon: '🛍️', lucideIcon: <ShoppingBag className="w-5 h-5" /> },
  { name: 'Fuel', icon: '⛽', lucideIcon: <Fuel className="w-5 h-5" /> },
  { name: 'Income', icon: '💰', lucideIcon: <DollarSign className="w-5 h-5" /> },
  { name: 'Other', icon: '📦', lucideIcon: <Box className="w-5 h-5" /> },
];

export default function CategoryConfirmationSheet() {
  const {
    isCategorySheetOpen,
    setIsCategorySheetOpen,
    selectedPendingTransaction,
    confirmCategory
  } = useContext(FinSyncContext);

  const [activeCategory, setActiveCategory] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Sync state when transaction changes
  useEffect(() => {
    if (selectedPendingTransaction) {
      setActiveCategory(selectedPendingTransaction.category || 'Other');
      setShowPicker(false);
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [selectedPendingTransaction]);

  if (!isCategorySheetOpen || !selectedPendingTransaction) return null;

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setIsCategorySheetOpen(false);
    }, 200); // Allow animation to close
  };

  const handleConfirm = () => {
    confirmCategory(selectedPendingTransaction.id, activeCategory);
    handleClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end select-none">
      {/* Semi-transparent Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      ></div>

      {/* Bottom Sheet Slide Up Panel */}
      <div
        className={`relative bg-white rounded-t-3xl shadow-2xl border-t border-borderColor max-h-[92%] flex flex-col transition-transform duration-300 overflow-hidden ${
          animate ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle Top Bar */}
        <div className="flex flex-col items-center py-3 cursor-pointer" onClick={handleClose}>
          <div className="w-10 h-1 bg-slate-200 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-6 pb-2">
          <h2 className="text-heading text-textPrimary">Confirm Category</h2>
          <button
            onClick={handleClose}
            className="p-1 text-textSecondary hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Scroll Container */}
        <div className="px-6 pb-8 overflow-y-auto no-scrollbar flex flex-col gap-5">
          {/* Transaction Summary Card */}
          <div className="bg-slate-50 border border-borderColor p-4 rounded-xl flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-caption text-textSecondary uppercase tracking-wider font-semibold">Merchant</span>
              <span className="text-body font-bold text-textPrimary text-base">{selectedPendingTransaction.merchant}</span>
              <div className="flex items-center gap-1.5 mt-2 bg-blue-50 text-primary-dark px-2.5 py-1 rounded-lg w-fit">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">Parsed from SMS</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-caption text-textSecondary font-medium">{selectedPendingTransaction.date}</span>
              <span className="text-lg font-black text-expense">
                Rs {selectedPendingTransaction.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* AI Suggestion Section */}
          <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl">
            <span className="text-caption text-purple-700 font-bold uppercase tracking-wider">AI Suggested Category</span>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                {categories.find(c => c.name.toLowerCase() === selectedPendingTransaction.category.toLowerCase())?.lucideIcon || <Box className="w-5 h-5" />}
              </div>
              <div className="flex flex-col">
                <span className="text-body font-bold text-purple-900">{selectedPendingTransaction.category}</span>
                <span className="text-[11px] text-purple-600 font-medium">Based on merchant name</span>
              </div>
            </div>
          </div>

          {/* Category Selector Selector */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-label text-textPrimary">Selected Category</span>
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="text-caption text-primary font-semibold hover:underline"
              >
                {showPicker ? 'Close Picker' : 'Change Category'}
              </button>
            </div>
            
            <div className="py-2.5 px-4 border border-borderColor rounded-xl flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {categories.find(c => c.name === activeCategory)?.icon || '📦'}
                </span>
                <span className="text-body font-bold text-textPrimary">{activeCategory}</span>
              </div>
              <span className="text-caption text-textSecondary italic">Confirm selection below</span>
            </div>
          </div>

          {/* Category Picker Grid */}
          {(showPicker || true) && (
            <div className="mt-1 transition-all duration-300">
              <span className="text-caption text-textSecondary uppercase tracking-wider font-semibold block mb-2">
                Select Alternative Category:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const isSelected = activeCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setActiveCategory(cat.name);
                        setShowPicker(false);
                      }}
                      type="button"
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-primary text-primary font-bold shadow-sm shadow-blue-100 scale-[1.02]'
                          : 'bg-white border-borderColor hover:bg-slate-50 text-textPrimary hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-[11px]">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={handleConfirm}
              className="w-full py-3 bg-primary text-white text-label font-semibold rounded-xl hover:bg-primary-dark active:scale-[0.98] transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-1.5"
            >
              <Check className="w-5 h-5" />
              Confirm Category
            </button>
            
            <button
              onClick={() => {
                addToast('Manual entry details opened (simulation)', 'info');
                handleClose();
              }}
              className="w-full py-3 bg-white border border-borderColor text-textPrimary text-label font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all"
            >
              Enter Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
