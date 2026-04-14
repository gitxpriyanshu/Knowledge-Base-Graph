"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, MousePointer, Layers, GitMerge, Move, Trash2, RotateCcw, ZoomIn } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; }

const shortcuts = [
  { icon: <MousePointer className="w-4 h-4 text-[#00f0ff]" />, action: 'Click Node', desc: 'Select and open Node Detail Panel' },
  { icon: <Layers className="w-4 h-4 text-[#a78bfa]" />, action: 'Click Background', desc: 'Deselect — clear all highlights' },
  { icon: <Move className="w-4 h-4 text-[#3b82f6]" />, action: 'Drag Node', desc: 'Reposition and save node location' },
  { icon: <ZoomIn className="w-4 h-4 text-[#00f0ff]" />, action: 'Scroll Wheel', desc: 'Zoom in / zoom out canvas' },
  { icon: <GitMerge className="w-4 h-4 text-[#a78bfa]" />, action: '+ Node / + Edge', desc: 'Add new nodes or edges to the graph' },
  { icon: <Trash2 className="w-4 h-4 text-red-400" />, action: 'Terminate Node', desc: 'Delete node and all its connected edges' },
  { icon: <RotateCcw className="w-4 h-4 text-orange-400" />, action: 'Reboot Matrix', desc: 'Reset to seed data, clear localStorage' },
];

export function HelpModal({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[480px] bg-[#0B0F1A] border-[#a78bfa]/20 text-slate-100 shadow-[0_0_50px_rgba(167,139,250,0.1)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <HelpCircle className="w-5 h-5 text-[#a78bfa]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a78bfa] to-[#00f0ff]">
              How to Use
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-[#a78bfa]/20 transition-colors">
              <div className="mt-0.5 shrink-0">{s.icon}</div>
              <div>
                <p className="text-sm font-semibold text-white">{s.action}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 p-3 rounded-xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 text-xs text-slate-400">
          💡 <span className="text-slate-300 font-medium">Pro tip:</span> All changes auto-save to <span className="font-mono text-[#00f0ff]">localStorage</span> instantly — no save button needed.
        </div>

        <Button onClick={onClose} className="mt-2 w-full bg-[#a78bfa]/20 hover:bg-[#a78bfa]/30 border border-[#a78bfa]/30 text-[#a78bfa]">
          Got it
        </Button>
      </DialogContent>
    </Dialog>
  );
}
