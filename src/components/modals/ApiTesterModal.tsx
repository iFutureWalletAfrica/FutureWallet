import { useState } from 'react';
import { Terminal, Play, CheckCircle2, Shield, Copy, Check, X, RefreshCw } from 'lucide-react';

interface ApiTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: 'Wallet API' | 'Payment API' | 'Virtual Account API' | 'KYC API';
}

export const ApiTesterModal = ({ isOpen, onClose, defaultProduct = 'Wallet API' }: ApiTesterModalProps) => {
  const [selectedProduct, setSelectedProduct] = useState(defaultProduct);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('create_wallet');
  const [env, setEnv] = useState<'sandbox' | 'production'>('sandbox');
  const [isLoading, setIsLoading] = useState(false);
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const endpointsConfig: Record<string, { label: string; method: string; path: string; payload: any }> = {
    // Wallet API
    create_wallet: {
      label: 'Create Wallet',
      method: 'POST',
      path: '/v1/wallet/create',
      payload: {
        customerEmail: 'dev.partner@fintechcorp.io',
        currency: 'USD',
        tier: 'TIER_1',
        bvnLinked: '22194830192',
        reference: 'DEV-WAL-' + Date.now().toString().slice(-6),
      },
    },
    check_balance: {
      label: 'Check Balance',
      method: 'GET',
      path: '/v1/wallet/balance?walletId=IFW_WLT_994208',
      payload: null,
    },
    wallet_transfer: {
      label: 'Wallet Transfer',
      method: 'POST',
      path: '/v1/wallet/transfer',
      payload: {
        sourceWalletId: 'IFW_WLT_994208',
        destinationWalletId: 'IFW_WLT_110293',
        amount: 250.0,
        currency: 'USD',
        narration: 'Inter-wallet B2B settlement',
        idempotencyKey: 'idemp_' + Math.random().toString(36).substring(7),
      },
    },
    // Payment API
    payment_process: {
      label: 'Payment Processing',
      method: 'POST',
      path: '/v1/payments/process',
      payload: {
        amount: 1450.0,
        currency: 'USD',
        channel: 'BANK_TRANSFER',
        customerPhone: '+2348035550192',
        merchantCallbackUrl: 'https://partner.com/api/webhook',
        settlementAutoNet: true,
      },
    },
    payment_verify: {
      label: 'Payment Verification',
      method: 'GET',
      path: '/v1/payments/verify?reference=IFW-TXN-2026-99014',
      payload: null,
    },
    // Virtual Account API
    create_account: {
      label: 'Create Virtual Account',
      method: 'POST',
      path: '/v1/virtual-accounts/create',
      payload: {
        bankCode: '9PSB',
        accountName: 'iFutureWallet / Global Trade Logistics',
        expiresInMinutes: 0, // permanent static NUBAN
        autoSweepWalletId: 'IFW_WLT_994208',
      },
    },
    account_statement: {
      label: 'Account Statement',
      method: 'GET',
      path: '/v1/virtual-accounts/statement?accountNumber=9901428192&from=2026-09-01',
      payload: null,
    },
    // KYC API
    bvn_verification: {
      label: 'BVN Verification',
      method: 'POST',
      path: '/v1/kyc/bvn-verify',
      payload: {
        bvn: '22194830192',
        dateOfBirth: '1992-04-18',
        verifyFaceBiometric: true,
      },
    },
    nin_verification: {
      label: 'NIN Verification',
      method: 'POST',
      path: '/v1/kyc/nin-verify',
      payload: {
        nin: '84920194821',
        phoneNumber: '+2348149901201',
      },
    },
  };

  const productEndpoints: Record<string, string[]> = {
    'Wallet API': ['create_wallet', 'check_balance', 'wallet_transfer'],
    'Payment API': ['payment_process', 'payment_verify'],
    'Virtual Account API': ['create_account', 'account_statement'],
    'KYC API': ['bvn_verification', 'nin_verification'],
  };

  const handleProductChange = (prod: string) => {
    setSelectedProduct(prod as any);
    setSelectedEndpoint(productEndpoints[prod][0]);
    setResponseOutput(null);
  };

  const handleRunTest = () => {
    setIsLoading(true);
    setResponseOutput(null);

    setTimeout(() => {
      setIsLoading(false);
      const ep = endpointsConfig[selectedEndpoint];
      let data: any = {};

      if (selectedEndpoint === 'create_wallet') {
        data = {
          walletId: 'IFW_WLT_' + Math.floor(100000 + Math.random() * 900000),
          currency: 'USD',
          tier: 'TIER_1',
          balance: 0.0,
          ledgerStatus: 'ACTIVE',
          linkedBvnStatus: 'VERIFIED_NIBSS',
          createdAt: new Date().toISOString(),
        };
      } else if (selectedEndpoint === 'check_balance') {
        data = {
          walletId: 'IFW_WLT_994208',
          availableBalance: 42819.5,
          ledgerBalance: 43100.0,
          currency: 'USD',
          ifwTokenBonusBalance: 1250.0,
          lastSettlement: '2026-09-19T06:40:12Z',
        };
      } else if (selectedEndpoint === 'wallet_transfer') {
        data = {
          transferId: 'TRF_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          status: 'SUCCESS',
          amountDebited: 250.0,
          fee: 0.0,
          settlementRail: 'IFW_INTERNAL_SWITCH_V4',
          executionTimeMs: 42,
        };
      } else if (selectedEndpoint === 'payment_process') {
        data = {
          paymentReference: 'PAY_2026_' + Math.floor(1000000 + Math.random() * 9000000),
          status: 'PENDING_SETTLEMENT',
          checkoutUrl: 'https://checkout.ifuturewallet.com/pay/' + Math.random().toString(36).substring(7),
          gatewayNode: 'eu-west-1-core-01',
          feeEstimate: 7.25,
        };
      } else if (selectedEndpoint === 'payment_verify') {
        data = {
          reference: 'IFW-TXN-2026-99014',
          status: 'SETTLED',
          amount: 4500.0,
          payerBank: 'Zenith Commercial Bank PLC',
          paidAt: '2026-09-19T08:12:04Z',
          hashVerification: 'sha256:4f89b...c912a',
        };
      } else if (selectedEndpoint === 'create_account') {
        data = {
          virtualAccountNumber: '99014' + Math.floor(10000 + Math.random() * 90000),
          bankName: '9PSB Payment Service Bank',
          assignedMerchant: 'iFutureWallet / Global Trade Logistics',
          currency: 'NGN / USD Dual Rail',
          status: 'ACTIVE_PERMANENT',
        };
      } else if (selectedEndpoint === 'account_statement') {
        data = {
          accountNumber: '9901428192',
          totalCreditsToday: 184500.0,
          totalDebitsToday: 142000.0,
          netPosition: 42500.0,
          statementFormat: 'AUDIT_SEALED_CSV',
          dispatchedWebhook: true,
        };
      } else if (selectedEndpoint === 'bvn_verification') {
        data = {
          bvn: '22194830192',
          verificationStatus: 'VERIFIED',
          matchScore: 99.4,
          nibssResponseCode: '00',
          fullName: 'OBI, EMEKA CHUKWUDI',
          enrollmentBank: 'Zenith Bank PLC',
          watchListStatus: 'CLEAR_NO_SANCTIONS',
        };
      } else if (selectedEndpoint === 'nin_verification') {
        data = {
          nin: '84920194821',
          nimcValidation: 'AUTHENTIC_ACTIVE',
          matchScore: 98.9,
          firstName: 'FATIMA',
          lastName: 'MOHAMMED',
          residenceState: 'Kano',
        };
      }

      setResponseOutput({
        statusCode: 200,
        statusText: 'OK',
        environment: env,
        latencyMs: Math.floor(25 + Math.random() * 60),
        signature: 'hmac-sha512-' + Math.random().toString(36).substring(2, 14),
        data,
      });
    }, 600);
  };

  const copyPayload = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeEp = endpointsConfig[selectedEndpoint] || endpointsConfig['create_wallet'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">API Product Integration Sandbox</h3>
              <p className="text-xs text-slate-400">admin.ifuturewallet.com • Live External Developer Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Top Bar Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
            {/* Product Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {(['Wallet API', 'Payment API', 'Virtual Account API', 'KYC API'] as const).map((prod) => (
                <button
                  key={prod}
                  onClick={() => handleProductChange(prod)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedProduct === prod
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {prod}
                </button>
              ))}
            </div>

            {/* Environment Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-md border border-slate-800">
              <button
                onClick={() => setEnv('sandbox')}
                className={`px-2.5 py-1 text-xs font-medium rounded ${
                  env === 'sandbox' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sandbox
              </button>
              <button
                onClick={() => setEnv('production')}
                className={`px-2.5 py-1 text-xs font-medium rounded ${
                  env === 'production' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Production Live
              </button>
            </div>
          </div>

          {/* Endpoint Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {productEndpoints[selectedProduct].map((epKey) => (
              <button
                key={epKey}
                onClick={() => {
                  setSelectedEndpoint(epKey);
                  setResponseOutput(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border whitespace-nowrap transition-all ${
                  selectedEndpoint === epKey
                    ? 'bg-slate-800 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-[10px] uppercase text-emerald-400 mr-1.5">
                  {endpointsConfig[epKey].method}
                </span>
                {endpointsConfig[epKey].label}
              </button>
            ))}
          </div>

          {/* Request Header Bar */}
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              {activeEp.method}
            </span>
            <span className="text-slate-300 flex-1 truncate">{activeEp.path}</span>
            <button
              onClick={handleRunTest}
              disabled={isLoading}
              className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Send Request
            </button>
          </div>

          {/* Request Payload & Response Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Request Body */}
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-3.5 flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-850">
                <span className="text-xs font-medium text-slate-400">Request Body (JSON)</span>
                {activeEp.payload && (
                  <button
                    onClick={() => copyPayload(JSON.stringify(activeEp.payload, null, 2))}
                    className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                )}
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2 bg-slate-900/60 rounded flex-1">
                {activeEp.payload ? JSON.stringify(activeEp.payload, null, 2) : '// No Request Body (GET Endpoint)'}
              </pre>
            </div>

            {/* Response Output */}
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-3.5 flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">Response</span>
                  {responseOutput && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                      {responseOutput.statusCode} {responseOutput.statusText}
                    </span>
                  )}
                </div>
                {responseOutput && (
                  <span className="text-[11px] text-slate-400 font-mono">{responseOutput.latencyMs}ms</span>
                )}
              </div>
              <div className="flex-1 overflow-x-auto p-2 bg-slate-900/60 rounded">
                {responseOutput ? (
                  <pre className="text-[11px] font-mono text-emerald-300">
                    {JSON.stringify(responseOutput, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
                    <Terminal className="w-8 h-8 mb-2 opacity-40 text-cyan-400" />
                    <span>Click "Send Request" to trigger simulation against {env} gateway.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Encrypted with SHA-512 API HMAC & IP Whitelist Enforced</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg font-medium transition-colors"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
