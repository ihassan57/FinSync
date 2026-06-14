import React, { useContext } from 'react';
import { FinSyncContext } from '../context/FinSyncContext';
import { AlertCircle, Info, Users, CheckCheck, ChevronLeft } from 'lucide-react';

export default function NotificationsScreen() {
  const {
    notifications,
    transactions,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedPendingTransaction,
    setIsCategorySheetOpen,
    navigateTo
  } = useContext(FinSyncContext);

  const actionRequired = notifications.filter((n) => n.type === 'action');
  const infoNotifs = notifications.filter((n) => n.type === 'info');
  const splitNotifs = notifications.filter((n) => n.type === 'split');

  const handleNotificationTap = (notif) => {
    markNotificationRead(notif.id);

    // If it has a transactionId, open the Category Confirmation Bottom Sheet
    if (notif.transactionId) {
      const tx = transactions.find((t) => t.id === notif.transactionId);
      if (tx && tx.status === 'pending_review') {
        setSelectedPendingTransaction(tx);
        setIsCategorySheetOpen(true);
      }
    }
  };

  const renderNotificationCard = (n) => {
    const isUnread = !n.read;
    let icon = <Info className="w-4.5 h-4.5 text-blue-500" />;
    let borderClass = 'border-l-4 border-l-blue-500';
    let bgClass = 'bg-blue-50/10';

    if (n.type === 'action') {
      icon = <AlertCircle className="w-4.5 h-4.5 text-warning" />;
      borderClass = 'border-l-4 border-l-warning';
      bgClass = 'bg-amber-50/10';
    } else if (n.type === 'split') {
      icon = <Users className="w-4.5 h-4.5 text-income" />;
      borderClass = 'border-l-4 border-l-income';
      bgClass = 'bg-emerald-50/10';
    }

    return (
      <div
        key={n.id}
        onClick={() => handleNotificationTap(n)}
        className={`bg-white p-3.5 rounded-xl border border-borderColor shadow-card flex items-start gap-3 transition-all cursor-pointer ${borderClass} ${
          isUnread ? 'bg-slate-50 border-slate-300 font-bold scale-[1.01]' : 'opacity-80'
        }`}
      >
        <div className={`p-1.5 rounded-lg ${bgClass} mt-0.5`}>
          {icon}
        </div>
        <div className="flex flex-col gap-0.5 flex-grow">
          <p className={`text-body text-textPrimary leading-normal ${isUnread ? 'font-bold' : 'font-normal'}`}>
            {n.title}
          </p>
          <span className="text-caption text-textSecondary">{n.time}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-appBg overflow-y-auto no-scrollbar pb-24 select-none">
      {/* Top Header */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-borderColor sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('dashboard', 'backward')}
            className="p-1 hover:bg-slate-100 rounded-full transition-all text-textSecondary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-title text-textPrimary">Notifications</h1>
        </div>
        
        <button
          onClick={markAllNotificationsRead}
          className="text-caption text-primary font-bold hover:underline flex items-center gap-1 hover:bg-blue-50 py-1.5 px-2 rounded-lg transition-all"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-5">
        {/* Section 1: Action Required */}
        {actionRequired.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-caption font-bold text-textSecondary uppercase tracking-wider pl-1 flex items-center gap-1 text-warning">
              <span className="w-1.5 h-1.5 bg-warning rounded-full"></span>
              Action Required
            </h3>
            <div className="flex flex-col gap-2">
              {actionRequired.map(renderNotificationCard)}
            </div>
          </div>
        )}

        {/* Section 2: Info Alerts */}
        {infoNotifs.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-caption font-bold text-textSecondary uppercase tracking-wider pl-1 flex items-center gap-1 text-blue-500">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Updates & Info
            </h3>
            <div className="flex flex-col gap-2">
              {infoNotifs.map(renderNotificationCard)}
            </div>
          </div>
        )}

        {/* Section 3: Bill Splits */}
        {splitNotifs.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-caption font-bold text-textSecondary uppercase tracking-wider pl-1 flex items-center gap-1 text-income">
              <span className="w-1.5 h-1.5 bg-income rounded-full"></span>
              Bill Splits
            </h3>
            <div className="flex flex-col gap-2">
              {splitNotifs.map(renderNotificationCard)}
            </div>
          </div>
        )}

        {notifications.length === 0 && (
          <div className="bg-white p-8 rounded-card border border-borderColor text-center mt-8">
            <span className="text-2xl">🎉</span>
            <p className="text-body font-bold text-textPrimary mt-2">All Caught Up!</p>
            <p className="text-caption text-textSecondary mt-1">You have no notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
