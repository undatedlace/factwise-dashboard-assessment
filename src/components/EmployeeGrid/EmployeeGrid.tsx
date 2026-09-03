import { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  GridApi,
  GridReadyEvent,
  ModelUpdatedEvent,
  RowClickedEvent,
  PaginationChangedEvent,
} from 'ag-grid-community';
import { Employee } from '../../data/types';
import { columnDefs } from './columnDefs';
import PaginationControls from './PaginationControls';

const DEFAULT_PAGE_SIZE = 10;

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRows: number;
}

interface EmployeeGridProps {
  rowData: Employee[];
  quickFilter: string;
  onRowClick: (employee: Employee) => void;
  gridApiRef: { current: GridApi<Employee> | null };
  onRowCountChange: (count: number) => void;
}

const EmployeeGrid = ({
  rowData, quickFilter, onRowClick, gridApiRef, onRowCountChange,
}: EmployeeGridProps) => {
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 0,
    totalPages:  1,
    pageSize:    DEFAULT_PAGE_SIZE,
    totalRows:   0,
  });

  const defaultColDef = useMemo(() => ({
    sortable:   true,
    filter:     true,
    resizable:  true,
  }), []);

  // Deferred read — setTimeout(0) lets AG Grid finish its internal
  // pagination setup before we read values. Without this, the first
  // call (from onModelUpdated) returns NaN because the pagination
  // controller hasn't initialised yet.
const syncPagination = useCallback((api: GridApi<Employee>) => {
  const currentPage = api.paginationGetCurrentPage();
  const totalPages = api.paginationGetTotalPages();
  const pageSize = api.paginationGetPageSize();
  const totalRows = api.paginationGetRowCount();

  setPaginationInfo({
    currentPage,
    totalPages,
    pageSize,
    totalRows,
  });
}, []);

  const onGridReady = useCallback((event: GridReadyEvent<Employee>) => {
    gridApiRef.current = event.api;
    onRowCountChange(event.api.getDisplayedRowCount());
    syncPagination(event.api);
  }, [gridApiRef, onRowCountChange, syncPagination]);

  // onModelUpdated only updates the toolbar row count.
  // Pagination state is handled exclusively by onPaginationChanged
  // to avoid reading stale values during model rebuild.
  const onModelUpdated = useCallback((event: ModelUpdatedEvent<Employee>) => {
    onRowCountChange(event.api.getDisplayedRowCount());
  }, [onRowCountChange]);

  const onPaginationChanged = useCallback((event: PaginationChangedEvent<Employee>) => {
    syncPagination(event.api);
  }, [syncPagination]);

  const onRowClicked = useCallback((event: RowClickedEvent<Employee>) => {
    if (event.data) onRowClick(event.data);
  }, [onRowClick]);

const handlePageChange = useCallback((page: number) => {
  const api = gridApiRef.current;

  if (!api) return;

  api.paginationGoToPage(page);
}, [gridApiRef]);


 const handlePageSizeChange = useCallback((size: number) => {
  const api = gridApiRef.current;

  if (!api) return;

  api.setGridOption('paginationPageSize', size);
  api.paginationGoToFirstPage();

  syncPagination(api);
}, [gridApiRef, syncPagination]);

  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col"
      style={{ height: 'calc(100vh - 330px)', minHeight: 420 }}
    >
      <div
        className="ag-theme-alpine"
        style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}
      >
        <AgGridReact<Employee>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilter}
          rowSelection="single"
          animateRows={true}
          pagination={true}
          paginationPageSize={paginationInfo.pageSize}
          suppressPaginationPanel={true}
          cacheQuickFilter={true}
          rowHeight={52}
          headerHeight={40}
          groupHeaderHeight={36}
          suppressCellFocus={true}
          onGridReady={onGridReady}
          onModelUpdated={onModelUpdated}
          onPaginationChanged={onPaginationChanged}
          onRowClicked={onRowClicked}
          overlayNoRowsTemplate='<span style="color:#9CA3AF;font-size:14px">No employees match your filters</span>'
        />
      </div>

      <PaginationControls
        currentPage={paginationInfo.currentPage}
        totalPages={paginationInfo.totalPages}
        pageSize={paginationInfo.pageSize}
        totalRows={paginationInfo.totalRows}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default EmployeeGrid;