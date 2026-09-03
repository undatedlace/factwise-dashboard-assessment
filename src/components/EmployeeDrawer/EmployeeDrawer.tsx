import { Employee } from '../../data/types';
import { formatSalary, formatDate } from '../../utils/formatters';
import { AVATAR_COLORS } from '../../constants/departments';

interface EmployeeDrawerProps {
  employee: Employee | null;
  onClose: () => void;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800 text-right max-w-[200px] truncate">{value}</span>
  </div>
);

const getRatingColor = (r: number) => {
  if (r >= 4.5) return 'bg-green-500';
  if (r >= 4.0) return 'bg-blue-500';
  if (r >= 3.5) return 'bg-yellow-400';
  return 'bg-red-400';
};

const EmployeeDrawer = ({ employee, onClose }: EmployeeDrawerProps) => {
  if (!employee) return null;

  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;
  const avatarColor = AVATAR_COLORS[employee.id % AVATAR_COLORS.length];
  const ratingPct = (employee.performanceRating / 5) * 100;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 z-40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">

        {/* Gradient header */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 flex-shrink-0">
          <div className="flex justify-between items-center mb-5">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/15 text-white">
              {employee.department}
            </span>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className={`w-14 h-14 rounded-2xl ${avatarColor} flex items-center justify-center text-xl font-bold mb-3`}>
            {initials}
          </div>

          <h2 className="text-xl font-bold text-white">
            {employee.firstName} {employee.lastName}
          </h2>
          <p className="text-indigo-200 text-sm mt-0.5">{employee.position}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              employee.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${employee.isActive ? 'bg-green-500' : 'bg-red-400'}`} />
              {employee.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className="text-indigo-300 text-xs">
              #{String(employee.id).padStart(3, '0')}
            </span>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Performance */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Performance
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Rating</span>
              <span className="text-2xl font-bold text-gray-800">
                {employee.performanceRating.toFixed(1)}
                <span className="text-sm text-gray-400 font-normal"> / 5.0</span>
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
              <div
                className={`h-2 rounded-full ${getRatingColor(employee.performanceRating)}`}
                style={{ width: `${ratingPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Projects Completed</span>
              <span className="text-lg font-bold text-gray-800">{employee.projectsCompleted}</span>
            </div>
          </div>

          {/* Details */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Details
            </h3>
            <InfoRow label="Email"     value={employee.email} />
            <InfoRow label="Salary"    value={formatSalary(employee.salary)} />
            <InfoRow label="Hire Date" value={formatDate(employee.hireDate)} />
            <InfoRow label="Location"  value={employee.location} />
            <InfoRow label="Age"       value={`${employee.age} years old`} />
            <InfoRow label="Manager"   value={employee.manager ?? 'No direct manager'} />
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default EmployeeDrawer;