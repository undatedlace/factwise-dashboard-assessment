import { Department } from '../data/types';

export const DEPARTMENTS: (Department | 'All')[] = [
  'All', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance',
];

export const DEPT_BADGE_STYLES: Record<Department, string> = {
  Engineering: 'bg-indigo-100 text-indigo-700',
  Marketing:   'bg-pink-100 text-pink-700',
  Sales:       'bg-orange-100 text-orange-700',
  HR:          'bg-teal-100 text-teal-700',
  Finance:     'bg-green-100 text-green-700',
};

export const DEPT_ACTIVE_PILL: Record<string, string> = {
  All:         'bg-gray-800 text-white border-gray-800',
  Engineering: 'bg-indigo-600 text-white border-indigo-600',
  Marketing:   'bg-pink-600 text-white border-pink-600',
  Sales:       'bg-orange-600 text-white border-orange-600',
  HR:          'bg-teal-600 text-white border-teal-600',
  Finance:     'bg-green-600 text-white border-green-600',
};

export const DEPT_INACTIVE_PILL: Record<string, string> = {
  All:         'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
  Engineering: 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50',
  Marketing:   'bg-white text-pink-600 border-pink-200 hover:bg-pink-50',
  Sales:       'bg-white text-orange-600 border-orange-200 hover:bg-orange-50',
  HR:          'bg-white text-teal-600 border-teal-200 hover:bg-teal-50',
  Finance:     'bg-white text-green-600 border-green-200 hover:bg-green-50',
};

export const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
  'bg-purple-100 text-purple-700',
];