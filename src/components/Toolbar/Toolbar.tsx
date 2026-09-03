import { Department } from '../../data/types';
import { ImportResult } from '../../utils/excelImporter';
import SearchInput from './SearchInput';
import DepartmentFilter from './DepartmentFilter';
import ExportButton from './ExportButton';
import DownloadTemplateButton from './DownloadButton';
import ImportButton from './ImportButton';

interface ToolbarProps {
  search: string;
  onSearch: (val: string) => void;
  activeDept: Department | 'All';
  onDeptChange: (dept: Department | 'All') => void;
  onExport: () => void;
  rowCount: number;
  totalCount: number;
  startId: number;
  onImportParsed: (result: ImportResult) => void;
  onImportError: (msg: string) => void;
}

const Toolbar = ({
  search, onSearch, activeDept, onDeptChange,
  onExport, rowCount, totalCount,
  startId, onImportParsed, onImportError,
}: ToolbarProps) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <DepartmentFilter active={activeDept} onChange={onDeptChange} />

      <div className="flex items-center gap-2">
        <SearchInput value={search} onChange={onSearch} />

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        <DownloadTemplateButton />
        <ImportButton
          startId={startId}
          onParseComplete={onImportParsed}
          onError={onImportError}
        />

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        <ExportButton onExport={onExport} />
      </div>
    </div>

    <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
      Showing{' '}
      <span className="font-semibold text-gray-600">{rowCount}</span>
      {' '}of{' '}
      <span className="font-semibold text-gray-600">{totalCount}</span>
      {' '}employees
    </p>
  </div>
);

export default Toolbar;