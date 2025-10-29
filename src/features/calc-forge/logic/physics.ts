import { DECIMALS_PRECISION, registerTool } from "../calc-tool";

registerTool({
  id: "density_calc",
  name: "Density",
  category: "Physics",
  description: "Calculate density (ρ = m / V)",
  params: [
    { name: "Mass", unit: "kg", type: "number" },
    { name: "Volume", unit: "m³", type: "number" },
  ],
  execute: (m: number, v: number) => (v > 0 ? Number((m / v).toFixed(DECIMALS_PRECISION)) : 0),
});

registerTool({
  id: "force_calc",
  name: "Force",
  category: "Physics",
  description: "Calculate force using F = m × a",
  params: [
    { name: "Mass", unit: "kg", type: "number" },
    { name: "Acceleration", unit: "m/s²", type: "number" },
  ],
  execute: (m: number, a: number) => Number((m * a).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "speed_calc",
  name: "Speed",
  category: "Physics",
  description: "Calculate speed using v = d / t",
  params: [
    { name: "Distance", unit: "m", type: "number" },
    { name: "Time", unit: "s", type: "number" },
  ],
  execute: (d: number, t: number) => (t > 0 ? Number((d / t).toFixed(DECIMALS_PRECISION)) : 0),
});

registerTool({
  id: "power_calc",
  name: "Power",
  category: "Physics",
  description: "Calculate power using P = W / t",
  params: [
    { name: "Work", unit: "J", type: "number" },
    { name: "Time", unit: "s", type: "number" },
  ],
  execute: (w: number, t: number) => (t > 0 ? Number((w / t).toFixed(DECIMALS_PRECISION)) : 0),
});

