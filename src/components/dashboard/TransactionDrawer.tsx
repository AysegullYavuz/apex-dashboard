import React, { useState } from "react";
import {
  X,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Hash,
  Tag,
  Calendar,
  DollarSign,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import type { Transaction } from "../../types";

interface TransactionDrawerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteTransaction?: (id: string) => void;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({
  transaction,
  isOpen,
  onClose,
  onDeleteTransaction,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !transaction) return null;

  const isIncome = transaction.amount > 0;
  const mockHash = `0x${transaction.id.replace(/[^a-zA-Z0-9]/g, "")}9a7b4c8f2e`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(mockHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (onDeleteTransaction) {
      onDeleteTransaction(transaction.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Arka plan kapatma */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Sağdan Açılan Panel */}
      <div className="relative z-10 h-full w-full max-w-md border-l border-zinc-800 bg-[#0d0d11] p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
        <div>
          {/* Üst Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                İşlem Mutabakatı
              </span>
              <span className="text-[11px] font-mono bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                {transaction.id}
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Vurgulu Tutar Kartı */}
          <div className="my-6 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 text-center">
            <div
              className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border ${
                isIncome
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-300"
              }`}
            >
              {isIncome ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight text-white">
              {isIncome ? "+" : ""}${Math.abs(transaction.amount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-zinc-400 mt-1 font-medium">{transaction.title}</p>
          </div>

          {/* Yapılandırılmış Meta Veriler */}
          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" /> Mutabakat Durumu
              </span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {transaction.status === "completed" ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" /> Onaylandı
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 text-amber-400" /> Beklemede
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400 flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-zinc-500" /> Kategori
              </span>
              <span className="text-zinc-200 font-medium">{transaction.category}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" /> Kayıt Zamanı
              </span>
              <span className="text-zinc-300 font-mono text-[11px]">{transaction.date}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400 flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-zinc-500" /> Hareket Türü
              </span>
              <span className="text-zinc-200 font-mono text-[11px] uppercase">{transaction.type}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400 flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-zinc-500" /> Doğrulama Hash
              </span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-2 py-1 rounded border border-zinc-800 transition-colors cursor-pointer"
                title="Panoya Kopyala"
              >
                <span>{mockHash.slice(0, 10)}...</span>
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-zinc-500" />}
              </button>
            </div>
          </div>
        </div>

        {/* Aksiyon Barı (İptal / Kapat) */}
        <div className="pt-4 border-t border-zinc-800 flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Kayıttan Sil</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-semibold rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};