import React, { useState, useRef, useEffect } from "react";
import { Bell, Command, Shield, User, Settings, LogOut, Check, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../context/LanguageContext";

interface HeaderProps {
  onOpenCommand: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: "trade" | "alert" | "system";
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "NVIDIA temettü ödemesi hesabınıza geçti ($840,50).",
    time: "10 dk önce",
    read: false,
    type: "trade",
  },
  {
    id: "notif-2",
    title: "Bitcoin 24s hacim artışı %15 seviyesini aştı.",
    time: "1 saat önce",
    read: false,
    type: "alert",
  },
  {
    id: "notif-3",
    title: "Aylık portföy mutabakat raporu hazırlandı.",
    time: "Dün",
    read: true,
    type: "system",
  },
];

export const Header: React.FC<HeaderProps> = ({ onOpenCommand }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.12] bg-[#070709]/90 backdrop-blur-2xl transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
      <div className="max-w-[1560px] mx-auto flex h-20 items-center justify-between px-6 sm:px-10">
        {/* Sol Logo ve Terminal Durumu (Daha Büyük) */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono font-bold text-base shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            &gt;_
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-bold tracking-tight text-white text-base">
              APEX OS
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-mono font-semibold text-emerald-400 border border-emerald-500/25 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {t.live}
            </span>
          </div>
        </div>

        {/* Orta Arama Barı (Daha Geniş ve Ferah) */}
        <button
          onClick={onOpenCommand}
          className="hidden sm:flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/70 hover:border-white/20 hover:bg-zinc-800/80 px-4 py-2.5 text-xs text-zinc-400 hover:text-zinc-200 transition-all w-80 lg:w-96 justify-between cursor-pointer shadow-inner"
        >
          <span className="flex items-center gap-2.5">
            <Command className="h-4 w-4 text-zinc-400" />
            <span className="font-medium">{t.searchPlaceholder}</span>
          </span>
          <kbd className="rounded-md border border-white/10 bg-zinc-800 px-2 py-0.5 text-[11px] font-mono text-zinc-300 shadow-xs">
            Ctrl+K
          </kbd>
        </button>

        {/* Sağ Butonlar (Daha Büyük İkonlar & Padding) */}
        <div className="flex items-center gap-3">
          {/* Dil Değiştirici Buton */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 hover:border-white/20 text-zinc-200 text-xs font-mono font-semibold transition-all cursor-pointer shadow-xs"
            title="Dili Değiştir / Change Language"
          >
            <Globe className="h-4 w-4 text-zinc-400" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Tema Değiştirme Butonu */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 hover:border-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs"
            title={theme === "dark" ? "Açık Temaya Geç" : "Koyu Temaya Geç"}
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-zinc-300" />}
          </button>

          {/* Bildirim Menüsü */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen((prev) => !prev);
                setIsProfileOpen(false);
              }}
              className="relative p-2.5 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 hover:border-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs"
              title={t.notifications}
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070709]" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-88 rounded-2xl border border-white/15 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{t.notifications}</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                        {unreadCount} {t.newBadge}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" /> {t.markAllRead}
                    </button>
                  )}
                </div>

                <div className="mt-2 divide-y divide-white/5 max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`py-3 px-2 rounded-xl transition-colors ${
                        !notif.read ? "bg-white/[0.03]" : "opacity-75"
                      }`}
                    >
                      <p className="text-xs text-zinc-200 leading-snug">{notif.title}</p>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profil Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setIsProfileOpen((prev) => !prev);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-zinc-900/60 p-1.5 pl-3 hover:bg-zinc-800 hover:border-white/20 transition-all cursor-pointer shadow-xs"
            >
              <span className="text-xs font-mono font-semibold text-zinc-200">AY</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold font-mono shadow-xs">
                AY
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-white/15 bg-zinc-950/95 p-2.5 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-3 py-2.5 border-b border-white/10 mb-1.5">
                  <p className="text-sm font-semibold text-white">Ayşegül Yavuz</p>
                  <p className="text-[11px] font-mono text-zinc-400">Lead Engineer</p>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                  >
                    <User className="h-4 w-4 text-zinc-400" />
                    <span>{t.profileSettings}</span>
                  </button>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                  >
                    <Shield className="h-4 w-4 text-zinc-400" />
                    <span>{t.apiKeys}</span>
                  </button>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-zinc-400" />
                    <span>{t.terminalPrefs}</span>
                  </button>
                  <div className="pt-1.5 border-t border-white/10 mt-1">
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};