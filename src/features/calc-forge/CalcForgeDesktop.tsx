import { useState, useMemo } from 'react';
import { getAllTools, type ToolDefinition } from './calc-tool'; 
import NormalCalculator from './NormalCalculator';
import { SlidersHorizontal, Calculator as CalculatorIcon } from 'lucide-react';

export default function CalcForgeDesktop() {
  const [viewMode, setViewMode] = useState<'formula' | 'normal'>('formula');
  const allTools = useMemo(() => getAllTools(), []);
  const [selectedCategory, setSelectedCategory] = useState<string>( 
    allTools.find(t => t.category)?.category || allTools[0]?.category || 'Basic'
  );
  const [selectedFormula, setSelectedFormula] = useState<ToolDefinition | null>(
    allTools.find(f => f.category === selectedCategory) || allTools[0] || null
  );
  const [inputValues, setInputValues] = useState<Record<string, string>>({}); 
  const [result, setResult] = useState<number | string | boolean | null>(null);

  const handleInputChange = (paramName: string, value: string) => {
    setInputValues(prev => ({ ...prev, [paramName]: value }));
    setResult(null);
  };

  const calculateResult = () => {
    if (!selectedFormula) return;

    const numericInputs: Record<string, number> = {};
    let allInputsValid = true;
    const missingParams: string[] = [];

    // Validasi dan konversi input
    for (const param of selectedFormula.params) {
      const valueString = inputValues[param.name];
      if (valueString === undefined || valueString.trim() === '') {
        if (param.defaultValue !== undefined) {
          const defaultValueNum = typeof param.defaultValue === 'string' ? parseFloat(param.defaultValue) : (param.defaultValue as number);
          if (isNaN(defaultValueNum)) {
            allInputsValid = false;
            missingParams.push(param.label || param.name);
          } else {
            numericInputs[param.name] = defaultValueNum;
          }
        } else {
          allInputsValid = false;
          missingParams.push(param.label || param.name);
        }
        continue;
      }

      const value = parseFloat(valueString);
      if (isNaN(value)) {
        allInputsValid = false;
        missingParams.push(param.label || param.name);
      }
      numericInputs[param.name] = value;
    }

    if (!allInputsValid) {
      setResult(`Input tidak valid atau kosong untuk: ${missingParams.join(', ')}`);
      return;
    }

    try {
      const argsInOrder = selectedFormula.params.map(p => numericInputs[p.name]);
      const calculationResult = selectedFormula.execute(...argsInOrder);
      setResult(calculationResult);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult(error instanceof Error ? `Error: ${error.message}` : 'Error perhitungan');
    }
  };

  const filteredFormulas = useMemo(() =>
    allTools.filter(f => f.category === selectedCategory), [selectedCategory, allTools]
  );
  const categories = useMemo(() =>
    [...new Set(allTools.map(t => t.category || 'Lainnya'))]
    .sort((a,b) => a === 'Basic' ? -1 : b === 'Basic' ? 1 : a.localeCompare(b)),
    [allTools]
  );
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedFormula(allTools.find(f => f.category === category) || null);
    setInputValues({}); setResult(null);
  };

  return (
    <div className="relative flex w-full max-w-6xl mx-auto my-16 mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-[70vh]">

    {/* Tombol Toggle Mode */}
    <button
    onClick={() => setViewMode(prev => prev === 'formula' ? 'normal' : 'formula')}
    className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition shadow-sm"
    title={viewMode === 'formula' ? 'Ganti ke Kalkulator Normal' : 'Ganti ke Mode Rumus'}
    >
    {viewMode === 'formula' ? <CalculatorIcon size={18} /> : <SlidersHorizontal size={18} />}
    </button>

    {/* === KOLOM KIRI: PEMILIHAN RUMUS / KONTROL === */}
    <div className={`w-2/5 lg:w-1/3 bg-gray-50 dark:bg-gray-700 p-4 border-r border-gray-200 dark:border-gray-600 flex flex-col overflow-hidden transition-all duration-300 ${viewMode === 'normal' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
    <div className="flex justify-between items-center mb-3 flex-shrink-0">
    <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-100">
    {viewMode === 'formula' ? 'Pilih Rumus' : 'Mode Rumus'}
    </h2>
    </div>
    {viewMode === 'formula' ? (
      <>
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
      </>
    ) : (
      <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-center px-4">
      <p>Ganti ke Mode Rumus untuk memilih formula spesifik.</p>
      </div>
    )}
    </div>

    {/* === KOLOM KANAN: TAMPILAN UTAMA (KONDISIONAL) === */}
    <div className="w-3/5 lg:w-2/3 p-6 flex flex-col overflow-hidden relative">
    {/* Tampilan Mode Rumus */}
    <div className={`absolute inset-0 p-6 flex flex-col transition-opacity duration-300 ease-in-out ${viewMode === 'formula' ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'}`}>
    {selectedFormula ? (
      <>
      <h3 className="text-xl lg:text-2xl font-bold mb-2 text-center text-indigo-700 dark:text-indigo-400 flex-shrink-0">{selectedFormula.name}</h3>
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
        type={variable.type === 'number' ? 'number' : 'text'}
        id={variable.name}
        placeholder={variable.unit || ''}
        value={inputValues[variable.name] || ''}
        onChange={(e) => handleInputChange(variable.name, e.target.value)}
        className="w-full sm:flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      disabled={!selectedFormula || selectedFormula.params.length === 0}
      >
      Hitung
      </button>
      {result !== null && (
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center border border-gray-200 dark:border-gray-600">
        <h4 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Hasil:</h4>
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 break-words">
        {typeof result === 'number' ? result.toLocaleString(undefined, { maximumFractionDigits: 6 }) : result}
        </p>
        </div>
      )}
      </div>
      </>
    ) : (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Pilih rumus dari daftar.</p>
    )}
    </div>

    {/* Tampilan Mode Kalkulator Normal */}
    <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${viewMode === 'normal' ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'}`}>
    {/* Pastikan NormalCalculator dirender di sini */}
    <NormalCalculator />
    </div>
    </div>
    </div>
  );
}
