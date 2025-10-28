// ALL THE LOGIC ARE PLACED ON calculatorLogic.ts
export type CALCULATOR_CATEGORY = "Basic" | "Mathematics" | "Geometry" | "Physics" | "Kimia";

export interface ToolParam {
  name: string; 
  label?: string;
  unit?: string;
  type?: 'number' | 'string' | 'boolean';
  defaultValue?: number | string | boolean;
}

export interface ToolDefinition {
  id: string; 
  name: string;
  category?: CALCULATOR_CATEGORY;
  description?: string; 
  params: ToolParam[];
  execute: (...args: number[]) => number | string | boolean;
}

export const toolRegistry: Record<string, ToolDefinition> = {};

export function registerTool(tool: ToolDefinition): void {
  if (!tool.id || typeof tool.execute !== 'function') {
    throw new Error("Tool must have a valid 'id' and an 'execute' function.");
  }
  toolRegistry[tool.id] = tool;
}

export function getAllTools(): ToolDefinition[] {
  return Object.values(toolRegistry);
}
export function getToolById(toolId: string): ToolDefinition | undefined {
  return toolRegistry[toolId];
}

export function runTool(toolId: string, args: any[] = []): number | string | boolean {
  const tool = toolRegistry[toolId];
  if (!tool) throw new Error(`Tool '${toolId}' not found.`);
  // Pastikan argumen sesuai tipe
  const numericArgs = args.map(arg => typeof arg === 'string' ? parseFloat(arg) : arg).filter(arg => !isNaN(arg as number));
  if (numericArgs.length !== tool.params.length) {
    throw new Error(`Invalid number of arguments for tool '${toolId}'. Expected ${tool.params.length}, got ${numericArgs.length}.`);
  }
  return tool.execute(...numericArgs);
}
