# Apex OS — Financial Command Center

Apex OS is a responsive, desktop-optimized fintech dashboard built with React 18, TypeScript, and Tailwind CSS v4. The application is designed around a Linear- and Raycast-inspired interface language, pairing high visual contrast with real-time financial telemetry, client-side data filtering, and multi-language support.

---

## Overview

Modern trading terminals and financial operations suites demand both immediate readability and robust state handling. Apex OS organizes complex account telemetry into structured, glanceable modules: live FX and commodity sparklines, asset allocation breakdowns, real-time cryptocurrency feeds via Binance REST endpoints, and a paginated transaction ledger.

The dashboard defaults to English with localized numerical formatting and features a persistent Dark/Light mode engine tailored for high-density workspaces.

---

## Key Features

- **Linear-Style Depth & Ambient Lighting:** Custom layered border highlights, inset lighting accents, and glassmorphic panels engineered for 1560px ultrawide displays.
- **Bi-Directional Localization (EN / TR):** Zero-dependency dictionary architecture via React Context. Automatically formats currency delimiters and decimal markers according to the active locale (`$113,658.10` vs `$113.658,10`).
- **Live Market Radar (Binance API):** Fetches 24-hour volume and price variance for USDT pairs directly from Binance's public REST endpoints. Includes network timeouts and deterministic fallback mock data to prevent empty-state lockups during rate-limiting or CORS failures.
- **Micro Sparkline Pulse:** Lightweight inline SVG vector curves illustrating 24-hour directional momentum across Forex, Precious Metals, and Crypto pairs.
- **Interactive Portfolio Visualizations:** Dynamic area performance curves and inner-radius-optimized donut charts powered by Recharts, preventing label overlap and tooltip clipping.
- **Ledger Management & Client-Side Pagination:** Transaction table featuring real-time keyword search, status filtering, page splitting (4 records/view), and an inspection slide-over drawer with transaction hashes.
- **Direct CSV Export:** In-memory CSV generation utilizing native JavaScript `Blob` APIs to export transaction state directly without server round-trips.
- **Command Palette:** Global modal navigation accessible via `Ctrl + K` / `Cmd + K`.

---

## Technical Architecture

| Layer | Solution | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 18 + Vite | Modular UI composition with rapid Hot Module Replacement |
| **Language** | TypeScript (Strict) | Static typing across market payloads, ledger items, and chart points |
| **Styling** | Tailwind CSS v4 | CSS variables and custom variant rules (`@custom-variant dark`) |
| **Data Visualization** | Recharts | Composable SVG Area and Donut charts |
| **Icons** | Lucide React | Consistent vector iconography |
| **Data Ingestion** | Native Fetch API | Handled through custom hooks with `AbortController` timeouts |

---

## Directory Structure

```text
src/
├── components/
│   ├── charts/        # Portfolio growth area chart & asset donut chart
│   ├── dashboard/     # Metric cards, live market radar, ticker & ledger table
│   ├── layout/        # Header navigation, language/theme controls & profile panel
│   └── ui/            # Command palette, confirmation modals & slide-over drawer
├── context/           # LanguageContext (Locale persistence & translations)
├── hooks/             # useTheme (Tailwind v4 integration), useBinanceMarket
├── lib/               # Utility functions (exportCsv, numeric formatters)
├── types/             # Shared TypeScript models and interfaces
├── data/              # Default dataset, historical points & fallbacks
├── App.tsx            # Main shell, global state & keyboard listener
└── main.tsx           # Application root mounting