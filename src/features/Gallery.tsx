import React from 'react';
import { Button } from '../components/Button';
import { Image } from '../components/Image';
import { GridIcon } from 'hugeicons-react';

export const Gallery: React.FC = () => {
  console.log('Gallery component rendering...');

  // UXP Detection and debugging
  const isInUxp = typeof (globalThis as any).uxp !== 'undefined';
  const userAgent = navigator.userAgent;
  console.log('Gallery running in UXP:', isInUxp);
  console.log('User Agent:', userAgent);
  console.log('Window dimensions:', window.innerWidth, 'x', window.innerHeight);

  // Create high-contrast placeholder images that will definitely be visible
  const createPlaceholderImage = (color: string, textColor: string, id: number) => {
    const svgString = `
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="${color}" stroke="#333" stroke-width="2"/>
        <circle cx="100" cy="75" r="40" fill="rgba(255,255,255,0.2)"/>
        <text x="100" y="85" font-family="system-ui" font-size="24" font-weight="bold" fill="${textColor}" text-anchor="middle">${id}</text>
        <text x="100" y="105" font-family="system-ui" font-size="12" fill="${textColor}" text-anchor="middle">Image ${id}</text>
      </svg>
    `;
    const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
    console.log(`Generated large image ${id}:`, dataUrl.substring(0, 100) + '...');
    return dataUrl;
  };

  const items = [
    { id: 1, name: 'Mountain Landscape', description: 'Scenic mountain view', src: createPlaceholderImage('#2563eb', 'white', 1) },
    { id: 2, name: 'Ocean Sunset', description: 'Beautiful ocean scene', src: createPlaceholderImage('#dc2626', 'white', 2) },
    { id: 3, name: 'Forest Path', description: 'Mystical forest walkway', src: createPlaceholderImage('#16a34a', 'white', 3) },
    { id: 4, name: 'City Skyline', description: 'Modern urban landscape', src: createPlaceholderImage('#ca8a04', 'white', 4) },
    { id: 5, name: 'Desert Dunes', description: 'Golden sand patterns', src: createPlaceholderImage('#9333ea', 'white', 5) },
    { id: 6, name: 'Arctic Aurora', description: 'Northern lights display', src: createPlaceholderImage('#0891b2', 'white', 6) },
  ];

  console.log('Gallery items:', items.length);

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
        <div style={{
          marginLeft: 'auto',
          fontSize: '12px',
          color: '#999',
          backgroundColor: '#444',
          padding: '4px 8px',
          borderRadius: '12px'
        }}>
          {items.length} items
        </div>
      </div>
      
      {/* Gallery grid - UXP compatible flexbox instead of CSS Grid */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
        justifyContent: 'flex-start'
      }}>
        {items.map((item) => {
          console.log('Rendering item:', item.name);
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#383838',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid transparent',
                width: '160px',
                flexShrink: 0
              }}
              onClick={() => console.log(`Selected ${item.name}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#454545';
                e.currentTarget.style.borderColor = '#4a90e2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#383838';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{
                position: 'relative',
                marginBottom: '8px'
              }}>
                <Image
                  src={item.src}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '120px',
                    borderRadius: '6px',
                    objectFit: 'cover',
                    backgroundColor: '#2a2a2a'
                  }}
                  onLoad={() => console.log(`Image ${item.id} loaded successfully`)}
                  onError={(e) => console.error(`Image ${item.id} failed to load:`, e)}
                />
                {/* Overlay badge */}
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: 'white'
                }}>
                  {item.id}
                </div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ 
                  margin: '0 0 4px 0', 
                  color: '#ffffff', 
                  fontSize: '13px',
                  fontWeight: '500',
                  lineHeight: '1.3'
                }}>
                  {item.name}
                </h4>
                <p style={{ 
                  margin: '0', 
                  color: '#999', 
                  fontSize: '11px',
                  lineHeight: '1.3'
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Simple grid without complex GridList component */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        padding: '20px',
        backgroundColor: '#2d2d2d',
        borderRadius: '8px',
        border: '2px solid #666',
        minHeight: '400px'
      }}>
        {items.map((item) => {
          console.log('Rendering item:', item.name);
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#374151',
                border: '2px solid #6b7280',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                minHeight: '200px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
              onClick={() => console.log(`Selected ${item.name}`)}
            >
              <img
                src={item.src}
                alt={`${item.name} - ${item.description}`}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  objectFit: 'cover',
                  border: '3px solid #fff',
                  backgroundColor: '#fff'
                }}
                onLoad={() => console.log(`Image ${item.id} loaded successfully`)}
                onError={(e) => console.error(`Image ${item.id} failed to load:`, e)}
              />
              <h3 style={{ margin: '0 0 8px 0', color: '#e5e7eb', fontSize: '18px', fontWeight: 'bold' }}>{item.name}</h3>
              <p style={{ margin: '0', color: '#9ca3af', fontSize: '14px' }}>{item.description}</p>
            </div>
          );
        })}
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