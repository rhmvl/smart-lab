export const COLORS = {
  background: 0xA6A6A6,
  primary: 0x6366f1,
  empty: 0xf5f5f5,
  wall: 0x2e3440,
  start: 0x81c784,
  end: 0xe57373,
  path: 0xab47bc,
  closedSet: 0x80DFFF,
  // path: 0xCDA4FF,
  openSet: 0xFFF280,
}

export function hexToCss(hex: number) {
  return "#" + hex.toString(16).padStart(6, "0");
}

export function rgbaToHex(rgba: string) {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  const [_, r, g, b] = match.map(Number);
  return (r << 16) + (g << 8) + b;
}

