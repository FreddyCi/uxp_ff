'use client';
import { ReactNode, useRef } from 'react';
import { useButton, useFocusRing } from 'react-aria';
import './Card-hybrid.css';

export interface CardProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  footer?: ReactNode;
  variant?: 'gallery' | 'quiet' | 'horizontal';
  isSelected?: boolean;
  isFocused?: boolean;
  isDropTarget?: boolean;
  hasActions?: boolean;
  hasQuickActions?: boolean;
  coverPhoto?: string;
  preview?: ReactNode;
  actions?: ReactNode;
  quickActions?: ReactNode;
  onPress?: () => void;
  className?: string;
  id?: string;
  role?: string;
  tabIndex?: number;
}

export function Card({
  children,
  title,
  subtitle,
  description,
  footer,
  variant,
  isSelected = false,
  isFocused = false,
  isDropTarget = false,
  hasActions = false,
  hasQuickActions = false,
  coverPhoto,
  preview,
  actions,
  quickActions,
  onPress,
  className = '',
  id,
  role = 'figure',
  tabIndex = 0,
  ...props
}: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Use React Aria for button-like behavior if onPress is provided
  const { buttonProps } = useButton({
    onPress,
    isDisabled: false,
  }, ref);

  // Use React Aria for focus ring management
  const { focusProps, isFocusVisible } = useFocusRing();

  // Build Spectrum CSS classes following the nuclear div approach
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Card';
  const variantClass = variant ? `spectrum-Card--${variant}` : '';
  
  // Build state classes
  const stateClasses = [
    isSelected && 'is-selected',
    isFocused && 'is-focused', 
    isDropTarget && 'is-drop-target',
    isFocusVisible && 'is-focus-visible'
  ].filter(Boolean).join(' ');

  const cardClasses = [
    resetClasses,
    baseClasses,
    variantClass,
    stateClasses,
    className
  ].filter(Boolean).join(' ');

  // Combine button props and focus props if interactive
  const combinedProps = onPress ? { ...buttonProps, ...focusProps } : { ...focusProps };

  return (
    <div
      ref={ref}
      className={cardClasses}
      role={role}
      tabIndex={tabIndex}
      id={id}
      {...combinedProps}
      {...props}
    >
      {/* Cover Photo / Preview */}
      {coverPhoto && (
        <div 
          className="spectrum-Card-coverPhoto"
          style={{ backgroundImage: `url(${coverPhoto})` }}
        />
      )}
      
      {preview && (
        <div className="spectrum-Card-preview">
          {preview}
        </div>
      )}

      {/* Divider after preview */}
      {(coverPhoto || preview) && (
        <hr 
          role="separator" 
          className="spectrum-Divider spectrum-Divider--sizeS spectrum-Card-divider" 
        />
      )}

      {/* Card Body */}
      <div className="spectrum-Card-body">
        {/* Header with title and actions */}
        {(title || hasActions) && (
          <div className="spectrum-Card-header">
            {title && (
              <div className="spectrum-Card-title">
                {title}
              </div>
            )}
            
            {hasActions && actions && (
              <div className="spectrum-Card-actions">
                {actions}
              </div>
            )}
          </div>
        )}

        {/* Content area */}
        {(subtitle || description || children) && (
          <div className="spectrum-Card-content">
            {subtitle && (
              <div className="spectrum-Card-subtitle">
                {subtitle}
              </div>
            )}
            
            {description && (
              <div className="spectrum-Card-description">
                {description}
              </div>
            )}
            
            {children}
          </div>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className="spectrum-Card-footer">
          {footer}
        </div>
      )}

      {/* Quick Actions (like checkboxes) */}
      {hasQuickActions && quickActions && (
        <div className="spectrum-Card-quickActions">
          {quickActions}
        </div>
      )}
    </div>
  );
}

export default Card;