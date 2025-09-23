'use client';
import { ReactNode, useRef, useState } from 'react';
import './Table-hybrid.css';

type SortDirection = 'ascending' | 'descending' | 'none';

interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  hasMenu?: boolean;
}

interface TableRow {
  id: string;
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
  size?: 'small' | 'medium' | 'large';
  emphasized?: boolean;
  onSort?: (columnKey: string, direction: SortDirection) => void;
  onRowClick?: (row: TableRow) => void;
  className?: string;
}

export function Table({ 
  columns,
  rows,
  size = 'medium',
  emphasized = false,
  onSort,
  onRowClick,
  className = ''
}: TableProps) {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  
  const ref = useRef<HTMLDivElement>(null);

  const handleSort = (columnKey: string) => {
    let newDirection: SortDirection;
    
    if (sortColumn === columnKey) {
      // Toggle direction for same column
      newDirection = sortDirection === 'ascending' ? 'descending' : 
                    sortDirection === 'descending' ? 'none' : 'ascending';
    } else {
      // Start with ascending for new column
      newDirection = 'ascending';
    }
    
    setSortColumn(newDirection === 'none' ? '' : columnKey);
    setSortDirection(newDirection);
    onSort?.(columnKey, newDirection);
  };

  const getSortIconName = (direction: SortDirection) => {
    return direction === 'ascending' ? 'ArrowUp100' : 'ArrowDown100';
  };

  // HYBRID APPROACH: Nuclear div with table role + Official Spectrum classes
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Table';
  const sizeClass = `spectrum-Table--size${size === 'small' ? 'S' : size === 'large' ? 'L' : 'M'}`;
  const emphasizedClass = emphasized ? 'spectrum-Table--emphasized' : '';
  
  const spectrumClasses = `${baseClasses} ${sizeClass} ${emphasizedClass}`.trim();
  const combinedClasses = `${resetClasses} ${spectrumClasses} ${className}`.trim();

  console.log('Table render:', { columns: columns.length, rows: rows.length, size, emphasized, sortColumn, sortDirection });

  return (
    <div
      ref={ref}
      role="table"
      className={combinedClasses}
      style={{ maxWidth: '800px' }}
    >
      {/* Table Head */}
      <div role="rowgroup" className="spectrum-Table-head">
        <div role="row">
          {columns.map((column) => {
            const isCurrentSort = sortColumn === column.key;
            const currentDirection = isCurrentSort ? sortDirection : 'none';
            const isSortable = column.sortable !== false;
            
            const headCellClasses = [
              'spectrum-Table-headCell',
              isSortable ? 'is-sortable' : '',
              isCurrentSort && sortDirection !== 'none' ? `is-sorted-${sortDirection === 'ascending' ? 'asc' : 'desc'}` : ''
            ].filter(Boolean).join(' ');

            return (
              <div
                key={column.key}
                role="columnheader"
                tabIndex={isSortable ? 0 : undefined}
                className={headCellClasses}
                aria-sort={currentDirection}
                onClick={isSortable ? () => handleSort(column.key) : undefined}
                onKeyDown={isSortable ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSort(column.key);
                  }
                } : undefined}
                style={{ cursor: isSortable ? 'pointer' : 'default' }}
              >
                {/* Sort Icon - only show when sorted */}
                {isCurrentSort && sortDirection !== 'none' && (
                  <div
                    role="img"
                    aria-hidden="true"
                    className="spectrum-Icon spectrum-UIIcon-ArrowDown100 spectrum-Icon--medium spectrum-Table-sortedIcon"
                    style={{
                      transform: sortDirection === 'ascending' ? 'rotate(180deg)' : 'none'
                    }}
                  >
                    <svg focusable="false" aria-hidden="true">
                      <use xlinkHref="#spectrum-css-icon-ArrowDown100" href="#spectrum-css-icon-ArrowDown100"></use>
                    </svg>
                  </div>
                )}
                
                <span className="spectrum-Table-columnTitle">{column.title}</span>
                
                {/* Menu Icon - optional */}
                {column.hasMenu && (
                  <div
                    role="img"
                    aria-hidden="true"
                    className="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Icon--medium spectrum-Table-menuIcon"
                  >
                    <svg focusable="false" aria-hidden="true">
                      <use xlinkHref="#spectrum-css-icon-ChevronDown100" href="#spectrum-css-icon-ChevronDown100"></use>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Table Body */}
      <div role="rowgroup" className="spectrum-Table-body">
        {rows.map((row) => (
          <div
            key={row.id}
            role="row"
            className="spectrum-Table-row"
            onClick={() => onRowClick?.(row)}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {columns.map((column) => (
              <div
                key={`${row.id}-${column.key}`}
                role="cell"
                className="spectrum-Table-cell"
              >
                {row[column.key]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}