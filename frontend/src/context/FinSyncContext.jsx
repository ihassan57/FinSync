import React, { createContext, useState, useEffect } from 'react';

export const FinSyncContext = createContext();

const initialTransactions = [
  {
    id: 1,
    merchant: 'FOODPANDA',
    category: 'Food',
    amount: 1200,
    type: 'debit',
    account: 'Meezan Bank',
    date: 'Today 2:30 PM',
    groupDate: 'Today',
    status: 'confirmed'
  },
  {
    id: 2,
    merchant: 'Salary Credit',
    category: 'Income',
    amount: 85000,
    type: 'credit',
    account: 'UBL',
    date: 'Yesterday',
    groupDate: 'Yesterday',
    status: 'confirmed'
  },
  {
    id: 3,
    merchant: 'UBER',
    category: 'Transport',
    amount: 850,
    type: 'debit',
    account: 'JazzCash',
    date: 'Yesterday',
    groupDate: 'Yesterday',
    status: 'confirmed'
  },
  {
    id: 4,
    merchant: 'NETFLIX',
    category: 'Entertainment',
    amount: 1500,
    type: 'debit',
    account: 'JazzCash',
    date: '2 days ago',
    groupDate: 'This Week',
    status: 'pending_review'
  },
  {
    id: 5,
    merchant: 'ARAMCO Fuel',
    category: 'Fuel',
    amount: 4500,
    type: 'debit',
    account: 'Meezan Bank',
    date: '3 days ago',
    groupDate: 'This Week',
    status: 'pending_review'
  },
  {
    id: 6,
    merchant: 'Meezan ATM',
    category: 'Other',
    amount: 5000,
    type: 'debit',
    account: 'Meezan Bank',
    date: 'This Week',
    groupDate: 'This Week',
    status: 'confirmed'
  },
  {
    id: 7,
    merchant: 'JazzCash Transfer',
    category: 'Other',
    amount: 2000,
    type: 'debit',
    account: 'JazzCash',
    date: 'This Week',
    groupDate: 'This Week',
    status: 'confirmed'
  },
  {
    id: 8,
    merchant: 'HBL Transfer',
    category: 'Income',
    amount: 10000,
    type: 'credit',
    account: 'HBL',
    date: 'Earlier',
    groupDate: 'Earlier',
    status: 'confirmed'
  },
  {
    id: 9,
    merchant: 'Grocery Store',
    category: 'Shopping',
    amount: 3200,
    type: 'debit',
    account: 'Meezan Bank',
    date: 'Earlier',
    groupDate: 'Earlier',
    status: 'confirmed'
  },
  {
    id: 10,
    merchant: 'Electricity Bill',
    category: 'Bills',
    amount: 4800,
    type: 'debit',
    account: 'UBL',
    date: 'Earlier',
    groupDate: 'Earlier',
    status: 'confirmed'
  }
];

const initialBudgets = [
  { category: 'Food', icon: '🍔', budget: 12000, spent: 9800, color: 'amber' },
  { category: 'Transport', icon: '🚗', budget: 8000, spent: 3200, color: 'green' },
  { category: 'Bills', icon: '💡', budget: 15000, spent: 4800, color: 'green' },
  { category: 'Entertainment', icon: '🎬', budget: 5000, spent: 6500, color: 'red' },
  { category: 'Fuel', icon: '⛽', budget: 10000, spent: 7150, color: 'amber' }
];

const initialSplits = [
  {
    id: 1,
    title: 'Dinner at Salt',
    total: 4000,
    participants: [
      { name: 'You', share: 1000, settled: true },
      { name: 'Ali Khan', share: 1000, settled: false },
      { name: 'Usman Tariq', share: 1000, settled: false }
    ],
    date: '2 days ago',
    type: 'Equal',
    settled: false
  },
  {
    id: 2,
    title: 'Office Lunch',
    total: 2400,
    participants: [
      { name: 'You', share: 600, settled: true },
      { name: 'Participant 1', share: 600, settled: false },
      { name: 'Participant 2', share: 600, settled: false },
      { name: 'Participant 3', share: 600, settled: false }
    ],
    date: '3 days ago',
    type: 'Equal',
    settled: false
  },
  {
    id: 3,
    title: 'Pizza Night',
    total: 3200,
    participants: [
      { name: 'You', share: 640, settled: true },
      { name: 'Friend 1', share: 640, settled: true },
      { name: 'Friend 2', share: 640, settled: true },
      { name: 'Friend 3', share: 640, settled: true },
      { name: 'Friend 4', share: 640, settled: true }
    ],
    date: '5 days ago',
    type: 'Equal',
    settled: true
  }
];

