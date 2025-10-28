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
// --- Kategori: Kimia ---
// Tambahkan rumus Kimia lain di sini jika ada...
registerTool({
  id: 'molarity',
  name: 'Molaritas (M)',
             category: 'Kimia',
             description: 'M = mol zat terlarut / Volume larutan (L)',
             params: [
               { name: 'n', label: 'Mol zat (n)', unit: 'mol' },
             { name: 'V', label: 'Volume (V)', unit: 'Liter' },
             ],
             execute: (n, V) => {
               if (V <= 0) return 'Error: Volume harus positif';
               return Number((n / V).toFixed(DECIMALS_PRECISION)); // Tambah presisi
             }
});

registerTool({
  id: 'molality',
  name: 'Molalitas (m)',
             category: 'Kimia',
             description: 'm = mol zat terlarut / Massa pelarut (kg)',
             params: [
               { name: 'n', label: 'Mol zat (n)', unit: 'mol' },
             { name: 'mass_solvent', label: 'Massa Pelarut', unit: 'kg' },
             ],
             execute: (n, mass_solvent) => {
               if (mass_solvent <= 0) return 'Error: Massa pelarut harus positif';
               return Number((n / mass_solvent).toFixed(DECIMALS_PRECISION));
             }
});

registerTool({
  id: 'ideal_gas_law_PV',
  name: 'Hukum Gas Ideal (PV=nRT)',
             category: 'Kimia',
             description: 'Hitung Tekanan (P) atau Volume (V). R = 0.0821 L·atm/(mol·K)',
             params: [
               { name: 'n', label: 'Mol gas (n)', unit: 'mol' },
             { name: 'T', label: 'Suhu (T)', unit: 'Kelvin' },
             { name: 'V_or_P', label: 'Volume (L) jika mencari P, atau Tekanan (atm) jika mencari V', unit: 'L atau atm' },
             { name: 'find', label: 'Cari (ketik "P" atau "V")', type: 'string' } // Parameter string
             ],
             // Fungsi execute perlu menangani string dan number
             execute: (n: number, T: number, V_or_P: number, find: string) => {
               const R = 0.0821;
               if (n <= 0 || T <= 0 || V_or_P <= 0) return 'Error: n, T, dan V/P harus positif';
               if (find.toUpperCase() === 'P') { // Cari Tekanan
                 return Number(((n * R * T) / V_or_P).toFixed(DECIMALS_PRECISION)); // Hasil P dalam atm
               } else if (find.toUpperCase() === 'V') { // Cari Volume
                 return Number(((n * R * T) / V_or_P).toFixed(DECIMALS_PRECISION)); // Hasil V dalam Liter
               } else {
                 return 'Error: Parameter "Cari" harus "P" atau "V"';
               }
             }
});


registerTool({
  id: 'dilution',
  name: 'Pengenceran (M1V1 = M2V2)',
             category: 'Kimia',
             description: 'Hitung konsentrasi/volume sebelum/sesudah pengenceran',
             params: [
               { name: 'M1', label: 'Molaritas Awal (M1)', unit: 'M' },
             { name: 'V1', label: 'Volume Awal (V1)', unit: 'mL' },
             { name: 'M2', label: 'Molaritas Akhir (M2)', unit: 'M', defaultValue: NaN }, // Beri NaN agar bisa dideteksi mana yg dicari
             { name: 'V2', label: 'Volume Akhir (V2)', unit: 'mL', defaultValue: NaN }
             ],
             execute: (M1, V1, M2, V2) => {
               // Cari variabel yang kosong (NaN)
               if (isNaN(M2) && !isNaN(V2)) { // Cari M2
                 if (V2 <= 0) return 'Error: V2 harus positif';
                 return Number(((M1 * V1) / V2).toFixed(DECIMALS_PRECISION));
               } else if (!isNaN(M2) && isNaN(V2)) { // Cari V2
                 if (M2 <= 0) return 'Error: M2 harus positif';
                 return Number(((M1 * V1) / M2).toFixed(DECIMALS_PRECISION));
               } else if (isNaN(M1) || isNaN(V1)) {
                 return 'Error: M1 dan V1 harus diisi';
               } else {
                 return 'Error: Kosongkan M2 atau V2 yang ingin dicari';
               }
             }
});

