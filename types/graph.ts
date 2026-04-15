export interface GraphNode {
  id: string;
  title: string;
  note: string;
  color?: string; // Hex color code
  position?: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
