import { useCallback, useMemo, useRef, useState } from 'react';
import { GridApi } from 'ag-grid-community';
import { Employee, Department } from './data/types';
import { employeeData } from './data/Employee';
import { useEmployeeStats } from './hooks/useEmployeeStats';
import { useDebounce } from './hooks/useDebounce';
import { ImportResult } from './utils/excelImporter';
import StatsBar from './components/StatsBar/StatsBar';
import Toolbar from './components/Toolbar/Toolbar';
import EmployeeGrid from './components/EmployeeGrid/EmployeeGrid';
import EmployeeDrawer from './components/EmployeeDrawer/EmployeeDrawer';
import ImportModal from './components/ImportModal/ImportModal';

function App() {
  const gridApiRef = useRef<GridApi<Employee> | null>(null);

  // ── Core data state ──────────────────────────────────
  const [tableData, setTableData]   = useState<Employee[]>(employeeData);

  // ── UI state ─────────────────────────────────────────
  const [search, setSearch]         = useState('');
  const [activeDept, setActiveDept] = useState<Department | 'All'>('All');
  const [selected, setSelected]     = useState<Employee | null>(null);
  const [rowCount, setRowCount]     = useState(employeeData.length);

  // ── Import state ──────────────────────────────────────
  const [importResult, setImportResult]   = useState<ImportResult | null>(null);
  const [importError, setImportError]     = useState<string | null>(null);

  // ── Derived ───────────────────────────────────────────
  const debouncedSearch = useDebounce(search, 250);
  const stats           = useEmployeeStats(tableData);

  const nextId = useMemo(
    () => Math.max(...tableData.map((e) => e.id), 0) + 1,
    [tableData]
  );

  const filteredByDept = useMemo(
    () =>
      activeDept === 'All'
        ? tableData
        : tableData.filter((e) => e.department === activeDept),
    [tableData, activeDept]
  );

  // ── Handlers ──────────────────────────────────────────
  const handleSearch   = useCallback((v: string) => setSearch(v), []);
  const handleDept     = useCallback((d: Department | 'All') => setActiveDept(d), []);
  const handleRowClick = useCallback((e: Employee) => setSelected(e), []);
  const handleClose    = useCallback(() => setSelected(null), []);

  const handleExport = useCallback(() => {
    gridApiRef.current?.exportDataAsCsv({ fileName: 'employees_export.csv' });
  }, []);

  // Import flow
  const handleImportParsed = useCallback((result: ImportResult) => {
    setImportResult(result);
    setImportError(null);
  }, []);

  const handleImportError = useCallback((msg: string) => {
    setImportError(msg);
    setImportResult(null);
  }, []);
  
const handleImportConfirm = useCallback(
  (employees: Employee[], mode: 'append' | 'replace') => {
    if (mode === 'replace') {
      // Clean slate — IDs restart from 1
      const withIds = employees.map((emp, i) => ({ ...emp, id: i + 1 }));
      setTableData(withIds);
    } else {
      // Append — IDs continue from current max to avoid collision
      const withIds = employees.map((emp, i) => ({
        ...emp,
        id: nextId + i,
      }));
      setTableData((prev) => [...prev, ...withIds]);
    }
    setActiveDept('All');
    setImportResult(null);
  },
  [nextId]
);

  const handleImportCancel = useCallback(() => setImportResult(null), []);

  // ── Render ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 leading-none">FactWise</h1>
            <p className="text-xs text-gray-400 leading-none mt-0.5">People Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
          })}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-6 flex flex-col min-h-0">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Workforce Overview</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Browse, filter, and export employee data across all departments
          </p>
        </div>

        <StatsBar stats={stats} />

        {/* Import error banner */}
        {importError && (
          <div className="mb-4 flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd" />
              </svg>
              <span><strong>Import failed:</strong> {importError}</span>
            </div>
            <button
              onClick={() => setImportError(null)}
              className="text-red-500 hover:text-red-700 text-xs font-medium flex-shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        <Toolbar
          search={search}
          onSearch={handleSearch}
          activeDept={activeDept}
          onDeptChange={handleDept}
          onExport={handleExport}
          rowCount={rowCount}
          totalCount={filteredByDept.length}
          startId={nextId}
          onImportParsed={handleImportParsed}
          onImportError={handleImportError}
        />

        <EmployeeGrid
          rowData={filteredByDept}
          quickFilter={debouncedSearch}
          onRowClick={handleRowClick}
          gridApiRef={gridApiRef}
          onRowCountChange={setRowCount}
        />
      </main>

      <EmployeeDrawer employee={selected} onClose={handleClose} />

      {importResult && (
        <ImportModal
          result={importResult}
          existingCount={tableData.length}
          onConfirm={handleImportConfirm}
          onCancel={handleImportCancel}
        />
      )}
    </div>
  );
}

export default App;