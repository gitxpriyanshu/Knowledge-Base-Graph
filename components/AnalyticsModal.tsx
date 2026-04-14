"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGraphStore } from '@/store/useGraphStore';
import { BarChart2, Network, Cpu, GitBranch, AlertCircle } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; }

export function AnalyticsModal({ isOpen, onClose }: Props) {
  const { nodes, edges } = useGraphStore();

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

        <div className="mt-2 grid grid-cols-2 gap-2">
          {nodes.sort((a, b) => (connectionCount[b.id] || 0) - (connectionCount[a.id] || 0)).slice(0, 6).map(n => (
            <div key={n.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-800">
              <span className="text-sm text-slate-300 truncate">{n.title}</span>
              <span className="text-xs text-[#00f0ff] font-mono ml-2">{connectionCount[n.id] || 0}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
