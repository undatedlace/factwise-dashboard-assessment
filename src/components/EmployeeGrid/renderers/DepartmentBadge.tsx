import { ICellRendererParams } from 'ag-grid-community';
import { Employee, Department } from '../../../data/types';
import { DEPT_BADGE_STYLES } from '../../../constants/departments';

const DepartmentBadge = ({ value }: ICellRendererParams<Employee, Department>) => {
  if (!value) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${DEPT_BADGE_STYLES[value]}`}>
      {value}
    </span>
  );
};

export default DepartmentBadge;