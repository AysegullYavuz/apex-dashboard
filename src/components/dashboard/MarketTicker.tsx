import React, { useState, useEffect } from "react";
import { DollarSign, Euro, Coins, Bitcoin, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

// Mini SVG Sparkline bileşeni (Varlığın 24s trend eğrisi)
const Sparkline: React.FC<{ isPositive: boolean; data: number[] }> = ({ isPositive, data }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 22;
  const width = 64;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const strokeColor = isPositive ? "#10b981" : "#f43f5e";

  return (
    <div className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          style={{
            filter: `drop-shadow(0 0 4px ${isPositive ? "rgba(16,185,129,0.5)" : "rgba(244,63,94,0.5)"})`,
          }}
        />
      </svg>
    </div>
  );
};

export const MarketTicker: React.FC = () => {
  const { language } = useLanguage();
  const [time, setTime] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString(language === "tr" ? "tr-TR" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const tickerItems = [
    {
      symbol: "USD/TRY",
      name: "USD / TRY",
      category: "FOREX",
      price: "49,3375",
      change: "+0.14%",
      isPositive: true,
      spark: [48.9, 49.0, 49.1, 49.05, 49.2, 49.33],
      color: "emerald",
      icon: DollarSign,
    },
    {
      symbol: "EUR/TRY",
      name: "EUR / TRY",
      category: "FOREX",
      price: "55,2721",
      change: "+0.25%",
      isPositive: true,
      spark: [54.8, 55.0, 54.9, 55.1, 55.15, 55.27],
      color: "blue",
      icon: Euro,
    },
    {
      symbol: "GA",
      name: language === "tr" ? "Gram Altın" : "Gold Gram",
      category: "COMMODITY",
      price: "6.617,79 ₺",
      change: "-0.55%",
      isPositive: false,
      spark: [6680, 6660, 6650, 6640, 6620, 6617],
      color: "amber",
      icon: Coins,
    },
    {
      symbol: "XAU",
      name: language === "tr" ? "Ons Altın" : "Gold Ounce",
      category: "COMMODITY",
      price: "$4,172.01",
      change: "-0.55%",
      isPositive: false,
      spark: [4210, 4195, 4190, 4180, 4175, 4172],
      color: "amber",
      icon: Coins,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      category: "CRYPTO",
      price: "$82,534.00",
      change: "-1.61%",
      isPositive: false,
      spark: [84200, 83900, 83400, 83100, 82800, 82534],
      color: "orange",
      icon: Bitcoin,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      category: "CRYPTO",
      price: "$2,513.82",
      change: "-1.10%",
      isPositive: false,
      spark: [2560, 2550, 2530, 2540, 2520, 2513],
      color: "purple",
      icon: Coins,
    },
  ];

  return (
    <div className="p-5">
      {/* Ticker Üst Başlık & Kontroller */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-sm font-bold tracking-tight text-white">
              {language === "tr" ? "Piyasa Nabzı" : "Market Pulse"}
            </span>
          </div>

          <span className="rounded-md bg-white/[0.04] border border-white/10 px-2 py-0.5 text-[11px] font-mono text-zinc-300">
            {language === "tr" ? "Canlı Akış" : "Live Feed"} • {time}
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <span className="hidden sm:inline font-mono text-[11px] text-zinc-400">
            {language === "tr" ? "Global Spot & Döviz Kotasyonları" : "Global Spot & FX Quotes"}
          </span>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Yenile"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Ticker Kartları Izgarası */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {tickerItems.map((item) => {
          return (
            <div
              key={item.symbol}
              className="group relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:-translate-y-0.5"
            >
              {/* Üst Kısım: İkon + İsim + Kategori */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] font-semibold text-zinc-300 truncate group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 bg-white/[0.04] px-1.5 py-0.2 rounded border border-white/5">
                  {item.category}
                </span>
              </div>

              {/* Orta & Alt Kısım: Fiyat + Yüzde + Mini Sparkline */}
              <div className="flex items-end justify-between gap-1 pt-1">
                <div>
                  <p className="text-sm font-mono font-bold text-white tracking-tight">
                    {item.price}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {item.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-rose-400" />
                    )}
                    <span
                      className={`text-[10px] font-mono font-semibold ${
                        item.isPositive ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {item.change}
                    </span>
                  </div>
                </div>

                {/* Dinamik Neon Dalga Grafiği */}
                <Sparkline isPositive={item.isPositive} data={item.spark} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};