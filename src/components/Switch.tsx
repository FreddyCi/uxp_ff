'use client';
import { ReactNode, useRef, useId, useState, useEffect } from 'react';
import { useFocusRing } from 'react-aria';
import './Switch-hybrid.css';

export interface SwitchProps {
  children?: ReactNode;
  size?: 's' | 'm' | 'l' | 'xl';
  isSelected?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onChange?: (isSelected: boolean) => void;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export function Switch({
  children,
  size = 'm',
  isSelected = false,
  isDisabled = false,
  isReadOnly = false,
  onChange,
  className = '',
  id,
  ...ariaProps
}: SwitchProps) {
  const ref = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const switchId = id || generatedId;
  const inputId = `${switchId}-input`;

  // Use local state for switch management
  const [checked, setChecked] = useState(isSelected);

  // Update local state when prop changes
  useEffect(() => {
    setChecked(isSelected);
  }, [isSelected]);

  // Handle change events
  const handleChange = (isSelected: boolean) => {
    if (isDisabled || isReadOnly) return;
    console.log('Switch handleChange:', { isSelected, checked });
    setChecked(isSelected);
    onChange?.(isSelected);
  };

  // Handle click on the switch container
  const handleClick = () => {
    console.log('Switch handleClick called:', { isDisabled, isReadOnly, checked });
    if (isDisabled || isReadOnly) {
      console.log('Switch click blocked:', { isDisabled, isReadOnly });
      return;
    }
    const newValue = !checked;
    console.log('Switch toggling to:', newValue);
    handleChange(newValue);
  };

  // Use React Aria for focus ring management
  const { focusProps, isFocusVisible } = useFocusRing();

  // HYBRID APPROACH: Nuclear div + Official Spectrum classes
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Switch';
  const sizeClass = `spectrum-Switch--size${size.toUpperCase()}`;
  
  // Build state classes
  const stateClasses = [
    isReadOnly && 'is-readOnly',
    isFocusVisible && 'is-focus-visible'
  ].filter(Boolean).join(' ');

  const switchClasses = [
    resetClasses,
    baseClasses,
    sizeClass,
    stateClasses,
    className
  ].filter(Boolean).join(' ');

  console.log('Switch render:', { 
    size, 
    isSelected: checked, 
    isDisabled, 
    isReadOnly, 
    switchId, 
    inputId 
  });

  // Use DIV instead of native switch elements to completely bypass UXP's native styling
  return (
    <div
      role="switch"
      className={switchClasses}
      id={switchId}
      aria-checked={checked}
      aria-disabled={isDisabled}
      aria-readonly={isReadOnly}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
    >
      <input
        {...focusProps}
        ref={ref}
        type="checkbox"
        className="spectrum-Switch-input"
        id={inputId}
        checked={checked}
        disabled={isDisabled}
        readOnly={isReadOnly}
        onChange={(e) => handleChange(e.target.checked)}
        aria-label={ariaProps['aria-label']}
        aria-labelledby={ariaProps['aria-labelledby']}
        aria-describedby={ariaProps['aria-describedby']}
      />
      
      <span className="spectrum-Switch-switch"></span>
      
      {children && (
        <span className="spectrum-Switch-label">
          {children}
        </span>
      )}
    </div>
  );
}

export default Switch;