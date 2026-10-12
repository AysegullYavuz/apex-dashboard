export type TimeRange = "1M" | "6M" | "1Y" | "ALL";

export interface ChartDataPoint {
  date: string;
  value: number;
  benchmark: number;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: number;
  change: number;
  isPositive: boolean;
  prefix?: string;
  suffix?: string;
  sparkline?: number[];
}

export type TransactionCategory = "Yatırım" | "Gelir" | "Operasyon" | "Yazılım" | "Maaş";

export interface Transaction {
  id: string;
  title: string;
  category: TransactionCategory;
  amount: number;
  type: "income" | "expense" | "investment";
  date: string;
  status: "completed" | "pending";
}

export interface AllocationItem {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface MarketTickerItem {
  id: string;
  name: string;
  symbol: string;
  price: string;
  changePercent: number;
  changeValue: string;
  isPositive: boolean;
  iconType: "usd" | "eur" | "gold" | "btc" | "eth";
}

export interface IPOItem {
  id: string;
  company: string;
  code: string;
  date: string;
  status: "active" | "upcoming" | "completed";
  distribution: string;
  price: string;
}

export interface EconomicEvent {
  id: string;
  title: string;
  region: string;
  date: string;
  impact: "high" | "medium" | "low";
  expectation: string;
}

export interface TrendingAsset {
  id: string;
  name: string;
  symbol: string;
  volume: string;
  change: number;
}