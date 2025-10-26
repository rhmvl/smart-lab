import { useState } from "react";
import { getAllTools, runTool } from "./calc-tool";

/**
 * CalcForgeMobile
 * ----------------------------------------
 * Mobile-first layout based on your concept.
 * Optimized for Android calculator style:
 * - Compact header
 * - Expression + result stacked
 * - Collapsible function panel
 * - Tap-friendly buttons
 */

export default function CalcForgeMobile() {
  const [mode, setMode] = useState<"Basic" | "Mathematics" | "Custom" | "History">("Basic");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | number | boolean>("");
  const [history, setHistory] = useState<{ expr: string; res: string | number | boolean }[]>([]);
  const [panelOpen, setPanelOpen] = useState(true);

  const tools = getAllTools();

  const handleEvaluate = () => {
    try {
      const expr = expression.trim();
      let res: number | string | boolean = 0;

      // detect a tool call pattern like: toolName(arg1,arg2,arg3)
      const match = expr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\((.*)\)$/);

      if (match) {
        const [, toolId, argsStr] = match;
        // parse arguments by comma, trimming spaces
        const args = argsStr
          .split(",")
          .map((a) => parseFloat(a.trim()))
          .filter((a) => !isNaN(a));

        res = runTool(toolId, args);
      } else {
        // fallback to basic math expression
        res = eval(expr);
      }

      setResult(res);
      setHistory((h) => [{ expr, res }, ...h]);
    } catch (_) {
      setResult("Error");
    }
  };

  const handleInsert = (val: string) => {
    setExpression((prev) => prev + val);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* ─────────────────────────────── */}
      {/* Header / Mode Selector */}
      {/* ─────────────────────────────── */}
      <header className="flex items-center justify-between bg-gray-900 border-b border-gray-800 px-4 py-3">
        <h1 className="text-lg font-bold text-teal-400">CalcForge</h1>
        <div className="flex space-x-1">
          {["Basic", "Mathematics", "Custom", "History"].map((m) => (
            <button
              key={m}
              className={`px-2 py-1 text-xs rounded ${
                mode === m ? "bg-teal-600 text-white" : "bg-gray-800 text-gray-400"
              }`}
              onClick={() => setMode(m as any)}
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      {/* ─────────────────────────────── */}
      {/* Expression + Result */}
      {/* ─────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-end p-4 space-y-2">
        <textarea
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Enter expression..."
          className="w-full bg-transparent text-right text-xl font-mono text-gray-300 resize-none focus:outline-none"
          rows={2}
        />
        <div className="text-right text-3xl font-bold text-white min-h-[2.5rem]">
          {result === "" ? " " : String(result)}
        </div>
      </div>

      {/* ─────────────────────────────── */}
      {/* Keypad / Function Panel */}
      {/* ─────────────────────────────── */}
      {panelOpen && (
        <div className="bg-gray-900 border-t border-gray-800 p-3">
          <div className="grid grid-cols-4 gap-2">
            {/* Basic numeric keypad */}
            {[7, 8, 9, "+", 4, 5, 6, "-", 1, 2, 3, "*", 0, ".", "(", ")", "/", "^", "√", "π"].map(
              (val) => (
                <button
                  key={val}
                  onClick={() => handleInsert(String(val))}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-lg rounded py-3"
                >
                  {val}
                </button>
              )
            )}
            <button
              onClick={() => setExpression("")}
              className="col-span-2 bg-red-700 hover:bg-red-600 rounded py-3 font-semibold"
            >
              AC
            </button>
            <button
              onClick={handleEvaluate}
              className="col-span-2 bg-teal-600 hover:bg-teal-500 rounded py-3 font-semibold"
            >
              =
            </button>
          </div>

          {/* Function categories */}
          <div className="mt-4">
            <h3 className="text-sm text-teal-300 mb-2 font-semibold">
              {mode === "Basic" ? "Basic Tools" : "Functions"}
            </h3>
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {tools
                .filter((t) =>
                  mode === "Basic" ? t.category === "Basic" : t.category === mode
                )
                .slice(0, 12)
                .map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleInsert(`${tool.id}(`)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-200 whitespace-nowrap"
                  >
                    {tool.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────── */}
      {/* History Drawer */}
      {/* ─────────────────────────────── */}
      {mode === "History" && (
        <div className="bg-gray-900 border-t border-gray-800 p-3 overflow-y-auto max-h-60">
          <h3 className="text-sm text-teal-300 mb-2 font-semibold">History</h3>
          {history.length === 0 && <p className="text-gray-500 text-xs">No calculations yet.</p>}
          <ul className="space-y-2">
            {history.map((item, i) => (
              <li
                key={i}
                className="flex justify-between bg-gray-950 border border-gray-800 rounded p-2 text-xs"
              >
                <span className="text-gray-400">{item.expr}</span>
                <span className="text-gray-200 font-mono">{String(item.res)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─────────────────────────────── */}
      {/* Footer / Drawer Toggle */}
      {/* ─────────────────────────────── */}
      <footer className="bg-gray-900 border-t border-gray-800 flex justify-center p-2">
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="text-teal-400 text-sm hover:text-teal-300 transition"
        >
          {panelOpen ? "Hide Panel ▲" : "Show Panel ▼"}
        </button>
      </footer>
    </div>
  );
}
