import { DECIMALS_PRECISION, registerTool } from "../calc-tool";

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

