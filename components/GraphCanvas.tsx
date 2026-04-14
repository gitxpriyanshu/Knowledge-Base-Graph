"use client";

import React, { useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { useGraphStore } from '@/store/useGraphStore';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

// Cytoscape's @types doesn't expose shadow-* properties, but they exist at runtime.
// We extend the style record to allow them while staying as close to typed as possible.
type CyStyle = cytoscape.Css.Node & cytoscape.Css.Edge & cytoscape.Css.Core & Record<string, unknown>;
interface CyStylesheet { selector: string; style: Partial<CyStyle>; }

if (!cytoscape.prototype.hasInitialDagre) {
  cytoscape.use(dagre);
  cytoscape.prototype.hasInitialDagre = true;
}

interface Props {
  layoutDirection: 'LR' | 'TB';
  pulsing: boolean;
}

export function GraphCanvas({ layoutDirection, pulsing }: Props) {
  const { nodes, edges, setSelectedNode, updateNodePosition, selectedNodeId } = useGraphStore();
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (cyRef.current) {
        const layout = cyRef.current.layout({
            name: 'dagre',
            rankDir: layoutDirection,
            padding: 50,
            animate: true,
            nodeDimensionsIncludeLabels: true,
        } as cytoscape.LayoutOptions);
        layout.run();
    }
  }, [nodes.length, edges.length, layoutDirection]);
  
  // Combined Highlighting Logic (Search + Selection)
  // Consolidates visual states to prevent conflicts and 'glow clutter'
  const searchQuery = useGraphStore(state => state.searchQuery);
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    // 1. Reset everything first
    cy.elements().removeClass('highlighted dimmed');

    // 2. Priority 1: Search Query (Global Filter)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      cy.elements().addClass('dimmed');
      
      const matchedNodes = cy.nodes().filter(node => 
        node.data('title').toLowerCase().includes(query)
      );
      
      matchedNodes.removeClass('dimmed').addClass('highlighted');
      return; // Exit early so search override selection
    }

    // 3. Priority 2: Manual Selection (Neighborhood focus)
    if (selectedNodeId) {
      const node = cy.getElementById(selectedNodeId);
      if (node.length > 0) {
        cy.elements().addClass('dimmed');
        node.removeClass('dimmed').addClass('highlighted');
        node.neighborhood().removeClass('dimmed').addClass('highlighted');
      }
    }
  }, [searchQuery, selectedNodeId, nodes.length, edges.length]);

  // Edge pulse toggle + animation loop for 'marching ants' flow
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cyRef.current) {
        if (pulsing) {
            cyRef.current.edges().addClass('pulsing');
            // Animate line-dash-offset to create flow effect
            let offset = 0;
            interval = setInterval(() => {
              offset = (offset - 1) % 24;
              cyRef.current?.edges('.pulsing').style('line-dash-offset', offset);
            }, 30);
        } else {
            cyRef.current.edges().removeClass('pulsing');
        }
    }
    return () => { if (interval) clearInterval(interval); };
  }, [pulsing, edges.length]);

  const elements = [
    ...nodes.map(n => ({ data: { ...n, label: n.title }, position: n.position })),
    ...edges.map(e => ({ data: { id: e.id, source: e.source, target: e.target, label: e.label } }))
  ];

  const stylesheet: CyStylesheet[] = [
    {
      selector: 'node',
      style: {
        'shape': 'roundrectangle',
        'background-color': '#0B0F1A',
        'color': '#ffffff',
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '120px',
        'border-color': '#3b82f6',
        'border-width': 2,
        'width': '140px',
        'height': '45px',
        'padding': '10px',
        'font-family': 'Inter, sans-serif',
        'font-size': '12px',
        'shadow-blur': 25,
        'shadow-color': '#3b82f6',
        'shadow-opacity': 0.6,
        'transition-property': 'background-color, border-color, shadow-color, opacity, border-width, shadow-blur',
        'transition-duration': 400
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#3b82f6',
        'target-arrow-color': '#3b82f6',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': '9px',
        'color': '#00f0ff',
        'text-background-color': '#0F172A',
        'text-background-opacity': 1,
        'text-background-padding': '4px',
        'text-background-shape': 'roundrectangle',
        'text-border-color': '#3b82f6',
        'text-border-width': 1,
        'text-border-opacity': 0.5,
        'shadow-blur': 15,
        'shadow-color': '#3b82f6',
        'shadow-opacity': 0.4,
        'text-rotation': 'autorotate',
        'transition-property': 'line-color, target-arrow-color, text-border-color, shadow-color, opacity, color',
        'transition-duration': 400
      }
    },
    {
       selector: '.dimmed',
       style: {
         'opacity': 0.15
       }
    },
    {
       selector: 'node.highlighted',
       style: {
         'border-color': '#00f0ff',
         'shadow-color': '#00f0ff',
         'shadow-opacity': 1,
         'shadow-blur': 35,
         'border-width': 3,
         'color': '#00f0ff',
         'opacity': 1
       }
    },
    {
       selector: 'edge.highlighted',
       style: {
         'line-color': '#00f0ff',
         'target-arrow-color': '#00f0ff',
         'text-border-color': '#00f0ff',
         'color': '#ffffff',
         'shadow-color': '#00f0ff',
         'shadow-opacity': 0.9,
         'shadow-blur': 20,
         'opacity': 1,
         'width': 3,
         'z-index': 10
       }
    },
    {
       selector: 'edge.pulsing',
       style: {
         'line-color': '#00f0ff',
         'target-arrow-color': '#00f0ff',
         'width': 3,
         'opacity': 1,
         'line-style': 'dashed',
         'line-dash-pattern': [6, 3],
         'line-dash-offset': 24,
         'transition-property': 'line-dash-offset',
         'transition-duration': 0
       }
    }
  ];

  return (
    <div className="w-full relative bg-transparent" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Zoom Controls Overlay (Bottom Left) */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2 bg-[#0F172A]/70 backdrop-blur-md border border-[#3b82f6]/30 p-2 rounded-xl z-50 shadow-[0_0_20px_rgba(59,130,246,0.15)] pointer-events-auto">
        <button onClick={() => cyRef.current?.zoom(cyRef.current.zoom() + 0.2)} title="Zoom In" className="p-2.5 hover:bg-[#3b82f6]/30 rounded-lg text-slate-400 hover:text-[#00f0ff] transition-all cursor-pointer"><ZoomIn className="w-5 h-5"/></button>
        <button onClick={() => cyRef.current?.fit()} title="Fit View" className="p-2.5 hover:bg-[#3b82f6]/30 rounded-lg text-slate-400 hover:text-[#00f0ff] transition-all cursor-pointer"><Maximize className="w-5 h-5"/></button>
        <button onClick={() => cyRef.current?.zoom(cyRef.current.zoom() - 0.2)} title="Zoom Out" className="p-2.5 hover:bg-[#3b82f6]/30 rounded-lg text-slate-400 hover:text-[#a78bfa] transition-all cursor-pointer"><ZoomOut className="w-5 h-5"/></button>
      </div>

      {/* Futuristic Mini Radar Overlay (Bottom Right) */}
      <div className="absolute bottom-6 right-6 w-56 h-56 rounded-full border border-[#00f0ff]/20 bg-[#0B0F1A]/80 backdrop-blur-lg shadow-[0_0_40px_rgba(0,240,255,0.1)] flex items-center justify-center overflow-hidden z-10 pointer-events-none">
         {/* Concentric Rings */}
         <div className="absolute inset-0 rounded-full border border-[#00f0ff]/10 m-6"></div>
         <div className="absolute inset-0 rounded-full border border-[rgba(167,139,250,0.1)] m-12"></div>
         <div className="absolute inset-0 rounded-full border border-[#00f0ff]/5 m-18"></div>
         
         {/* Crosshairs */}
         <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent"></div>
         <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#00f0ff]/20 to-transparent"></div>
         
         {/* Sweeping Radar Scanner Line */}
         <div className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left bg-gradient-to-tr from-[#00f0ff]/30 via-[#00f0ff]/5 to-transparent animate-[spin_3s_linear_infinite]" style={{ borderRight: '2px solid #00f0ff' }}></div>
         
         {/* Dynamic Node Blips - Real-time Visualization of Knowledge Matrix */}
         {nodes.map((node, i) => {
           // Golden angle style distribution for organic radar feel
           const angle = (i * 137.5) % 360; 
           const radius = 15 + (i * 8) % 75; // Stay within radar circles
           return (
             <div 
               key={node.id}
               className={`absolute rounded-full blur-[0.5px] transition-all duration-1000 ${
                 i % 3 === 0 ? 'w-1.5 h-1.5 bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]' : 
                 i % 3 === 1 ? 'w-2 h-2 bg-[#a78bfa] opacity-60' : 
                 'w-1 h-1 bg-white opacity-40 shadow-[0_0_3px_#fff]'
               }`}
               style={{
                 transform: `rotate(${angle}deg) translateY(-${radius}px)`,
               }}
             />
           );
         })}
      </div>

      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        stylesheet={stylesheet}
        cy={(cy) => {
          cyRef.current = cy;
          
          if (!cy.scratch('_listenersAttached')) {
              cy.on('tap', 'node', (evt) => {
                const id = evt.target.id();
                cy.elements().removeClass('highlighted dimmed').addClass('dimmed');
                const node = evt.target;
                node.removeClass('dimmed').addClass('highlighted');
                node.neighborhood().removeClass('dimmed').addClass('highlighted');
                
                setSelectedNode(null); 
                setTimeout(() => setSelectedNode(id), 0);
              });
              
              cy.on('tap', (evt) => {
                 if (evt.target === cy) {
                     cy.elements().removeClass('highlighted dimmed');
                     setSelectedNode(null);
                 }
              });
    
              cy.on('dragfree', 'node', (evt) => {
                  const node = evt.target;
                  const pos = node.position();
                  updateNodePosition(node.id(), pos.x, pos.y);
              });
              
              cy.on('add', 'edge', (evt) => {
                 const ele = evt.target;
                 ele.style('opacity', 0);
                 ele.animate({
                     style: { opacity: 1 }
                 }, {
                     duration: 600
                 });
              });

              cy.scratch('_listenersAttached', true);
          }
        }}
        wheelSensitivity={0.1}
        maxZoom={3}
        minZoom={0.2}
      />
    </div>
  );
}
