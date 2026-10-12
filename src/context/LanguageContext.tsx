import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "tr" | "en";

export const translations = {
  tr: {
    // Header
    searchPlaceholder: "Komut veya varlık ara...",
    live: "Canlı",
    notifications: "Bildirimler",
    newBadge: "yeni",
    markAllRead: "Okundu yap",
    profileSettings: "Profil Ayarları",
    apiKeys: "API Anahtarları (Binance)",
    terminalPrefs: "Terminal Tercihleri",
    logout: "Oturumu Kapat",
    
    // Dashboard Header
    mainTitle: "Finansal Komuta Merkezi",
    mainSubtitle: "Portföy dağılımı, gerçek zamanlı piyasa hareketleri ve operasyonel nakit akışı.",
    activePeriod: "Aktif Dönem:",
    
    // Metric Cards
    netWorth: "Net Portföy Değeri",
    monthlyInflow: "Aylık Giriş (Nakit Akışı)",
    monthlyOutflow: "Aylık Harcama",
    annualRoi: "Yıllık Getiri Oranı (ROI)",
    vsLastMonth: "Geçen aya göre",
    dataLive: "Veri güncel",
    
    // Charts
    growthAnalysis: "Portföy Büyüme Analizi",
    growthSubtitle: "S&P 500 benchmark performansı ile karşılaştırmalı varlık eğrisi.",
    assetAllocation: "Varlık Dağılımı",
    assetSubtitle: "Portföyün risk ve varlık sınıflarına göre dengeli dağılımı.",
    assetClasses: "Varlık Sınıfı",
    totalAssets: "Toplam Varlık",
    share: "Pay",
    portfolioTotal: "Portföy",
    
    // Market Leaders
    marketLeaders: "Piyasa Liderleri",
    topGainers: "En Çok Yükselenler",
    volumeLeaders: "Hacim Liderleri",
    volume24h: "24s Hacim:",
    
    // Transactions
    txTitle: "Finansal Hareketler ve Kayıtlar",
    txSubtitle: "Satıra tıklayarak işlem makbuzunu ve detaylarını inceleyebilirsiniz",
    recordsListed: "kayıt listelendi",
    addTxBtn: "+ Yeni İşlem Ekle",
    txSearchPlaceholder: "Başlık veya kategori ara...",
    all: "Tümü",
    income: "Gelir",
    expense: "Gider",
    investment: "Yatırım",
    completed: "Tamamlandı",
    pending: "Beklemede",
    noRecords: "Kriterlere uygun kayıt bulunamadı.",
    
    // Drawer
    txSettlement: "İşlem Mutabakatı",
    settlementStatus: "Mutabakat Durumu",
    approved: "Onaylandı",
    category: "Kategori",
    recordTime: "Kayıt Zamanı",
    movementType: "Hareket Türü",
    verificationHash: "Doğrulama Hash",
    deleteRecord: "Kayıttan Sil",
    close: "Kapat",
  },
  en: {
    // Header
    searchPlaceholder: "Search command or asset...",
    live: "Live",
    notifications: "Notifications",
    newBadge: "new",
    markAllRead: "Mark as read",
    profileSettings: "Profile Settings",
    apiKeys: "API Keys (Binance)",
    terminalPrefs: "Terminal Preferences",
    logout: "Log Out",
    
    // Dashboard Header
    mainTitle: "Financial Command Center",
    mainSubtitle: "Portfolio allocation, real-time market action, and operational cash flow.",
    activePeriod: "Active Period:",
    
    // Metric Cards
    netWorth: "Total Net Worth",
    monthlyInflow: "Monthly Inflow (Cash Flow)",
    monthlyOutflow: "Monthly Expenses",
    annualRoi: "Annual ROI Rate",
    vsLastMonth: "vs last month",
    dataLive: "Live sync",
    
    // Charts
    growthAnalysis: "Portfolio Growth Analysis",
    growthSubtitle: "Comparative asset curve benchmarked against S&P 500.",
    assetAllocation: "Asset Allocation",
    assetSubtitle: "Balanced distribution across asset classes and risk profiles.",
    assetClasses: "Asset Classes",
    totalAssets: "Total Assets",
    share: "Share",
    portfolioTotal: "Portfolio",
    
    // Market Leaders
    marketLeaders: "Market Leaders",
    topGainers: "Top Gainers",
    volumeLeaders: "Volume Leaders",
    volume24h: "24h Volume:",
    
    // Transactions
    txTitle: "Financial Records & Ledger",
    txSubtitle: "Click on any transaction to inspect verification receipt and details",
    recordsListed: "records listed",
    addTxBtn: "+ Add New Transaction",
    txSearchPlaceholder: "Search title or category...",
    all: "All",
    income: "Income",
    expense: "Expense",
    investment: "Investment",
    completed: "Completed",
    pending: "Pending",
    noRecords: "No matching records found.",
    
    // Drawer
    txSettlement: "Transaction Settlement",
    settlementStatus: "Settlement Status",
    approved: "Settled",
    category: "Category",
    recordTime: "Timestamp",
    movementType: "Transaction Type",
    verificationHash: "Verification Hash",
    deleteRecord: "Delete Record",
    close: "Close",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations.tr;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("apex-lang") as Language | null;
    return saved === "en" || saved === "tr" ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("apex-lang", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "tr" ? "en" : "tr"));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};