import React from 'react';
import './MenuItem-hybrid.css';

// MenuItem Size type
export type MenuItemSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// MenuItem Props
export interface MenuItemProps {
  /** The main text label for the menu item */
  children: React.ReactNode;
  /** Optional description text below the label */
  description?: string;
  /** Icon name (emoji or text) to display before the label */
  iconName?: string;
  /** Size of the menu item */
  size?: MenuItemSize;
  /** Whether the item is selected */
  isSelected?: boolean;
  /** Whether the item is disabled */
  isDisabled?: boolean;
  /** Called when the menu item is clicked */
  onPress?: (event: React.MouseEvent<HTMLLIElement>) => void;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Additional CSS class */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Role for accessibility (defaults to "option" for menu items) */
  role?: string;
  /** Whether the item is selected for aria-selected */
  'aria-selected'?: boolean;
  /** Whether the item is disabled for aria-disabled */
  'aria-disabled'?: boolean;
  /** Unique ID for the menu item */
  id?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  description,
  iconName,
  size = 'm',
  isSelected = false,
  isDisabled = false,
  onPress,
  'aria-label': ariaLabel,
  className = '',
  style = {},
  tabIndex = 0,
  role = 'option',
  'aria-selected': ariaSelected,
  'aria-disabled': ariaDisabled,
  id,
  ...otherProps
}) => {
  // Generate CSS classes
  const menuItemClasses = [
    'uxp-reset--complete',
    'spectrum-Menu-item',
    `spectrum-Menu-item--size${size.toUpperCase()}`,
    isSelected && 'is-selected',
    isDisabled && 'is-disabled',
    className,
  ].filter(Boolean).join(' ');

  // Handle click events
  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    
    onPress?.(event);
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (isDisabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onPress?.(event as any);
    }
  };

  return (
    <li
      id={id}
      className={menuItemClasses}
      style={style}
      role={role}
      aria-selected={ariaSelected ?? isSelected}
      aria-disabled={ariaDisabled ?? isDisabled}
      aria-label={ariaLabel}
      tabIndex={isDisabled ? -1 : tabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...otherProps}
    >
      {/* Icon */}
      {iconName && (
        <span 
          className="uxp-reset--complete spectrum-Menu-itemIcon spectrum-Menu-itemIcon--workflowIcon"
          aria-hidden="true"
        >
          {iconName}
        </span>
      )}
      
      {/* Label */}
      <span className="uxp-reset--complete spectrum-Menu-itemLabel">
        {children}
      </span>
      
      {/* Description */}
      {description && (
        <span className="uxp-reset--complete spectrum-Menu-itemDescription">
          {description}
        </span>
      )}
    </li>
  );
};