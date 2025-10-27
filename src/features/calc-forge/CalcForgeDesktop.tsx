// src/features/calc-forge/CalcForgeDesktop.tsx
import React, { useState, useMemo } from 'react'; // Tambahkan useMemo
// === UBAH IMPORT INI ===
import { getAllTools, type ToolDefinition } from './calc-tool'; // Impor getAllTools dan ToolDefinition

// (Anda mungkin perlu menambahkan CSS atau menggunakan Tailwind di sini)
// import './CalcForgeDesktop.css';

export default function CalcForgeDesktop() {
  const [selectedCategory, setSelectedCategory] = useState<'Fisika' | 'Kimia'>('Fisika');
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(
    formulas.find(f => f.category === 'Fisika') || null // Pilih rumus Fisika pertama
  );
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | string | null>(null);

  const handleInputChange = (symbol: string, value: string) => {
    setInputValues(prev => ({ ...prev, [symbol]: value }));
    setResult(null);
  };

  const calculateResult = () => {
    if (!selectedFormula) return;
    const numericInputs: Record<string, number> = {};
    let allInputsValid = true;
    for (const variable of selectedFormula.variables) {
      const value = parseFloat(inputValues[variable.symbol]);
      if (isNaN(value)) { allInputsValid = false; break; }
      numericInputs[variable.symbol] = value;
    }
    if (!allInputsValid) { setResult("Input tidak valid."); return; }
    try {
      const calculationResult = selectedFormula.calculate(numericInputs);
      setResult(calculationResult);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult('Error perhitungan');
    }
  };

  const filteredFormulas = formulas.filter(f => f.category === selectedCategory);

  return (
    // Gunakan flex untuk membuat dua kolom
    <div className="flex w-full max-w-5xl mx-auto my-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden min-h-[600px]">

    {/* === KOLOM KIRI: PEMILIHAN RUMUS === */}
    <div className="w-2/5 bg-gray-50 dark:bg-gray-700 p-6 border-r border-gray-200 dark:border-gray-600 flex flex-col">
    <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">Pilih Rumus</h2>
    {/* Tab Kategori */}
    <div className="flex mb-4 rounded-md border border-gray-300 dark:border-gray-500 overflow-hidden">
    <button
    onClick={() => { setSelectedCategory('Fisika'); setSelectedFormula(formulas.find(f => f.category === 'Fisika') || null); setInputValues({}); setResult(null); }}
    className={`flex-1 py-2 px-3 text-sm font-medium transition ${selectedCategory === 'Fisika' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'}`}
    >
    Fisika
    </button>
    <button
    onClick={() => { setSelectedCategory('Kimia'); setSelectedFormula(formulas.find(f => f.category === 'Kimia') || null); setInputValues({}); setResult(null); }}
    className={`flex-1 py-2 px-3 text-sm font-medium transition ${selectedCategory === 'Kimia' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'}`}
    >
    Kimia
    </button>
    </div>
    {/* Daftar Rumus */}
    <ul className="flex-1 overflow-y-auto space-y-1 pr-2"> {/* Tambah pr-2 agar scrollbar tidak mepet */}
    {filteredFormulas.map(formula => (
      <li
      key={formula.id}
      className={`p-3 rounded cursor-pointer transition text-sm ${selectedFormula?.id === formula.id ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
      onClick={() => { setSelectedFormula(formula); setInputValues({}); setResult(null); }}
      >
      {formula.name}
      </li>
    ))}
    </ul>
    </div>

    {/* === KOLOM KANAN: KALKULATOR AKTIF === */}
    <div className="w-3/5 p-8 flex flex-col">
    {selectedFormula ? (
      <>
      <h3 className="text-2xl font-bold mb-2 text-center text-indigo-700 dark:text-indigo-400">{selectedFormula.name}</h3>
      {/* Tampilkan Rumus */}
      <p className="font-mono text-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded mb-6 text-lg">
      {selectedFormula.equation}
      </p>
      {/* Input Fields */}
      <div className="space-y-4 mb-6 flex-1"> {/* flex-1 agar input mengisi ruang */}
      {selectedFormula.variables.map(variable => (
        <div key={variable.symbol} className="flex flex-col sm:flex-row sm:items-center">
        <label htmlFor={variable.symbol} className="w-full sm:w-1/3 mb-1 sm:mb-0 text-sm font-medium text-gray-700 dark:text-gray-300">
        {variable.name} ({variable.symbol}):
        </label>
        <input
        type="number"
        id={variable.symbol}
        placeholder={variable.unit}
        value={inputValues[variable.symbol] || ''}
        onChange={(e) => handleInputChange(variable.symbol, e.target.value)}
        // Styling input dengan Tailwind
        className="w-full sm:w-2/3 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        </div>
      ))}
      </div>
      {/* Tombol Hitung */}
      <button
      className="w-full sm:w-auto mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg transition text-lg"
      onClick={calculateResult}
      >
      Hitung
      </button>
      {/* Hasil */}
      {result !== null && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center border border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Hasil:</h4>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 break-words">
        {typeof result === 'number' ? result.toFixed(3) : result}
        {typeof result === 'number' && selectedFormula.resultUnit ? ` ${selectedFormula.resultUnit}` : ''}
        </p>
        </div>
      )}
      </>
    ) : (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Pilih rumus dari daftar di sebelah kiri.</p>
    )}
    </div>
    </div>
  );
}
