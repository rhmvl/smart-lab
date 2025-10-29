import { DECIMALS_PRECISION, registerTool } from "../calc-tool";

registerTool({
  id: "pythagoras",
  name: "Pythagoras Theorem",
  category: "Mathematics",
  description: "Calculate the hypotenuse (c) given sides a and b",
  params: [
    { name: "Side A", unit: "m", type: "number" },
    { name: "Side B", unit: "m", type: "number" },
  ],
  execute: (a: number, b: number) => Number(Math.sqrt(a * a + b * b).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "quadratic_root",
  name: "Quadratic Root (+)",
  category: "Mathematics",
  description: "Solve ax² + bx + c = 0 (positive root)",
  params: [
    { name: "a", type: "number" },
    { name: "b", type: "number" },
    { name: "c", type: "number" },
  ],
  execute: (a: number, b: number, c: number) => {
    if (a === 0) return -c / b;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return NaN;
    return Number(((-b + Math.sqrt(discriminant)) / (2 * a)).toFixed(DECIMALS_PRECISION));
  },
});

registerTool({
  id: "quadratic_root_neg",
  name: "Quadratic Root (−)",
  category: "Mathematics",
  description: "Solve ax² + bx + c = 0 (negative root)",
  params: [
    { name: "a", type: "number" },
    { name: "b", type: "number" },
    { name: "c", type: "number" },
  ],
  execute: (a: number, b: number, c: number) => {
    if (a === 0) return -c / b;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return NaN;
    return Number(((-b - Math.sqrt(discriminant)) / (2 * a)).toFixed(DECIMALS_PRECISION));
  },
});

registerTool({
  id: "log10_calc",
  name: "Logarithm (base 10)",
  category: "Mathematics",
  description: "Calculate log₁₀(x)",
  params: [{ name: "x", type: "number" }],
  execute: (x: number) => (x > 0 ? Number(Math.log10(x).toFixed(DECIMALS_PRECISION)) : NaN),
});

registerTool({
  id: "ln_calc",
  name: "Natural Logarithm",
  category: "Mathematics",
  description: "Calculate ln(x)",
  params: [{ name: "x", type: "number" }],
  execute: (x: number) => (x > 0 ? Number(Math.log(x).toFixed(DECIMALS_PRECISION)) : NaN),
});

registerTool({
  id: "exp_calc",
  name: "Exponential (e^x)",
  category: "Mathematics",
  description: "Calculate eˣ",
  params: [{ name: "x", type: "number" }],
  execute: (x: number) => Number(Math.exp(x).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "sin",
  name: "Sine (°)",
  category: "Mathematics",
  description: "Calculate sine of an angle in degrees",
  params: [{ name: "Angle", unit: "°", type: "number" }],
  execute: (angle: number) => Number(Math.sin((angle * Math.PI) / 180).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "cos",
  name: "Cosine (°)",
  category: "Mathematics",
  description: "Calculate cosine of an angle in degrees",
  params: [{ name: "Angle", unit: "°", type: "number" }],
  execute: (angle: number) => Number(Math.cos((angle * Math.PI) / 180).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "tan",
  name: "Tangent (°)",
  category: "Mathematics",
  description: "Calculate tangent of an angle in degrees",
  params: [{ name: "Angle", unit: "°", type: "number" }],
  execute: (angle: number) => Number(Math.tan((angle * Math.PI) / 180).toFixed(DECIMALS_PRECISION)),
});

