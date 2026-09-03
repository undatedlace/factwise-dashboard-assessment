import { useRef, useState } from 'react';
import { parseExcelFile, parseJsonFile, ImportResult } from '../../utils/excelImporter';

interface ImportButtonProps {
  startId: number;
  onParseComplete: (result: ImportResult) => void;
  onError: (msg: string) => void;
}

const ImportButton = ({ startId, onParseComplete, onError }: ImportButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const isJson =
        file.name.toLowerCase().endsWith('.json') ||
        file.type === 'application/json';

      const result = isJson
        ? await parseJsonFile(file, startId)
        : await parseExcelFile(file, startId);

      onParseComplete(result);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Unknown error parsing file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv,.json"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={handleClick}
        disabled={loading}
        title="Import from Excel (.xlsx, .csv) or JSON"
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Parsing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import
            <span className="text-[10px] font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              xlsx · csv · json
            </span>
          </>
        )}
      </button>
    </>
  );
};

export default ImportButton;