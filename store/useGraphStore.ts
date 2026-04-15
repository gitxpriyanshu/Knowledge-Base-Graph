import { create } from 'zustand';
import { GraphNode, GraphEdge } from '@/types/graph';
import { seedNodes, seedEdges } from '@/data/seedData';
import { v4 as uuidv4 } from 'uuid';

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  initGraph: () => void;
  addNode: (title: string, note: string) => void;
  updateNode: (id: string, title: string, note: string) => void;
  updateNodeColor: (id: string, color: string) => void;
  deleteNode: (id: string) => void;
  addEdge: (source: string, target: string, label: string) => void;
  deleteEdge: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const saveToLocalStorage = (nodes: GraphNode[], edges: GraphEdge[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('knowledge-graph', JSON.stringify({ nodes, edges }));
  }
};

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  searchQuery: '',

  updateNodeColor: (id: string, color: string) => {
    set((state) => {
      const newNodes = state.nodes.map(n => n.id === id ? { ...n, color } : n);
      saveToLocalStorage(newNodes, state.edges);
      return { nodes: newNodes };
    });
  },

  initGraph: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('knowledge-graph');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
            set({ nodes: parsed.nodes, edges: parsed.edges });
            return;
          }
        } catch (e) {
          console.error('Failed to parse graph data from local storage', e);
        }
      }
    }
    
    const NODE_COLORS = ['#00f0ff', '#a78bfa', '#3b82f6', '#4ade80', '#f472b6', '#fb923c'];
    
    set({ 
      nodes: seedNodes.map((n, i) => ({ ...n, color: n.color || NODE_COLORS[i % NODE_COLORS.length] })), 
      edges: seedEdges 
    });
    saveToLocalStorage(seedNodes, seedEdges);
  },

  addNode: (title: string, note: string) => {
    const newNode: GraphNode = {
      id: uuidv4(),
      title,
      note,
      position: {
        x: Math.floor(Math.random() * 501) + 100,
        y: Math.floor(Math.random() * 301) + 100,
      },
      color: ['#00f0ff', '#a78bfa', '#3b82f6', '#4ade80', '#f472b6', '#fb923c'][Math.floor(Math.random() * 6)]
    };
    set((state) => {
      const newNodes = [...state.nodes, newNode];
      saveToLocalStorage(newNodes, state.edges);
      return { nodes: newNodes };
    });
  },

  updateNode: (id: string, title: string, note: string) => {
     set((state) => {
       const newNodes = state.nodes.map(n => n.id === id ? { ...n, title, note } : n);
       saveToLocalStorage(newNodes, state.edges);
       return { nodes: newNodes };
     });
  },

  deleteNode: (id: string) => {
     set((state) => {
       const newNodes = state.nodes.filter(n => n.id !== id);
       const newEdges = state.edges.filter(e => e.source !== id && e.target !== id);
       saveToLocalStorage(newNodes, newEdges);
       return {
         nodes: newNodes,
         edges: newEdges,
         selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId
       };
     });
  },

  addEdge: (source: string, target: string, label: string) => {
     const newEdge: GraphEdge = {
       id: uuidv4(),
       source,
       target,
       label
     };
     set((state) => {
       const newEdges = [...state.edges, newEdge];
       saveToLocalStorage(state.nodes, newEdges);
       return { edges: newEdges };
     });
  },

  deleteEdge: (id: string) => {
     set((state) => {
       const newEdges = state.edges.filter(e => e.id !== id);
       saveToLocalStorage(state.nodes, newEdges);
       return { edges: newEdges };
     });
  },

  setSelectedNode: (id: string | null) => {
     set({ selectedNodeId: id });
  },

  updateNodePosition: (id: string, x: number, y: number) => {
     set((state) => {
       const newNodes = state.nodes.map(n => n.id === id ? { ...n, position: { x, y } } : n);
       saveToLocalStorage(newNodes, state.edges);
       return { nodes: newNodes };
     });
  },

  setSearchQuery: (query: string) => set({ searchQuery: query })
}));