// src/features/calc-forge/calc-tool.ts

// ... (Kode sebelumnya: ToolDefinition, registerTool, Basic, Fisika, Kimia Molaritas & Molalitas) ...

// === TAMBAHAN RUMUS KIMIA ===

// 1. Persen Massa
registerTool({
  id: 'percent_mass',
  name: 'Persen Massa (%)',
             category: 'Kimia',
             description: '% Massa = (Massa Zat / Massa Total Larutan) * 100%',
             params: [
               { name: 'massa_zat', label: 'Massa Zat (g)' },
             { name: 'massa_total', label: 'Massa Total (g)' },
             ],
             execute: (massa_zat, massa_total) => {
               if (massa_total === 0) return 'Error: Massa total tidak boleh nol';
               return Number(((massa_zat / massa_total) * 100).toFixed(DECIMALS_PRECISION));
             }
});

// 2. Fraksi Mol
registerTool({
  id: 'mole_fraction',
  name: 'Fraksi Mol (X)',
             category: 'Kimia',
             description: 'Xa = mol A / (mol A + mol B + ...)',
             params: [
               { name: 'mol_a', label: 'Mol Zat A (mol)' },
             { name: 'mol_total', label: 'Mol Total (mol)' },
             ],
             execute: (mol_a, mol_total) => {
               if (mol_total === 0) return 'Error: Mol total tidak boleh nol';
               return Number((mol_a / mol_total).toFixed(DECIMALS_PRECISION)); // Fraksi mol tidak bersatuan
             }
});

// 3. Menghitung Jumlah Mol dari Massa
registerTool({
  id: 'moles_from_mass',
  name: 'Mol dari Massa',
  category: 'Kimia',
  description: 'mol = Massa (g) / Massa Molar (g/mol)',
             params: [
               { name: 'massa', label: 'Massa Zat (g)' },
             { name: 'mr', label: 'Massa Molar (Mr/Ar)', unit: 'g/mol' },
             ],
             execute: (massa, mr) => {
               if (mr <= 0) return 'Error: Massa Molar harus positif';
               return Number((massa / mr).toFixed(DECIMALS_PRECISION));
             }
});

// 4. Menghitung pH Asam Kuat
registerTool({
  id: 'ph_strong_acid',
  name: 'pH Asam Kuat',
  category: 'Kimia',
  description: 'pH = -log[H+]. Untuk Asam Kuat: [H+] = Molaritas Asam * Valensi',
  params: [
    { name: 'molaritas', label: 'Molaritas Asam (M)' },
             { name: 'valensi', label: 'Valensi Asam (a)', defaultValue: 1 }, // Default valensi 1
  ],
  execute: (molaritas, valensi) => {
    if (molaritas <= 0 || valensi <= 0) return 'Error: Molaritas & Valensi > 0';
    const H_plus = molaritas * valensi;
    return Number((-Math.log10(H_plus)).toFixed(DECIMALS_PRECISION));
  }
});

// 5. Menghitung pH Basa Kuat
registerTool({
  id: 'poh_strong_base',
  name: 'pOH Basa Kuat',
  category: 'Kimia',
  description: 'pOH = -log[OH-]. Untuk Basa Kuat: [OH-] = Molaritas Basa * Valensi',
  params: [
    { name: 'molaritas', label: 'Molaritas Basa (M)' },
             { name: 'valensi', label: 'Valensi Basa (b)', defaultValue: 1 }, // Default valensi 1
  ],
  execute: (molaritas, valensi) => {
    if (molaritas <= 0 || valensi <= 0) return 'Error: Molaritas & Valensi > 0';
    const OH_minus = molaritas * valensi;
    return Number((-Math.log10(OH_minus)).toFixed(DECIMALS_PRECISION));
    // Ingat: pH = 14 - pOH
  }
});

