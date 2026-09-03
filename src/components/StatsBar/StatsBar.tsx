import { EmployeeStats } from '../../hooks/useEmployeeStats';
import { formatSalary } from '../../utils/formatters';

interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  iconBg: string;
}

const StatCard = ({ label, value, subtext, icon, iconBg }: StatCardProps) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtext}</p>
    </div>
  </div>
);

interface StatsBarProps {
  stats: EmployeeStats;
}

const StatsBar = ({ stats }: StatsBarProps) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
    <StatCard
      label="Total Employees"
      value={String(stats.total)}
      subtext={`${stats.active} active · ${stats.inactive} inactive`}
      icon="👥"
      iconBg="bg-indigo-50"
    />
    <StatCard
      label="Active"
      value={String(stats.active)}
      subtext={`${Math.round((stats.active / stats.total) * 100)}% of workforce`}
      icon="✅"
      iconBg="bg-green-50"
    />
    <StatCard
      label="Avg Performance"
      value={`${stats.avgPerformance} / 5.0`}
      subtext="Company-wide rating"
      icon="⭐"
      iconBg="bg-yellow-50"
    />
    <StatCard
      label="Avg Salary"
      value={formatSalary(stats.avgSalary)}
      subtext="Across all departments"
      icon="💰"
      iconBg="bg-blue-50"
    />
  </div>
);

export default StatsBar;