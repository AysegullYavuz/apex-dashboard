import type { ChartDataPoint, TimeRange } from "../types";

export const chartRangeData: Record<TimeRange, ChartDataPoint[]> = {
  "1M": [
    { date: "01 Eki", value: 118400, benchmark: 115200 },
    { date: "05 Eki", value: 119850, benchmark: 115800 },
    { date: "10 Eki", value: 121200, benchmark: 116400 },
    { date: "15 Eki", value: 120900, benchmark: 117000 },
    { date: "20 Eki", value: 122800, benchmark: 117500 },
    { date: "25 Eki", value: 123950, benchmark: 118200 },
    { date: "30 Eki", value: 124850, benchmark: 118900 },
  ],
  "6M": [
    { date: "May", value: 92400, benchmark: 94000 },
    { date: "Haz", value: 98100, benchmark: 97500 },
    { date: "Tem", value: 104500, benchmark: 101200 },
    { date: "Ağu", value: 111300, benchmark: 106800 },
    { date: "Eyl", value: 118900, benchmark: 112400 },
    { date: "Eki", value: 124850, benchmark: 118900 },
  ],
  "1Y": [
    { date: "Kas", value: 78000, benchmark: 82000 },
    { date: "Oca", value: 84500, benchmark: 87000 },
    { date: "Mar", value: 89200, benchmark: 91500 },
    { date: "May", value: 96400, benchmark: 98000 },
    { date: "Tem", value: 107800, benchmark: 105200 },
    { date: "Eyl", value: 119400, benchmark: 113000 },
    { date: "Eki", value: 124850, benchmark: 118900 },
  ],
  ALL: [
    { date: "2023 Q1", value: 45000, benchmark: 52000 },
    { date: "2023 Q3", value: 62000, benchmark: 68000 },
    { date: "2024 Q1", value: 79000, benchmark: 84000 },
    { date: "2024 Q3", value: 98500, benchmark: 99000 },
    { date: "2025 Q1", value: 112000, benchmark: 109000 },
    { date: "2025 Q3", value: 124850, benchmark: 118900 },
  ],
};