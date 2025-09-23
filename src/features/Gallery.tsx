import React from 'react';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { GridIcon } from 'hugeicons-react';

export const Gallery: React.FC = () => {
  console.log('Gallery component rendering...');

  // UXP Detection and debugging
  const isInUxp = typeof (globalThis as any).uxp !== 'undefined';
  const userAgent = navigator.userAgent;
  console.log('Gallery running in UXP:', isInUxp);
  console.log('User Agent:', userAgent);
  console.log('Window dimensions:', window.innerWidth, 'x', window.innerHeight);

  // Table data for demonstration
  const tableColumns = [
    { key: 'name', title: 'Asset Name', sortable: true, hasMenu: true },
    { key: 'type', title: 'Type', sortable: true },
    { key: 'size', title: 'File Size', sortable: true },
    { key: 'modified', title: 'Last Modified', sortable: true }
  ];

  const tableRows = [
    { id: '1', name: 'Mountain Landscape.jpg', type: 'JPEG Image', size: '2.4 MB', modified: '2024-01-15' },
    { id: '2', name: 'Ocean Sunset.png', type: 'PNG Image', size: '1.8 MB', modified: '2024-01-14' },
    { id: '3', name: 'Forest Path.jpg', type: 'JPEG Image', size: '3.1 MB', modified: '2024-01-13' },
    { id: '4', name: 'City Skyline.jpg', type: 'JPEG Image', size: '2.7 MB', modified: '2024-01-12' },
    { id: '5', name: 'Desert Dunes.png', type: 'PNG Image', size: '2.2 MB', modified: '2024-01-11' }
  ];

  const handleSort = (columnKey: string, direction: 'ascending' | 'descending' | 'none') => {
    console.log('Table sort:', { columnKey, direction });
  };

  const handleRowClick = (row: any) => {
    console.log('Table row clicked:', row);
  };

  return (
    <div style={{ 
      padding: '16px', 
      backgroundColor: '#1c1c1c', 
      color: '#ffffff', 
      minHeight: '400px',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, sans-serif',
      overflow: 'auto'
    }}>
      {/* Header similar to Adobe panel */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #444'
      }}>
        <GridIcon size={20} color="#ffffff" style={{ marginRight: '8px' }} />
        <h2 style={{ 
          margin: '0', 
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '600'
        }}>Image Gallery</h2>
      </div>
      
      {/* Table View Section */}
      <div style={{ 
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#2d2d2d',
        borderRadius: '8px',
        border: '1px solid #444'
      }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Asset Table View
        </h3>
        <Table
          columns={tableColumns}
          rows={tableRows}
          size="medium"
          emphasized={true}
          onSort={handleSort}
          onRowClick={handleRowClick}
        />
      </div>
      
      
      {/* Action buttons - Adobe style */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        paddingTop: '12px',
        borderTop: '1px solid #444'
      }}>
        <Button onPress={() => console.log('Select All clicked')}>
          Select All
        </Button>
        <Button onPress={() => console.log('Clear Selection clicked')} variant="secondary">
          Clear
        </Button>
      </div>
    </div>
  );
};