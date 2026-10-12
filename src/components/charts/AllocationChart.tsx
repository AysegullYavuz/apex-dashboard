import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { assetAllocation } from "../../data/mockData";
import { useLanguage } from "../../context/LanguageContext";

export const AllocationChart: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalValue = assetAllocation.reduce((acc, curr) => acc + curr.value, 0);

  const translatedAllocation = assetAllocation.map((item) => {
    let name = item.name;
    if (language === "en") {
      if (item.name.includes("Hisse")) name = "Stocks & ETFs";
      if (item.name.includes("Tahvil")) name = "Fixed Income / Bonds";
      if (item.name.includes("Kripto")) name = "Crypto Assets";
      if (item.name.includes("Nakit")) name = "Cash & Reserves";
    }
    return { ...item, displayName: name };
  });

  const currentHovered = activeIndex !== null ? translatedAllocation[activeIndex] : null;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/60 p-6 backdrop-blur-md shadow-sm flex flex-col justify-between h-full transition-colors">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            {t.assetAllocation}
          </h3>
          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
            {assetAllocation.length} {t.assetClasses}
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          {t.assetSubtitle}
        </p>
      </div>

      <div className="relative h-64 w-full my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={translatedAllocation}
              cx="50%"
              cy="50%"
              innerRadius={78}
              outerRadius={96}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              cursor="pointer"
              stroke="transparent"
            >
              {translatedAllocation.map((entry, index) => {
                const isHovered = activeIndex === index;
                const isAnyHovered = activeIndex !== null;

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={isAnyHovered ? (isHovered ? 1 : 0.3) : 1}
                    className="transition-opacity duration-200"
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider truncate max-w-[130px]">
            {currentHovered ? currentHovered.displayName : t.totalAssets}
          </span>
          <span className="text-lg font-bold font-mono tracking-tight text-zinc-900 dark:text-white mt-0.5">
            {currentHovered
              ? `$${currentHovered.value.toLocaleString(language === "tr" ? "tr-TR" : "en-US")}`
              : `$${(totalValue / 1000).toFixed(1)}k`}
          </span>
          <span className="text-[10px] font-mono font-semibold text-emerald-500 dark:text-emerald-400 mt-0.5">
            {currentHovered ? `%${currentHovered.percentage} ${t.share}` : `100% ${t.portfolioTotal}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
        {translatedAllocation.map((item, index) => (
          <div
            key={item.name}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
              activeIndex === index
                ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-xs"
                : "border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-zinc-600 dark:text-zinc-300 truncate">
                {item.displayName}
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-white ml-1">
              %{item.percentage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};