// 6. Konsentrasi Persen Volume
registerTool({
  id: 'percent_volume',
  name: 'Persen Volume (%)',
             category: 'Kimia',
             description: '% Volume = (Volume Zat / Volume Total Larutan) * 100%',
             params: [
               { name: 'volume_zat', label: 'Volume Zat (mL)' },
             { name: 'volume_total', label: 'Volume Total (mL)' },
             ],
             execute: (volume_zat, volume_total) => {
               if (volume_total === 0) return 'Error: Volume total tidak boleh nol';
               return Number(((volume_zat / volume_total) * 100).toFixed(DECIMALS_PRECISION));
             }
});

// 7. Jumlah Partikel
registerTool({
  id: 'number_of_particles',
  name: 'Jumlah Partikel',
  category: 'Kimia',
  description: 'Jumlah Partikel = mol * Bilangan Avogadro (6.022 x 10^23)',
             params: [
               { name: 'mol', label: 'Jumlah Mol (mol)' },
             ],
             execute: (mol) => {
               const avogadro = 6.022e23;
               return Number((mol * avogadro).toExponential(DECIMALS_PRECISION)); // Hasil dalam notasi ilmiah
             }
});

// 8. Massa Jenis (Sudah ada di Fisika, tapi relevan di Kimia juga)
registerTool({
  id: 'density_calc_chem', // ID berbeda jika 'density_calc' sudah ada
  name: 'Massa Jenis (Kimia)',
             category: 'Kimia',
             description: 'ρ = Massa (g) / Volume (mL atau cm³)',
             params: [
               { name: 'massa', label: 'Massa (g)', unit: 'g' },
             { name: 'volume', label: 'Volume (mL)', unit: 'mL' },
             ],
             execute: (massa, volume) => {
               if (volume <= 0) return 'Error: Volume harus positif';
               return Number((massa / volume).toFixed(DECIMALS_PRECISION));
             }
});

// 9. Perhitungan ΔH Reaksi (Hukum Hess - contoh sederhana)
registerTool({
  id: 'delta_h_hess',
  name: 'ΔH Reaksi (Hess)',
             category: 'Kimia',
             description: 'ΔH total = ΔH1 + ΔH2 + ... (Penjumlahan entalpi tahap reaksi)',
             params: [
               { name: 'delta_h1', label: 'ΔH tahap 1 (kJ/mol)' },
             { name: 'delta_h2', label: 'ΔH tahap 2 (kJ/mol)', defaultValue: 0 },
             { name: 'delta_h3', label: 'ΔH tahap 3 (kJ/mol)', defaultValue: 0 }, // Bisa ditambah tahap lain
             ],
             execute: (delta_h1, delta_h2, delta_h3) => {
               return Number((delta_h1 + delta_h2 + delta_h3).toFixed(DECIMALS_PRECISION));
             }
});

// 10. Energi Aktivasi (Arrhenius - versi sederhana mencari k)
registerTool({
  id: 'arrhenius_k',
  name: 'Konstanta Laju (k)',
             category: 'Kimia',
             description: 'k = A * exp(-Ea / (RT))',
             params: [
               { name: 'A', label: 'Faktor Pra-eksponensial (A)' }, // Unit tergantung orde reaksi
             { name: 'Ea', label: 'Energi Aktivasi (Ea)', unit: 'J/mol' },
             { name: 'T', label: 'Suhu (T)', unit: 'Kelvin' },
             ],
             execute: (A, Ea, T) => {
               const R = 8.314; // Konstanta gas ideal (J/(mol·K))
if (T <= 0) return 'Error: Suhu harus positif Kelvin';
const k = A * Math.exp(-Ea / (R * T));
return Number(k.toExponential(DECIMALS_PRECISION)); // Hasil dalam notasi ilmiah
             }
});

