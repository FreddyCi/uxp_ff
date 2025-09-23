import React, { useState, useEffect, forwardRef, useId } from 'react';
import { useFocusRing } from 'react-aria';

// Import CSS
import './Stepper-hybrid.css';

export interface StepperProps {
  /** The size variant of the stepper */
  size?: 's' | 'm' | 'l' | 'xl';
  
  /** Current value of the stepper */
  value?: number;
  
  /** Default value if uncontrolled */
  defaultValue?: number;
  
  /** Minimum allowed value */
  min?: number;
  
  /** Maximum allowed value */
  max?: number;
  
  /** Step increment/decrement amount */
  step?: number;
  
  /** Whether the stepper is disabled */
  isDisabled?: boolean;
  
  /** Whether the stepper is read-only */
  isReadOnly?: boolean;
  
  /** Whether the stepper is invalid/has an error */
  isInvalid?: boolean;
  
  /** Callback fired when the value changes */
  onChange?: (value: number) => void;
  
  /** Additional CSS class names */
  className?: string;
  
  /** Custom inline styles */
  style?: React.CSSProperties;
  
  /** ARIA label */
  'aria-label'?: string;
  
  /** ARIA labelledby */
  'aria-labelledby'?: string;
  
  /** ARIA describedby */
  'aria-describedby'?: string;
  
  /** Placeholder text for the input */
  placeholder?: string;
}

export const Stepper = forwardRef<HTMLInputElement, StepperProps>(({
  size = 'm',
  value: controlledValue,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  onChange,
  className = '',
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  placeholder,
  ...props
}, ref) => {
  // Generate unique IDs for the component parts
  const stepperId = useId();
  const inputId = `${stepperId}-input`;
  
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState<number>(controlledValue ?? defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  
  // Update internal state when controlled value changes
  useEffect(() => {
    if (isControlled) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue, isControlled]);
  
  // Handle value changes
  const handleValueChange = (newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    
    if (!isControlled) {
      setInternalValue(clampedValue);
    }
    
    onChange?.(clampedValue);
  };
  
  // Handle input field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled || isReadOnly) return;
    
    const inputValue = e.target.value;
    if (inputValue === '') {
      // Allow empty input temporarily
      return;
    }
    
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      handleValueChange(numericValue);
    }
  };
  
  // Handle input blur to ensure valid value
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      handleValueChange(defaultValue);
      return;
    }
    
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) {
      handleValueChange(currentValue);
    }
  };
  
  // Handle increment button click
  const handleIncrement = () => {
    if (isDisabled || isReadOnly) return;
    
    const newValue = currentValue + step;
    if (newValue <= max) {
      handleValueChange(newValue);
    }
  };
  
  // Handle decrement button click
  const handleDecrement = () => {
    if (isDisabled || isReadOnly) return;
    
    const newValue = currentValue - step;
    if (newValue >= min) {
      handleValueChange(newValue);
    }
  };
  
  // Handle keyboard navigation on buttons
  const handleButtonKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
  
  // Use React Aria for focus ring management
  const { focusProps, isFocusVisible } = useFocusRing();
  
  // HYBRID APPROACH: Nuclear div + Official Spectrum classes
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Stepper';
  const sizeClass = `spectrum-Stepper--size${size.toUpperCase()}`;
  
  // Build state classes
  const stateClasses = [
    isDisabled && 'is-disabled',
    isReadOnly && 'is-readOnly', 
    isInvalid && 'is-invalid',
    isFocusVisible && 'is-focus-visible'
  ].filter(Boolean).join(' ');
  
  const stepperClasses = [
    resetClasses,
    baseClasses,
    sizeClass,
    stateClasses,
    className
  ].filter(Boolean).join(' ');
  
  // Build ARIA props
  const ariaProps = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby
  };
  
  console.log('Stepper render:', { 
    size, 
    value: currentValue, 
    min, 
    max, 
    step, 
    isDisabled, 
    isReadOnly, 
    stepperId,
    inputId 
  });
  
  // Check if buttons should be disabled
  const isDecrementDisabled = isDisabled || isReadOnly || currentValue <= min;
  const isIncrementDisabled = isDisabled || isReadOnly || currentValue >= max;
  
  // Use DIV instead of native stepper elements to completely bypass UXP's native styling
  return (
    <div
      className={stepperClasses}
      id={stepperId}
      style={style}
    >
      {/* Text Field Container */}
      <div className={`spectrum-Textfield spectrum-Textfield--size${size.toUpperCase()} spectrum-Stepper-textfield`}>
        <input
          {...focusProps}
          {...ariaProps}
          ref={ref}
          type="number"
          className="spectrum-Textfield-input spectrum-Stepper-input"
          id={inputId}
          value={currentValue}
          min={min}
          max={max}
          step={step}
          disabled={isDisabled}
          readOnly={isReadOnly}
          placeholder={placeholder}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          {...props}
        />
      </div>
      
      {/* Stepper Buttons */}
      <span className="spectrum-Stepper-buttons">
        {/* Increment Button */}
        <button
          type="button"
          className={`spectrum-InfieldButton spectrum-InfieldButton--size${size.toUpperCase()} spectrum-InfieldButton--top spectrum-Stepper-button`}
          tabIndex={-1}
          disabled={isIncrementDisabled}
          onClick={handleIncrement}
          onKeyDown={(e) => handleButtonKeyDown(e, handleIncrement)}
          aria-label="Increment value"
        >
          <div className="spectrum-InfieldButton-fill">
            {/* Chevron Up Icon */}
            <svg
              className="spectrum-Icon spectrum-InfieldButton-icon"
              focusable="false"
              aria-hidden="true"
              role="img"
            >
              <path d="M8 2L14 8H2L8 2Z" fill="currentColor" />
            </svg>
          </div>
        </button>
        
        {/* Decrement Button */}
        <button
          type="button"
          className={`spectrum-InfieldButton spectrum-InfieldButton--size${size.toUpperCase()} spectrum-InfieldButton--bottom spectrum-Stepper-button`}
          tabIndex={-1}
          disabled={isDecrementDisabled}
          onClick={handleDecrement}
          onKeyDown={(e) => handleButtonKeyDown(e, handleDecrement)}
          aria-label="Decrement value"
        >
          <div className="spectrum-InfieldButton-fill">
            {/* Chevron Down Icon */}
            <svg
              className="spectrum-Icon spectrum-InfieldButton-icon"
              focusable="false"
              aria-hidden="true"
              role="img"
            >
              <path d="M2 8L8 14L14 8H2Z" fill="currentColor" />
            </svg>
          </div>
        </button>
      </span>
    </div>
  );
});

Stepper.displayName = 'Stepper';