import * as XLSX from 'xlsx';

export const downloadTemplate = (): void => {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Instructions ──
  const instructions: (string | number)[][] = [
    ['FactWise Employee Import Template'],
    [''],
    ['INSTRUCTIONS: Fill in the "Employee Data" sheet. Do not change column headers.'],
    [''],
    ['Field',             'Required', 'Type',    'Notes'],
    ['firstName',         'Yes',      'Text',    'e.g. John'],
    ['lastName',          'Yes',      'Text',    'e.g. Smith'],
    ['email',             'Yes',      'Email',   'e.g. john.smith@company.com'],
    ['department',        'Yes',      'Text',    'One of: Engineering, Marketing, Sales, HR, Finance'],
    ['position',          'Yes',      'Text',    'e.g. Senior Developer'],
    ['salary',            'Yes',      'Number',  'Annual salary — no $ or commas. e.g. 95000'],
    ['hireDate',          'Yes',      'Date',    'YYYY-MM-DD format. e.g. 2023-06-15'],
    ['age',               'Yes',      'Number',  'Must be 18–100'],
    ['location',          'Yes',      'Text',    'City name. e.g. New York'],
    ['performanceRating', 'Yes',      'Number',  '0.0 to 5.0. e.g. 4.2'],
    ['projectsCompleted', 'Yes',      'Number',  'e.g. 12'],
    ['isActive',          'Yes',      'Boolean', 'true or false'],
    ['skills',            'No',       'Text',    'Comma-separated. e.g. JavaScript, React, Node.js'],
    ['manager',           'No',       'Text',    "Manager full name, or leave blank if none"],
  ];

  const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
  wsInstructions['!cols'] = [{ wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

  // ── Sheet 2: Employee Data ──
  const headers = [
    'firstName', 'lastName', 'email', 'department', 'position',
    'salary', 'hireDate', 'age', 'location', 'performanceRating',
    'projectsCompleted', 'isActive', 'skills', 'manager',
  ];

  const sampleRows = [
    [
      'Jane', 'Doe', 'jane.doe@company.com', 'Engineering', 'Software Engineer',
      85000, '2023-06-15', 28, 'New York', 4.2, 7, true,
      'JavaScript, React, Node.js', 'Sarah Johnson',
    ],
    [
      'Mark', 'Taylor', 'mark.taylor@company.com', 'Sales', 'Sales Representative',
      62000, '2022-09-01', 30, 'Chicago', 3.9, 5, true,
      'CRM, Negotiation', 'Robert Martinez',
    ],
  ];

  const wsData = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
  wsData['!cols'] = headers.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, wsData, 'Employee Data');

  XLSX.writeFile(wb, 'employee_import_template.xlsx');
};