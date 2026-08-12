import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Shield, Lock, Wallet, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, course, userProfile, onPaymentSubmitted, language = 'en' }) {
  const isFr = language === 'fr';
  const [selectedMethod, setSelectedMethod] = useState('USDT'); // 'USDT', 'BNB', 'LTC'
  const [txId, setTxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [ratesData, setRatesData] = useState({
    cryptoAmounts: { USDT: '10.00', BNB: '0.0172', LTC: '0.1471' },
    rates: { USDT: 1.0, BNB: 580.0, LTC: 68.0 },
    addresses: {
      USDT_POLYGON: '0x50ad85d9488ef6b690834c20635b1a6fbc97e545',
      BNB_BEP20: '0x50ad85d9488ef6b690834c20635b1a6fbc97e545',
      LTC_NATIVE: 'MGDCwiQm7o4v7Tgp9Y8LKLWnRpUvvvCy7V'
    }
  });

  // Fetch live exchange rates
  const fetchRates = async () => {
    setRatesLoading(true);
    try {
      const res = await fetch('/api/payments/rates');
      if (res.ok) {
        const data = await res.json();
        if (data.rates) {
          setRatesData(data);
        }
      }
    } catch (err) {
      console.warn("Rates fetch fallback note:", err);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRates();
      setError('');
      setSuccessMsg('');
      setTxId('');
    }
  }, [isOpen]);

  if (!isOpen || !course) return null;

  const paymentMethods = {
    USDT: {
      name: 'USDT',
      network: 'POLYGON Network',
      badge: 'Polygon POS',
      address: ratesData.addresses.USDT_POLYGON,
      amount: ratesData.cryptoAmounts.USDT + ' USDT',
      rateText: `$1.00 USD / USDT`,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400'
    },
    BNB: {
      name: 'BNB',
      network: 'BEP-20 Network',
      badge: 'Binance Smart Chain',
      address: ratesData.addresses.BNB_BEP20,
      amount: ratesData.cryptoAmounts.BNB + ' BNB',
      rateText: `1 BNB ≈ $${ratesData.rates.BNB} USD`,
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-400'
    },
    LTC: {
      name: 'LTC',
      network: 'Native Network',
      badge: 'Litecoin Mainnet',
      address: ratesData.addresses.LTC_NATIVE,
      amount: ratesData.cryptoAmounts.LTC + ' LTC',
      rateText: `1 LTC ≈ $${ratesData.rates.LTC} USD`,
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-400'
    }
  };

  const currentMethod = paymentMethods[selectedMethod];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!txId.trim()) {
      setError(isFr ? 'Veuillez coller l\'ID de transaction (TxID).' : 'Please enter your Transaction Hash / ID.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile?.id || 'user_' + Date.now(),
          username: userProfile?.username || 'Operative',
          userEmail: userProfile?.email || '',
          courseId: course.id,
          courseTitle: course.title,
          txId: txId.trim(),
          network: currentMethod.network,
          cryptoToken: currentMethod.name,
          amountCrypto: currentMethod.amount
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(isFr ? 'ID de transaction soumis ! Un administrateur vérifiera votre paiement pour débloquer le cours.' : 'Transaction ID submitted! An administrator will review your payment to unlock the course.');
        if (onPaymentSubmitted) {
          onPaymentSubmitted(data.payment);
        }
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(data.error || 'Failed to submit transaction.');
      }
    } catch (err) {
      setError('Network error submitting payment proof.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] bg-gradient-to-r from-cyan-950/40 via-[var(--bg-card)] to-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded uppercase">
                  EXPERT COURSE
                </span>
                <span className="text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded">
                  $10 USD
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono mt-0.5">{course.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Method Selection Tabs */}
          <div>
            <label className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
              {isFr ? '1. Choisissez la Méthode de Paiement (10$ USD)' : '1. Select Payment Method ($10 USD)'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(paymentMethods).map((key) => {
                const method = paymentMethods[key];
                const isSelected = selectedMethod === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedMethod(key)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `bg-gradient-to-b ${method.color} shadow-lg shadow-cyan-950/20 ring-1 ring-cyan-400/50`
                        : 'bg-[var(--bg-input)] border-[var(--border-subtle)] hover:border-[var(--border-main)] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold font-mono text-sm text-white">{method.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono truncate">{method.network}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Price & Wallet Info Card */}
          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-main)] space-y-3">
            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                  {isFr ? 'Montant Crypto Requis' : 'Required Crypto Amount'}
                </span>
                <span className="text-lg font-bold font-mono text-cyan-400">{currentMethod.amount}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block flex items-center gap-1 justify-end">
                  {isFr ? 'Taux Dynamique En Direct' : 'Live Dynamic Rate'}
                  <button onClick={fetchRates} className="p-1 hover:text-cyan-400 transition-colors" title="Refresh Rate">
                    <RefreshCw className={`w-3 h-3 ${ratesLoading ? 'animate-spin' : ''}`} />
                  </button>
                </span>
                <span className="text-xs font-mono text-slate-300">{currentMethod.rateText}</span>
              </div>
            </div>

            {/* Wallet Address Display */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                  {isFr ? `Adresse de Dépôt (${currentMethod.network})` : `Deposit Address (${currentMethod.network})`}
                </span>
                <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {currentMethod.badge}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <code className="text-xs font-mono text-white break-all flex-1 select-all">
                  {currentMethod.address}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(currentMethod.address)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isFr ? 'Copié !' : 'Copied!') : (isFr ? 'Copier' : 'Copy')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Transaction ID Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                {isFr ? '2. ID de Transaction / Hash (TxID)' : '2. Transaction Hash / ID (TxID)'}
              </label>
              <input
                type="text"
                placeholder={isFr ? 'Collez votre Hash de transaction ici (ex: 0x7f8a9...)' : 'Paste your transaction Hash / ID here (e.g. 0x7f8a9...)'}
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono placeholder:text-slate-600"
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                {isFr ? 'Après avoir envoyé 10$ en crypto, collez le Hash de transaction pour vérification par l\'administrateur.' : 'After sending $10 worth of crypto, paste the TxID so the administrator can verify and unlock your course.'}
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                {isFr ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading || !txId.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{isFr ? 'Soumettre le Paiement (10$)' : 'Submit Payment Proof ($10)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}