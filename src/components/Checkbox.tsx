'use client';
import {Checkbox as AriaCheckbox, CheckboxProps} from 'react-aria-components';

export function Checkbox(
  { children, ...props }: Omit<CheckboxProps, 'children'> & {
    children?: React.ReactNode;
  }
) {
  return (
    <AriaCheckbox 
      {...props}
      style={{
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#e5e7eb',
        cursor: 'pointer',
        ...props.style
      }}
    >
      {({ isIndeterminate, isSelected }) => (
        <>
          <div 
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid #6b7280',
              borderRadius: '4px',
              transition: 'all 200ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              backgroundColor: isSelected ? '#3b82f6' : '#374151',
              borderColor: isSelected ? '#3b82f6' : '#6b7280'
            }}
          >
            <svg 
              viewBox="0 0 18 18" 
              aria-hidden="true"
              style={{
                width: '14px',
                height: '14px',
                fill: 'none',
                stroke: '#ffffff',
                strokeWidth: '3px',
                strokeDasharray: '22px',
                strokeDashoffset: isSelected ? '44' : '66',
                transition: 'all 200ms'
              }}
            >
              {isIndeterminate
                ? <rect x={1} y={7.5} width={15} height={3} />
                : <polyline points="1 9 7 14 15 4" />}
            </svg>
          </div>
          {children}
        </>
      )}
    </AriaCheckbox>
  );
}