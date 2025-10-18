export const COLORS = {
  background: 0x1e1e2e,
  empty: 0xf5f5f5,
  wall: 0x2e3440,
  start: 0x81c784,
  end: 0xe57373,
  path: 0xab47bc,
  closedSet: 0x64b5f6,
  // closedSet: 0xba68c8,
  openSet: 0xffa726,
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

