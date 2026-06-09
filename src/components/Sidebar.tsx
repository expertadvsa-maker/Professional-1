import React from "react";
import { Sparkles, Plus, Edit, X, Key, Settings } from "lucide-react";
import { ChatThread, ContactInfo } from "../types";

/**
 * SidebarProps defines the handlers and state required to render the navigation sidebar.
 */
interface SidebarProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  companyInfo: ContactInfo;
  soundEnabled: boolean;
  isOpen: boolean;
  onClose: () => void;
  onCreateNewThread: () => void;
  onSelectThread: (id: string) => void;
  onDeleteThread: (id: string, e: React.MouseEvent) => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
}

/**
 * Sidebar is a beautifully styled floating navigation panel designed to mirror
 * high-level vector design workstation toolbars. It contains no simulation.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  threads,
  activeThreadId,
  companyInfo,
  soundEnabled,
  isOpen,
  onClose,
  onCreateNewThread,
  onSelectThread,
  onDeleteThread,
  onOpenSettings,
  onToggleSound,
}) => {
  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity" 
        />
      )}
      
      <aside className={`fixed lg:static top-0 right-0 z-50 w-[15rem] flex flex-col shrink-0 p-4 h-full select-none justify-between text-right bg-[#FAF9F5] lg:bg-transparent transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full lg:translate-x-0"}`} dir="rtl">
      <div className="space-y-6">
        
        {/* Main agency brand indicator */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E293B] to-[#475569] flex items-center justify-center shadow-sm shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-800 tracking-wide">الـوكـيـل الإبـداعـي</h1>
            <span className="text-[10px] text-slate-500 block font-medium">الأفـضـل فـي الـمـلـمـتـر</span>
          </div>
        </div>

        {/* New Chat Button: Sleek pencil layout */}
        <button
          onClick={onCreateNewThread}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-800/5 hover:bg-slate-800/10 text-xs font-bold text-slate-800 rounded-full transition-all duration-300 transform active:scale-95 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-slate-600 ml-1 shrink-0" />
            دردشة جديدة
          </span>
          <Edit className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* RECENT MESSAGES THREADS TIMELINE */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-bold text-slate-400 block px-2 tracking-wider">سجل المحادثات الإبداعية</span>
          <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
            {threads.map((t) => {
              const isActive = t.id === activeThreadId;
              return (
                <div
                  key={t.id}
                  onClick={() => onSelectThread(t.id)}
                  className={`group w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-200/80 text-slate-800 font-bold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  <span className="truncate max-w-[130px] text-right font-medium">
                    {t.title}
                  </span>
                  <button
                    onClick={(e) => onDeleteThread(t.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:bg-slate-250 p-1 rounded transition-all text-slate-400 hover:text-red-500 cursor-pointer"
                    title="حذف الدردشة"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* BOTTOM SIDEBAR FOOTER */}
      <div className="space-y-2">
        
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400 animate-pulse ml-1 shrink-0" />
            تراخيص ومفاتيح الربط
          </span>
          <Settings className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <div className="flex items-center justify-between px-2 text-[10.5px]">
          <span className="text-slate-500 font-medium">مساعد المليمتر النشط</span>
          <button
            onClick={onToggleSound}
            className={`text-xs font-semibold hover:underline transition-all cursor-pointer ${
              soundEnabled ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {soundEnabled ? "🔊 صوت مفعّل" : "🔇 صامت"}
          </button>
        </div>

        <div className="px-2 pt-2">
          <span className="text-[10px] text-slate-600 font-extrabold truncate block">
            {companyInfo.name}
          </span>
          <span className="text-[8.5px] text-slate-400 block truncate">
            {companyInfo.email}
          </span>
        </div>
      </div>
    </aside>
    </>
  );
};
