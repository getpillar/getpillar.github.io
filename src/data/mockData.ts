// ─── Types ───────────────────────────────────────────────────────────────────

export interface ETFHolding {
  ticker: string;
  name: string;
  allocation: number;
  rating: string;
  aum: string;
  yield: number;
  description: string;
  riskNote: string;
}

export interface BalanceHistoryPoint {
  date: string;
  balance: number;
  event?: string;
}

export interface Transaction {
  id: string;
  type: "deposit" | "yield_credit" | "auto_invest" | "rebalance" | "leverage_adjust";
  description: string;
  amount: number;
  date: string;
  details?: string;
}

// ─── ETF Holdings (30-Day SEC Yields, Feb 2026) ─────────────────────────────

export const etfHoldings: ETFHolding[] = [
  {
    ticker: "JAAA",
    name: "Janus Henderson AAA CLO ETF",
    allocation: 45,
    rating: "AAA",
    aum: "$26.9B",
    yield: 4.95,
    description:
      "Invests exclusively in AAA-rated tranches of collateralized loan obligations. These are the most senior tranches with first priority on cash flows.",
    riskNote:
      "AAA CLO tranches have never experienced a principal loss in 30+ years of history, including during 2008.",
  },
  {
    ticker: "CLOA",
    name: "iShares AAA CLO Active ETF",
    allocation: 25,
    rating: "AAA",
    aum: "$1.6B",
    yield: 5.1,
    description:
      "Actively managed portfolio of AAA-rated CLO debt. Focuses on diversified manager selection and vintage diversification across the CLO universe.",
    riskNote:
      "Provides diversification across CLO managers, reducing single-manager concentration risk.",
  },
  {
    ticker: "FLOT",
    name: "iShares Floating Rate Bond ETF",
    allocation: 20,
    rating: "A/BBB",
    aum: "$9.2B",
    yield: 4.77,
    description:
      "Investment-grade floating rate notes that adjust with interest rates. Near-zero duration means minimal rate sensitivity.",
    riskNote:
      "Floating rate structure means NAV is highly stable even when interest rates move.",
  },
  {
    ticker: "BIL",
    name: "SPDR Bloomberg 1-3 Month T-Bill ETF",
    allocation: 10,
    rating: "AAA (UST)",
    aum: "$42.8B",
    yield: 3.49,
    description:
      "Ultra-short US Treasury bills. Essentially government-guaranteed cash equivalent held for liquidity.",
    riskNote:
      "Backed by the full faith and credit of the US government. Serves as the portfolio's liquidity buffer.",
  },
];

// ─── Yield Boost (Leverage) ──────────────────────────────────────────────────

// Blended base APY from real 30-Day SEC Yields
export const BASE_APY = Number(
  etfHoldings
    .reduce((sum, etf) => sum + (etf.allocation / 100) * etf.yield, 0)
    .toFixed(2)
);

// Repo funding cost on AAA collateral (~SOFR - 10bp)
export const FUNDING_RATE = 4.2;
// Net spread per turn of leverage
export const NET_SPREAD = Number((BASE_APY - FUNDING_RATE).toFixed(2));

// Leverage levels
export const LEVERAGE_MIN = 1;
export const LEVERAGE_MAX = 3;
export const LEVERAGE_DEFAULT = 2;

export const LEVERAGE_LABELS: Record<number, string> = {
  1: "Conservative",
  1.5: "Moderate",
  2: "Enhanced",
  2.5: "Aggressive",
  3: "Max Boost",
};

export function getEffectiveAPY(leverage: number): number {
  return Number((BASE_APY + (leverage - 1) * NET_SPREAD).toFixed(2));
}

// Default effective APY at 2x leverage
export const CURRENT_APY = getEffectiveAPY(LEVERAGE_DEFAULT);

// Auto-deleverage thresholds
export const DELEVERAGE_THRESHOLDS = [
  { trigger: "Net spread < 0.25%", action: "Auto-reduce to 1x" },
  { trigger: "Portfolio NAV drops > 2% intraday", action: "Auto-reduce to 1x" },
  { trigger: "Funding cost > 90% of portfolio yield", action: "Pause leverage" },
];

