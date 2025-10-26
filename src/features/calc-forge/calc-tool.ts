export interface ToolParam {
  name: string;
  unit?: string;
  type?: 'number' | 'string' | 'boolean';
  defaultValue?: number | string | boolean;
}

export interface ToolDefinition {
  id: string;
  name: string;
  category?: string;
  description?: string;
  params: ToolParam[];
  execute: (...args: any[]) => number | string | boolean;
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
  return tool.execute(...args);
}

