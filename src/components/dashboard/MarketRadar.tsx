import React, { useState } from "react";
import { TrendingUp, RefreshCw, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useBinanceMarket } from "../../hooks/useBinanceMarket";
import { useLanguage } from "../../context/LanguageContext";

export const MarketRadar: React.FC = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<"gainers" | "volume">("gainers");
  const { data: liveAssets, loading, refetch } = useBinanceMarket(activeFilter);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/60 p-5 backdrop-blur-md shadow-sm flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
              {t.marketLeaders}
            </h3>
          </div>
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-500 dark:text-emerald-400" : ""}`} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900/80 rounded-lg mt-3 border border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setActiveFilter("gainers")}
            className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeFilter === "gainers"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <TrendingUp className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
            <span>{t.topGainers}</span>
          </button>
          <button
            onClick={() => setActiveFilter("volume")}
            className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeFilter === "volume"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Activity className="h-3 w-3 text-blue-500 dark:text-blue-400" />
            <span>{t.volumeLeaders}</span>
          </button>
        </div>
      </div>

      <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800/40 min-h-[190px]">
        {loading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-2.5 w-24 bg-zinc-100 dark:bg-zinc-900 rounded" />
                </div>
                <div className="space-y-1.5 text-right">
                  <div className="h-3.5 w-14 bg-zinc-200 dark:bg-zinc-800 rounded ml-auto" />
                  <div className="h-2.5 w-10 bg-zinc-100 dark:bg-zinc-900 rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          liveAssets.map((asset, idx) => (
            <div key={idx} className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">{asset.symbol}</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{asset.name}</span>
                </div>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                  {t.volume24h} {asset.volume}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 block">
                  {asset.price}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold ${
                    asset.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {asset.isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  %{Math.abs(asset.change).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};