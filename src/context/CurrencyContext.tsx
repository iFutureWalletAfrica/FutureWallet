import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'NGN' | 'USD';

export interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  toggleCurrency: () => void;
  exchangeRate: number; // 1 USD = NGN
  formatUsd: (amountInUsd: number, options?: { compact?: boolean; decimals?: number; showCurrencyCode?: boolean }) => string;
  formatNgn: (amountInNgn: number, options?: { compact?: boolean; decimals?: number; showCurrencyCode?: boolean }) => string;
  convertUsdToCurrent: (amountInUsd: number) => number;
  convertNgnToCurrent: (amountInNgn: number) => number;
  currencySymbol: string;
}

// 1 USD = 1,580 NGN (Central Bank of Nigeria / Official NAFEM Benchmark)
export const USD_TO_NGN_RATE = 1580;

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('ifw_currency_preference');
      if (saved === 'NGN' || saved === 'USD') return saved;
    } catch {
      // fallback
    }
    return 'USD';
  });

  useEffect(() => {
    try {
      localStorage.setItem('ifw_currency_preference', currency);
    } catch {
      // storage unavailable
    }
  }, [currency]);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
  };

  const toggleCurrency = () => {
    setCurrencyState((prev) => (prev === 'USD' ? 'NGN' : 'USD'));
  };

  const convertUsdToCurrent = (amountInUsd: number): number => {
    if (currency === 'USD') return amountInUsd;
    return amountInUsd * USD_TO_NGN_RATE;
  };

  const convertNgnToCurrent = (amountInNgn: number): number => {
    if (currency === 'NGN') return amountInNgn;
    return amountInNgn / USD_TO_NGN_RATE;
  };

  // Helper for compact representation (K, M, B, T)
  const formatCompact = (val: number, symbol: string, decimals = 1, showCode = false): string => {
    const absVal = Math.abs(val);
    const sign = val < 0 ? '-' : '';

    let formatted = '';
    if (absVal >= 1_000_000_000_000) {
      formatted = `${sign}${symbol}${(absVal / 1_000_000_000_000).toFixed(decimals)}T`;
    } else if (absVal >= 1_000_000_000) {
      formatted = `${sign}${symbol}${(absVal / 1_000_000_000).toFixed(decimals)}B`;
    } else if (absVal >= 1_000_000) {
      formatted = `${sign}${symbol}${(absVal / 1_000_000).toFixed(decimals)}M`;
    } else if (absVal >= 10_000) {
      formatted = `${sign}${symbol}${(absVal / 1_000).toFixed(decimals)}K`;
    } else {
      formatted = `${sign}${symbol}${absVal.toLocaleString('en-US', {
        minimumFractionDigits: decimals > 0 ? (decimals <= 2 ? decimals : 2) : 0,
        maximumFractionDigits: decimals > 0 ? (decimals <= 2 ? decimals : 2) : 0,
      })}`;
    }

    return showCode ? `${formatted} ${currency}` : formatted;
  };

  // Format value that originates in USD
  const formatUsd = (
    amountInUsd: number,
    options?: { compact?: boolean; decimals?: number; showCurrencyCode?: boolean }
  ): string => {
    const compact = options?.compact ?? true;
    const decimals = options?.decimals ?? 1;
    const showCode = options?.showCurrencyCode ?? false;

    if (currency === 'USD') {
      if (compact) {
        return formatCompact(amountInUsd, '$', decimals, showCode);
      }
      return `${amountInUsd < 0 ? '-' : ''}$${Math.abs(amountInUsd).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${showCode ? ' USD' : ''}`;
    } else {
      // Convert to NGN
      const ngnAmount = amountInUsd * USD_TO_NGN_RATE;
      if (compact) {
        return formatCompact(ngnAmount, '₦', decimals, showCode);
      }
      return `${ngnAmount < 0 ? '-' : ''}₦${Math.abs(ngnAmount).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}${showCode ? ' NGN' : ''}`;
    }
  };

  // Format value that originates in NGN
  const formatNgn = (
    amountInNgn: number,
    options?: { compact?: boolean; decimals?: number; showCurrencyCode?: boolean }
  ): string => {
    const compact = options?.compact ?? true;
    const decimals = options?.decimals ?? 1;
    const showCode = options?.showCurrencyCode ?? false;

    if (currency === 'NGN') {
      if (compact) {
        return formatCompact(amountInNgn, '₦', decimals, showCode);
      }
      return `${amountInNgn < 0 ? '-' : ''}₦${Math.abs(amountInNgn).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}${showCode ? ' NGN' : ''}`;
    } else {
      // Convert to USD
      const usdAmount = amountInNgn / USD_TO_NGN_RATE;
      if (compact) {
        return formatCompact(usdAmount, '$', decimals, showCode);
      }
      return `${usdAmount < 0 ? '-' : ''}$${Math.abs(usdAmount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}${showCode ? ' USD' : ''}`;
    }
  };

  const currencySymbol = currency === 'USD' ? '$' : '₦';

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        exchangeRate: USD_TO_NGN_RATE,
        formatUsd,
        formatNgn,
        convertUsdToCurrent,
        convertNgnToCurrent,
        currencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
