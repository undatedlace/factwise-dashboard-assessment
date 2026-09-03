import { downloadTemplate } from '../../utils/excelTemplateGenerator';

const DownloadTemplateButton = () => (
  <button
    onClick={downloadTemplate}
    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-colors shadow-sm"
    title="Download empty Excel template with headers and sample rows"
  >
    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    Template
  </button>
);

export default DownloadTemplateButton;