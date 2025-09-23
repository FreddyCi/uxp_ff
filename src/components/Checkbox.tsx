'use client';
import { ReactNode, useRef, useState } from 'react';
import { useCheckbox, useFocusRing } from 'react-aria';
import './Checkbox-hybrid.css';

export interface CheckboxProps {
  children?: ReactNode;
  value?: string;
  size?: 's' | 'm' | 'l' | 'xl';
  isSelected?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isEmphasized?: boolean;
  onChange?: (isSelected: boolean) => void;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export function Checkbox({
  children,
  value,
  size = 'm',
  isSelected = false,
  isIndeterminate = false,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  isEmphasized = false,
  onChange,
  className = '',
  id,
  ...ariaProps
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  
  // Use state for checkbox selection
  const [checked, setChecked] = useState(isSelected);

  // Handle change events
  const handleChange = (isSelected: boolean) => {
    setChecked(isSelected);
    onChange?.(isSelected);
  };

  // Use React Aria for focus ring management
  const { focusProps, isFocusVisible } = useFocusRing();

  // Build Spectrum CSS classes following the nuclear div approach
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Checkbox';
  const sizeClass = `spectrum-Checkbox--size${size.toUpperCase()}`;
  
  // Build state classes
  const stateClasses = [
    isIndeterminate && 'is-indeterminate',
    isInvalid && 'is-invalid',
    isEmphasized && 'spectrum-Checkbox--emphasized',
    isReadOnly && 'is-readOnly',
    isFocusVisible && 'is-focus-visible'
  ].filter(Boolean).join(' ');

  const checkboxClasses = [
    resetClasses,
    baseClasses,
    sizeClass,
    stateClasses,
    className
  ].filter(Boolean).join(' ');

  // Determine icon sizes based on checkbox size
  const getIconSize = () => {
    switch (size) {
      case 's': return '50';
      case 'm': return '75';
      case 'l': return '100';
      case 'xl': return '200';
      default: return '75';
    }
  };

  const iconSize = getIconSize();

  return (
    <label className={checkboxClasses} htmlFor={id}>
      <input
        {...focusProps}
        ref={ref}
        type="checkbox"
        className="spectrum-Checkbox-input"
        id={id}
        value={value}
        checked={checked}
        disabled={isDisabled}
        readOnly={isReadOnly}
        onChange={(e) => handleChange(e.target.checked)}
        aria-label={ariaProps['aria-label']}
        aria-labelledby={ariaProps['aria-labelledby']}
        aria-describedby={ariaProps['aria-describedby']}
      />
      
      <span className="spectrum-Checkbox-box">
        {/* Checkmark icon */}
        <svg 
          focusable="false" 
          aria-hidden="true" 
          role="img" 
          className={`spectrum-Icon spectrum-UIIcon-Checkmark${iconSize} spectrum-Icon--medium spectrum-Checkbox-checkmark`}
        >
          <use href={`#spectrum-css-icon-Checkmark${iconSize}`} />
        </svg>
        
        {/* Partial checkmark (dash) icon for indeterminate state */}
        <svg 
          focusable="false" 
          aria-hidden="true" 
          role="img" 
          className={`spectrum-Icon spectrum-UIIcon-Dash${iconSize} spectrum-Icon--medium spectrum-Checkbox-partialCheckmark`}
        >
          <use href={`#spectrum-css-icon-Dash${iconSize}`} />
        </svg>
      </span>
      
      {children && (
        <span className="spectrum-Checkbox-label">
          {children}
        </span>
      )}
    </label>
  );
}

export default Checkbox;