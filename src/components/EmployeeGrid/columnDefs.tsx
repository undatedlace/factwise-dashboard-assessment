import { ColDef, ColGroupDef, ValueGetterParams } from 'ag-grid-community';
import { Employee } from '../../data/types';
import NameCell from './renderers/NameCell';
import DepartmentBadge from './renderers/DepartmentBadge';
import StatusBadge from './renderers/StatusBadge';
import RatingBar from './renderers/RatingBar';
import SkillChips from './renderers/SkillChips';
import SalaryCell from './renderers/SalaryCell';
import { formatDate } from '../../utils/formatters';

export const columnDefs: (ColDef<Employee> | ColGroupDef<Employee>)[] = [
  {
    headerName: 'Employee',
    children: [
      {
        headerName: 'Name',
        pinned: 'left',
        width: 200,
        cellRenderer: NameCell,
        // valueGetter drives sort + filter; cellRenderer drives display
        valueGetter: (params: ValueGetterParams<Employee>) =>
          `${params.data?.firstName ?? ''} ${params.data?.lastName ?? ''}`,
        sort: 'asc',
      },
      {
        field: 'email',
        headerName: 'Email',
        width: 220,
        cellStyle: { color: '#6B7280', fontSize: '12px' },
      },
    ],
  },
  {
    headerName: 'Role',
    children: [
      {
        field: 'department',
        headerName: 'Department',
        width: 150,
        cellRenderer: DepartmentBadge,
      },
      {
        field: 'position',
        headerName: 'Position',
        width: 185,
        cellStyle: { color: '#4B5563', fontSize: '13px' },
      },
      {
        field: 'location',
        headerName: 'Location',
        width: 130,
        cellStyle: { color: '#6B7280', fontSize: '13px' },
      },
      {
        field: 'manager',
        headerName: 'Manager',
        width: 160,
        cellStyle: { color: '#6B7280', fontSize: '13px' },
        valueFormatter: (params) => params.value ?? '—',
      },
    ],
  },
  {
    headerName: 'Performance',
    children: [
      {
        field: 'performanceRating',
        headerName: 'Rating',
        width: 160,
        cellRenderer: RatingBar,
      },
      {
        field: 'projectsCompleted',
        headerName: 'Projects',
        width: 100,
        cellStyle: { textAlign: 'center', fontWeight: '600', color: '#374151' },
      },
    ],
  },
  {
    headerName: 'Compensation',
    children: [
      {
        field: 'salary',
        headerName: 'Salary',
        width: 130,
        cellRenderer: SalaryCell,
      },
      {
        field: 'hireDate',
        headerName: 'Hire Date',
        width: 130,
        valueFormatter: (params) => formatDate(params.value as string),
        cellStyle: { color: '#6B7280', fontSize: '13px' },
      },
      {
        field: 'age',
        headerName: 'Age',
        width: 80,
        cellStyle: { textAlign: 'center', color: '#4B5563' },
      },
    ],
  },
  {
    headerName: 'Status & Skills',
    children: [
      {
        field: 'isActive',
        headerName: 'Status',
        width: 115,
        cellRenderer: StatusBadge,
      },
      {
        field: 'skills',
        headerName: 'Skills',
        width: 220,
        cellRenderer: SkillChips,
        sortable: false,
        filter: false,
      },
    ],
  },
];