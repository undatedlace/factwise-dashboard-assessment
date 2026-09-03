import * as XLSX from 'xlsx';
import { Employee, Department } from '../data/types';

const VALID_DEPARTMENTS: Department[] = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];

export interface ImportRow {
  rowNumber: number;
  data: Partial<Employee>;
  errors: string[];
  isValid: boolean;
}

export interface ImportResult {
  total: number;
  valid: ImportRow[];
  invalid: ImportRow[];
}

const parseBoolean = (val: unknown): boolean | null => {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') {
    if (val === 1) return true;
    if (val === 0) return false;
  }
  if (typeof val === 'string') {
    const lower = val.toLowerCase().trim();
    if (['true', 'yes', '1'].includes(lower)) return true;
    if (['false', 'no', '0'].includes(lower)) return false;
  }
  return null;
};

const parseDate = (val: unknown): string | null => {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString().split('T')[0];
  const str = String(val).trim();
  const date = new Date(str);
  return isNaN(date.getTime()) ? null : str;
};

// Handles skills as string[] (from JSON) or comma-separated string (from Excel)
const parseSkills = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.map(String).map((s) => s.trim()).filter(Boolean);
  if (val) return String(val).split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

const validateRow = (
  raw: Record<string, unknown>,
  rowNumber: number,
  startId: number
): ImportRow => {
  const errors: string[] = [];
  const data: Partial<Employee> = {};

  data.id = startId + rowNumber - 1;

  if (!raw.firstName || !String(raw.firstName).trim()) {
    errors.push('firstName required');
  } else {
    data.firstName = String(raw.firstName).trim();
  }

  if (!raw.lastName || !String(raw.lastName).trim()) {
    errors.push('lastName required');
  } else {
    data.lastName = String(raw.lastName).trim();
  }

  if (!raw.email) {
    errors.push('email required');
  } else {
    const email = String(raw.email).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('email invalid format');
    } else {
      data.email = email;
    }
  }

  if (!raw.department) {
    errors.push('department required');
  } else {
    const dept = String(raw.department).trim() as Department;
    if (!VALID_DEPARTMENTS.includes(dept)) {
      errors.push(`department must be one of: ${VALID_DEPARTMENTS.join(', ')}`);
    } else {
      data.department = dept;
    }
  }

  if (!raw.position || !String(raw.position).trim()) {
    errors.push('position required');
  } else {
    data.position = String(raw.position).trim();
  }

  if (raw.salary === undefined || raw.salary === null || raw.salary === '') {
    errors.push('salary required');
  } else {
    const salary = Number(raw.salary);
    if (isNaN(salary) || salary < 0) {
      errors.push('salary must be a positive number');
    } else {
      data.salary = salary;
    }
  }

  const hireDate = parseDate(raw.hireDate);
  if (!hireDate) {
    errors.push('hireDate required (YYYY-MM-DD)');
  } else {
    data.hireDate = hireDate;
  }

  if (raw.age === undefined || raw.age === null || raw.age === '') {
    errors.push('age required');
  } else {
    const age = Number(raw.age);
    if (isNaN(age) || age < 18 || age > 100) {
      errors.push('age must be 18–100');
    } else {
      data.age = age;
    }
  }

  if (!raw.location || !String(raw.location).trim()) {
    errors.push('location required');
  } else {
    data.location = String(raw.location).trim();
  }

  if (raw.performanceRating === undefined || raw.performanceRating === null || raw.performanceRating === '') {
    errors.push('performanceRating required');
  } else {
    const rating = Number(raw.performanceRating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      errors.push('performanceRating must be 0–5');
    } else {
      data.performanceRating = Math.round(rating * 10) / 10;
    }
  }

  if (raw.projectsCompleted === undefined || raw.projectsCompleted === null || raw.projectsCompleted === '') {
    errors.push('projectsCompleted required');
  } else {
    const projects = Number(raw.projectsCompleted);
    if (isNaN(projects) || projects < 0) {
      errors.push('projectsCompleted must be ≥ 0');
    } else {
      data.projectsCompleted = Math.round(projects);
    }
  }

  const isActive = parseBoolean(raw.isActive);
  if (isActive === null) {
    errors.push('isActive must be true or false');
  } else {
    data.isActive = isActive;
  }

  data.skills  = parseSkills(raw.skills);
  data.manager = raw.manager ? String(raw.manager).trim() || null : null;

  return { rowNumber, data, errors, isValid: errors.length === 0 };
};

// ── Excel / CSV ─────────────────────────────────────────────────────────────
export const parseExcelFile = (file: File, startId: number): Promise<ImportResult> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const raw = e.target?.result;
        const workbook = XLSX.read(raw, { type: 'binary', cellDates: true });

        const sheetName = workbook.SheetNames.includes('Employee Data')
          ? 'Employee Data'
          : workbook.SheetNames[0];

        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          workbook.Sheets[sheetName],
          { defval: '' }
        );

        if (!rows.length) {
          reject(new Error('No data rows found. Make sure the sheet has at least one row below the header.'));
          return;
        }

        const results = rows.map((row, idx) => validateRow(row, idx + 1, startId));
        resolve({
          total:   results.length,
          valid:   results.filter((r) => r.isValid),
          invalid: results.filter((r) => !r.isValid),
        });
      } catch {
        reject(new Error('Failed to parse file. Please use the provided template.'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsBinaryString(file);
  });

// ── JSON ─────────────────────────────────────────────────────────────────────
export const parseJsonFile = async (file: File, startId: number): Promise<ImportResult> => {
  const text = await file.text();

  let rows: Record<string, unknown>[];

  try {
    const parsed: unknown = JSON.parse(text);

    if (Array.isArray(parsed)) {
      rows = parsed as Record<string, unknown>[];
    } else if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'employees' in parsed &&
      Array.isArray((parsed as Record<string, unknown>).employees)
    ) {
      rows = (parsed as { employees: Record<string, unknown>[] }).employees;
    } else {
      throw new Error('JSON must be an array or an object with an "employees" array.');
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error('Invalid JSON. Please check the file for syntax errors.');
    }
    throw e;
  }

  if (!rows.length) {
    throw new Error('No employee records found in the JSON file.');
  }

  const results = rows.map((row, idx) => validateRow(row, idx + 1, startId));
  return {
    total:   results.length,
    valid:   results.filter((r) => r.isValid),
    invalid: results.filter((r) => !r.isValid),
  };
};