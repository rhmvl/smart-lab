import { PathfindingVisualizer } from "./visualizers/PathfindingVisualizer";

// TODO Write this to be a menu selector.

export default function AlgoWorks() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minWidth: '800px' }}>
      <PathfindingVisualizer />
    </div>
  );
}
