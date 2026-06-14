import React, { useContext, useState } from 'react';
import { FinSyncContext } from '../context/FinSyncContext';
import { Bell, Fingerprint, Moon, Download, HelpCircle, LogOut, Landmark, Wallet, Edit2, Plus, X } from 'lucide-react';

export default function ProfileScreen() {
  const {
    navigateTo,
    accounts,
    settings,
    toggleSetting,
    updateAccountBalance,
    addNewAccount,
    addToast
  } = useContext(FinSyncContext);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);
  const [editBalanceVal, setEditBalanceVal] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState('bank');
  const [newAccBalance, setNewAccBalance] = useState('');

  // Handle Edit Account Balance Click
  const handleEditClick = (acc) => {
    setEditingAcc(acc);
    setEditBalanceVal(acc.balance.toString());
    setIsEditModalOpen(true);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editBalanceVal || isNaN(Number(editBalanceVal))) return;
    updateAccountBalance(editingAcc.id, Number(editBalanceVal));
    setIsEditModalOpen(false);
  };

  // Handle Add Account
  const handleAddAccountSave = (e) => {
    e.preventDefault();
    if (!newAccName || !newAccBalance || isNaN(Number(newAccBalance))) return;
    addNewAccount(newAccName, Number(newAccBalance), newAccType);
    
    // Reset Form
    setNewAccName('');
    setNewAccBalance('');
    setNewAccType('bank');
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-appBg overflow-y-auto no-scrollbar pb-24 relative select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-borderColor sticky top-0 z-10">
        <h1 className="text-title text-textPrimary">Profile</h1>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-5">
        {/* User Card */}
        <div className="bg-white p-5 rounded-card border border-borderColor shadow-card flex flex-col items-center">
          <div className="w-18 h-18 rounded-full bg-blue-50 text-primary border border-blue-200 flex items-center justify-center text-3xl font-extrabold shadow-sm">
            MH
          </div>
          <h2 className="text-heading text-textPrimary font-bold mt-3">Muhammad Hassan</h2>
          <span className="text-caption text-textSecondary">hassan@finsync.pk</span>
        </div>

        {/* Accounts Section */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center pl-1">
            <h3 className="text-label font-bold text-textSecondary uppercase tracking-wider">
              Accounts & Wallets
            </h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-caption text-primary font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Account
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-white p-3.5 rounded-card border border-borderColor shadow-card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-primary">
                    {acc.type === 'bank' ? <Landmark className="w-5 h-5 text-primary" /> : <Wallet className="w-5 h-5 text-secondary" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-body font-bold text-textPrimary">{acc.name}</span>
                    <span className="text-caption text-textSecondary font-semibold">
                      Rs {acc.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick(acc)}
                  className="p-2 text-textSecondary hover:text-primary hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Checklist */}
        <div className="flex flex-col gap-3">
          <h3 className="text-label font-bold text-textSecondary uppercase tracking-wider pl-1">
            Preferences & Settings
          </h3>
          
          <div className="bg-white rounded-card border border-borderColor shadow-card divide-y divide-slate-100">
            {/* Toggle 1: Notifications */}
            <div className="flex justify-between items-center p-3.5">
              <div className="flex items-center gap-3 text-textPrimary">
                <Bell className="w-5 h-5 text-textSecondary" />
                <span className="text-body font-semibold">Notifications</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  toggleSetting('notifications');
                  addToast(`Notifications turned ${!settings.notifications ? 'ON' : 'OFF'}`, 'info');
                }}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  settings.notifications ? 'bg-primary' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                    settings.notifications ? 'right-0.5' : 'left-0.5'
                  }`}
                ></div>
              </button>
            </div>

            {/* Toggle 2: Biometric */}
            <div className="flex justify-between items-center p-3.5">
              <div className="flex items-center gap-3 text-textPrimary">
                <Fingerprint className="w-5 h-5 text-textSecondary" />
                <span className="text-body font-semibold">Biometric Login</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  toggleSetting('biometric');
                  addToast(`Biometric Login turned ${!settings.biometric ? 'ON' : 'OFF'}`, 'info');
                }}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  settings.biometric ? 'bg-primary' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                    settings.biometric ? 'right-0.5' : 'left-0.5'
                  }`}
                ></div>
              </button>
            </div>

            {/* Toggle 3: Dark Mode */}
            <div className="flex justify-between items-center p-3.5">
              <div className="flex items-center gap-3 text-textPrimary">
                <Moon className="w-5 h-5 text-textSecondary" />
                <span className="text-body font-semibold">Dark Mode</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  toggleSetting('darkMode');
                  addToast(`Dark Mode simulation toggled`, 'info');
                }}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  settings.darkMode ? 'bg-primary' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                    settings.darkMode ? 'right-0.5' : 'left-0.5'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Action Items List */}
        <div className="bg-white rounded-card border border-borderColor shadow-card divide-y divide-slate-100 mb-6">
          {/* Export */}
          <button
            onClick={() => addToast('Data exported successfully ✓', 'success')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-all text-left"
          >
            <div className="flex items-center gap-3 text-textPrimary">
              <Download className="w-5 h-5 text-textSecondary" />
              <span className="text-body font-semibold">Export Financial Data</span>
            </div>
            <span className="text-caption text-textSecondary font-bold">CSV / PDF</span>
          </button>

          {/* Help */}
          <button
            onClick={() => addToast('Support ticket created ✓. We will contact you soon.', 'success')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-all text-left"
          >
            <div className="flex items-center gap-3 text-textPrimary">
              <HelpCircle className="w-5 h-5 text-textSecondary" />
              <span className="text-body font-semibold">Help & Support</span>
            </div>
            <span className="text-caption text-textSecondary font-semibold">FAQs</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              addToast('Logged out ✓', 'info');
              navigateTo('login', 'backward');
            }}
            className="w-full flex items-center justify-between p-3.5 hover:bg-red-50 text-left transition-all text-red-600 rounded-b-card"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="text-body font-semibold">Logout</span>
            </div>
            <span className="text-caption text-red-400 font-semibold">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Edit Account Modal */}
      {isEditModalOpen && editingAcc && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-card w-full max-w-[320px] p-5 shadow-2xl border border-borderColor z-10 flex flex-col gap-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-heading text-textPrimary">Edit Balance</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="flex flex-col gap-4">
              <div>
                <span className="text-caption text-textSecondary block mb-1">Account: {editingAcc.name}</span>
                <label className="text-label text-textPrimary block mb-1">New Balance (Rs)</label>
                <input
                  type="number"
                  value={editBalanceVal}
                  onChange={(e) => setEditBalanceVal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2 bg-white border border-borderColor text-caption font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white text-caption font-bold rounded-xl shadow-md shadow-blue-200"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-card w-full max-w-[320px] p-5 shadow-2xl border border-borderColor z-10 flex flex-col gap-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-heading text-textPrimary">Add Account</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAccountSave} className="flex flex-col gap-3.5">
              {/* Account Name */}
              <div>
                <label className="text-label text-textPrimary block mb-1">Account Name</label>
                <input
                  type="text"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="e.g. HBL, Standard Chartered"
                  className="w-full px-3 py-2 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="text-label text-textPrimary block mb-1">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['bank', 'wallet'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAccType(t)}
                      className={`py-1.5 rounded-xl border text-caption font-semibold transition-all uppercase tracking-wide ${
                        newAccType === t
                          ? 'bg-blue-50 border-primary text-primary'
                          : 'bg-slate-50 border-borderColor text-textSecondary hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Balance */}
              <div>
                <label className="text-label text-textPrimary block mb-1">Initial Balance (Rs)</label>
                <input
                  type="number"
                  value={newAccBalance}
                  onChange={(e) => setNewAccBalance(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full px-3 py-2 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>

              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 bg-white border border-borderColor text-caption font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white text-caption font-bold rounded-xl shadow-md shadow-blue-200"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
