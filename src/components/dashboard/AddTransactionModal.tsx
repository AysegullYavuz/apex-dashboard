import React, { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import type { Transaction, TransactionCategory } from "../../types";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Transaction) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TransactionCategory>("Yatırım");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense" | "investment">("income");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const parsedAmount = parseFloat(amount);
    const finalAmount = type === "expense" ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title,
      category,
      amount: finalAmount,
      type,
      date: "Şimdi",
      status: "completed",
    };

    onAddTransaction(newTx);
    setTitle("");
    setAmount("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-foreground">Yeni Finansal Hareket</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-zinc-500 hover:text-foreground hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-400 block mb-1.5">İşlem Türü</label>
            <div className="grid grid-cols-3 gap-2">
              {(["income", "expense", "investment"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    type === t
                      ? "bg-zinc-800 text-foreground border-emerald-500/50 shadow-sm"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-foreground"
                  }`}
                >
                  {t === "income" ? "Gelir" : t === "expense" ? "Gider" : "Yatırım"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 block mb-1.5">Başlık / Açıklama</label>
            <input
              type="text"
              required
              placeholder="Örn: Apple Hisse Alımı, Freelance Gelir"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-foreground placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">Tutar ($)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-foreground placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-foreground focus:border-emerald-500/50 focus:outline-none"
              >
                <option value="Yatırım">Yatırım</option>
                <option value="Gelir">Gelir</option>
                <option value="Operasyon">Operasyon</option>
                <option value="Yazılım">Yazılım</option>
                <option value="Maaş">Maaş</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-foreground rounded-lg transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20 font-semibold cursor-pointer"
            >
              İşlemi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};