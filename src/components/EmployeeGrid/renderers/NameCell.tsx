import { ICellRendererParams } from 'ag-grid-community';
import { Employee } from '../../../data/types';
import { AVATAR_COLORS } from '../../../constants/departments';

const NameCell = ({ data }: ICellRendererParams<Employee>) => {
  if (!data) return null;
  const initials = `${data.firstName[0]}${data.lastName[0]}`;
  const colorClass = AVATAR_COLORS[data.id % AVATAR_COLORS.length];

  return (
    <div className="flex items-center gap-2.5 h-full">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${colorClass}`}>
        {initials}
      </div>
      <span className="font-semibold text-gray-800 text-sm">
        {data.firstName} {data.lastName}
      </span>
    </div>
  );
};

export default NameCell;