"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RotateCcw, Box, Search, BarChart2, Download, HelpCircle, Activity, Settings, GitBranch, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
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
import { toast } from 'sonner';

interface Props {
  onAddNode: () => void;
  onAddEdge: () => void;
  layoutDirection: 'LR' | 'TB';
  onLayoutChange: (dir: 'LR' | 'TB') => void;
  pulsing: boolean;
  onTogglePulse: () => void;
}

export function Toolbar({ onAddNode, onAddEdge, layoutDirection, onLayoutChange, pulsing, onTogglePulse }: Props) {
  const { initGraph, nodes, edges, searchQuery, setSearchQuery } = useGraphStore();

  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleReset = () => {
    localStorage.removeItem('knowledge-graph');
    initGraph();
    setResetDialogOpen(false);
    toast.success("Knowledge Matrix Reinitialized", {
      description: "Baseline topology and cache have been purged successfully.",
      duration: 3000,
    });
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
        className="fixed top-0 w-full z-[100] flex items-center justify-between px-4 md:px-6"
        style={{
          height: '64px',
          backgroundColor: 'rgba(11, 15, 26, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.15)'
        }}
      >
        {/* Brand & Stats Panel */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0 relative z-10 h-full">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-[#00f0ff] hover:bg-[#00f0ff]/10"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-[#00f0ff]/10 p-1.5 md:p-2 rounded-xl border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <GitBranch className="w-4 h-4 md:w-5 md:h-5 text-[#00f0ff]" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-sm md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wider uppercase truncate max-w-[150px] md:max-w-none">
                Knowledge Base Graphs
              </h1>
              <div className="flex items-center gap-2 text-[10px] text-[#a78bfa] font-mono tracking-widest uppercase">
                <span>{nodes.length} NDE</span>
                <div className="w-1 h-1 rounded-full bg-[#3b82f6]"></div>
                <span>{edges.length} EDG</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800">
            <Box className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
              {layoutDirection === 'LR' ? 'Left → Right' : 'Top → Bottom'}
            </span>
          </div>
        </div>

        {/* Desktop Search Hub */}
        <div className="hidden lg:flex flex-1 justify-center max-w-md mx-6 relative z-10 h-full items-center">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00f0ff] transition-colors" />
            <Input
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 bg-[#0F172A]/80 border-[#3b82f6]/20 text-slate-200 placeholder:text-slate-600 focus-visible:ring-[#00f0ff]/40 focus-visible:border-[#00f0ff]/60 h-10 rounded-xl shadow-inner transition-all"
            />
          </div>
        </div>

        {/* Action Suite - Desktop */}
        <div className="hidden lg:flex items-center gap-6 shrink-0 relative z-10 h-full">
          <div className="flex items-center gap-2 border-r border-[#3b82f6]/20 pr-6 h-full">
            <Button variant="outline" onClick={onAddNode} className="border-[#3b82f6]/30 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-blue-100 hover:text-white transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)] rounded-lg h-9">
              <Plus className="w-4 h-4 mr-2 text-[#00f0ff]" /> Node
            </Button>
            <Button variant="outline" onClick={onAddEdge} className="border-[#a78bfa]/30 bg-[#a78bfa]/10 hover:bg-[#a78bfa]/20 text-purple-100 hover:text-white transition-all shadow-[0_0_10px_rgba(167,139,250,0.1)] rounded-lg h-9">
              <Plus className="w-4 h-4 mr-2 text-[#a78bfa]" /> Edge
            </Button>
          </div>

          <div className="flex items-center gap-2 text-slate-400 h-full text-sm">
            <Button variant="ghost" size="icon" title="Analytics" onClick={() => setAnalyticsOpen(true)} className="rounded-lg hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] w-9 h-9"><BarChart2 className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" title="Pulse" onClick={onTogglePulse} className={`rounded-lg w-9 h-9 ${pulsing ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'hover:bg-[#00f0ff]/10 text-slate-400'}`}><Activity className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" title="Export JSON" onClick={handleExport} className="rounded-lg hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] w-9 h-9"><Download className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" title="Settings" onClick={() => setSettingsOpen(true)} className="rounded-lg hover:bg-[#a78bfa]/10 hover:text-[#a78bfa] w-9 h-9"><Settings className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" title="Help" onClick={() => setHelpOpen(true)} className="rounded-lg hover:bg-[#a78bfa]/10 hover:text-[#a78bfa] w-9 h-9"><HelpCircle className="w-5 h-5" /></Button>

            <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <AlertDialogTrigger 
                render={
                  <Button variant="ghost" size="icon" title="Reset Matrix" className="ml-1 rounded-lg border border-red-900/50 bg-red-950/30 text-red-400 hover:bg-red-900/50 transition-all w-9 h-9">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                } 
              />
              <AlertDialogContent className="bg-[#0B0F1A] border-red-500/20 text-slate-100 shadow-[0_0_50px_rgba(255,0,0,0.1)] rounded-2xl z-[250]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-400">Reboot Matrix?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    This will purge all local data and restore the baseline neural network. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800">Abort</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white border-none">
                    Execute Reboot
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Mobile Quick Actions (Node/Edge only) */}
        <div className="flex lg:hidden items-center gap-2">
          <Button variant="outline" size="icon" onClick={onAddNode} className="border-[#3b82f6]/40 bg-[#3b82f6]/10 text-blue-100 h-9 w-9"><Plus className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" onClick={onAddEdge} className="border-[#a78bfa]/40 bg-[#a78bfa]/10 text-purple-100 h-9 w-9"><Activity className="w-4 h-4" /></Button>
        </div>
      </header>

      {/* Mobile Tactical Sidebar Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0B0F1A] border-r border-[#00f0ff]/20 z-[120] p-6 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-6 h-6 text-[#00f0ff]" />
                  <span className="font-bold text-white uppercase tracking-tight">Main Command</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}><X className="w-6 h-6 text-slate-500" /></Button>
              </div>

              {/* Mobile Search */}
              <div className="relative mb-8 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00f0ff]" />
                <Input
                  placeholder="Search neurons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 bg-[#0F172A] border-slate-800 focus:border-[#00f0ff]/50 rounded-xl"
                />
              </div>

              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-600 tracking-[0.2em] px-2 mb-2">Systems</p>
                  <Button variant="ghost" onClick={() => { setAnalyticsOpen(true); setMenuOpen(false); }} className="w-full justify-start text-slate-300 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff]"><BarChart2 className="w-5 h-5 mr-3" /> Data Analytics</Button>
                  <Button variant="ghost" onClick={() => { onTogglePulse(); setMenuOpen(false); }} className={`w-full justify-start ${pulsing ? 'text-[#00f0ff]' : 'text-slate-300'}`}><Activity className="w-5 h-5 mr-3" /> Flow Pulse</Button>
                  <Button variant="ghost" onClick={() => { setSettingsOpen(true); setMenuOpen(false); }} className="w-full justify-start text-slate-300 hover:bg-[#a78bfa]/10 hover:text-[#a78bfa]"><Settings className="w-5 h-5 mr-3" /> Preferences</Button>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-600 tracking-[0.2em] px-2 mb-2">Transmission</p>
                  <Button variant="ghost" onClick={() => { handleExport(); setMenuOpen(false); }} className="w-full justify-start text-slate-300"><Download className="w-5 h-5 mr-3" /> Export Brain</Button>
                  <Button variant="ghost" onClick={() => { setHelpOpen(true); setMenuOpen(false); }} className="w-full justify-start text-slate-300"><HelpCircle className="w-5 h-5 mr-3" /> Manual / Help</Button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setMenuOpen(false);
                    setResetDialogOpen(true);
                  }} 
                  className="w-full bg-red-950/40 border border-red-500/30 text-red-100 hover:bg-red-600"
                >
                  <RotateCcw className="w-4 h-4 mr-3" /> Reboot Matrix
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
