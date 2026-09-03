import { useMemo } from 'react';
import { Employee } from '../data/types';
import { getActiveCount, getAvgPerformance, getAvgSalary } from '../utils/aggregators';

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  avgPerformance: number;
  avgSalary: number;
}

export const useEmployeeStats = (employees: Employee[]): EmployeeStats =>
  useMemo(() => {
    const active = getActiveCount(employees);
    return {
      total: employees.length,
      active,
      inactive: employees.length - active,
      avgPerformance: getAvgPerformance(employees),
      avgSalary: getAvgSalary(employees),
    };
  }, [employees]);