// src/features/calc-forge/calc-tool.ts

// ... (Kode sebelumnya: ToolDefinition, registerTool, Basic, Fisika Awal, Kimia Awal) ...

// ==========================
// === TAMBAHAN GEOMETRI ===
// ==========================
// (Rumus Area Segitiga, Lingkaran, Volume Bola, Silinder sudah ada)

// 6. Keliling Lingkaran
registerTool({
  id: 'circumference_circle',
  name: 'Keliling Lingkaran',
  category: 'Geometry',
  description: 'K = 2πr',
  params: [{ name: 'r', label: 'Jari-jari (r)', unit: 'm' }],
             execute: (r) => Number((2 * Math.PI * r).toFixed(DECIMALS_PRECISION)),
});

// 7. Luas Permukaan Kubus
registerTool({
  id: 'surface_area_cube',
  name: 'Luas Permukaan Kubus',
  category: 'Geometry',
  description: 'L = 6s²',
  params: [{ name: 's', label: 'Sisi (s)', unit: 'm' }],
             execute: (s) => Number((6 * s * s).toFixed(DECIMALS_PRECISION)),
});

// 8. Luas Permukaan Balok
registerTool({
  id: 'surface_area_box',
  name: 'Luas Permukaan Balok',
  category: 'Geometry',
  description: 'L = 2(pl + pt + lt)',
             params: [
               { name: 'p', label: 'Panjang (p)', unit: 'm' },
             { name: 'l', label: 'Lebar (l)', unit: 'm' },
             { name: 't', label: 'Tinggi (t)', unit: 'm' },
             ],
             execute: (p, l, t) => Number((2 * ((p * l) + (p * t) + (l * t))).toFixed(DECIMALS_PRECISION)),
});

// 9. Luas Permukaan Bola
registerTool({
  id: 'surface_area_sphere',
  name: 'Luas Permukaan Bola',
  category: 'Geometry',
  description: 'L = 4πr²',
  params: [{ name: 'r', label: 'Jari-jari (r)', unit: 'm' }],
             execute: (r) => Number((4 * Math.PI * r * r).toFixed(DECIMALS_PRECISION)),
});

// 10. Volume Kerucut
registerTool({
  id: 'volume_cone',
  name: 'Volume Kerucut',
  category: 'Geometry',
  description: 'V = (1/3)πr²h',
             params: [
               { name: 'r', label: 'Jari-jari Alas (r)', unit: 'm' },
             { name: 'h', label: 'Tinggi (h)', unit: 'm' },
             ],
             execute: (r, h) => Number(((1 / 3) * Math.PI * r * r * h).toFixed(DECIMALS_PRECISION)),
});

// ========================
// === TAMBAHAN FISIKA ===
// ========================
// (Rumus Massa Jenis, Gaya, Kecepatan, Daya sudah ada)

// 5. Energi Kinetik
registerTool({
  id: 'kinetic_energy',
  name: 'Energi Kinetik (EK)',
             category: 'Fisika',
             description: 'EK = ½mv²',
             params: [
               { name: 'm', label: 'Massa (m)', unit: 'kg' },
             { name: 'v', label: 'Kecepatan (v)', unit: 'm/s' },
             ],
             execute: (m, v) => Number((0.5 * m * v * v).toFixed(DECIMALS_PRECISION)),
});

// 6. Energi Potensial Gravitasi
registerTool({
  id: 'potential_energy_gravity',
  name: 'Energi Potensial Gravitasi (EP)',
             category: 'Fisika',
             description: 'EP = mgh (g ≈ 9.8 m/s²)',
             params: [
               { name: 'm', label: 'Massa (m)', unit: 'kg' },
             { name: 'h', label: 'Ketinggian (h)', unit: 'm' },
             { name: 'g', label: 'Gravitasi (g)', unit: 'm/s²', defaultValue: 9.8 },
             ],
             execute: (m, h, g = 9.8) => Number((m * g * h).toFixed(DECIMALS_PRECISION)),
});

// 7. Usaha (Work)
registerTool({
  id: 'work_calc',
  name: 'Usaha (W)',
             category: 'Fisika',
             description: 'W = F × d × cos(θ)',
             params: [
               { name: 'F', label: 'Gaya (F)', unit: 'Newton' },
             { name: 'd', label: 'Perpindahan (d)', unit: 'meter' },
             { name: 'theta', label: 'Sudut (θ)', unit: 'derajat', defaultValue: 0 }, // Sudut dalam derajat
             ],
             execute: (F, d, theta = 0) => {
               const angleRad = (theta * Math.PI) / 180; // Konversi ke radian
               return Number((F * d * Math.cos(angleRad)).toFixed(DECIMALS_PRECISION));
             }
});

// 8. Tekanan (Pressure)
registerTool({
  id: 'pressure_calc',
  name: 'Tekanan (P)',
             category: 'Fisika',
             description: 'P = F / A',
             params: [
               { name: 'F', label: 'Gaya (F)', unit: 'Newton' },
             { name: 'A', label: 'Luas Area (A)', unit: 'm²' },
             ],
             execute: (F, A) => {
               if (A <= 0) return 'Error: Luas Area harus positif';
               return Number((F / A).toFixed(DECIMALS_PRECISION));
             }
});

// 9. Hukum Ohm (Mencari V)
registerTool({
  id: 'ohm_law_v',
  name: 'Hukum Ohm (V = IR)',
             category: 'Fisika',
             description: 'Hitung Tegangan (V)',
             params: [
               { name: 'I', label: 'Arus (I)', unit: 'Ampere' },
             { name: 'R', label: 'Hambatan (R)', unit: 'Ohm' },
             ],
             execute: (I, R) => Number((I * R).toFixed(DECIMALS_PRECISION)),
});

// 10. Frekuensi Gelombang
registerTool({
  id: 'wave_frequency',
  name: 'Frekuensi Gelombang (f)',
             category: 'Fisika',
             description: 'f = v / λ',
             params: [
               { name: 'v', label: 'Cepat Rambat (v)', unit: 'm/s' },
             { name: 'lambda', label: 'Panjang Gelombang (λ)', unit: 'meter' },
             ],
             execute: (v, lambda) => {
               if (lambda === 0) return 'Error: Panjang gelombang tidak boleh nol';
               return Number((v / lambda).toFixed(DECIMALS_PRECISION));
             }
});

// ===========================
// === TAMBAHAN MATEMATIKA ===
// ===========================
// (Rumus Pythagoras, Akar Kuadratik +/-, Log10, Ln, Exp, Sin, Cos, Tan sudah ada)

// 1. Faktorial
registerTool({
  id: 'factorial',
  name: 'Faktorial (!)',
             category: 'Mathematics',
             description: 'n! = n * (n-1) * ... * 1',
             params: [{ name: 'n', label: 'Angka (n)' }], // Harus bilangan bulat non-negatif
             execute: (n) => {
               if (n < 0 || !Number.isInteger(n)) return 'Error: n harus bilangan bulat ≥ 0';
               if (n === 0) return 1;
               let result = 1;
               for (let i = n; i > 1; i--) {
                 result *= i;
               }
               // Hati-hati overflow untuk n besar
               return result;
             }
});

// 2. Permutasi
registerTool({
  id: 'permutation',
  name: 'Permutasi (nPr)',
             category: 'Mathematics',
             description: 'nPr = n! / (n-r)!',
             params: [
               { name: 'n', label: 'Total item (n)' },
             { name: 'r', label: 'Item dipilih (r)' },
             ],
             execute: (n, r) => {
               if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r) || r > n) return 'Error: n, r bulat ≥ 0, r ≤ n';
const factorial = (num: number): number => {
  if (num === 0) return 1; let res = 1; for (let i = num; i > 1; i--) res *= i; return res;
}
return factorial(n) / factorial(n - r);
             }
});

