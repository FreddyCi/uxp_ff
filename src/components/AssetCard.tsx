import React from 'react';

export interface AssetCardProps {
  /** Asset image source */
  src: string;
  /** Asset image alt text */
  alt: string;
  /** Card title */
  title?: string;
  /** Header content (additional metadata) */
  headerContent?: React.ReactNode;
  /** Main content area */
  content?: React.ReactNode;
  /** Selection style variant */
  selectionStyle?: 'checkbox' | 'highlight' | 'ordered';
  /** Whether the card is selected */
  isSelected?: boolean;
  /** Whether the card is a drop target */
  isDropTarget?: boolean;
  /** Whether the card is focused */
  isFocused?: boolean;
  /** Asset size in pixels */
  assetSize?: number;
  /** Additional CSS class */
  className?: string;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  src,
  alt,
  title,
  headerContent,
  content,
  selectionStyle,
  isSelected = false,
  isDropTarget = false,
  isFocused = false,
  assetSize = 224,
  className = '',
}) => {
  const baseClasses = 'spectrum-AssetCard';
  const selectionClasses = selectionStyle ? `spectrum-AssetCard--${selectionStyle}Selection` : '';
  const stateClasses = [
    isSelected ? 'is-selected' : '',
    isDropTarget ? 'is-drop-target' : '',
    isFocused ? 'is-focused' : '',
  ].filter(Boolean).join(' ');

  const combinedClasses = [baseClasses, selectionClasses, stateClasses, className].filter(Boolean).join(' ');

  return (
    <div
      className={combinedClasses}
      style={{ '--spectrum-assetcard-asset-size': `${assetSize}px` } as React.CSSProperties}
    >
      <div className="spectrum-AssetCard-assetContainer">
        <img className="spectrum-AssetCard-asset" src={src} alt={alt} />
      </div>
      {(title || headerContent) && (
        <div className="spectrum-AssetCard-header">
          {title && <div className="spectrum-AssetCard-title">{title}</div>}
          {headerContent && <div className="spectrum-AssetCard-headerContent">{headerContent}</div>}
        </div>
      )}
      {content && <div className="spectrum-AssetCard-content">{content}</div>}
      {selectionStyle === 'checkbox' && (
        <div className="spectrum-AssetCard-selectionOverlay">
          <div className="spectrum-AssetCard-selectionIndicator"></div>
        </div>
      )}
    </div>
  );
};