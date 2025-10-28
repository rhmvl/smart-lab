// src/features/calc-forge/CalcForgeDesktop.tsx
import React, { useState, useMemo } from 'react';
// Impor fungsi dan tipe dari calc-tool.ts
import { getAllTools, type ToolDefinition } from './calc-tool';
// Impor CSS jika Anda membuatnya (opsional jika hanya pakai Tailwind)
// import './CalcForgeDesktop.css';

export default function CalcForgeDesktop() {
  // Ambil semua alat/rumus saat komponen dimuat
  const allTools = useMemo(() => getAllTools(), []);

  // State untuk mengelola UI
  const [selectedCategory, setSelectedCategory] = useState<'Fisika' | 'Kimia' | 'Basic' | 'Geometry' | 'Mathematics'>(
    // Coba cari kategori pertama yang ada alatnya, fallback ke 'Basic' atau kategori pertama
    allTools.find(t => t.category)?.category || allTools[0]?.category || 'Basic'
  );
  const [selectedFormula, setSelectedFormula] = useState<ToolDefinition | null>(
    // Cari alat pertama dalam kategori default
    allTools.find(f => f.category === selectedCategory) || allTools[0] || null
  );
  const [inputValues, setInputValues] = useState<Record<string, string>>({}); // Simpan input sebagai string
  const [result, setResult] = useState<number | string | null>(null);

  // Handler saat nilai input berubah
  const handleInputChange = (paramName: string, value: string) => {
    setInputValues(prev => ({ ...prev, [paramName]: value }));
    setResult(null); // Reset hasil saat input diubah
  };

  // Handler saat tombol "Hitung" diklik
  const calculateResult = () => {
    if (!selectedFormula) return;

    const numericInputs: Record<string, number> = {};
    let allInputsValid = true;
    let missingParams: string[] = []; // Lacak parameter yang kosong

    // Validasi dan konversi input
    for (const param of selectedFormula.params) {
      const valueString = inputValues[param.name];
      // Anggap input kosong = tidak valid, kecuali ada defaultValue
      if (valueString === undefined || valueString.trim() === '') {
        if (param.defaultValue !== undefined) {
          // Jika ada default, gunakan itu (pastikan tipenya number jika perlu)
          numericInputs[param.name] = typeof param.defaultValue === 'string' ? parseFloat(param.defaultValue) : (param.defaultValue as number);
          if (isNaN(numericInputs[param.name])) {
            allInputsValid = false;
            missingParams.push(param.label || param.name);
          }
        } else {
          allInputsValid = false;
          missingParams.push(param.label || param.name);
        }
        continue; // Lanjut ke parameter berikutnya
      }

      const value = parseFloat(valueString);
      if (isNaN(value)) {
        allInputsValid = false;
        missingParams.push(param.label || param.name);
      }
      numericInputs[param.name] = value;
    }

    // Jika ada input tidak valid/kosong
    if (!allInputsValid) {
      setResult(`Input tidak valid atau kosong untuk: ${missingParams.join(', ')}`);
      return;
    }

    // Lakukan perhitungan
    try {
      // Ambil argumen sesuai urutan 'params'
      const argsInOrder = selectedFormula.params.map(p => numericInputs[p.name]);
      const calculationResult = selectedFormula.execute(...argsInOrder);
      setResult(calculationResult);
    } catch (error) {
      console.error("Calculation error:", error);
      // Tampilkan pesan error yang lebih informatif jika memungkinkan
      setResult(error instanceof Error ? `Error: ${error.message}` : 'Error perhitungan');
    }
  };

  // Filter rumus berdasarkan kategori terpilih
  const filteredFormulas = useMemo(() =>
  allTools.filter(f => f.category === selectedCategory),
                                   [selectedCategory, allTools]
  );

  // Dapatkan daftar kategori unik dari alat yang ada
  const categories = useMemo(() =>
  [...new Set(allTools.map(t => t.category || 'Lainnya'))]
  .sort((a,b) => a === 'Basic' ? -1 : b === 'Basic' ? 1 : a.localeCompare(b)), // Urutkan, Basic di depan
                             [allTools]
  );

  // Handler saat kategori diubah
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as any);
    // Pilih otomatis rumus pertama di kategori baru
    setSelectedFormula(allTools.find(f => f.category === category) || null);
    setInputValues({}); // Reset input
    setResult(null);    // Reset hasil
  };

  return (
    // Container utama
    <div className="flex w-full max-w-6xl mx-auto my-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-[70vh]">

    {/* === KOLOM KIRI: PEMILIHAN RUMUS === */}
    <div className="w-2/5 lg:w-1/3 bg-gray-50 dark:bg-gray-700 p-4 border-r border-gray-200 dark:border-gray-600 flex flex-col overflow-hidden">
    <h2 className="text-lg lg:text-xl font-semibold mb-3 text-center text-gray-800 dark:text-gray-100 flex-shrink-0">Pilih Rumus</h2>
    {/* Tab Kategori */}
    <div className="flex-shrink-0 mb-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
    <div className="flex w-max rounded-md border border-gray-300 dark:border-gray-500 overflow-hidden">
    {categories.map(category => (
      <button
      key={category}
      onClick={() => handleCategoryChange(category)}
      className={`flex-1 py-2 px-3 text-xs sm:text-sm font-medium transition whitespace-nowrap ${selectedCategory === category ? 'bg-indigo-600 text-white shadow-inner' : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'}`}
      >
      {category}
      </button>
    ))}
    </div>
    </div>
    {/* Daftar Rumus */}
    <ul className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
    {filteredFormulas.map(formula => (
      <li
      key={formula.id}
      className={`block w-full text-left p-3 rounded cursor-pointer transition text-sm ${selectedFormula?.id === formula.id ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
      onClick={() => { setSelectedFormula(formula); setInputValues({}); setResult(null); }}
      >
      {formula.name}
      </li>
    ))}
    {filteredFormulas.length === 0 && (
      <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">Tidak ada rumus di kategori ini.</p>
    )}
    </ul>
    </div>

    {/* === KOLOM KANAN: KALKULATOR AKTIF === */}
    <div className="w-3/5 lg:w-2/3 p-6 flex flex-col overflow-hidden">
    {selectedFormula ? (
      <>
      <h3 className="text-xl lg:text-2xl font-bold mb-2 text-center text-indigo-700 dark:text-indigo-400 flex-shrink-0">{selectedFormula.name}</h3>
      {/* Deskripsi/Rumus */}
      {selectedFormula.description && (
        <p className="text-sm text-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded mb-4 flex-shrink-0">
        {selectedFormula.description}
        </p>
      )}
      {/* Area Input (Scrollable) */}
      <div className="flex-1 space-y-3 mb-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
      {selectedFormula.params.map(variable => (
        <div key={variable.name} className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
        <label htmlFor={variable.name} className="w-full sm:w-2/5 lg:w-1/3 mb-1 sm:mb-0 text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
        {variable.label || variable.name}:
        </label>
        <input
        type={variable.type === 'number' ? 'number' : 'text'} // Sesuaikan tipe input
        id={variable.name}
        placeholder={variable.unit || ''}
        value={inputValues[variable.name] || ''}
        onChange={(e) => handleInputChange(variable.name, e.target.value)}
        className="w-full sm:flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        // Tambahkan step="any" untuk desimal jika perlu
        step={variable.type === 'number' ? "any" : undefined}
        />
        </div>
      ))}
      </div>
      {/* Tombol Hitung & Hasil (Fixed Bottom) */}
      <div className="flex-shrink-0 space-y-4">
      <button
      className="w-full sm:w-auto mx-auto block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={calculateResult}
      disabled={!selectedFormula || selectedFormula.params.length === 0} // Disable jika tidak ada parameter
      >
      Hitung
      </button>
      {result !== null && (
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center border border-gray-200 dark:border-gray-600">
        <h4 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Hasil:</h4>
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 break-words">
        {typeof result === 'number' ? result.toLocaleString(undefined, { maximumFractionDigits: 6 }) : result} {/* Format angka */}
        {/* (Logika unit hasil perlu disesuaikan jika execute mengembalikan unit) */}
        </p>
        </div>
      )}
      </div>
      </>
    ) : (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Pilih rumus dari daftar di sebelah kiri.</p>
    )}
    </div>
    </div>
  );
}
