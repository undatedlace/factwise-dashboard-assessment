import { Department } from '../../data/types';
import { DEPARTMENTS, DEPT_ACTIVE_PILL, DEPT_INACTIVE_PILL } from '../../constants/departments';

interface DepartmentFilterProps {
  active: Department | 'All';
  onChange: (dept: Department | 'All') => void;
}

const DepartmentFilter = ({ active, onChange }: DepartmentFilterProps) => (
  <div className="flex flex-wrap gap-2">
    {DEPARTMENTS.map((dept) => (
      <button
        key={dept}
        onClick={() => onChange(dept)}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          active === dept ? DEPT_ACTIVE_PILL[dept] : DEPT_INACTIVE_PILL[dept]
        }`}
      >
        {dept}
      </button>
    ))}
  </div>
);

export default DepartmentFilter;