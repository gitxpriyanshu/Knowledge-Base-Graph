"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings, LayoutTemplate, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  layoutDirection: 'LR' | 'TB';
  onLayoutChange: (dir: 'LR' | 'TB') => void;
}

export function SettingsModal({ isOpen, onClose, layoutDirection, onLayoutChange }: Props) {
  const [dir, setDir] = useState<'LR' | 'TB'>(layoutDirection);

  const handleApply = () => {
    onLayoutChange(dir);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[400px] bg-[#0B0F1A] border-[#3b82f6]/20 text-slate-100 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Settings className="w-5 h-5 text-[#3b82f6]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#00f0ff]">
              Graph Settings
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <Label className="text-xs text-slate-400 uppercase font-bold tracking-widest flex items-center gap-1 mb-3">
              <LayoutTemplate className="w-3 h-3" /> Layout Direction
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {(['LR', 'TB'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => setDir(option)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    dir === option
                      ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {/* Direction icon */}
                  <div className="relative w-12 h-10 flex items-center justify-center">
                    {option === 'LR' ? (
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded border-2 border-current" />
                        <div className="w-5 h-px bg-current" />
                        <div className="w-4 h-4 rounded border-2 border-current" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-4 h-4 rounded border-2 border-current" />
                        <div className="h-4 w-px bg-current" />
                        <div className="w-4 h-4 rounded border-2 border-current" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold">{option === 'LR' ? 'Left → Right' : 'Top → Bottom'}</span>
                  {dir === option && <CheckCircle className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-slate-800 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800">
            Cancel
          </Button>
          <Button onClick={handleApply} className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white border-0">
            Apply Layout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
