import React, { useContext, useState } from 'react';
import { FinSyncContext } from '../context/FinSyncContext';
import { Users, AlertCircle, BellRing, ChevronDown, ChevronUp, Plus, X, Calculator, ArrowRight } from 'lucide-react';

export default function BillSplitScreen() {
  const {
    splits,
    transactions,
    sendSplitReminder,
    addNewSplit,
    addToast
  } = useContext(FinSyncContext);

  const [isSettledExpanded, setIsSettledExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Split Modal States
  const [selectedTxId, setSelectedTxId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [participantInput, setParticipantInput] = useState('');
  const [participants, setParticipants] = useState([]);
  const [splitType, setSplitType] = useState('Equal');
  const [sharesCalculated, setSharesCalculated] = useState(null);

  const activeSplits = splits.filter((s) => !s.settled);
  const settledSplits = splits.filter((s) => s.settled);

  // Filter out debit transactions for the dropdown selector
  const debitTransactions = transactions.filter((t) => t.type === 'debit');

  const handleTxChange = (txId) => {
    setSelectedTxId(txId);
    const selectedTx = transactions.find((t) => t.id === Number(txId));
    if (selectedTx) {
      setCustomTitle(selectedTx.merchant);
      setCustomAmount(selectedTx.amount.toString());
    } else {
      setCustomTitle('');
      setCustomAmount('');
    }
    setSharesCalculated(null);
  };

  const addParticipant = () => {
    const trimmed = participantInput.trim();
    if (!trimmed) return;
    if (participants.includes(trimmed)) {
      addToast('Participant already added!', 'info');
      return;
    }
    setParticipants([...participants, trimmed]);
    setParticipantInput('');
    setSharesCalculated(null);
  };

  const removeParticipant = (name) => {
    setParticipants(participants.filter((p) => p !== name));
    setSharesCalculated(null);
  };

  const handleCalculate = () => {
    const totalAmt = Number(customAmount);
    if (!totalAmt || totalAmt <= 0) {
      addToast('Please enter a valid amount', 'info');
      return;
    }
    if (participants.length === 0) {
      addToast('Please add at least one participant', 'info');
      return;
    }

    const totalPeople = participants.length + 1; // plus "You"
    const share = Math.round(totalAmt / totalPeople);
    
    setSharesCalculated({
      share,
      totalPeople
    });
  };

  const handleConfirmSplit = (e) => {
    e.preventDefault();
    if (!customTitle) {
      addToast('Please specify a title or transaction', 'info');
      return;
    }
    const totalAmt = Number(customAmount);
    if (!totalAmt || totalAmt <= 0) return;
    if (participants.length === 0) return;

    // Run calculation if not done
    let finalShare = sharesCalculated?.share;
    if (!finalShare) {
      finalShare = Math.round(totalAmt / (participants.length + 1));
    }

    addNewSplit(customTitle, totalAmt, participants, splitType);

    // Reset States & Close
    setSelectedTxId('');
    setCustomTitle('');
    setCustomAmount('');
    setParticipants([]);
    setSharesCalculated(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-appBg overflow-y-auto no-scrollbar pb-24 relative select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-borderColor sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-title text-textPrimary">Bill Split</h1>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* Active Splits Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-label font-bold text-textSecondary uppercase tracking-wider pl-1">
            Active Splits ({activeSplits.length})
          </h2>

          {activeSplits.length === 0 ? (
            <div className="bg-white p-6 rounded-card border border-borderColor text-center text-textSecondary text-body">
              No active splits. Tap the button below to split a bill!
            </div>
          ) : (
            activeSplits.map((split) => {
              const unsettledCount = split.participants.filter(p => !p.settled).length;
              return (
                <div
                  key={split.id}
                  className="bg-white p-4 rounded-card border border-borderColor shadow-card flex flex-col gap-3"
                >
                  {/* Split Meta */}
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-body font-bold text-textPrimary">{split.title}</span>
                      <span className="text-caption text-textSecondary">
                        Rs {split.total.toLocaleString()} total • {split.participants.length} participants
                      </span>
                    </div>
                    <span className="text-caption text-textSecondary font-medium">{split.date}</span>
                  </div>

                  {/* Participants Share Breakdown */}
                  <div className="flex flex-col gap-2">
                    {split.participants.map((p, idx) => {
                      const isOwner = p.name === 'You';
                      return (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${p.settled ? 'bg-income' : 'bg-warning'}`}></div>
                            <span className="text-body font-semibold text-textPrimary">
                              {p.name} {isOwner && <span className="text-caption text-textSecondary font-normal">(Owner)</span>}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-caption text-textPrimary font-bold">
                              Rs {p.share.toLocaleString()}
                            </span>
                            
                            {p.settled ? (
                              <span className="text-[10px] bg-emerald-50 text-income font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md border border-emerald-100">
                                Paid
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-amber-50 text-warning font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md border border-amber-100">
                                  Unsettled
                                </span>
                                <button
                                  onClick={() => sendSplitReminder(split.id, p.name)}
                                  className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-1 active:scale-95"
                                >
                                  <BellRing className="w-3 h-3" />
                                  Remind
                                </button>
                              </div>
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

        {/* Settled Splits Section */}
        <div className="mt-2">
          <button
            onClick={() => setIsSettledExpanded(!isSettledExpanded)}
            className="w-full flex justify-between items-center py-2 px-1 text-label font-bold text-textSecondary hover:text-textPrimary transition-all uppercase tracking-wider"
          >
            <span>Settled Splits ({settledSplits.length})</span>
            {isSettledExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isSettledExpanded && (
            <div className="flex flex-col gap-2.5 mt-2 transition-all">
              {settledSplits.map((split) => (
                <div
                  key={split.id}
                  className="bg-slate-50 p-3.5 rounded-card border border-borderColor flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-income rounded-full border border-emerald-100">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-body font-bold text-textPrimary opacity-75">{split.title}</span>
                      <span className="text-caption text-textSecondary">
                        Rs {split.total.toLocaleString()} • Fully settled
                      </span>
                    </div>
                  </div>
                  <span className="text-caption text-textSecondary font-medium">{split.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Persistent bottom trigger button */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-[390px] max-w-full px-4 py-3 bg-white border-t border-borderColor z-15">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3 bg-primary text-white text-label font-semibold rounded-xl hover:bg-primary-dark active:scale-[0.98] transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          New Split
        </button>
      </div>

      {/* New Split Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white rounded-card w-full max-w-[340px] p-5 shadow-2xl border border-borderColor z-10 flex flex-col gap-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-heading text-textPrimary">New Bill Split</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-textSecondary hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSplit} className="flex flex-col gap-3.5">
              {/* Select Transaction Dropdown */}
              <div>
                <label className="text-label text-textPrimary block mb-1">Select Transaction</label>
                <select
                  value={selectedTxId}
                  onChange={(e) => handleTxChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white"
                >
                  <option value="">-- Or enter manually below --</option>
                  {debitTransactions.map((tx) => (
                    <option key={tx.id} value={tx.id}>
                      {tx.merchant} - Rs {tx.amount.toLocaleString()} ({tx.date})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div>
                <label className="text-label text-textPrimary block mb-1">Split Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => {
                    setCustomTitle(e.target.value);
                    setSharesCalculated(null);
                  }}
                  placeholder="e.g. Dinner at Salt"
                  className="w-full px-3 py-2 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-label text-textPrimary block mb-1">Total Amount (Rs)</label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSharesCalculated(null);
                  }}
                  placeholder="e.g. 4000"
                  className="w-full px-3 py-2 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>

              {/* Participant List Manager */}
              <div>
                <label className="text-label text-textPrimary block mb-1">Add Participants</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={participantInput}
                    onChange={(e) => setParticipantInput(e.target.value)}
                    placeholder="Enter name..."
                    className="flex-grow px-3 py-1.5 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-borderColor text-textPrimary text-caption font-bold rounded-xl active:scale-95"
                  >
                    Add
                  </button>
                </div>

                {/* Chips Grid */}
                {participants.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100 max-h-[75px] overflow-y-auto">
                    {participants.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-1 bg-white border border-borderColor text-[10px] font-bold text-textPrimary rounded-lg flex items-center gap-1 shadow-sm"
                      >
                        {p}
                        <button
                          type="button"
                          onClick={() => removeParticipant(p)}
                          className="text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Split Type Toggle */}
              <div>
                <label className="text-label text-textPrimary block mb-1">Split Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Equal', 'Unequal'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSplitType(type)}
                      className={`py-1.5 rounded-xl border text-caption font-semibold transition-all ${
                        splitType === type
                          ? 'bg-blue-50 border-primary text-primary'
                          : 'bg-slate-50 border-borderColor text-textSecondary hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculate Share UI */}
              <div className="mt-1">
                {sharesCalculated ? (
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center justify-between text-primary-dark">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Calculated Share</span>
                      <span className="text-body font-black">Rs {sharesCalculated.share.toLocaleString()} / person</span>
                    </div>
                    <span className="text-[10px] font-medium opacity-90">({sharesCalculated.totalPeople} people total)</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleCalculate}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-borderColor text-textPrimary text-caption font-semibold rounded-xl flex items-center justify-center gap-1 hover:border-slate-300"
                  >
                    <Calculator className="w-4 h-4 text-primary" />
                    Calculate Share
                  </button>
                )}
              </div>

              {/* Submit / Confirm */}
              <div className="flex gap-2.5 mt-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-white border border-borderColor text-textPrimary text-caption font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={participants.length === 0 || !customAmount}
                  className="flex-1 py-2.5 bg-primary disabled:opacity-50 text-white text-caption font-bold rounded-xl hover:bg-primary-dark shadow-md shadow-blue-200"
                >
                  Confirm Split
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
