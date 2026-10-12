import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { MarketTicker } from "./components/dashboard/MarketTicker";
import { MetricCard } from "./components/dashboard/MetricCard";
import { PortfolioChart } from "./components/charts/PortfolioChart";
import { AllocationChart } from "./components/charts/AllocationChart";
import { MarketRadar } from "./components/dashboard/MarketRadar";
import { TransactionList } from "./components/dashboard/TransactionList";
import { TransactionDrawer } from "./components/dashboard/TransactionDrawer";
import { CommandPalette } from "./components/ui/CommandPalette";
import { AddTransactionModal } from "./components/dashboard/AddTransactionModal";
import { metricsData as initialMetrics, recentTransactions } from "./data/mockData";
import { useLanguage } from "./context/LanguageContext";
import type { Transaction, TimeRange } from "./types";

export default function App() {
  const { t } = useLanguage();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(recentTransactions);
  const [currentTimeRange, setCurrentTimeRange] = useState<TimeRange>("1Y");

  const netWorth = transactions.reduce((acc, curr) => acc + curr.amount, 110000);

  const dynamicMetrics = initialMetrics.map((m) => {
    if (m.id === "net-worth") {
      return { ...m, title: t.netWorth, value: netWorth };
    }
    if (m.id === "monthly-inflow") {
      return { ...m, title: t.monthlyInflow };
    }
    if (m.id === "monthly-expenses") {
      return { ...m, title: t.monthlyOutflow };
    }
    if (m.id === "annual-roi") {
      return { ...m, title: t.annualRoi };
    }
    return m;
  });

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsCommandOpen(false);
        setIsAddModalOpen(false);
        setSelectedTx(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070709] text-zinc-100 flex flex-col antialiased transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Arka Plan Atmosferik Beyaz & Zümrüt Işık Katmanları (Derinlik Efekti) */}
      <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-white/[0.03] blur-[160px] rounded-full" />
      <div className="pointer-events-none fixed top-24 left-10 w-[600px] h-[400px] bg-emerald-500/[0.04] blur-[180px] rounded-full" />
      <div className="pointer-events-none fixed top-60 right-10 w-[700px] h-[500px] bg-cyan-500/[0.03] blur-[200px] rounded-full" />

      {/* İnce Izgara Deseni (Grid Pattern) ile Terminal Hissi */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-[0.035]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: "32px 32px"
        }}
      />

      {/* Ana Arayüz - Genişletilmiş Container (max-w-[1560px]) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onOpenCommand={() => setIsCommandOpen(true)} />

        <main className="flex-1 px-6 sm:px-10 py-8 max-w-[1560px] mx-auto w-full space-y-7">
          {/* Karşılama ve Global Filtre */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                {t.mainTitle}
              </h1>
              <p className="text-sm text-zinc-400 mt-1 font-medium">
                {t.mainSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">{t.activePeriod}</span>
              <span className="rounded-lg bg-zinc-900/90 px-3 py-1.5 text-xs font-mono font-bold text-emerald-400 border border-white/10 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                {currentTimeRange}
              </span>
            </div>
          </div>

          {/* Canlı Piyasa Ticker */}
          <div className="terminal-card rounded-2xl">
            <MarketTicker />
          </div>

          {/* Reaktif Metrik Kartları (Daha büyük ve belirgin) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dynamicMetrics.map((metric) => (
              <div key={metric.id} className="terminal-card rounded-2xl">
                <MetricCard data={metric} />
              </div>
            ))}
          </div>

          {/* Etkileşimli Grafikler */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 terminal-card rounded-2xl">
              <PortfolioChart onRangeChange={(range) => setCurrentTimeRange(range)} />
            </div>
            <div className="lg:col-span-1 terminal-card rounded-2xl">
              <AllocationChart />
            </div>
          </div>

          {/* Canlı İşlem Listesi ve Piyasa Radarı */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 terminal-card rounded-2xl">
              <TransactionList
                transactions={transactions}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onDeleteTransaction={handleDeleteTransaction}
                onSelectTransaction={(tx) => setSelectedTx(tx)}
              />
            </div>
            <div className="lg:col-span-1 terminal-card rounded-2xl">
              <MarketRadar />
            </div>
          </div>
        </main>
      </div>

      {/* Sağdan Açılan İşlem Detay Çekmecesi */}
      <TransactionDrawer
        transaction={selectedTx}
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <CommandPalette
  isOpen={isCommandOpen}
  onClose={() => setIsCommandOpen(false)}
  onOpenAddModal={() => setIsAddModalOpen(true)}
  transactions={transactions}
/>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}