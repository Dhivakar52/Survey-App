import React, { useState, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Settings, Eye, Edit, Trash2, Download, ChevronRight, Check } from 'lucide-react';
import Pagination from './Pagination';

const DataTable = ({
  data = [],
  columns = [],
  title = 'Data Table',
  onEdit,
  onDelete,
  onView,
  loading = false,
  itemsPerPage = 10,
  showColumnToggle = true,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: itemsPerPage,
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsColumnDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add actions column if callbacks are provided
  const tableColumns = React.useMemo(() => {
    const cols = columns.map(col => ({
      ...col,
      id: col.id || col.accessorKey || col.header?.toString() || Math.random().toString(36).substring(7),
    }));
    
    if (onEdit || onDelete || onView) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="d-flex gap-1 justify-content-center">
            {onView && (
              <button
                onClick={() => onView(row.original)}
                className="btn btn-sm btn-outline-primary rounded-circle p-1"
                title="View"
                style={{ width: '30px', height: '30px' }}
              >
                <Eye size={14} />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(row.original)}
                className="btn btn-sm btn-outline-warning rounded-circle p-1"
                title="Edit"
                style={{ width: '30px', height: '30px' }}
              >
                <Edit size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(row.original)}
                className="btn btn-sm btn-outline-danger rounded-circle p-1"
                title="Delete"
                style={{ width: '30px', height: '30px' }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ),
        enableSorting: false,
      });
    }
    
    return cols;
  }, [columns, onEdit, onDelete, onView]);

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

  // Get visible column count
  const visibleCount = table.getAllLeafColumns().filter(col => col.getIsVisible()).length;
  const totalColumns = table.getAllLeafColumns().length;

  // Format column name for display
  const formatColumnName = (name) => {
    if (name === 'id') return 'ID';
    if (name === 'actions') return '';
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
  };

  // Skeleton rows for loading state
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="bg-white rounded-3 p-3 p-lg-4 shadow-sm border border-light">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h5 className="fw-semibold m-0" style={{ color: '#00084D' }}>
          {title}
        </h5>
        <div className="d-flex flex-wrap align-items-center gap-2">


             {showColumnToggle && (
            <div className="position-relative" ref={dropdownRef}>
              <button
                onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                className="btn btn-light btn-sm d-flex align-items-center gap-1"
                style={{
                  borderColor: isColumnDropdownOpen ? '#00084D' : '#dee2e6',
                  background: isColumnDropdownOpen ? '#f0f4ff' : '#ffffff',
                }}
              >
                <Settings size={16} />
                <span>Columns</span>
                <span 
                  className="badge ms-1" 
                  style={{ 
                    background: '#00084D', 
                    fontSize: '0.6rem',
                    padding: '2px 6px'
                  }}
                >
                  {visibleCount}
                </span>
                <ChevronRight 
                  size={14} 
                  style={{
                    transform: isColumnDropdownOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </button>

              {isColumnDropdownOpen && (
                <div
                  className="position-absolute end-0 mt-1 bg-white rounded-3 shadow-lg border"
                  style={{ 
                    zIndex: 1050, 
                    width: '220px',
                    top: '100%',
                    maxHeight: '320px',
                    overflowY: 'auto',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                  }}
                >
                  {/* Header */}
                  <div className="px-3 py-2 border-bottom bg-light rounded-top-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small fw-semibold text-muted">Toggle Columns</span>
                      <button
                        onClick={() => {
                          const allVisible = {};
                          table.getAllLeafColumns().forEach(col => {
                            if (col.id !== 'actions') {
                              allVisible[col.id] = true;
                            }
                          });
                          setColumnVisibility(allVisible);
                        }}
                        className="btn btn-sm btn-link text-primary p-0 text-decoration-none"
                      >
                        Show All
                      </button>
                    </div>
                  </div>
                  
                  {/* Column List */}
                  <div className="p-2">
                    {table.getAllLeafColumns().map((column) => {
                      if (column.id === 'actions') return null;
                      const isVisible = column.getIsVisible();
                      const displayName = formatColumnName(column.id);
                      
                      return (
                        <label
                          key={column.id}
                          className="d-flex align-items-center gap-2 rounded cursor-pointer"
                          style={{
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                             padding: '6px 4px',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center rounded"
                            style={{
                              width: '18px',
                              height: '18px',
                              border: isVisible ? '2px solid #00084D' : '2px solid #d1d5db',
                              background: isVisible ? '#00084D' : '#ffffff',
                              transition: 'all 0.15s ease',
                              flexShrink: 0,
                             
                            }}
                          >
                            {isVisible && <Check size={12} color="#ffffff" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={() => column.toggleVisibility(!isVisible)}
                            style={{ display: 'none' }}
                          />
                          <span className="small" style={{ color: isVisible ? '#00084D' : '#6c757d' }}>
                            {displayName}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Search */}
          <div className="d-flex align-items-center bg-light rounded px-2 py-1 border border-light">


              {/* Column Toggle Dropdown */}
         






            <input
              type="text"
              placeholder="Search..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="border-0 bg-transparent px-2 py-1 small"
              style={{ width: '150px', outline: 'none' }}
            />
          </div>

        
          {/* Export Button */}
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            style={{ background: '#00084D', borderColor: '#00084D' }}
            onClick={() => {
              console.log('Export data:', data);
            }}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover  mb-0">
          <thead className="table-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`fw-semibold text-secondary ${
                      header.column.getCanSort() ? 'cursor-pointer' : ''
                    }`}
                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  >
                    <div className="d-flex align-items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ChevronUp size={14} />,
                        desc: <ChevronDown size={14} />,
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              skeletonRows.map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {tableColumns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
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
                    <td key={cell.id} className="align-middle">
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