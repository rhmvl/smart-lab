export const DARK_COLORS = {
	background: 0x111827,
	empty: 0xF3F4F6,
	primary: 0x818CF8,
	primaryHover: 0x6366F1,
	accent: 0x60A5FA,
	accentHover: 0x3B82F6,
	success: 0x34D399,
	warning: 0xFBBF24,
	error: 0xFB7185,
	compare: 0xFACC15,
	swap: 0xFB7185,
	sorted: 0x34D399,
	wall: 0x1F2937,
	start: 0x34D399,
	end: 0xF87171,
	path: 0xC084FC,
	openSet: 0xFDE68A,
	closedSet: 0x38BDF8,
}

export const LIGHT_COLORS = {
	background: 0xF9FAFB,
	text: 0x1F2937,
	primary: 0x6366F1,
	primaryHover: 0x4F46E5,
	accent: 0x3B82F6,
	accentHover: 0x2563EB,
	success: 0x10B981,
	warning: 0xFACC15,
	error: 0xEF4444,
	compare: 0xFBBF24,
	swap: 0xF43F5E,
	sorted: 0x10B981,
	wall: 0x2E3440,
	start: 0x81C784,
	end: 0xE57373,
	path: 0xAB47BC,
	openSet: 0xFFF280,
	closedSet: 0x80DFFF,
};
export const COLORS = DARK_COLORS;

export function hexToCss(hex: number) {
  return "#" + hex.toString(16).padStart(6, "0");
}

export function rgbaToHex(rgba: string) {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  const [_, r, g, b] = match.map(Number);
  return (r << 16) + (g << 8) + b;
}

