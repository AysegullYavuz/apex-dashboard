import React, { useState, useEffect } from "react";
import { Search, PlusCircle, Download, TrendingUp, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { exportTransactionsToCsv } from "../../lib/exportCsv";
import type { Transaction } from "../../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddModal: () => void;
  transactions: Transaction[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenAddModal,
  transactions,
}) => {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    {
      id: "add-tx",
      title: language === "tr" ? "Yeni Varlık / İşlem Ekle" : "Add New Asset / Transaction",
      category: language === "tr" ? "İşlem" : "Action",
      icon: PlusCircle,
      action: () => {
        onClose();
        onOpenAddModal();
      },
    },
    {
      id: "export-csv",
      title: language === "tr" ? "Portföyü CSV Olarak Dışa Aktar" : "Export Portfolio as CSV",
      category: language === "tr" ? "Rapor" : "Report",
      icon: Download,
      action: () => {
        exportTransactionsToCsv(transactions);
        onClose();
      },
    },
    {
      id: "compare-sp500",
      title: language === "tr" ? "S&P 500 Benchmark Karşılaştır" : "Compare S&P 500 Benchmark",
      category: language === "tr" ? "Analiz" : "Analytics",
      icon: TrendingUp,
      action: () => {
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-2.5 px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/80">
          <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder={language === "tr" ? "Bir komut yazın veya arayın..." : "Type a command or search..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="py-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-400 font-mono">
              {language === "tr" ? "Eşleşen komut bulunamadı." : "No matching commands found."}
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <cmd.icon className="h-4 w-4 text-zinc-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                  <span className="font-medium text-zinc-900 dark:text-white">{cmd.title}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-3 pt-2 pb-1 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
          <span>{language === "tr" ? "Seçmek için tıkla" : "Click to select"}</span>
          <span className="rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 text-[10px]">
            ESC
          </span>
        </div>
      </div>
    </div>
  );
};