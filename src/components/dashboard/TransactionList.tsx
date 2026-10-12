import React, { useState, useMemo } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import type { Transaction } from "../../types";

interface TransactionListProps {
  transactions: Transaction[];
  onOpenAddModal: () => void;
  onDeleteTransaction: (id: string) => void;
  onSelectTransaction: (transaction: Transaction) => void;
}

const ITEMS_PER_PAGE = 4;

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onOpenAddModal,
  onDeleteTransaction,
  onSelectTransaction,
}) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "income" | "expense" | "investment">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const locale = language === "tr" ? "tr-TR" : "en-US";

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "ALL" || tx.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  // Filtre veya arama değiştiğinde ilk sayfaya dön
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const translateCategory = (cat: string) => {
    if (language === "en") {
      if (cat === "Yatırım") return "Investment";
      if (cat === "Operasyon") return "Operations";
      if (cat === "Gelir") return "Revenue";
      if (cat === "Yazılım") return "Software / SaaS";
    }
    return cat;
  };

  const translateDate = (d: string) => {
    if (language === "en") {
      return d
        .replace("Bugün", "Today")
        .replace("Dün", "Yesterday")
        .replace("Eki", "Oct")
        .replace("Kas", "Nov");
    }
    return d;
  };

  return (
    <div className="p-6">
      {/* Üst Başlık ve Yeni Ekle Butonu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-semibold text-white">{t.txTitle}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {t.txSubtitle} ({filteredTransactions.length} {t.recordsListed}).
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="self-start sm:self-auto text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-all border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-xl cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.15)]"
        >
          {t.addTxBtn}
        </button>
      </div>

      {/* Arama ve Filtre Kontrolleri */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 pb-4 border-b border-white/[0.08]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder={t.txSearchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/25 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-xl p-1 text-xs">
          <Filter className="h-3.5 w-3.5 text-zinc-500 mx-1.5 hidden sm:block" />
          {(
            [
              { label: t.all, val: "ALL" },
              { label: t.income, val: "income" },
              { label: t.expense, val: "expense" },
              { label: t.investment, val: "investment" },
            ] as const
          ).map((item) => (
            <button
              key={item.val}
              onClick={() => setFilterType(item.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filterType === item.val
                  ? "bg-zinc-800 text-white shadow-xs border border-white/10"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* İşlem Listesi veya Boş Durum (Empty State) */}
      <div className="divide-y divide-white/[0.06] min-h-[260px]">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-3 text-zinc-500">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-zinc-300">
              {language === "tr" ? "Kayıt bulunamadı" : "No records found"}
            </p>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
              {searchTerm
                ? (language === "tr" ? `"${searchTerm}" aramasına uygun işlem yok.` : `No transactions match "${searchTerm}".`)
                : (language === "tr" ? "Bu filtreleme kategorisinde henüz işlem bulunmuyor." : "No transactions in this category yet.")}
            </p>
          </div>
        ) : (
          paginatedTransactions.map((tx) => {
            const isIncome = tx.amount > 0;
            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="group flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      isIncome
                        ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                        : "bg-white/[0.04] border-white/10 text-zinc-400"
                    }`}
                  >
                    {isIncome ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                      {tx.title}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                      {translateCategory(tx.category)} • {translateDate(tx.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={`text-xs font-bold font-mono tracking-tight ${
                        isIncome ? "text-emerald-400" : "text-white"
                      }`}
                    >
                      {isIncome ? "+" : ""}$
                      {Math.abs(tx.amount).toLocaleString(locale, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {tx.status === "completed" ? (
                        <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" /> {t.completed}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                          <Clock className="h-3 w-3" /> {t.pending}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTransaction(tx);
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="İncele"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTransaction(tx.id);
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alt Sayfalama Barı (Pagination) */}
      {filteredTransactions.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/[0.08] text-xs font-mono text-zinc-400">
          <span>
            {language === "tr"
              ? `Sayfa ${currentPage} / ${totalPages}`
              : `Page ${currentPage} of ${totalPages}`}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};