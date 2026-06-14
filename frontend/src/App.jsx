import React, { useContext, useState, useEffect } from 'react';
import { FinSyncProvider, FinSyncContext } from './context/FinSyncContext';

// Import Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import BudgetScreen from './screens/BudgetScreen';
import BillSplitScreen from './screens/BillSplitScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import CategoryConfirmationSheet from './screens/CategoryConfirmationSheet';
import OcrScannerScreen from './screens/OcrScannerScreen';

// Import Icons
import { LayoutGrid, ArrowLeftRight, TrendingUp, Share2, CircleUser, Wifi, Battery, Signal, CheckCircle2, AlertCircle, Info } from 'lucide-react';

function AppContent() {
  const {
    currentScreen,
    navigationDirection,
    navigateTo,
    toasts,
    isCategorySheetOpen
  } = useContext(FinSyncContext);

  const [deviceTime, setDeviceTime] = useState('09:41');

  // Live time for the status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      setDeviceTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Screen router logic
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'transactions':
        return <TransactionsScreen />;
      case 'budgets':
        return <BudgetScreen />;
      case 'split':
        return <BillSplitScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'ocr':
        return <OcrScannerScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const showNavbar = currentScreen !== 'splash' && currentScreen !== 'login';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 antialiased text-slate-900 select-none">
      {/* Phone Frame Device Container (390px width, centered) */}
      <div className="relative w-[390px] h-[844px] bg-slate-900 rounded-[50px] shadow-[0_0_0_12px_#1e293b,0_20px_50px_rgba(0,0,0,0.8)] border-[6px] border-slate-800 flex flex-col overflow-hidden">
        
        {/* Physical Camera Notch / Dynamic Island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6.5 bg-black rounded-full z-45 flex items-center justify-center border border-slate-900 shadow-inner">
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full ml-auto mr-3 border border-slate-800"></div>
        </div>

        {/* Status Bar */}
        <div className="bg-white flex justify-between items-center px-6 pt-3.5 pb-2 text-[11px] font-bold text-slate-900 z-40 select-none flex-shrink-0">
          <span>{deviceTime}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 fill-current" />
            <span className="text-[10px]">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Dynamic Toast Notifications (Slide in from top) */}
        <div className="absolute top-12 left-0 right-0 z-50 px-4 flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`py-3 px-4 rounded-xl shadow-lg flex items-center gap-2.5 text-caption font-semibold pointer-events-auto border animate-scale-in transition-all ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : toast.type === 'info'
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-4.5 h-4.5 text-blue-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
          ))}
        </div>

        {/* Active Screen Area with Keyframe Transitions */}
        <div className="flex-grow relative overflow-hidden bg-appBg flex flex-col">
          <div
            key={currentScreen}
            className={`flex-grow h-full w-full flex flex-col overflow-hidden ${
              currentScreen === 'splash' || currentScreen === 'login'
                ? ''
                : navigationDirection === 'forward'
                ? 'animate-slide-in-right'
                : 'animate-slide-in-left'
            }`}
          >
            {renderScreen()}
          </div>
          
          {/* Bottom Sheet Category Confirm Component */}
          <CategoryConfirmationSheet />
        </div>

        {/* Persistent Bottom Nav Bar */}
        {showNavbar && (
          <div className="bg-white border-t border-borderColor px-4 pt-2 pb-6 flex justify-between items-center z-35 flex-shrink-0 shadow-[0_-1px_10px_rgba(0,0,0,0.03)] select-none">
            {/* Dashboard Tab */}
            <button
              onClick={() => navigateTo('dashboard', currentScreen === 'profile' || currentScreen === 'notifications' || currentScreen === 'split' || currentScreen === 'budgets' || currentScreen === 'transactions' ? 'backward' : 'forward')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
                currentScreen === 'dashboard' ? 'text-primary scale-105 font-bold' : 'text-slate-400 font-medium'
              }`}
            >
              <LayoutGrid className="w-5.5 h-5.5" />
              <span className="text-[10px]">Dashboard</span>
            </button>

            {/* Transactions Tab */}
            <button
              onClick={() => navigateTo('transactions', currentScreen === 'dashboard' ? 'forward' : 'backward')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
                currentScreen === 'transactions' ? 'text-primary scale-105 font-bold' : 'text-slate-400 font-medium'
              }`}
            >
              <ArrowLeftRight className="w-5.5 h-5.5" />
              <span className="text-[10px]">Transactions</span>
            </button>

            {/* Budgets Tab */}
            <button
              onClick={() => navigateTo('budgets', currentScreen === 'dashboard' || currentScreen === 'transactions' ? 'forward' : 'backward')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
                currentScreen === 'budgets' ? 'text-primary scale-105 font-bold' : 'text-slate-400 font-medium'
              }`}
            >
              <TrendingUp className="w-5.5 h-5.5" />
              <span className="text-[10px]">Budgets</span>
            </button>

            {/* Split Tab */}
            <button
              onClick={() => navigateTo('split', currentScreen === 'profile' ? 'backward' : 'forward')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
                currentScreen === 'split' ? 'text-primary scale-105 font-bold' : 'text-slate-400 font-medium'
              }`}
            >
              <Share2 className="w-5.5 h-5.5" />
              <span className="text-[10px]">Split</span>
            </button>

            {/* Profile Tab */}
            <button
              onClick={() => navigateTo('profile', 'forward')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
                currentScreen === 'profile' ? 'text-primary scale-105 font-bold' : 'text-slate-400 font-medium'
              }`}
            >
              <CircleUser className="w-5.5 h-5.5" />
              <span className="text-[10px]">Profile</span>
            </button>
          </div>
        )}

        {/* Physical Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1 bg-black rounded-full z-45"></div>
      </div>
      
      {/* Bottom Desktop caption hint */}
      <span className="text-slate-500 text-[11px] mt-4 font-semibold tracking-wider uppercase select-none">
        FinSync iOS Mobile Viewport (390x844)
      </span>
    </div>
  );
}

export default function App() {
  return (
    <FinSyncProvider>
      <AppContent />
    </FinSyncProvider>
  );
}
