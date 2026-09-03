import { useState } from 'react';
import { ImportResult } from '../../utils/excelImporter';
import { Employee } from '../../data/types';

type ImportMode = 'append' | 'replace';

interface ImportModalProps {
  result: ImportResult;
  existingCount: number;
  onConfirm: (employees: Employee[], mode: ImportMode) => void;
  onCancel: () => void;
}

const ImportModal = ({ result, existingCount, onConfirm, onCancel }: ImportModalProps) => {
  const [mode, setMode] = useState<ImportMode>('append');

  const validEmployees = result.valid.map((r) => r.data as Employee);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Import Preview</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Review parsed data before it's added to the grid
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Summary cards */}
        <div className="px-6 pt-5 pb-4 grid grid-cols-3 gap-3 flex-shrink-0">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">{result.total}</p>
            <p className="text-xs font-medium text-gray-500 mt-1">Total Rows Found</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{result.valid.length}</p>
            <p className="text-xs font-medium text-green-600 mt-1">Ready to Import</p>
          </div>
          <div className={`rounded-xl p-4 text-center ${result.invalid.length > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
            <p className={`text-2xl font-bold ${result.invalid.length > 0 ? 'text-red-600' : 'text-gray-300'}`}>
              {result.invalid.length}
            </p>
            <p className={`text-xs font-medium mt-1 ${result.invalid.length > 0 ? 'text-red-500' : 'text-gray-400'}`}>
              Skipped (Errors)
            </p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-5">

          {/* Import mode */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
              Import Mode
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('append')}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  mode === 'append'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    mode === 'append' ? 'border-indigo-500' : 'border-gray-300'
                  }`}>
                    {mode === 'append' && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    )}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">Append</span>
                </div>
                <p className="text-xs text-gray-500 pl-6">
                  Add to existing {existingCount} employees. IDs auto-assigned.
                </p>
              </button>

              <button
                onClick={() => setMode('replace')}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  mode === 'replace'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    mode === 'replace' ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    {mode === 'replace' && (
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">Replace All</span>
                </div>
                <p className="text-xs text-gray-500 pl-6">
                  Clear all existing data and replace with import.
                </p>
              </button>
            </div>

            {mode === 'replace' && (
              <div className="mt-2.5 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd" />
                </svg>
                This will permanently remove all {existingCount} current employees from the grid.
              </div>
            )}
          </div>

          {/* Errors */}
          {result.invalid.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                Skipped Rows — {result.invalid.length} Error{result.invalid.length !== 1 ? 's' : ''}
              </p>
              <div className="bg-red-50 border border-red-100 rounded-xl overflow-hidden max-h-36 overflow-y-auto">
                {result.invalid.map((row) => (
                  <div
                    key={row.rowNumber}
                    className="px-4 py-2.5 border-b border-red-100 last:border-0 flex items-start gap-3"
                  >
                    <span className="flex-shrink-0 inline-block bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5">
                      Row {row.rowNumber + 1}
                    </span>
                    <span className="text-xs text-red-600">{row.errors.join(' · ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Valid rows preview */}
          {result.valid.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                Preview — First {Math.min(result.valid.length, 5)} of {result.valid.length} Valid Rows
              </p>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Name', 'Department', 'Position', 'Salary', 'Rating', 'Active'].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.valid.slice(0, 5).map((row) => (
                      <tr key={row.rowNumber} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2.5 font-medium text-gray-800">
                          {row.data.firstName} {row.data.lastName}
                        </td>
                        <td className="px-3 py-2.5 text-gray-600">{row.data.department}</td>
                        <td className="px-3 py-2.5 text-gray-600 max-w-[120px] truncate">{row.data.position}</td>
                        <td className="px-3 py-2.5 text-gray-600 tabular-nums">
                          ${(row.data.salary ?? 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-gray-600">{row.data.performanceRating}</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            row.data.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {row.data.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.valid.length > 5 && (
                  <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 text-center">
                    + {result.valid.length - 5} more valid rows not shown
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {result.invalid.length > 0 && (
              <span className="text-xs text-gray-400">
                {result.invalid.length} row{result.invalid.length !== 1 ? 's' : ''} will be skipped
              </span>
            )}
            <button
              onClick={() => onConfirm(validEmployees, mode)}
              disabled={result.valid.length === 0}
              className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                mode === 'replace'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {mode === 'replace' ? 'Replace with ' : 'Import '} 
              {result.valid.length} Employee{result.valid.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;