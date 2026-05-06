import React, { useState, useMemo } from 'react';
import { X, WalletCards, Shield, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { StakingPool } from '@/types/fi';
import { calculateReturn, formatIDRXFull, formatNumber } from '@/lib/yield';
import { useNemesisStore } from '@/store/useNemesisStore';

interface InvestModalProps {
  pool: StakingPool;
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
}

export function InvestModal({ pool, isOpen, onClose, initialAmount = 1_000_000 }: InvestModalProps) {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [currency, setCurrency] = useState<'IDRX' | 'USDC'>('IDRX');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { investInPool } = useNemesisStore();

  const calc = useMemo(
    () => calculateReturn(pool, amount || 0, 100),
    [amount, pool]
  );

  if (!isOpen) return null;

  const handleInvest = async () => {
    if (!agreed || !amount || amount < (pool.minInvestment || 50000)) return;
    
    setIsSubmitting(true);
    // Simulate transaction delay
    setTimeout(() => {
      investInPool(pool.id, amount, currency);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-950">Invest in {pool.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 rounded-full bg-teal-50 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-950 mb-2">Investment Successful!</h3>
              <p className="text-zinc-500">You have successfully invested {formatNumber(amount)} {currency} in {pool.name}.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-zinc-950 mb-2">Investment Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-zinc-500 font-bold">{currency === 'IDRX' ? 'Rp' : '$'}</span>
                  </div>
                  <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50 py-4 pl-12 pr-4 text-xl font-bold text-zinc-950 outline-none focus:border-teal-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-zinc-500 font-semibold">
                  <span>Min: {formatIDRXFull(pool.minInvestment || 50000)}</span>
                  <span>Max: {formatIDRXFull(pool.targetSupply - pool.totalSupplied)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-950 mb-2">Select Currency</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCurrency('IDRX')}
                    className={`flex items-center justify-center py-3 rounded-xl border-2 font-bold transition-colors ${
                      currency === 'IDRX' 
                        ? 'border-teal-600 bg-teal-50 text-teal-800' 
                        : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 mr-2 flex items-center justify-center ${currency === 'IDRX' ? 'border-teal-600' : 'border-zinc-300'}`}>
                      {currency === 'IDRX' && <div className="h-2 w-2 rounded-full bg-teal-600" />}
                    </div>
                    IDRX
                  </button>
                  <button
                    onClick={() => setCurrency('USDC')}
                    className={`flex items-center justify-center py-3 rounded-xl border-2 font-bold transition-colors ${
                      currency === 'USDC' 
                        ? 'border-blue-600 bg-blue-50 text-blue-800' 
                        : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 mr-2 flex items-center justify-center ${currency === 'USDC' ? 'border-blue-600' : 'border-zinc-300'}`}>
                      {currency === 'USDC' && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                    USDC
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Projected Returns
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600">Monthly Cash Yield</span>
                    <span className="font-bold text-teal-700">{formatIDRXFull(calc.monthlyCashYieldIDRX)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600">Monthly Principal</span>
                    <span className="font-bold text-zinc-950">{formatIDRXFull(calc.monthlyPrincipalRecoveryIDRX)}</span>
                  </div>
                  <div className="h-px bg-zinc-200 my-2" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-zinc-950">Annual Cash Total</span>
                    <span className="font-bold text-zinc-950">{formatIDRXFull(calc.annualCashDistributionIDRX)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600">Maturity Settlement</span>
                    <span className="font-bold text-zinc-950">{formatIDRXFull(calc.maturitySettlementIDRX)}</span>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${agreed ? 'border-teal-600 bg-teal-600 text-white' : 'border-zinc-300 bg-white'}`}>
                  {agreed && <CheckCircle2 className="h-3 w-3" />}
                </div>
                <input type="checkbox" className="hidden" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span className="text-sm text-zinc-600 leading-tight">
                  I understand the risks associated with this investment and acknowledge that projected returns are not guaranteed.
                </span>
              </label>
            </div>
          )}
        </div>

        {!isSuccess && (
          <div className="p-6 border-t border-zinc-100 bg-zinc-50">
            <button
              onClick={handleInvest}
              disabled={!agreed || !amount || amount < (pool.minInvestment || 50000) || isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-4 font-bold text-white transition hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
              ) : (
                <><WalletCards className="h-5 w-5" /> Confirm Investment</>
              )}
            </button>
            <p className="text-center text-xs text-zinc-500 mt-4 font-semibold flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3" /> Powered by Solana • {currency} settled
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
