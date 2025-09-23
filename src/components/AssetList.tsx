'use client';
import { ReactNode, useState } from 'react';
import { Checkbox } from './Checkbox';
import './AssetList-hybrid.css';

export interface AssetListItem {
  id: string;
  label: string;
  thumbnail?: string | ReactNode;
  isSelected?: boolean;
  isBranch?: boolean;
  isNavigated?: boolean;
  metadata?: string;
}

export interface AssetListProps {
  items: AssetListItem[];
  isSelectable?: boolean;
  selectionMode?: 'single' | 'multiple' | 'none';
  onSelectionChange?: (selectedIds: string[]) => void;
  onItemClick?: (item: AssetListItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function AssetList({
  items,
  isSelectable = true,
  selectionMode = 'multiple',
  onSelectionChange,
  onItemClick,
  className = '',
  style,
}: AssetListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    items.filter(item => item.isSelected).map(item => item.id)
  );

  const effectiveIsSelectable = isSelectable && selectionMode !== 'none';

  const handleCheckboxChange = (itemId: string, isSelected: boolean) => {
    let newSelectedIds: string[];
    
    if (selectionMode === 'single') {
      newSelectedIds = isSelected ? [itemId] : [];
    } else {
      newSelectedIds = isSelected
        ? [...selectedIds, itemId]
        : selectedIds.filter(id => id !== itemId);
    }

    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const handleItemClick = (item: AssetListItem) => {
    if (effectiveIsSelectable && onSelectionChange) {
      const isCurrentlySelected = selectedIds.includes(item.id);
      handleCheckboxChange(item.id, !isCurrentlySelected);
    }
    onItemClick?.(item);
  };

  // Build Spectrum CSS classes following the nuclear div approach
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-AssetList';

  const assetListClasses = [
    resetClasses,
    baseClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <ul
      className={assetListClasses}
      style={style}
      role="list"
    >
      {items.map((item) => {
        // Build item classes
        const itemResetClasses = 'uxp-reset--complete';
        const itemBaseClasses = 'spectrum-AssetList-item';
        const itemStateClasses = [
          effectiveIsSelectable && 'is-selectable',
          selectedIds.includes(item.id) && 'is-selected',
          item.isBranch && 'is-branch',
          item.isNavigated && 'is-navigated',
        ].filter(Boolean).join(' ');

        const itemClasses = [
          itemResetClasses,
          itemBaseClasses,
          itemStateClasses
        ].filter(Boolean).join(' ');

        return (
          <li
            key={item.id}
            className={itemClasses}
            tabIndex={0}
            onClick={() => handleItemClick(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleItemClick(item);
              }
            }}
            role="option"
            aria-selected={selectedIds.includes(item.id)}
          >
            {effectiveIsSelectable && (
              <label className="spectrum-AssetList-itemSelector">
                <Checkbox
                  isSelected={selectedIds.includes(item.id)}
                  onChange={(isSelected) => handleCheckboxChange(item.id, isSelected)}
                  size="m"
                  aria-labelledby={`assetitemlabel-${item.id}`}
                />
              </label>
            )}

            {/* Thumbnail */}
            <div className="spectrum-AssetList-itemThumbnail">
              {typeof item.thumbnail === 'string' ? (
                <img
                  src={item.thumbnail}
                  alt={`${item.label} thumbnail`}
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
              ) : item.thumbnail ? (
                item.thumbnail
              ) : (
                // Default document icon
                <svg
                  focusable="false"
                  aria-hidden="true"
                  role="img"
                  className="spectrum-Icon spectrum-Icon--sizeM"
                  style={{ width: '32px', height: '32px' }}
                  aria-labelledby={`icon-${item.id}`}
                >
                  <title id={`icon-${item.id}`}>Document</title>
                  <use xlinkHref="#spectrum-icon-18-Document" href="#spectrum-icon-18-Document"></use>
                </svg>
              )}
            </div>

            {/* Label */}
            <span
              className="spectrum-AssetList-itemLabel"
              id={`assetitemlabel-${item.id}`}
            >
              {item.label}
            </span>

            {/* Child indicator for folders */}
            {item.isBranch && (
              <svg
                focusable="false"
                aria-hidden="true"
                role="img"
                className="spectrum-Icon spectrum-UIIcon-ChevronRight100 spectrum-Icon--medium spectrum-AssetList-itemChildIndicator"
                aria-labelledby={`chevron-${item.id}`}
              >
                <title id={`chevron-${item.id}`}>Chevron100</title>
                <use xlinkHref="#spectrum-css-icon-Chevron100" href="#spectrum-css-icon-Chevron100"></use>
              </svg>
            )}
          </li>
        );
      })}
    </ul>
  );
}