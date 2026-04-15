"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGraphStore } from '@/store/useGraphStore';
import { BarChart2, Network, Cpu, GitBranch, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Props { isOpen: boolean; onClose: () => void; }

export function AnalyticsModal({ isOpen, onClose }: Props) {
  const { nodes, edges } = useGraphStore();
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

  // Compute stats
  const connectionCount: Record<string, number> = {};
  nodes.forEach(n => { connectionCount[n.id] = 0; });
  edges.forEach(e => {
    connectionCount[e.source] = (connectionCount[e.source] || 0) + 1;
    connectionCount[e.target] = (connectionCount[e.target] || 0) + 1;
  });

  const mostConnectedId = Object.entries(connectionCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostConnectedNode = nodes.find(n => n.id === mostConnectedId);
  const isolatedNodes = nodes.filter(n => connectionCount[n.id] === 0);
  const avgConnections = nodes.length > 0
    ? (Object.values(connectionCount).reduce((a, b) => a + b, 0) / nodes.length).toFixed(1)
    : '0';

  const stats = [
    { label: 'Total Nodes', value: nodes.length, icon: <Cpu className="w-5 h-5 text-[#00f0ff]" />, color: 'border-[#00f0ff]/20 bg-[#00f0ff]/5' },
    { label: 'Total Edges', value: edges.length, icon: <Network className="w-5 h-5 text-[#a78bfa]" />, color: 'border-[#a78bfa]/20 bg-[#a78bfa]/5' },
    { label: 'Avg Connections', value: avgConnections, icon: <BarChart2 className="w-5 h-5 text-[#3b82f6]" />, color: 'border-[#3b82f6]/20 bg-[#3b82f6]/5' },
    { label: 'Isolated Nodes', value: isolatedNodes.length, icon: <AlertCircle className="w-5 h-5 text-yellow-400" />, color: 'border-yellow-400/20 bg-yellow-400/5' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[500px] bg-[#0B0F1A] border-[#00f0ff]/20 text-slate-100 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <BarChart2 className="w-5 h-5 text-[#00f0ff]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] to-[#a78bfa]">
              Graph Analytics
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2">
          {stats.map(s => (
            <div key={s.label} className={`flex items-center gap-3 p-4 rounded-xl border ${s.color}`}>
              {s.icon}
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {mostConnectedNode && (
          <div className="mt-2 p-4 rounded-xl border border-[#00f0ff]/20 bg-[#00f0ff]/5">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-2 flex items-center gap-1">
              <GitBranch className="w-3 h-3" /> Most Connected Node
            </p>
            <p className="font-bold text-white text-lg">{mostConnectedNode.title}</p>
            <p className="text-sm text-[#00f0ff] mt-0.5">{connectionCount[mostConnectedNode.id]} connections</p>
          </div>
        )}

        {isolatedNodes.length > 0 && (
          <div className="p-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5">
            <p className="text-xs text-yellow-400 uppercase font-bold tracking-widest mb-2">Isolated Nodes</p>
            <div className="flex flex-wrap gap-2">
              {isolatedNodes.map(n => (
                <span key={n.id} className="text-xs px-2 py-1 rounded-full border border-yellow-400/30 text-yellow-300 bg-yellow-900/20">{n.title}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3 px-1">Network Intelligence (Click to Expand)</p>
          <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {nodes.sort((a, b) => (connectionCount[b.id] || 0) - (connectionCount[a.id] || 0)).map(n => {
              const isExpanded = expandedNodeId === n.id;
              const nodeEdges = edges.filter(e => e.source === n.id || e.target === n.id);
              
              return (
                <div key={n.id} className="flex flex-col">
                  <button 
                    onClick={() => setExpandedNodeId(isExpanded ? null : n.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
                        isExpanded ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'bg-slate-900/50 border-slate-800 hover:border-[#00f0ff]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: n.color || '#3b82f6', boxShadow: `0 0 8px ${n.color || '#3b82f6'}88` }} />
                      <span className={`text-sm font-medium ${isExpanded ? 'text-[#00f0ff]' : 'text-slate-300'}`}>{n.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className={`text-xs font-mono p-1 px-2 rounded-md ${isExpanded ? 'bg-[#00f0ff]/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {connectionCount[n.id] || 0}
                       </span>
                       {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#00f0ff]" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && nodeEdges.length > 0 && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-slate-950/40 rounded-b-lg border-x border-b border-[#00f0ff]/20 mx-1"
                      >
                        <div className="p-2 space-y-1">
                          {nodeEdges.map(edge => {
                            const isSource = edge.source === n.id;
                            const neighborId = isSource ? edge.target : edge.source;
                            const neighbor = nodes.find(nb => nb.id === neighborId);
                            return (
                              <div key={edge.id} className="flex items-center justify-between px-2 py-1.5 rounded bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                                <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${isSource ? 'bg-[#00f0ff]' : 'bg-[#a78bfa]'}`} />
                                  <span className="text-[11px] text-slate-400 italic">
                                    {isSource ? 'connects to' : 'linked by'} <span className="text-slate-500 font-bold not-italic">{edge.label}</span>
                                  </span>
                                </div>
                                <span className="text-xs text-white font-medium">{neighbor?.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