// 3. Kombinasi
registerTool({
  id: 'combination',
  name: 'Kombinasi (nCr)',
             category: 'Mathematics',
             description: 'nCr = n! / (r! * (n-r)!)',
             params: [
               { name: 'n', label: 'Total item (n)' },
             { name: 'r', label: 'Item dipilih (r)' },
             ],
             execute: (n, r) => {
               if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r) || r > n) return 'Error: n, r bulat ≥ 0, r ≤ n';
const factorial = (num: number): number => {
  if (num === 0) return 1; let res = 1; for (let i = num; i > 1; i--) res *= i; return res;
}
return factorial(n) / (factorial(r) * factorial(n - r));
             }
});

// 4. Arcsin (hasil dalam derajat)
registerTool({
  id: 'asin_deg',
  name: 'Arcsin (sin⁻¹)',
             category: 'Mathematics',
             description: 'Menghitung sudut (derajat) dari nilai sinus (-1 ≤ x ≤ 1)',
             params: [{ name: 'x', label: 'Nilai Sinus (x)' }],
             execute: (x) => {
               if (x < -1 || x > 1) return 'Error: x harus antara -1 dan 1';
               return Number((Math.asin(x) * 180 / Math.PI).toFixed(DECIMALS_PRECISION));
             }
});

// 5. Arccos (hasil dalam derajat)
registerTool({
  id: 'acos_deg',
  name: 'Arccos (cos⁻¹)',
             category: 'Mathematics',
             description: 'Menghitung sudut (derajat) dari nilai cosinus (-1 ≤ x ≤ 1)',
             params: [{ name: 'x', label: 'Nilai Cosinus (x)' }],
             execute: (x) => {
               if (x < -1 || x > 1) return 'Error: x harus antara -1 dan 1';
               return Number((Math.acos(x) * 180 / Math.PI).toFixed(DECIMALS_PRECISION));
             }
});

// 6. Arctan (hasil dalam derajat)
registerTool({
  id: 'atan_deg',
  name: 'Arctan (tan⁻¹)',
             category: 'Mathematics',
             description: 'Menghitung sudut (derajat) dari nilai tangen',
             params: [{ name: 'x', label: 'Nilai Tangen (x)' }],
             execute: (x) => {
               return Number((Math.atan(x) * 180 / Math.PI).toFixed(DECIMALS_PRECISION));
             }
});

// 7. Modulo (Sisa Bagi)
registerTool({
  id: 'modulo',
  name: 'Modulo (sisa bagi)',
             category: 'Mathematics',
             description: 'Menghitung sisa pembagian a oleh b (a mod b)',
             params: [
               { name: 'a', label: 'Angka (a)' },
             { name: 'b', label: 'Pembagi (b)' },
             ],
             execute: (a, b) => {
               if (b === 0) return 'Error: Pembagi tidak boleh nol';
               return a % b;
             }
});

// 8. Rata-rata Aritmatika (hingga 5 angka)
registerTool({
  id: 'average',
  name: 'Rata-rata',
  category: 'Mathematics',
  description: 'Menghitung rata-rata dari beberapa angka',
  params: [
    { name: 'n1', label: 'Angka 1' },
    { name: 'n2', label: 'Angka 2', defaultValue: NaN },
    { name: 'n3', label: 'Angka 3 (Ops)', defaultValue: NaN },
             { name: 'n4', label: 'Angka 4 (Ops)', defaultValue: NaN },
             { name: 'n5', label: 'Angka 5 (Ops)', defaultValue: NaN },
  ],
  execute: (n1, n2, n3, n4, n5) => {
    const numbers = [n1, n2, n3, n4, n5].filter(n => !isNaN(n)); // Filter angka yang valid
    if (numbers.length === 0) return 'Error: Masukkan setidaknya satu angka';
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / numbers.length).toFixed(DECIMALS_PRECISION));
  }
});

// 9. Pembulatan ke Atas (Ceiling)
registerTool({
  id: 'ceil',
  name: 'Pembulatan ke Atas',
  category: 'Mathematics',
  description: 'Membulatkan angka ke bilangan bulat terdekat ke atas',
  params: [{ name: 'x', label: 'Angka (x)' }],
             execute: (x) => Math.ceil(x),
});

// 10. Pembulatan ke Bawah (Floor)
registerTool({
  id: 'floor',
  name: 'Pembulatan ke Bawah',
  category: 'Mathematics',
  description: 'Membulatkan angka ke bilangan bulat terdekat ke bawah',
  params: [{ name: 'x', label: 'Angka (x)' }],
             execute: (x) => Math.floor(x),
});

// ========================
// === TAMBAHAN FISIKA ===
// ========================

// 6. Momentum (p)
registerTool({
  id: 'momentum',
  name: 'Momentum (p)',
             category: 'Fisika',
             description: 'p = m × v',
             params: [
               { name: 'm', label: 'Massa (m)', unit: 'kg' },
             { name: 'v', label: 'Kecepatan (v)', unit: 'm/s' },
             ],
             execute: (m, v) => Number((m * v).toFixed(DECIMALS_PRECISION)),
});

// 7. Impuls (I)
registerTool({
  id: 'impulse',
  name: 'Impuls (I)',
             category: 'Fisika',
             description: 'I = F × Δt (Perubahan Momentum)',
             params: [
               { name: 'F', label: 'Gaya (F)', unit: 'Newton' },
             { name: 'delta_t', label: 'Selang Waktu (Δt)', unit: 'detik' },
             ],
             execute: (F, delta_t) => Number((F * delta_t).toFixed(DECIMALS_PRECISION)),
});

// 8. Periode Getaran/Gelombang (T)
registerTool({
  id: 'period_oscillation',
  name: 'Periode (T)',
             category: 'Fisika',
             description: 'T = 1 / f',
             params: [
               { name: 'f', label: 'Frekuensi (f)', unit: 'Hz' },
             ],
             execute: (f) => {
               if (f === 0) return 'Error: Frekuensi tidak boleh nol';
               return Number((1 / f).toFixed(DECIMALS_PRECISION));
             }
});

// 9. Tekanan Hidrostatis
registerTool({
  id: 'hydrostatic_pressure',
  name: 'Tekanan Hidrostatis (Ph)',
             category: 'Fisika',
             description: 'Ph = ρ × g × h (g ≈ 9.8 m/s²)',
             params: [
               { name: 'rho', label: 'Massa Jenis Fluida (ρ)', unit: 'kg/m³' },
             { name: 'h', label: 'Kedalaman (h)', unit: 'm' },
             { name: 'g', label: 'Gravitasi (g)', unit: 'm/s²', defaultValue: 9.8 },
             ],
             execute: (rho, h, g = 9.8) => Number((rho * g * h).toFixed(DECIMALS_PRECISION)),
});

// 10. Kapasitas Kalor (C)
registerTool({
  id: 'heat_capacity',
  name: 'Kapasitas Kalor (C)',
             category: 'Fisika',
             description: 'C = Q / ΔT',
             params: [
               { name: 'Q', label: 'Kalor (Q)', unit: 'Joule' },
             { name: 'delta_T', label: 'Perubahan Suhu (ΔT)', unit: '°C atau K' },
             ],
             execute: (Q, delta_T) => {
               if (delta_T === 0) return 'Error: Perubahan suhu tidak boleh nol';
               return Number((Q / delta_T).toFixed(DECIMALS_PRECISION));
             }
});

// ... (Kode kategori Matematika, Custom, Akhir Pendaftaran) ...
