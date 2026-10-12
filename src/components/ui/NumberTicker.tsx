import React, { useEffect, useState } from "react";

interface NumberTickerProps {
  value: number;
  duration?: number;
  decimalPlaces?: number;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  duration = 1000,
  decimalPlaces = 2,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing fonksiyonu: yavaşlayarak duran akış (easeOutExpo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startValue + (value - startValue) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {displayValue.toLocaleString("tr-TR", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })}
    </span>
  );
};