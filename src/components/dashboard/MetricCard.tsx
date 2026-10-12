import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface MetricCardProps {
  data: {
    id: string;
    title: string;
    value: string | number;
    change: number;
    prefix?: string;
    suffix?: string;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  const { language, t } = useLanguage();
  const isPositive = data.change >= 0;
  const locale = language === "tr" ? "tr-TR" : "en-US";

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/60 p-5 backdrop-blur-md shadow-sm transition-colors flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {data.title}
        </span>
        <span
          className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-mono font-semibold ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
          }`}
        >
          {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          %{Math.abs(data.change)}
        </span>
      </div>

      <div className="my-3">
        <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-white">
          {data.prefix}
          {typeof data.value === "number"
            ? data.value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : data.value}
          {data.suffix}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
        <span>{t.vsLastMonth}</span>
        <span className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {t.dataLive}
        </span>
      </div>
    </div>
  );
};