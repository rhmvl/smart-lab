// src/features/calc-forge/NormalCalculator.tsx
import React, { useState } from 'react';
// Anda mungkin perlu library parser/evaluator yang lebih aman, contoh: mathjs
// import { evaluate } from 'mathjs';

export default function NormalCalculator() {
  const [displayValue, setDisplayValue] = useState('0'); // Nilai yang tampil di layar
  const [expression, setExpression] = useState(''); // Ekspresi lengkap

  const handleButtonClick = (value: string | number) => {
    if (value === 'AC') {
      setExpression('');
      setDisplayValue('0');
    } else if (value === '=') {
      try {
        // PERHATIAN: eval() tidak aman untuk input pengguna langsung!
        // Gunakan library seperti mathjs untuk produksi:
        // const result = evaluate(expression);
        const result = eval(expression.replace('^', '**').replace('√', 'Math.sqrt')); // Ganti simbol agar eval() mengerti
        setDisplayValue(String(result));
        setExpression(String(result)); // Hasil jadi input baru
      } catch (e) {
        setDisplayValue('Error');
        setExpression('');
      }
    } else if (typeof value === 'number' || value === '.') {
      setExpression(prev => (prev === '0' && value !== '.') ? String(value) : prev + value);
      setDisplayValue(prev => (prev === '0' && value !== '.') ? String(value) : prev + value);
    } else { // Operator, kurung, dll.
      setExpression(prev => prev + ' ' + value + ' '); // Tambah spasi antar operator
      setDisplayValue(String(value)); // Tampilkan operator terakhir
    }
  };

  const buttons = [
    'AC', '(', ')', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '^', '=', // '^' untuk pangkat
    '√', 'π' // Tambahan
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Layar Display */}
      <div className="p-4 bg-gray-200 dark:bg-gray-700 text-right space-y-1">
          <input
              type="text"
              readOnly
              value={expression || ' '} // Tampilkan ekspresi
              className="w-full bg-transparent text-gray-500 dark:text-gray-400 text-sm font-mono border-none focus:outline-none text-right"
          />
         <input
              type="text"
              readOnly
              value={displayValue}
              className="w-full bg-transparent text-gray-900 dark:text-white text-4xl font-semibold border-none focus:outline-none text-right"
          />
      </div>

      {/* Tombol Keypad */}
      <div className="grid grid-cols-4 gap-px flex-1 bg-gray-300 dark:bg-gray-600">
        {buttons.map((btn) => {
          const isOperator = ['/', '*', '-', '+', '^', '√', 'π'].includes(String(btn));
          const isEqual = btn === '=';
          const isAC = btn === 'AC';
          const isWide = isAC || isEqual;

          return (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`
                p-4 text-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-900 focus:ring-indigo-500 transition
                ${isAC ? 'bg-red-500 hover:bg-red-600 text-white col-span-1' : ''}
                ${isEqual ? 'bg-green-500 hover:bg-green-600 text-white col-span-1' : ''}
                ${isOperator ? 'bg-gray-300 dark:bg-gray-700 text-indigo-700 dark:text-indigo-300' : ''}
                ${!isAC && !isEqual && !isOperator ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
                ${isWide ? (isEqual ? 'col-start-4 row-start-5' : 'col-start-1 row-start-1') : ''}
                 ${btn === '√' ? 'col-start-1 row-start-5' : ''}
                 ${btn === 'π' ? 'col-start-2 row-start-5' : ''}
                 ${btn === '^' ? 'col-start-3 row-start-5' : ''}
                 ${btn === '.' ? 'col-start-2 row-start-4' : ''}
                 ${btn === '0' ? 'col-start-1 row-start-4' : ''}
              `}
               // Atur col-span dan row-span manual untuk layout
               style={{ gridColumn: isWide ? 'span 1' : 'span 1' }}
            >
              {btn === '*' ? '×' : btn === '/' ? '÷' : btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}
