"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGraphStore } from '@/store/useGraphStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddNodeModal({ isOpen, onClose }: Props) {
  const addNode = useGraphStore(state => state.addNode);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Reset fields when opened
  useEffect(() => {
     if (isOpen) {
         setTitle('');
         setNote('');
         setError('');
     }
  }, [isOpen]);

  const handleClose = () => {
    setTitle('');
    setNote('');
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) {
       setError('Title is required');
       return;
    }
    
    addNode(title, note);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-[425px] bg-[#111827] border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Add New Node</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-slate-300">Title <span className="text-red-500">*</span></Label>
            <Input 
                id="title" 
                value={title} 
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setError('');
                }} 
                className={`bg-slate-900 border-slate-700 text-slate-100 focus-visible:ring-slate-600 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                placeholder="e.g. React"
            />
            {error && <span className="text-red-500 text-xs font-semibold">{error}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="note" className="text-slate-300">Note (Optional)</Label>
            <Textarea 
                id="note" 
                value={note} 
                onChange={e => setNote(e.target.value)} 
                className="bg-slate-900 border-slate-700 text-slate-100 min-h-[100px] focus-visible:ring-slate-600"
                placeholder="Details about this concept..."
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} className="bg-transparent border-[#2a2a3d] text-slate-300 hover:bg-[#6c63ff] hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-[#6c63ff] hover:bg-[#5b51dd] text-white border-0">
            Save Node
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
