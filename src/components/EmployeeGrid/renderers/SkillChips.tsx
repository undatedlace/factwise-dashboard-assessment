import { ICellRendererParams } from 'ag-grid-community';
import { Employee } from '../../../data/types';

const SkillChips = ({ value }: ICellRendererParams<Employee, string[]>) => {
  if (!value?.length) return null;
  const visible = value.slice(0, 2);
  const extra = value.length - 2;

  return (
    <div className="flex items-center gap-1 h-full flex-wrap content-center">
      {visible.map((skill) => (
        <span key={skill} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
          {skill}
        </span>
      ))}
      {extra > 0 && (
        <span className="text-xs text-gray-400 font-medium">+{extra}</span>
      )}
    </div>
  );
};

export default SkillChips;