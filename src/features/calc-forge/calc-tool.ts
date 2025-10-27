// src/features/calc-forge/calc-tool.ts

// --- Definisi Struktur (Tetap Sama) ---
export interface ToolParam {
  name: string; // Nama parameter (penting untuk referensi)
  label?: string; // Label yang ditampilkan di UI (misal: 'Jarak (s)')
  unit?: string;
  type?: 'number' | 'string' | 'boolean';
  defaultValue?: number | string | boolean;
}

export interface ToolDefinition {
  id: string; // ID unik (digunakan untuk memanggil, misal: velocity)
  name: string; // Nama yang ditampilkan (misal: Kecepatan Rata-rata)
  category?: string; // Kategori (misal: Fisika, Kimia, Basic)
  description?: string; // Deskripsi singkat / Rumus
  params: ToolParam[]; // Daftar parameter input
  // Fungsi execute menerima argumen sesuai urutan 'params'
  execute: (...args: number[]) => number | string | boolean; // Ubah ke number[] jika hanya angka
}

// --- Registry Alat (Tetap Sama) ---
export const toolRegistry: Record<string, ToolDefinition> = {};

// --- Fungsi Pendaftaran (Tetap Sama) ---
export function registerTool(tool: ToolDefinition): void {
  if (!tool.id || typeof tool.execute !== 'function') {
    throw new Error("Tool must have a valid 'id' and an 'execute' function.");
  }
  toolRegistry[tool.id] = tool;
}

// --- Fungsi Pengambilan Alat (Tetap Sama) ---
export function getAllTools(): ToolDefinition[] {
  return Object.values(toolRegistry);
}
export function getToolById(toolId: string): ToolDefinition | undefined {
  return toolRegistry[toolId];
}

// --- Fungsi Eksekusi (Tetap Sama) ---
export function runTool(toolId: string, args: any[] = []): number | string | boolean {
  const tool = toolRegistry[toolId];
  if (!tool) throw new Error(`Tool '${toolId}' not found.`);
  // Pastikan argumen sesuai tipe (misal: konversi ke number jika perlu)
  const numericArgs = args.map(arg => typeof arg === 'string' ? parseFloat(arg) : arg).filter(arg => !isNaN(arg as number));
  if (numericArgs.length !== tool.params.length) {
    throw new Error(`Invalid number of arguments for tool '${toolId}'. Expected ${tool.params.length}, got ${numericArgs.length}.`);
  }
  return tool.execute(...numericArgs);
}

// ===========================================
// === PENDAFTARAN RUMUS / ALAT SPESIFIK ===
// ===========================================

// --- Kategori: Basic ---
registerTool({
  id: 'add',
  name: 'Penjumlahan',
  category: 'Basic',
  description: 'a + b',
  params: [ { name: 'a', label: 'Angka 1' }, { name: 'b', label: 'Angka 2' } ],
  execute: (a, b) => a + b,
});
registerTool({
  id: 'subtract',
  name: 'Pengurangan',
  category: 'Basic',
  description: 'a - b',
  params: [ { name: 'a', label: 'Angka 1' }, { name: 'b', label: 'Angka 2' } ],
  execute: (a, b) => a - b,
});
// Tambahkan perkalian (multiply), pembagian (divide), pangkat (power), akar (sqrt) jika perlu

// --- Kategori: Fisika ---
registerTool({
  id: 'velocity',
  name: 'Kecepatan Rata-rata',
  category: 'Fisika',
  description: 'v = s / t',
  params: [
    { name: 's', label: 'Jarak (s)', unit: 'meter' },
             { name: 't', label: 'Waktu (t)', unit: 'detik' },
  ],
  execute: (s, t) => { // Argumen diterima sesuai urutan params: s, t
    if (t === 0) return 'Error: Waktu tidak boleh nol';
    return s / t;
  },
});

registerTool({
  id: 'volume_balok',
  name: 'Volume Balok',
  category: 'Fisika',
  description: 'V = p × l × t',
  params: [
    { name: 'p', label: 'Panjang (p)', unit: 'meter' },
             { name: 'l', label: 'Lebar (l)', unit: 'meter' },
             { name: 't', label: 'Tinggi (t)', unit: 'meter' },
  ],
  execute: (p, l, t) => { // Argumen: p, l, t
    if (p <= 0 || l <= 0 || t <= 0) return 'Error: Dimensi harus positif';
    return p * l * t;
  }
});
// Tambahkan rumus Fisika lain di sini...

// --- Kategori: Kimia ---
registerTool({
  id: 'molarity',
  name: 'Molaritas',
  category: 'Kimia',
  description: 'M = n / V',
  params: [
    { name: 'n', label: 'Mol zat (n)', unit: 'mol' },
             { name: 'V', label: 'Volume (V)', unit: 'Liter' },
  ],
  execute: (n, V) => { // Argumen: n, V
    if (V <= 0) return 'Error: Volume harus positif';
    return n / V;
  }
});
// Tambahkan rumus Kimia lain di sini...

// --- Kategori: Custom (Contoh) ---
// registerTool({
//   id: 'hitung_diskon',
//   name: 'Hitung Diskon',
//   category: 'Custom',
//   description: 'Harga Akhir = Harga Awal * (1 - (Diskon / 100))',
//   params: [
//       { name: 'harga_awal', label: 'Harga Awal' },
//       { name: 'diskon_persen', label: 'Diskon (%)' }
//   ],
//   execute: (harga_awal, diskon_persen) => {
//       if (diskon_persen < 0 || diskon_persen > 100) return 'Error: Diskon antara 0-100';
//       return harga_awal * (1 - (diskon_persen / 100));
//   }
// });

// ===========================================
// === AKHIR PENDAFTARAN ALAT ===
// ===========================================

// Sekarang, komponen CalcForgeDesktop/Mobile bisa menggunakan getAllTools()
// untuk mendapatkan daftar alat yang sudah terdaftar ini.
