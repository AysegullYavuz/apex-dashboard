import type { Transaction } from "../types";

export function exportTransactionsToCsv(transactions: Transaction[], filename = "apex_transactions.csv") {
  if (!transactions.length) return;

  const headers = ["ID", "Title", "Amount (USD)", "Category", "Date", "Status", "Type"];
  
  const rows = transactions.map((t) => [
    t.id,
    `"${t.title.replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
    `"${t.category}"`,
    `"${t.date}"`,
    t.status,
    t.type,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}