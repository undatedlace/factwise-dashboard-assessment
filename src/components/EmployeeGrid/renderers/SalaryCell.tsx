import { ICellRendererParams } from 'ag-grid-community';
import { Employee } from '../../../data/types';
import { formatSalary } from '../../../utils/formatters';

const SalaryCell = ({ value }: ICellRendererParams<Employee, number>) => {
  if (value === undefined || value === null) return null;
  return (
    <span className="font-semibold text-gray-800 tabular-nums">{formatSalary(value)}</span>
  );
};

export default SalaryCell;