const initialNotifications = [
  {
    id: 1,
    type: 'action',
    title: 'NETFLIX transaction needs category confirmation',
    time: '2 days ago',
    read: false,
    transactionId: 4
  },
  {
    id: 2,
    type: 'action',
    title: 'ARAMCO Fuel transaction needs category confirmation',
    time: '3 days ago',
    read: false,
    transactionId: 5
  },
  {
    id: 3,
    type: 'action',
    title: 'Entertainment budget exceeded by Rs 1,500',
    time: '1 day ago',
    read: false
  },
  {
    id: 4,
    type: 'info',
    title: 'Salary of Rs 85,000 credited to UBL account',
    time: 'Yesterday',
    read: false
  },
  {
    id: 5,
    type: 'info',
    title: 'Food budget at 82% — Rs 2,200 remaining',
    time: '2 days ago',
    read: false
  },
  {
    id: 6,
    type: 'split',
    title: 'Ali Khan has been reminded about Dinner at Salt split',
    time: 'Just now',
    read: true
  },
  {
    id: 7,
    type: 'split',
    title: 'Office Lunch split created — Rs 600 is your share',
    time: '3 days ago',
    read: false
  }
];

const initialAccounts = [
  { id: 1, name: 'Meezan Bank', balance: 45000, type: 'bank' },
  { id: 2, name: 'UBL', balance: 28500, type: 'bank' },
  { id: 3, name: 'JazzCash', balance: 3200, type: 'wallet' }
];

