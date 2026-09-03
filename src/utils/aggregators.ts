import { Employee } from '../data/types';

export const getActiveCount = (employees: Employee[]): number =>
  employees.filter((e) => e.isActive).length;

export const getAvgPerformance = (employees: Employee[]): number => {
  if (!employees.length) return 0;
  const sum = employees.reduce((acc, e) => acc + e.performanceRating, 0);
  return Math.round((sum / employees.length) * 10) / 10;
};

export const getAvgSalary = (employees: Employee[]): number => {
  if (!employees.length) return 0;
  const sum = employees.reduce((acc, e) => acc + e.salary, 0);
  return Math.round(sum / employees.length);
};