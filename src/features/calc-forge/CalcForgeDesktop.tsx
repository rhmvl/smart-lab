import { useState } from "react";
import { getAllTools, runTool } from "./calc-tool";

/**
 * CalcForgeDesktop
 * ----------------------------------------
 * Desktop workspace layout:
 * - Left Pane: Expression editor, result viewer
 * - Right Pane: Tool panels (Basic / Scientific / Custom)
 * - Optional bottom drawer: History
 *
 * Designed for mouse + keyboard interaction,
 * while keeping CalcForge’s experimental feel.
 */

export default function CalcForgeDesktop() {
  const [mode, setMode] = useState<"Basic" | "Scientific" | "Custom" | "History">("Basic");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | number | boolean>("");
  const [history, setHistory] = useState<{ expr: string; res: string | number | boolean }[]>([]);

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
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* ───────────────────────────── */}
      {/* LEFT PANEL — MAIN CALCULATOR */}
      {/* ───────────────────────────── */}
      <div className="flex-1 flex flex-col border-r border-gray-800 p-6 space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-teal-400">CalcForge</h1>
          <nav className="flex space-x-2 text-sm">
            {["Basic", "Scientific", "Custom", "History"].map((m) => (
              <button
                key={m}
                className={`px-3 py-1 rounded ${
                  mode === m ? "bg-teal-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setMode(m as any)}
              >
                {m}
              </button>
            ))}
          </nav>
        </header>

        {/* Expression Editor */}
        <section className="flex-1 flex flex-col bg-gray-900 border border-gray-800 rounded-lg p-4">
          <label className="text-sm text-gray-400 mb-2">Expression Editor</label>
          <textarea
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Type an expression (e.g., sin(30) + volume_box(2,3,4))"
            className="flex-1 bg-gray-950 border border-gray-800 rounded-lg p-3 text-gray-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleEvaluate}
              className="bg-teal-600 hover:bg-teal-500 transition rounded px-6 py-2 font-semibold"
            >
              Evaluate
            </button>
          </div>
        </section>

        {/* Result Display */}
        <section className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-teal-300 font-semibold mb-2">Result</h3>
          <p className="text-3xl font-mono text-white break-words min-h-[2rem]">
            {result !== "" ? String(result) : "—"}
          </p>
        </section>
      </div>

      {/* ───────────────────────────── */}
      {/* RIGHT PANEL — FUNCTION PANEL */}
      {/* ───────────────────────────── */}
      <div className="w-80 flex flex-col bg-gray-900 p-4 border-l border-gray-800">
        <h3 className="text-teal-300 font-semibold mb-3">
          {mode === "Basic" ? "Basic Panel" : mode + " Tools"}
        </h3>

        {/* Tools List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {tools
            .filter((t) =>
              mode === "Basic" ? t.category === "Basic" : t.category === mode
            )
            .map((tool) => (
              <div
                key={tool.id}
                className="bg-gray-800 rounded-lg border border-gray-700 p-3 hover:bg-gray-750 cursor-pointer"
                onClick={() => handleInsert(`${tool.id}(`)}
              >
                <div className="text-gray-200 text-sm font-semibold">{tool.name}</div>
                {tool.description && (
                  <div className="text-xs text-gray-500">{tool.description}</div>
                )}
              </div>
            ))}
        </div>

        {/* Optional: Quick math pad */}
        {mode === "Basic" && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[7, 8, 9, "+", 4, 5, 6, "-", 1, 2, 3, "*", 0, ".", "(", ")", "/", "^"].map((v) => (
              <button
                key={v}
                onClick={() => handleInsert(String(v))}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-white text-lg py-2"
              >
                {v}
              </button>
            ))}
            <button
              onClick={() => setExpression("")}
              className="col-span-2 bg-red-700 hover:bg-red-600 rounded py-2 font-semibold"
            >
              AC
            </button>
            <button
              onClick={handleEvaluate}
              className="col-span-2 bg-teal-600 hover:bg-teal-500 rounded py-2 font-semibold"
            >
              =
            </button>
          </div>
        )}
      </div>

      {/* ───────────────────────────── */}
      {/* HISTORY DRAWER (BOTTOM PANEL) */}
      {/* ───────────────────────────── */}
      {mode === "History" && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 max-h-64 overflow-y-auto p-4">
          <h3 className="text-teal-300 font-semibold mb-2">Calculation History</h3>
          {history.length === 0 && <p className="text-gray-500 text-sm">No calculations yet.</p>}
          <ul className="space-y-2">
            {history.map((item, i) => (
              <li
                key={i}
                className="flex justify-between bg-gray-950 border border-gray-800 rounded p-2 text-sm"
              >
                <span className="text-gray-400">{item.expr}</span>
                <span className="font-mono text-gray-200">{String(item.res)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
