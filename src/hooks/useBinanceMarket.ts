import { useState, useEffect, useCallback } from "react";

export interface LiveMarketAsset {
  symbol: string;
  name: string;
  price: string;
  change: number;
  volume: string;
  isPositive: boolean;
}

const fallbackGainers: LiveMarketAsset[] = [
  { symbol: "GTC", name: "GTC Spot", price: "$0.3172", change: 76.52, volume: "$20 Mn", isPositive: true },
  { symbol: "RSR", name: "RSR Spot", price: "$0.0023", change: 39.68, volume: "$34 Mn", isPositive: true },
  { symbol: "CTK", name: "CTK Spot", price: "$0.1514", change: 16.28, volume: "$36 Mn", isPositive: true },
  { symbol: "OGN", name: "OGN Spot", price: "$0.0378", change: 14.18, volume: "$11 Mn", isPositive: true },
  { symbol: "W", name: "W Spot", price: "$0.0216", change: 11.29, volume: "$66 Mn", isPositive: true },
];

const fallbackVolume: LiveMarketAsset[] = [
  { symbol: "BTC", name: "BTC Spot", price: "$82,534.00", change: -1.61, volume: "$3.4 Mr", isPositive: false },
  { symbol: "ETH", name: "ETH Spot", price: "$2,513.82", change: -1.10, volume: "$1.8 Mr", isPositive: false },
  { symbol: "SOL", name: "SOL Spot", price: "$182.40", change: 4.35, volume: "$940 Mn", isPositive: true },
  { symbol: "BNB", name: "BNB Spot", price: "$594.10", change: 0.85, volume: "$420 Mn", isPositive: true },
  { symbol: "XRP", name: "XRP Spot", price: "$0.5420", change: -0.42, volume: "$310 Mn", isPositive: false },
];

export function useBinanceMarket(filter: "gainers" | "volume") {
  const [data, setData] = useState<LiveMarketAsset[]>(
    filter === "gainers" ? fallbackGainers : fallbackVolume
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("https://api.binance.com/api/v3/ticker/24hr", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("API yanıt vermedi");

      const json = await res.json();

      if (Array.isArray(json) && json.length > 0) {
        const usdtPairs = json.filter(
          (item: any) =>
            item.symbol.endsWith("USDT") &&
            parseFloat(item.quoteVolume) > 10_000_000 &&
            !item.symbol.includes("UP") &&
            !item.symbol.includes("DOWN")
        );

        let sorted = [];
        if (filter === "gainers") {
          sorted = [...usdtPairs].sort(
            (a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
          );
        } else {
          sorted = [...usdtPairs].sort(
            (a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume)
          );
        }

        const top5 = sorted.slice(0, 5).map((item: any) => {
          const changePercent = parseFloat(item.priceChangePercent);
          const price = parseFloat(item.lastPrice);
          const vol = parseFloat(item.quoteVolume);
          const cleanSymbol = item.symbol.replace("USDT", "");

          return {
            symbol: cleanSymbol,
            name: `${cleanSymbol} Spot`,
            price:
              price < 1
                ? `$${price.toFixed(4)}`
                : `$${price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
            change: parseFloat(changePercent.toFixed(2)),
            volume:
              vol >= 1_000_000_000
                ? `$${(vol / 1_000_000_000).toFixed(1)} Mr`
                : `$${(vol / 1_000_000).toFixed(0)} Mn`,
            isPositive: changePercent >= 0,
          };
        });

        if (top5.length > 0) {
          setData(top5);
          setLastUpdated(new Date());
        }
      }
    } catch (err) {
      // Ağ hatası veya rate limit durumunda listeyi boş bırakmayıp fallback verisini korur
      setData(filter === "gainers" ? fallbackGainers : fallbackVolume);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, lastUpdated, refetch: fetchData };
}