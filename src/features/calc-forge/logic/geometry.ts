import { DECIMALS_PRECISION, registerTool } from "../calc-tool";

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