// ─── Balance Calculations ────────────────────────────────────────────────────

export const INITIAL_DEPOSIT = 50_000;
export const DEPOSIT_DATE = "2025-01-15";

function daysSinceDeposit(): number {
  const start = new Date(DEPOSIT_DATE + "T00:00:00");
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
}

export function getCurrentBalance(leverage = LEVERAGE_DEFAULT): number {
  const days = daysSinceDeposit();
  const effectiveAPY = getEffectiveAPY(leverage);
  const dailyRate = effectiveAPY / 100 / 365;
  return INITIAL_DEPOSIT * Math.pow(1 + dailyRate, days);
}

export function getTotalYieldEarned(leverage = LEVERAGE_DEFAULT): number {
  return getCurrentBalance(leverage) - INITIAL_DEPOSIT;
}

export function getDailyYield(leverage = LEVERAGE_DEFAULT): number {
  return (getCurrentBalance(leverage) * getEffectiveAPY(leverage)) / 100 / 365;
}

export function getYieldPerSecond(leverage = LEVERAGE_DEFAULT): number {
  return getDailyYield(leverage) / 86_400;
}

// ─── Balance History ─────────────────────────────────────────────────────────

export function generateBalanceHistory(leverage = LEVERAGE_DEFAULT): BalanceHistoryPoint[] {
  const points: BalanceHistoryPoint[] = [];
  const startDate = new Date(DEPOSIT_DATE + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const effectiveAPY = getEffectiveAPY(leverage);
  const dailyRate = effectiveAPY / 100 / 365;

  let balance = INITIAL_DEPOSIT;
  const current = new Date(startDate);

  while (current <= today) {
    points.push({
      date: current.toISOString().split("T")[0],
      balance: Math.round(balance * 100) / 100,
    });
    balance *= 1 + dailyRate;
    current.setDate(current.getDate() + 1);
  }

  // Tag start and end events on the chart
  if (points.length > 0) {
    points[0].event = "Funded $50,000";
    points[points.length - 1].event = "Today";
  }

  return points;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

// ─── Activity Feed (fully dynamic dates, no gaps) ────────────────────────────

export function generateTransactions(leverage = LEVERAGE_DEFAULT): Transaction[] {
  const dailyYield = getDailyYield(leverage);
  const balance = getCurrentBalance(leverage);
  const effectiveAPY = getEffectiveAPY(leverage);

  return [
    {
      id: "tx-001",
      type: "yield_credit",
      description: "Daily yield credit",
      amount: Number(dailyYield.toFixed(2)),
      date: daysAgo(0),
      details: `${effectiveAPY}% APY on ${formatUSD(balance)} balance`,
    },
    {
      id: "tx-002",
      type: "yield_credit",
      description: "Daily yield credit",
      amount: Number((dailyYield - 0.01).toFixed(2)),
      date: daysAgo(1),
    },
    {
      id: "tx-003",
      type: "auto_invest",
      description: "Auto-invested into JAAA",
      amount: -2500,
      date: daysAgo(2),
      details: "Purchased 24.8 shares at $100.81",
    },
    {
      id: "tx-004",
      type: "yield_credit",
      description: "Daily yield credit",
      amount: Number((dailyYield - 0.01).toFixed(2)),
      date: daysAgo(2),
    },
    {
      id: "tx-005",
      type: "yield_credit",
      description: "Daily yield credit",
      amount: Number((dailyYield - 0.02).toFixed(2)),
      date: daysAgo(3),
    },
    {
      id: "tx-006",
      type: "rebalance",
      description: "Quarterly rebalance",
      amount: 0,
      date: daysAgo(4),
      details: "Rebalanced to target: JAAA 45%, CLOA 25%, FLOT 20%, BIL 10%",
    },
    {
      id: "tx-007",
      type: "yield_credit",
      description: "Daily yield credit",
      amount: Number((dailyYield - 0.02).toFixed(2)),
      date: daysAgo(4),
    },
    {
      id: "tx-008",
      type: "leverage_adjust",
      description: "Yield Boost set to 2x",
      amount: 0,
      date: daysAgo(5),
      details: `Leverage adjusted from 1x to 2x. Effective APY: ${effectiveAPY}%`,
    },
    {
      id: "tx-009",
      type: "auto_invest",
      description: "Auto-invested into CLOA",
      amount: -1500,
      date: daysAgo(5),
      details: "Purchased 29.3 shares at $51.19",
    },
    {
      id: "tx-010",
      type: "yield_credit",
      description: "Daily yield credit",
      amount: Number((dailyYield - 0.03).toFixed(2)),
      date: daysAgo(5),
    },
    {
      id: "tx-011",
      type: "auto_invest",
      description: "Auto-invested into BIL",
      amount: -500,
      date: daysAgo(7),
      details: "Purchased 5.5 shares at $91.52",
    },
    {
      id: "tx-012",
      type: "yield_credit",
      description: "Daily yield credit",
      amount: Number((dailyYield - 0.03).toFixed(2)),
      date: daysAgo(7),
    },
    {
      id: "tx-013",
      type: "auto_invest",
      description: "Initial allocation into JAAA, CLOA, FLOT, BIL",
      amount: -50000,
      date: DEPOSIT_DATE,
      details: "Portfolio allocated to target weights across 4 ETFs",
    },
    {
      id: "tx-014",
      type: "deposit",
      description: "Initial deposit",
      amount: 50000,
      date: DEPOSIT_DATE,
      details: "Funded from Chase checking ••••4821",
    },
  ];
}

// ─── Competitor Yields (Feb 2026) ────────────────────────────────────────────

export const yieldComparisons = [
  { name: "Pillar", apy: CURRENT_APY, highlight: true, note: "with Yield Boost at 2x" },
  { name: "Marcus", apy: 3.65, highlight: false },
  { name: "Wealthfront", apy: 3.3, highlight: false },
  { name: "Ally", apy: 3.3, highlight: false },
  { name: "Chase Savings", apy: 0.01, highlight: false },
];

// ─── FAQ Data ────────────────────────────────────────────────────────────────

export const faqItems = [
  {
    question: "What is Yield Boost?",
    answer:
      "Yield Boost uses an automated repo facility to leverage your AAA-rated ETF holdings. At 2x, you're effectively borrowing against your ultra-safe collateral at the repo rate (~4.2%) and reinvesting into assets yielding ~4.8%. The spread on each additional turn of leverage adds to your effective yield. An automated de-leveraging engine ensures positions are instantly rebalanced if spreads compress or volatility spikes.",
  },
  {
    question: "What are AAA structured products?",
    answer:
      "Structured products like CLOs (Collateralized Loan Obligations) are pools of corporate loans packaged into tranches by risk level. The AAA tranche sits at the very top of the capital structure — it gets paid first and absorbs losses last. In 30+ years of CLO history, no AAA tranche has ever lost principal, even during the 2008 financial crisis.",
  },
  {
    question: "How is this different from a bank?",
    answer:
      "Banks take your deposits and lend them out, keeping most of the profit. Pillar invests your cash directly into AAA-rated ETFs that hold structured products, passing the yield to you. You get institutional-grade returns without the bank taking a spread. The trade-off: your funds are not FDIC insured, but they are invested in securities rated as safe as US Treasuries.",
  },
  {
    question: "What if NAV drops?",
    answer:
      "AAA CLO NAV is extraordinarily stable — during COVID's March 2020 crash, AAA CLO tranches dropped just 3-5% and recovered within weeks. For context, the S&P 500 dropped 34%. If you have Yield Boost enabled, the auto-deleveraging engine will reduce your leverage to 1x if NAV drops more than 2% intraday, protecting your principal.",
  },
  {
    question: "Is my money locked up?",
    answer:
      "No. All ETFs in the Pillar portfolio trade on public exchanges with daily liquidity. You can withdraw your full balance at any time, typically settling within 1 business day. There are no lock-up periods, withdrawal penalties, or minimum holding periods.",
  },
  {
    question: "How does Pillar make money?",
    answer:
      "Pillar charges a 0.25% annual management fee on your balance. That's it. No hidden fees, no transaction costs, no withdrawal penalties. The ETFs themselves have expense ratios averaging 0.22%, which are already reflected in the quoted yields.",
  },
];
