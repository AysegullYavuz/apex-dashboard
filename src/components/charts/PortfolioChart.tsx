import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "../../context/LanguageContext";
import type { TimeRange } from "../../types";

interface PortfolioChartProps {
  onRangeChange?: (range: TimeRange) => void;
}

interface PerformancePoint {
  date: string;
  value: number;
}

const defaultPerformanceData: PerformancePoint[] = [
  { date: "Kas", value: 68000 },
  { date: "Oca", value: 74500 },
  { date: "Mar", value: 82000 },
  { date: "May", value: 89000 },
  { date: "Tem", value: 98500 },
  { date: "Eyl", value: 108000 },
  { date: "Eki", value: 113658 },
];

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ onRangeChange }) => {
  const { language, t } = useLanguage();
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1Y");

  const ranges: TimeRange[] = ["1M", "6M", "1Y", "ALL"];

  const handleRange = (range: TimeRange) => {
    setSelectedRange(range);
    if (onRangeChange) onRangeChange(range);
  };

  const monthMapEn: Record<string, string> = {
    Kas: "Nov",
    Oca: "Jan",
    Mar: "Mar",
    May: "May",
    Tem: "Jul",
    Eyl: "Sep",
    Eki: "Oct",
  };

  const chartData = defaultPerformanceData.map((item: PerformancePoint) => ({
    ...item,
    formattedDate: language === "en" && monthMapEn[item.date] ? monthMapEn[item.date] : item.date,
  }));

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/60 p-6 backdrop-blur-md shadow-sm transition-colors flex flex-col justify-between h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
              {t.growthAnalysis}
            </h3>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              +60.1% ({selectedRange})
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {t.growthSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => handleRange(r)}
              className={`rounded px-2.5 py-1 text-xs font-mono font-medium transition-colors cursor-pointer ${
                selectedRange === r
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="apexGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="formattedDate"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2.5 shadow-xl font-mono text-xs">
                      <p className="text-zinc-400">{payload[0].payload.formattedDate}</p>
                      <p className="font-bold text-emerald-500">
                        ${payload[0].value?.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#apexGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};