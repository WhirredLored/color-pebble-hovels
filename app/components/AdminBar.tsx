import React from "react";
import { Pencil, LogOut, RotateCcw, ImagePlus, Save, Eye } from "lucide-react";

interface AdminBarProps {
  onLogout: () => void;
  onReset: () => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  galleryCount: number;
}

export function AdminBar({ onLogout, onReset, onSave, hasUnsavedChanges, galleryCount }: AdminBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl shadow-amber-500/10 text-xs font-semibold">
      {/* Edit mode indicator */}
      <div className="flex items-center gap-2 text-amber-400 border-r border-slate-700 pr-3">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <Pencil className="w-3.5 h-3.5" />
        <span className="uppercase tracking-widest text-[10px]">Admin Edit Mode</span>
      </div>

      {/* Gallery count */}
      <div className="text-slate-400 border-r border-slate-700 pr-3">
        <span className="text-white font-bold">{galleryCount}</span> Gallery Items
      </div>

      {/* Save Changes */}
      <button
        onClick={onSave}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
          hasUnsavedChanges
            ? "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/30"
            : "bg-slate-800 text-slate-400 cursor-default"
        }`}
        disabled={!hasUnsavedChanges}
      >
        <Save className="w-3.5 h-3.5" />
        {hasUnsavedChanges ? "Save Changes" : "All Saved"}
      </button>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-800 text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/20 transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset Defaults
      </button>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all"
      >
        <LogOut className="w-3.5 h-3.5" />
        Exit Edit Mode
      </button>
    </div>
  );
}
