'use client';
import { ReactNode } from 'react';
import './Asset-hybrid.css';

export interface AssetProps {
  children?: ReactNode;
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  variant?: 'default' | 'overlay' | 'file';
  isSelected?: boolean;
  isDropTarget?: boolean;
  id?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export function Asset({
  children,
  src,
  alt = '',
  className = '',
  style,
  size = 'm',
  variant = 'default',
  isSelected = false,
  isDropTarget = false,
  id,
  onClick,
  onDoubleClick,
}: AssetProps) {
  
  // Build Spectrum CSS classes following the nuclear div approach
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Asset';
  const sizeClass = `spectrum-Asset--size${size.toUpperCase()}`;
  const variantClass = variant !== 'default' ? `spectrum-Asset--${variant}` : '';
  
  // Build state classes
  const stateClasses = [
    isSelected && 'is-selected',
    isDropTarget && 'is-drop-target',
  ].filter(Boolean).join(' ');

  const assetClasses = [
    resetClasses,
    baseClasses,
    sizeClass,
    variantClass,
    stateClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={assetClasses}
      id={id}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <img 
        className="spectrum-Asset-image" 
        src={src} 
        alt={alt}
        style={{ 
          maxInlineSize: '75%', 
          maxBlockSize: '75%' 
        }}
      />
      {children && (
        <div className="spectrum-Asset-content">
          {children}
        </div>
      )}
    </div>
  );
}