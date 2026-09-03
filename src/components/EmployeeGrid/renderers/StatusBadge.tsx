import { ICellRendererParams } from 'ag-grid-community';
import { Employee } from '../../../data/types';

const StatusBadge = ({ value }: ICellRendererParams<Employee, boolean>) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
    value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${value ? 'bg-green-500' : 'bg-red-400'}`} />
    {value ? 'Active' : 'Inactive'}
  </span>
);

export default StatusBadge;