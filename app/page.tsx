"use client";

import { useEffect, useState } from 'react';
import { GraphCanvas } from '@/components/GraphCanvas';
import { Toolbar } from '@/components/Toolbar';
import { AddNodeModal } from '@/components/AddNodeModal';
import { AddEdgeModal } from '@/components/AddEdgeModal';
import { NodeDetailPanel } from '@/components/NodeDetailPanel';
import { useGraphStore } from '@/store/useGraphStore';

export default function Home() {
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
  const [layoutDirection, setLayoutDirection] = useState<'LR' | 'TB'>('LR');
  const [pulsing, setPulsing] = useState(false);
  const initGraph = useGraphStore(state => state.initGraph);

  useEffect(() => {
    initGraph();
  }, [initGraph]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#0B0F1A] text-[#e2e8f0] font-sans">
      <Toolbar
        onAddNode={() => setIsNodeModalOpen(true)}
        onAddEdge={() => setIsEdgeModalOpen(true)}
        layoutDirection={layoutDirection}
        onLayoutChange={setLayoutDirection}
        pulsing={pulsing}
        onTogglePulse={() => setPulsing(p => !p)}
      />

      <main className="flex-1 relative mt-[64px] overflow-hidden">
        <GraphCanvas layoutDirection={layoutDirection} pulsing={pulsing} />
        <NodeDetailPanel />
      </main>

      <AddNodeModal isOpen={isNodeModalOpen} onClose={() => setIsNodeModalOpen(false)} />
      <AddEdgeModal isOpen={isEdgeModalOpen} onClose={() => setIsEdgeModalOpen(false)} />
    </div>
  );
}
