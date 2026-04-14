"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGraphStore } from '@/store/useGraphStore';
import { Check, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddEdgeModal({ isOpen, onClose }: Props) {
  const { addEdge, nodes } = useGraphStore();
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  // Reset fields when opened
  useEffect(() => {
     if (isOpen) {
         setSourceId('');
         setTargetId('');
         setLabel('');
         setError('');
     }
  }, [isOpen]);

  const handleClose = () => {
    setSourceId('');
    setTargetId('');
    setLabel('');
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    if (!sourceId || !targetId) {
      setError('Please select both a source and a target node.');
      return;
    }
    
    if (sourceId === targetId) {
      setError('A node cannot connect to itself.');
      return;
    }

    const finalLabel = label.trim() || 'relates to';
    addEdge(sourceId, targetId, finalLabel);
    handleClose();
  };

  const sourceNode = nodes.find(n => n.id === sourceId);
  const targetNode = nodes.find(n => n.id === targetId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-xl bg-[#0B0F1A] border-slate-800 text-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] to-[#a78bfa]">
            Establish Neural Link
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        <div className="grid gap-6 py-4">
          {/* Visual Link Overview */}
          <div className="flex items-center justify-center gap-4 py-4 px-2 bg-slate-900/50 rounded-2xl border border-slate-800/50">
            <div className={`flex-1 text-center p-3 rounded-xl border transition-all ${sourceId ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40' : 'bg-slate-900/50 border-dashed border-slate-700'}`}>
               <span className="text-xs text-slate-500 uppercase block mb-1">Source</span>
               <span className={sourceId ? 'text-white font-bold' : 'text-slate-600 italic'}>
                {sourceNode?.title || 'None Selected'}
               </span>
            </div>
            <ArrowRight className={`w-5 h-5 ${sourceId && targetId ? 'text-[#a78bfa] animate-pulse' : 'text-slate-700'}`} />
            <div className={`flex-1 text-center p-3 rounded-xl border transition-all ${targetId ? 'bg-[#a78bfa]/10 border-[#a78bfa]/40' : 'bg-slate-900/50 border-dashed border-slate-700'}`}>
               <span className="text-xs text-slate-500 uppercase block mb-1">Target</span>
               <span className={targetId ? 'text-white font-bold' : 'text-slate-600 italic'}>
                {targetNode?.title || 'None Selected'}
               </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Source Selection List */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider">Choose Source</Label>
              <div className="h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                {nodes.map(node => (
                  <button
                    key={`src-${node.id}`}
                    onClick={() => { setSourceId(node.id); if (targetId === node.id) setTargetId(''); setError(''); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${
                      sourceId === node.id 
                      ? 'bg-[#00f0ff]/20 text-white border border-[#00f0ff]/30' 
                      : 'hover:bg-slate-800/50 text-slate-400 border border-transparent'
                    }`}
                  >
                    <span className="truncate">{node.title}</span>
                    {sourceId === node.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Selection List */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider">Choose Target</Label>
              <div className="h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                {nodes.map(node => (
                  <button
                    key={`tgt-${node.id}`}
                    disabled={node.id === sourceId}
                    onClick={() => { setTargetId(node.id); setError(''); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${
                      targetId === node.id 
                      ? 'bg-[#a78bfa]/20 text-white border border-[#a78bfa]/30' 
                      : node.id === sourceId
                      ? 'opacity-20 cursor-not-allowed'
                      : 'hover:bg-slate-800/50 text-slate-400 border border-transparent'
                    }`}
                  >
                    <span className="truncate">{node.title}</span>
                    {targetId === node.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Label htmlFor="edge-label" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Link Description</Label>
            <Input 
                id="edge-label" 
                value={label} 
                onChange={(e) => { setLabel(e.target.value); setError(''); }} 
                className="bg-slate-900/80 border-slate-700 text-slate-100 placeholder:text-slate-600 focus-visible:ring-[#6c63ff]"
                placeholder="e.g. utilizes, depends on, extends"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-4 border-t border-slate-800/50">
          <Button variant="ghost" onClick={handleClose} className="text-slate-400 hover:text-white hover:bg-slate-800 h-10 px-6">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!sourceId || !targetId}
            className={`h-10 px-8 font-bold transition-all ${
              sourceId && targetId 
              ? 'bg-[#6c63ff] hover:bg-[#5b51dd] text-white shadow-[0_0_20px_rgba(108,99,255,0.3)]' 
              : 'bg-slate-800 text-slate-500'
            }`}
          >
            Forge Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
