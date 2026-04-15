"use client";

import { useGraphStore } from '@/store/useGraphStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, X, Activity, Cpu, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NodeDetailPanel() {
  const { selectedNodeId, nodes, edges, updateNode, deleteNode, deleteEdge, setSelectedNode } = useGraphStore();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleDelete = () => {
    if (selectedNode) {
        deleteNode(selectedNode.id);
        setSelectedNode(null);
    }
  };

  return (
    <AnimatePresence>
      {selectedNode && (
        <motion.div 
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-6 top-24 bottom-6 w-[340px] z-50 flex flex-col"
        >
          {/* Glassmorphism Panel */}
          <Card className="flex-1 flex flex-col bg-[#0F172A]/80 backdrop-blur-xl border border-[#00f0ff]/30 shadow-[0_0_40px_rgba(0,240,255,0.1)] rounded-2xl overflow-hidden m-0 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50 block" />
            
            <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-[#00f0ff]/20 shrink-0 space-y-0 bg-[#0B0F1A]/50">
              <div className="flex items-center gap-2">
                 <Cpu className="w-5 h-5 text-[#00f0ff]" />
                 <CardTitle className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Node Analysis</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 rounded-full h-8 w-8">
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="node-title" className="text-[#00f0ff] text-xs uppercase font-bold tracking-[0.1em] flex items-center gap-1">
                       <Activity className="w-3 h-3" /> Identity
                    </Label>
                    <Input 
                        id="node-title" 
                        value={selectedNode.title} 
                        onChange={(e) => updateNode(selectedNode.id, e.target.value, selectedNode.note)}
                        className="bg-[#0B0F1A] border-[#3b82f6]/30 text-white focus-visible:ring-[#00f0ff]/50 focus-visible:border-[#00f0ff] shadow-inner transition-all h-11"
                    />
                </div>
                
                <div className="space-y-3">
                    <Label htmlFor="node-note" className="text-[#a78bfa] text-xs uppercase font-bold tracking-[0.1em] flex items-center gap-1">
                        <Hexagon className="w-3 h-3" /> Parameters
                    </Label>
                    <Textarea 
                        id="node-note" 
                        value={selectedNode.note} 
                        onChange={(e) => updateNode(selectedNode.id, selectedNode.title, e.target.value)}
                        className="bg-[#0B0F1A] border-[#a78bfa]/30 text-slate-300 min-h-[140px] focus-visible:ring-[#a78bfa]/50 focus-visible:border-[#a78bfa] resize-y shadow-inner transition-all leading-relaxed"
                    />
                </div>

                {/* Relationships Management Section */}
                <div className="space-y-3">
                    <Label className="text-[#3b82f6] text-xs uppercase font-bold tracking-[0.1em] flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Active Links
                    </Label>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                        {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length === 0 ? (
                           <div className="text-[10px] text-slate-600 bg-slate-900/50 p-2 rounded-lg border border-dashed border-slate-800 text-center">No active connections</div>
                        ) : (
                          edges
                            .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                            .map(edge => {
                                const targetNode = nodes.find(n => n.id === (edge.source === selectedNode.id ? edge.target : edge.source));
                                return (
                                  <div key={edge.id} className="flex items-center justify-between p-2 rounded-lg bg-[#0B0F1A] border border-slate-800 group hover:border-[#3b82f6]/40 transition-all">
                                     <div className="flex flex-col">
                                       <span className="text-[10px] text-slate-500 font-bold uppercase">{edge.label}</span>
                                       <span className="text-xs text-slate-300 truncate w-[140px]">{targetNode?.title || 'Unknown'}</span>
                                     </div>
                                     <Button 
                                       size="icon" 
                                       variant="ghost" 
                                       className="h-7 w-7 text-slate-600 hover:text-red-400 hover:bg-red-900/20"
                                       onClick={() => deleteEdge(edge.id)}
                                     >
                                       <Trash2 className="w-3 h-3" />
                                     </Button>
                                  </div>
                                );
                            })
                        )}
                    </div>
                </div>
                
                {/* Node Branding (Color Picker) */}
                <div className="space-y-3">
                    <Label className="text-[#00f0ff] text-xs uppercase font-bold tracking-[0.1em] flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Node Branding
                    </Label>
                    <div className="flex flex-wrap gap-3 p-3 bg-[#0B0F1A] rounded-xl border border-slate-800/50">
                        {['#00f0ff', '#a78bfa', '#3b82f6', '#4ade80', '#f472b6', '#fb923c', '#ffffff'].map(c => (
                            <button
                                key={c}
                                onClick={() => useGraphStore.getState().updateNodeColor(selectedNode.id, c)}
                                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 shadow-lg ${selectedNode.color === c ? 'border-white scale-110 shadow-white/20' : 'border-transparent'}`}
                                style={{ backgroundColor: c, boxShadow: `0 0 10px ${c}44` }}
                                title={c}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="pt-2">
                   <div className="text-[10px] text-slate-500 font-mono break-all bg-[#0B0F1A] p-3 rounded-lg border border-slate-800/50 flex align-center justify-between">
                     <span>SYS.ID</span>
                     <span className="text-[#00f0ff]/60">{selectedNode.id}</span>
                   </div>
                </div>
            </CardContent>
            <CardFooter className="p-5 border-t border-[#00f0ff]/20 shrink-0 bg-[#0B0F1A]/50 backdrop-blur-md">
              <Button variant="destructive" className="w-full bg-red-900/40 hover:bg-red-600/80 border border-red-500/50 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all font-semibold tracking-wide" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" /> Terminate Node
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