export const FinSyncProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [navigationDirection, setNavigationDirection] = useState('forward');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [splits, setSplits] = useState(initialSplits);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [toasts, setToasts] = useState([]);
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    biometric: true,
    darkMode: false
  });

  // Category sheet state
  const [selectedPendingTransaction, setSelectedPendingTransaction] = useState(null);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  // Helper function to show toasts
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  };

  // Screen navigation handler with transition direction
  const navigateTo = (screen, direction = 'forward') => {
    setNavigationDirection(direction);
    setCurrentScreen(screen);
  };

  // Confirm category for transaction
  const confirmCategory = (transactionId, newCategory) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === transactionId) {
          // If transaction was pending, it reduces spent in Entertainment and adds/updates category.
          // Let's adjust budget spendings accordingly!
          const oldCategory = t.category;
          const amt = t.amount;
          
          adjustBudgetSpent(oldCategory, -amt);
          adjustBudgetSpent(newCategory, amt);
          
          return { ...t, category: newCategory, status: 'confirmed' };
        }
        return t;
      })
    );

    // If there is an action notification for this, mark it read
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.transactionId === transactionId) {
          return { ...n, read: true };
        }
        return n;
      })
    );

    addToast('Transaction confirmed ✓', 'success');
  };

  // Helper to adjust budget spend values
  const adjustBudgetSpent = (category, amount) => {
    setBudgets((prev) =>
      prev.map((b) => {
        if (b.category.toLowerCase() === category.toLowerCase()) {
          const newSpent = b.spent + amount;
          // Dynamically compute progress bar color
          const pct = (newSpent / b.budget) * 100;
          let color = 'green';
          if (pct >= 100) color = 'red';
          else if (pct >= 80) color = 'amber';
          return { ...b, spent: newSpent, color };
        }
        return b;
      })
    );
  };

  // Add a new budget
  const addNewBudget = (newBudgetObj) => {
    setBudgets((prev) => {
      // Check if category already exists
      const existsIdx = prev.findIndex(
        (b) => b.category.toLowerCase() === newBudgetObj.category.toLowerCase()
      );
      if (existsIdx !== -1) {
        return prev.map((b, idx) =>
          idx === existsIdx
            ? { ...b, budget: newBudgetObj.budget, color: getBudgetBarColor(b.spent, newBudgetObj.budget) }
            : b
        );
      } else {
        const emojiMap = {
          Food: '🍔',
          Transport: '🚗',
          Bills: '💡',
          Entertainment: '🎬',
          Health: '🏥',
          Shopping: '🛍️',
          Fuel: '⛽',
          Income: '💰',
          Other: '📦'
        };
        return [
          ...prev,
          {
            category: newBudgetObj.category,
            icon: emojiMap[newBudgetObj.category] || '📦',
            budget: newBudgetObj.budget,
            spent: 0,
            color: 'green'
          }
        ];
      }
    });
    addToast('Budget saved successfully ✓', 'success');
  };

  const getBudgetBarColor = (spent, budget) => {
    const pct = (spent / budget) * 100;
    if (pct >= 100) return 'red';
    if (pct >= 80) return 'amber';
    return 'green';
  };

  // Send split payment reminder
  const sendSplitReminder = (splitId, participantName) => {
    // Add toast
    addToast(`Reminder sent to ${participantName} ✓`, 'success');
    
    // Add notification
    const newNotif = {
      id: Date.now(),
      type: 'split',
      title: `${participantName} has been reminded about Dinner at Salt split`,
      time: 'Just now',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Add new bill split
  const addNewSplit = (title, total, participantsList, type) => {
    const splitCount = participantsList.length + 1; // plus "You"
    const shareAmount = Math.round(total / splitCount);

    const newSplitObj = {
      id: Date.now(),
      title,
      total,
      participants: [
        { name: 'You', share: shareAmount, settled: true },
        ...participantsList.map((p) => ({ name: p, share: shareAmount, settled: false }))
      ],
      date: 'Just now',
      type,
      settled: false
    };

    setSplits((prev) => [newSplitObj, ...prev]);
    
    // Add notification
    const newNotif = {
      id: Date.now() + 1,
      type: 'split',
      title: `${title} split created — Rs ${shareAmount} is your share`,
      time: 'Just now',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('Bill split created ✓', 'success');
  };

  // Edit account balance
  const updateAccountBalance = (accountId, newBalance) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, balance: Number(newBalance) } : acc))
    );
    addToast('Account updated ✓', 'success');
  };

  // Add new account
  const addNewAccount = (name, balance, type) => {
    const newAcc = {
      id: Date.now(),
      name,
      balance: Number(balance),
      type
    };
    setAccounts((prev) => [...prev, newAcc]);
    addToast('Account added successfully ✓', 'success');
  };

  // Mark specific notification as read
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read ✓', 'success');
  };

  // Add transaction from OCR or Manual scan
  const addOcrTransaction = (tx) => {
    const newTx = {
      id: Date.now(),
      merchant: tx.merchant,
      category: tx.category,
      amount: Number(tx.amount),
      type: 'debit',
      account: tx.account,
      date: tx.date || 'Today',
      groupDate: 'Today',
      status: 'confirmed',
      source: 'OCR'
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Subtract from account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.name.toLowerCase() === tx.account.toLowerCase()) {
          return { ...acc, balance: Math.max(0, acc.balance - Number(tx.amount)) };
        }
        return acc;
      })
    );

    // Adjust budget spent
    adjustBudgetSpent(tx.category, Number(tx.amount));

    // Show toast
    addToast('Receipt saved successfully ✓', 'success');
  };

  // Toggle settings
  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Compute total balance based on active accounts
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Compute stats for current month
  // Income category is 'Income'
  // Expense is everything else that is confirmed and debit type
  const totalIncome = transactions
    .filter((t) => t.type === 'credit' && t.status === 'confirmed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'debit' && t.status === 'confirmed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Unread notification count
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <FinSyncContext.Provider
      value={{
        currentScreen,
        navigationDirection,
        navigateTo,
        transactions,
        budgets,
        splits,
        notifications,
        accounts,
        toasts,
        settings,
        selectedPendingTransaction,
        setSelectedPendingTransaction,
        isCategorySheetOpen,
        setIsCategorySheetOpen,
        totalBalance,
        totalIncome,
        totalExpenses,
        unreadNotificationsCount,
        confirmCategory,
        addNewBudget,
        sendSplitReminder,
        addNewSplit,
        updateAccountBalance,
        addNewAccount,
        markNotificationRead,
        markAllNotificationsRead,
        toggleSetting,
        addToast,
        addOcrTransaction
      }}
    >
      {children}
    </FinSyncContext.Provider>
  );
};
