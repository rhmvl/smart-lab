import { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';

export default function NormalCalculator() {
  const [expression, setExpression] = useState('');
  const [shadowResult, setShadowResult] = useState<string | null>(null);

  // TODO: The entire result UI is messed up. Need to be fixed.
  useEffect(() => {
    try {
      if (!expression.trim()) {
        setShadowResult(null);
        return;
      }
      const formatted = expression
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/\^/g, '**')
        .replace(/√/g, 'sqrt');
      const result = evaluate(formatted);
      if (typeof result === 'number' && !isNaN(result)) {
        setShadowResult(String(result));
      } else {
        setShadowResult(null);
      }
    } catch {
      setShadowResult(null);
    }
  }, [expression]);

  // === Handle key press ===
  const handleButtonClick = (val: string) => {
    if (val === 'AC') {
      setExpression('');
      setShadowResult(null);
      return;
    }
    if (val === 'DEL') {
      setExpression(prev => prev.slice(0, -1));
      return;
    }
    if (val === '=') {
      if (shadowResult !== null) setExpression(shadowResult);
      setShadowResult(null);
      return;
    }
    setExpression(prev => prev + val);
  };

  const buttons = [
    'AC', 'DEL', '(', ')',
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '00', '.', '^',
    '+', '√', '='
  ];

  // === Render button ===
  const renderButton = (btn: string) => {
    const isOperator = ['÷', '×', '-', '+', '^', '√'].includes(btn);
    const isEqual = btn === '=';
    const isAC = btn === 'AC';
    const isDEL = btn === 'DEL';

    return (
      <button
        key={btn}
        onClick={() => handleButtonClick(btn)}
        className={`
          flex items-center justify-center text-2xl font-medium rounded-full select-none transition-all active:scale-95
          ${
            isAC
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
              : isDEL
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md'
              : isEqual
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
              : isOperator
              ? 'bg-gray-300 dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 hover:bg-gray-400 dark:hover:bg-gray-600'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
          }
        `}
      >
        {btn}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-lg">
      
      {/* === Display (single field with shadow) === */}
      <div className="relative flex items-end justify-end h-1/3 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-5">
        {/* Shadow result behind expression */}
        {shadowResult && (
          <div className="absolute right-5 bottom-16 text-gray-400 dark:text-gray-500 text-4xl font-semibold opacity-60 pointer-events-none select-none">
            {shadowResult}
          </div>
        )}
        <input
          type="text"
          readOnly
          value={expression || '0'}
          className="w-full bg-transparent text-gray-900 dark:text-white text-5xl font-semibold border-none focus:outline-none text-right truncate"
        />
      </div>

      {/* === Keypad === */}
      <div className="grid grid-cols-4 gap-3 p-4 bg-gray-200 dark:bg-gray-800 flex-1">
        {buttons.map(renderButton)}
      </div>
    </div>
  );
}
