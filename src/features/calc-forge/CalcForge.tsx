import { useState, useMemo } from 'react';
import { getAllTools, type ToolDefinition } from './calc-tool';
import NormalCalculator from './NormalCalculator';
import { Calculator as CalculatorIcon, SlidersHorizontal } from 'lucide-react';
import './calculatorLogic';

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

    for (const param of selectedFormula.params) {
      const valueString = inputValues[param.name];
      if (valueString === undefined || valueString.trim() === '') {
        if (param.defaultValue !== undefined) {
          const defaultValueNum =
            typeof param.defaultValue === 'string'
              ? parseFloat(param.defaultValue)
              : (param.defaultValue as number);
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

  const filteredFormulas = useMemo(
    () => allTools.filter(f => f.category === selectedCategory),
    [selectedCategory, allTools]
  );

  const categories = useMemo(
    () =>
      [...new Set(allTools.map(t => t.category || 'Lainnya'))].sort((a, b) =>
        a === 'Basic' ? -1 : b === 'Basic' ? 1 : a.localeCompare(b)
      ),
    [allTools]
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedFormula(allTools.find(f => f.category === category) || null);
    setInputValues({});
    setResult(null);
  };

  return (
    <div className="relative flex w-full max-w-6xl mx-auto my-12 bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 h-[75vh] transition-all duration-500">

      {/* === LEFT PANEL === */}
      <div className={`w-2/5 lg:w-1/3 border-r border-gray-300/50 dark:border-gray-600/50 flex flex-col overflow-hidden transition-all duration-500 ease-in-out
        ${viewMode === 'normal' ? 'opacity-100' : 'opacity-100'}`}>

        {/* Header: Mode Tabs */}
        <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 px-4 pt-4 pb-2">
          <div className="flex items-center justify-center rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
            <button
              onClick={() => setViewMode('formula')}
              className={`flex items-center gap-2 w-1/2 justify-center py-2 text-sm font-medium transition-all ${
                viewMode === 'formula'
                  ? 'bg-indigo-600 text-white shadow-inner'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <CalculatorIcon size={16} />
              Formula
            </button>
            <button
              onClick={() => setViewMode('normal')}
              className={`flex items-center gap-2 w-1/2 justify-center py-2 text-sm font-medium transition-all ${
                viewMode === 'normal'
                  ? 'bg-indigo-600 text-white shadow-inner'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <SlidersHorizontal size={16} />
              Normal
            </button>
          </div>
        </div>

        {/* Formula Panel */}
        {viewMode === 'formula' && (
          <div className="flex-1 flex flex-col p-5 pt-4 overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Pilih Rumus</h2>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap shadow-sm ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Formula List */}
            <ul className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {filteredFormulas.map(formula => (
                <li
                  key={formula.id}
                  onClick={() => {
                    setSelectedFormula(formula);
                    setInputValues({});
                    setResult(null);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedFormula?.id === formula.id
                      ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 font-semibold shadow-inner'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {formula.name}
                </li>
              ))}
              {filteredFormulas.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-6">Tidak ada rumus di kategori ini.</p>
              )}
            </ul>
          </div>
        )}

        {/* Normal Mode Sidebar Placeholder */}
        {viewMode === 'normal' && (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-center px-4">
            <p>Mode Kalkulator Normal aktif.</p>
          </div>
        )}
      </div>

      {/* === RIGHT PANEL === */}
      <div className="w-3/5 lg:w-2/3 relative overflow-hidden p-6 m-6 flex flex-col">

        {/* Formula Mode */}
        <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${viewMode === 'formula' ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}>
          {selectedFormula ? (
            <>
              <h3 className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-3">{selectedFormula.name}</h3>
              {selectedFormula.description && (
                <p className="text-sm text-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4 text-gray-600 dark:text-gray-300 shadow-inner">
                  {selectedFormula.description}
                </p>
              )}

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                {selectedFormula.params.map(variable => (
                  <div key={variable.name} className="relative">
                    <input
                      type={variable.type === 'number' ? 'number' : 'text'}
                      id={variable.name}
                      value={inputValues[variable.name] || ''}
                      onChange={e => handleInputChange(variable.name, e.target.value)}
                      className="
                        peer w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-100
                        focus:ring-2 focus:ring-indigo-500 outline-none transition-all
                        placeholder-transparent
                      "
                      placeholder={variable.label || variable.name}
                    />
                    <label
                      htmlFor={variable.name}
                      className="
                        absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-base
                        px-1 bg-white/80 dark:bg-gray-700/80 rounded transition-all
                        peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-indigo-600
                        peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:text-sm
                      "
                    >
                      {variable.label || variable.name}
                      {variable.unit ? ` (${variable.unit})` : ''}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                <button
                  onClick={calculateResult}
                  disabled={!selectedFormula || selectedFormula.params.length === 0}
                  className="w-full bg-gradient-to-r from-indigo-600 to-green-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                >
                  Hitung
                </button>

                {result !== null && (
                  <div className="p-5 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-600 text-center">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Hasil:</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white break-words">
                      {typeof result === 'number'
                        ? result.toLocaleString(undefined, { maximumFractionDigits: 6 })
                        : result}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Pilih rumus dari daftar.</p>
          )}
        </div>

        {/* Normal Calculator Mode */}
        <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${viewMode === 'normal' ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}>
          <NormalCalculator />
        </div>
      </div>
    </div>
  );
}
