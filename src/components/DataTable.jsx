import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Pagination from './Pagination';
import ColumnToggle from './ColumnToggle';
import SearchBar from './SearchBar';
import ExportButton from './ExportButton';
import ActionMenu from './ActionMenu';
import FilterPanel from './FilterPanel';

const DataTable = ({
  data = [],
  columns = [],
  title = 'Data Table',
  onView,
  onEdit,
  onDelete,
  onAuditLog,
  loading = false,
  itemsPerPage = 10,
  showColumnToggle = true,
  showSearch = true,
  showExport = true,
  showFilter = true,
  showActions = true,
  openMenuId = null,
  setOpenMenuId = () => {},
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: itemsPerPage,
  });
  const [globalFilter, setGlobalFilter] = useState('');

  // Add actions column if callbacks are provided
  const tableColumns = useMemo(() => {
    const cols = columns.map(col => ({
      ...col,
      id: col.id || col.accessorKey || col.header?.toString() || Math.random().toString(36).substring(7),
    }));
    
    if (showActions && (onView || onEdit || onDelete || onAuditLog)) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <ActionMenu 
            item={row.original}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onAuditLog={onAuditLog}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
          />
        ),
        enableSorting: false,
      });
    }
    
    return cols;
  }, [columns, onView, onEdit, onDelete, onAuditLog, showActions, openMenuId, setOpenMenuId]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });

  const skeletonRows = Array.from({ length: 5 });

  const handleFilter = (filters) => {
    console.log('Filters applied:', filters);
    // You can add additional logic here if needed
  };

  return (
    <div className="bg-white rounded-3 p-3 shadow-sm border border-light">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 gap-sm-3 mb-3">
        <h5 className="fw-semibold m-0" style={{ color: '#00084D', fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
          {title}
        </h5>
        <div className="d-flex flex-wrap align-items-center gap-1 gap-sm-2">
          {/* Search */}
          {showSearch && (
            <SearchBar 
              value={globalFilter} 
              onChange={setGlobalFilter} 
            />
          )}

          {/* Filter */}
          {showFilter && (
            <FilterPanel 
              table={table} 
              data={data}
              onFilter={handleFilter}
            />
          )}

          {/* Column Toggle */}
          {showColumnToggle && (
            <ColumnToggle table={table} />
          )}

          {/* Export Button */}
          {showExport && (
            <ExportButton data={data} />
          )}
        </div>
      </div>

      {/* Table */}
      <div 
        className="table-responsive" 
        style={{ 
          overflowX: 'auto', 
          overflowY: 'visible',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <table 
          className="table table-hover mb-0" 
          style={{ 
            width: '100%',
            minWidth: '100%',
          }}
        >
          {/* TABLE HEADER */}
          <thead className="table-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`fw-semibold text-secondary ${header.column.getCanSort() ? 'cursor-pointer' : ''}`}
                    style={{ 
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      fontSize: 'clamp(0.7rem, 0.8vw, 0.85rem)',
                      padding: '8px 10px',
                      whiteSpace: 'nowrap',
                      position: 'sticky',
                      top: 0,
                      background: '#f8f9fa',
                      zIndex: 2,
                    }}
                  >
                    <div className="d-flex align-items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ChevronUp size={12} />,
                        desc: <ChevronDown size={12} />,
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {loading ? (
              skeletonRows.map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {tableColumns.map((col, colIndex) => (
                    <td key={colIndex} className="px-2 py-3">
                      <div className="animate-pulse rounded bg-gray-200" style={{ height: '16px', width: '100%' }}></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={tableColumns.length}
                  className="text-center py-4 text-muted"
                >
                  No data found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="align-middle" style={{ 
                      padding: '8px 10px',
                      fontSize: 'clamp(0.75rem, 0.85vw, 0.9rem)',
                    }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination table={table} totalCount={data.length} />
    </div>
  );
};

export default DataTable;