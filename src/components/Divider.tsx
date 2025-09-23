'use client';
import { ReactNode } from 'react';
import './Divider-hybrid.css';

interface DividerProps {
  size?: 'S' | 'M' | 'L';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export function Divider({ 
  size = 'M',
  orientation = 'horizontal',
  className = '',
  style = {},
  ...props 
}: DividerProps) {
  
  // HYBRID APPROACH: Nuclear div + Official Spectrum classes
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Divider';
  const sizeClass = `spectrum-Divider--size${size}`;
  const orientationClass = orientation === 'vertical' ? 'spectrum-Divider--vertical' : '';
  
  const spectrumClasses = `${baseClasses} ${sizeClass} ${orientationClass}`.trim();
  const combinedClasses = `${resetClasses} ${spectrumClasses} ${className}`.trim();

  console.log('Divider render:', { size, orientation, combinedClasses });

  // Use HR element for semantic correctness but style it completely with our classes
  return (
    <hr
      role="separator"
      className={combinedClasses}
      style={{
        minInlineSize: orientation === 'horizontal' ? '200px' : 'auto',
        minBlockSize: orientation === 'vertical' ? '200px' : 'auto',
        ...style
      }}
      {...props}
    />
  );
}