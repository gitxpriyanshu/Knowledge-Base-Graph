# Knowledge Base Graph

An interactive, responsive knowledge mapping tool designed for topics and relationships. This project was built as a browser-coded frontend application to demonstrate graph-to-UI data management and persistence.

## 🚀 Key Features

### 1. Interactive Graph Visualization
- **Graph Library**: Built with `Cytoscape.js` and `Dagre` layout engine. 
- **Non-Overlapping Layout**: Uses a hierarchical layout (Left-to-Right or Top-to-Bottom) to ensure nodes are readable on initial load.
- **Node Dragging**: Reposition nodes via drag-and-drop; coordinates persist automatically.

### 2. Full CRUD Support
- **Node Management**: Add nodes with custom titles and detailed metadata/notes.
- **Relationship Forging**: A dedicated "Link Forge" interface to establish directed relationships between any two nodes with custom labels.
- **Inline Editing**: Selected nodes open a Detail Panel (Sidebar) where titles and notes can be edited in real-time.
- **Full Deletion**: Capability to delete specific nodes (auto-cleaning orphaned edges) or individual edges.

### 3. State & Persistence
- **LocalStorage Storage**: Full graph state (nodes, edges, positions) survives page refreshes.
- **Seed Data Integration**: Pre-populated on first load using the research topics provided in the assignment spec (React, Next.js, TypeScript, etc.).

### 4. Advanced UX (Stretch Goals)
- **High-End UI**: Cyber-inspired dark mode using glassmorphism and Tailwind CSS.
- **Connectivity Pulse**: Toggle data-flow animations along relationship paths.
- **Selection Isolation**: Clicking a node highlights its direct neighbors and dims the rest of the network for focus.
- **Real-time Radar**: A tactical overview widget tracking node distribution in the graph space.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router), TypeScript.
- **Styling**: Tailwind CSS, Framer Motion (Animations).
- **Store**: Zustand (with Persist middleware).
- **Core Library**: Cytoscape.js with Dagre layout plugin.
- **Component Library**: Shadcn UI / Radix Primitives.

## 🏁 Setup & Development

1. **Installation**:
   ```bash
   npm install
   ```

2. **Development Mode**:
   ```bash
   npm run dev
   ```

3. **Build & Optimize**:
   ```bash
   npm run build
   ```

4. **Access**:
   Open [http://localhost:3000](http://localhost:3000) (or 3001) in your browser.

## 📝 Assignment Verification
| Feature | Status | Note |
|---|---|---|
| Render Nodes & Edges | ✅ PASS | Cytoscape implementation |
| Relationship Labels | ✅ PASS | Visible on all edges |
| Layout (No overlap) | ✅ PASS | Hierarchical Dagre layout |
| Detail Panel (Edit) | ✅ PASS | Inline title/note editing |
| CRUD Nodes | ✅ PASS | Create/Update/Delete active |
| CRUD Edges | ✅ PASS | Forge/Delete active |
| LocalStorage | ✅ PASS | Zustand persistence |
| Highlight Connected | ✅ PASS | Automatic on node selection |

---
*Developed as a high-performance frontend assignment demo.*
