"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RotateCcw, Box, Search, BarChart2, Download, HelpCircle, Activity, Settings, GitBranch } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGraphStore } from '@/store/useGraphStore';
import { AnalyticsModal } from '@/components/AnalyticsModal';
import { HelpModal } from '@/components/HelpModal';
import { SettingsModal } from '@/components/SettingsModal';

interface Props {
  onAddNode: () => void;
  onAddEdge: () => void;
  layoutDirection: 'LR' | 'TB';
  onLayoutChange: (dir: 'LR' | 'TB') => void;
  pulsing: boolean;
  onTogglePulse: () => void;
}

export function Toolbar({ onAddNode, onAddEdge, layoutDirection, onLayoutChange, pulsing, onTogglePulse }: Props) {
  const { initGraph, nodes, edges } = useGraphStore();

  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleReset = () => {
    localStorage.removeItem('knowledge-graph');
    initGraph();
  };

  // Export graph as downloadable JSON
  const handleExport = () => {
    const data = { nodes, edges, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-graph-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header
        className="fixed top-0 w-full z-[100] flex items-center justify-between px-6"
        style={{
          height: '64px',
          backgroundColor: 'rgba(11, 15, 26, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.15)'
        }}
      >
        {/* Brand & Stats Panel */}
        <div className="flex items-center gap-6 shrink-0 relative z-10 h-full">
          <div className="flex items-center gap-3">
            <div className="bg-[#00f0ff]/10 p-2 rounded-xl border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <GitBranch className="w-5 h-5 text-[#00f0ff]" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wider uppercase">Knowledge Base Graph</h1>
              <div className="flex items-center gap-2 text-[10px] text-[#a78bfa] font-mono tracking-widest uppercase">
                <span>{nodes.length} NDE</span>
                <div className="w-1 h-1 rounded-full bg-[#3b82f6]"></div>
                <span>{edges.length} EDG</span>
              </div>
            </div>
          </div>

          {/* State Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800">
            <Box className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span className="text-xs font-semibold text-slate-300">
              {layoutDirection === 'LR' ? 'Left → Right' : 'Top → Bottom'} Layout
            </span>
          </div>
        </div>

        {/* Center Search Hub - Now relative within the flex flow for better hit detection */}
        <div className="hidden lg:flex flex-1 justify-center max-w-md mx-6 relative z-10 h-full items-center">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00f0ff] transition-colors" />
            <Input
              placeholder="Search nodes... ( / )"
              value={useGraphStore(state => state.searchQuery)}
              onChange={(e) => useGraphStore.getState().setSearchQuery(e.target.value)}
              className="w-full pl-9 bg-[#0F172A]/80 border-[#3b82f6]/20 text-slate-200 placeholder:text-slate-600 focus-visible:ring-[#00f0ff]/40 focus-visible:border-[#00f0ff]/60 h-10 rounded-xl shadow-inner transition-all"
            />
          </div>
        </div>

        {/* Action Suite */}
        <div className="flex items-center gap-6 shrink-0 relative z-10 h-full">
          {/* Core Buttons */}
          <div className="flex items-center gap-2 border-r border-[#3b82f6]/20 pr-6 h-full">
            <Button variant="outline" onClick={onAddNode} className="border-[#3b82f6]/30 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-blue-100 hover:text-white transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)] rounded-lg h-9">
              <Plus className="w-4 h-4 mr-2 text-[#00f0ff]" /> + Node
            </Button>
            <Button variant="outline" onClick={onAddEdge} className="border-[#a78bfa]/30 bg-[#a78bfa]/10 hover:bg-[#a78bfa]/20 text-purple-100 hover:text-white transition-all shadow-[0_0_10px_rgba(167,139,250,0.1)] rounded-lg h-9">
              <Plus className="w-4 h-4 mr-2 text-[#a78bfa]" /> + Edge
            </Button>
          </div>

          {/* Tools Menu */}
          <div className="flex items-center gap-2 text-slate-400 h-full">
            {/* Analytics */}
            <Button
              variant="ghost"
              size="icon"
              title="Analytics"
              onClick={() => setAnalyticsOpen(true)}
              className="rounded-lg hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] transition-all w-9 h-9"
            >
              <BarChart2 className="w-5 h-5" />
            </Button>

            {/* Activity / Pulse toggle */}
            <Button
              variant="ghost"
              size="icon"
              title={pulsing ? 'Disable Edge Pulse' : 'Enable Edge Pulse'}
              onClick={onTogglePulse}
              className={`rounded-lg transition-all w-9 h-9 ${pulsing ? 'bg-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/30' : 'hover:bg-[#00f0ff]/10 hover:text-[#00f0ff]'}`}
            >
              <Activity className="w-5 h-5" />
            </Button>

            {/* Export JSON */}
            <Button
              variant="ghost"
              size="icon"
              title="Export Graph JSON"
              onClick={handleExport}
              className="rounded-lg hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] transition-all w-9 h-9"
            >
              <Download className="w-5 h-5" />
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              title="Settings"
              onClick={() => setSettingsOpen(true)}
              className="rounded-lg hover:bg-[#a78bfa]/10 hover:text-[#a78bfa] transition-all w-9 h-9"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* Help */}
            <Button
              variant="ghost"
              size="icon"
              title="Help"
              onClick={() => setHelpOpen(true)}
              className="rounded-lg hover:bg-[#a78bfa]/10 hover:text-[#a78bfa] transition-all w-9 h-9"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>

            {/* Reset / Reboot */}
            <AlertDialog>
              <AlertDialogTrigger
                title="Reset Graph"
                className="ml-1 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all border border-red-900/50 bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200 h-9 px-3 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
              >
                <RotateCcw className="w-4 h-4" />
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#0B0F1A] border-[#3b82f6]/30 text-slate-100 shadow-[0_0_50px_rgba(0,240,255,0.1)] rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">Reboot Matrix?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    This action purges local storage cache and injects the baseline protocol topology. Confirm restart sequence?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 border-t border-slate-800 pt-4">
                  <AlertDialogCancel className="bg-transparent border-[#3b82f6]/30 hover:bg-[#3b82f6]/10 text-slate-300">Abort</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-red-600/80 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-500/50">Execute Reboot</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Modals */}
      <AnalyticsModal isOpen={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        layoutDirection={layoutDirection}
        onLayoutChange={onLayoutChange}
      />
    </>
  );
}
