import { ICellRendererParams } from 'ag-grid-community';
import { Employee } from '../../../data/types';

const getBarColor = (r: number) => {
  if (r >= 4.5) return 'bg-green-500';
  if (r >= 4.0) return 'bg-blue-500';
  if (r >= 3.5) return 'bg-yellow-400';
  return 'bg-red-400';
};

const RatingBar = ({ value }: ICellRendererParams<Employee, number>) => {
  if (value === undefined || value === null) return null;
  const pct = (value / 5) * 100;

  return (
    <div className="flex items-center gap-2 w-full h-full">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${getBarColor(value)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-7 text-right tabular-nums">
        {value.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingBar;