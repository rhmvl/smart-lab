import { registerTool } from "./calc-tool";

const DECIMALS_PRECISION = 6;

// Basic Arithmetic

registerTool({
  id: "add",
  name: "Addition",
  category: "Basic",
  description: "Add two or more numbers together",
  params: [
    { name: "A", type: "number" },
    { name: "B", type: "number" },
  ],
  execute: (a: number, b: number) => Number((a + b).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "subtract",
  name: "Subtraction",
  category: "Basic",
  description: "Subtract one number from another",
  params: [
    { name: "A", type: "number" },
    { name: "B", type: "number" },
  ],
  execute: (a: number, b: number) => Number((a - b).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "multiply",
  name: "Multiplication",
  category: "Basic",
  description: "Multiply two numbers",
  params: [
    { name: "A", type: "number" },
    { name: "B", type: "number" },
  ],
  execute: (a: number, b: number) => Number((a * b).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "divide",
  name: "Division",
  category: "Basic",
  description: "Divide one number by another (A / B)",
  params: [
    { name: "A", type: "number" },
    { name: "B", type: "number" },
  ],
  execute: (a: number, b: number) => (b !== 0 ? Number((a / b).toFixed(DECIMALS_PRECISION)) : NaN),
});

registerTool({
  id: "square",
  name: "Square",
  category: "Basic",
  description: "Compute the square of a number (x²)",
  params: [{ name: "x", type: "number" }],
  execute: (x: number) => Number(Math.pow(x, 2).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "sqrt",
  name: "Square Root",
  category: "Basic",
  description: "Compute the square root of a number (√x)",
  params: [{ name: "x", type: "number" }],
  execute: (x: number) => (x >= 0 ? Number(Math.sqrt(x).toFixed(DECIMALS_PRECISION)) : NaN),
});

registerTool({
  id: "negate",
  name: "Negate",
  category: "Basic",
  description: "Flip the sign of a number (+ ↔ −)",
  params: [{ name: "x", type: "number" }],
  execute: (x: number) => Number((-x).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "percent",
  name: "Percentage",
  category: "Basic",
  description: "Convert a number to percentage (x%) → x / 100",
  params: [{ name: "x", type: "number" }],
  execute: (x: number) => Number((x / 100).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "reciprocal",
  name: "Reciprocal",
  category: "Basic",
  description: "Compute the reciprocal of a number (1/x)",
  params: [{ name: "x", type: "number" }],
  execute: (x: number) => (x !== 0 ? Number((1 / x).toFixed(DECIMALS_PRECISION)) : NaN),
});

registerTool({
  id: "abs",
  name: "Absolute Value",
  category: "Basic",
  description: "Return the absolute value of a number (|x|)",
  params: [{ name: "x", type: "number" }],
  execute: (x: number) => Number(Math.abs(x).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "power",
  name: "Power",
  category: "Basic",
  description: "Raise a number to a power (xⁿ)",
  params: [
    { name: "Base", type: "number" },
    { name: "Exponent", type: "number" },
  ],
  execute: (base: number, exp: number) => Number(Math.pow(base, exp).toFixed(DECIMALS_PRECISION)),
});

// Geometry

registerTool({
  id: "volume_box",
  name: "Volume of Box",
  category: "Geometry",
  description: "Calculate the volume of a rectangular box (m³)",
  params: [
    { name: "Length", unit: "m", type: "number" },
    { name: "Width", unit: "m", type: "number" },
    { name: "Height", unit: "m", type: "number" },
  ],
  execute: (L: number, W: number, H: number) => Number((L * W * H).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "area_triangle",
  name: "Area of Triangle",
  category: "Geometry",
  description: "Calculate area of a triangle given base and height (m²)",
  params: [
    { name: "Base", unit: "m", type: "number" },
    { name: "Height", unit: "m", type: "number" },
  ],
  execute: (b: number, h: number) => Number(((b * h) / 2).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "area_circle",
  name: "Area of Circle",
  category: "Geometry",
  description: "Calculate the area of a circle (πr²)",
  params: [{ name: "Radius", unit: "m", type: "number" }],
  execute: (r: number) => Number((Math.PI * r * r).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "volume_sphere",
  name: "Volume of Sphere",
  category: "Geometry",
  description: "Calculate volume of a sphere (4/3πr³)",
  params: [{ name: "Radius", unit: "m", type: "number" }],
  execute: (r: number) => Number(((4 / 3) * Math.PI * Math.pow(r, 3)).toFixed(DECIMALS_PRECISION)),
});

registerTool({
  id: "volume_cylinder",
  name: "Volume of Cylinder",
  category: "Geometry",
  description: "Calculate volume of a cylinder (πr²h)",
  params: [
    { name: "Radius", unit: "m", type: "number" },
    { name: "Height", unit: "m", type: "number" },
  ],
  execute: (r: number, h: number) => Number((Math.PI * r * r * h).toFixed(DECIMALS_PRECISION)),
});

// Physics

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

// MATHS

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

// 🧮 Quadratic Formula (negative root)
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

