'use client';
import { ReactNode, useRef, useId, createContext, useContext, useState, useEffect } from 'react';
import { useFocusRing } from 'react-aria';
import './Radio-hybrid.css';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  size?: 's' | 'm' | 'l' | 'xl';
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  children: ReactNode;
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 's' | 'm' | 'l' | 'xl';
  isDisabled?: boolean;
  isEmphasized?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export interface RadioProps {
  children?: ReactNode;
  value: string;
  size?: 's' | 'm' | 'l' | 'xl';
  isDisabled?: boolean;
  isEmphasized?: boolean;
  className?: string;
  id?: string;
}

export function RadioGroup({
  children,
  name,
  value,
  defaultValue,
  onChange,
  size = 'm',
  isDisabled = false,
  isEmphasized = false,
  className = '',
  orientation = 'vertical',
  label,
}: RadioGroupProps) {
  
  // State management for the radio group - match Select component pattern
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value || defaultValue);
  
  // Update selectedValue when controlled value changes (like Select component)
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // Handle value changes
  const handleChange = (newValue: string) => {
    if (!isDisabled) {
      setSelectedValue(newValue);
      onChange?.(newValue);
    }
  };
  
  // Build Spectrum CSS classes
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-RadioGroup';
  const orientationClass = orientation === 'horizontal' ? 'spectrum-RadioGroup--horizontal' : '';
  
  const groupClasses = [
    resetClasses,
    baseClasses,
    orientationClass,
    className
  ].filter(Boolean).join(' ');

  const contextValue: RadioGroupContextValue = {
    name,
    value: selectedValue,
    onChange: handleChange,
    isDisabled,
    size
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={groupClasses} role="radiogroup">
        {label && (
          <span className="spectrum-RadioGroup-label">
            {label}
          </span>
        )}
        <div className="spectrum-RadioGroup-radios">
          {children}
        </div>
      </div>
    </RadioGroupContext.Provider>
  );
}

export function Radio({
  children,
  value,
  size,
  isDisabled,
  isEmphasized = false,
  className = '',
  id,
}: RadioProps) {
  const ref = useRef<HTMLInputElement>(null);
  const inputId = id || useId();
  const context = useContext(RadioGroupContext);
  
  // Use React Aria for focus management
  const { focusProps, isFocusVisible } = useFocusRing();

  // Get values from context or props
  const groupName = context?.name || 'radio-group';
  const groupValue = context?.value;
  const groupOnChange = context?.onChange;
  const groupIsDisabled = context?.isDisabled || isDisabled;
  const radioSize = size || context?.size || 'm';
  
  const isChecked = groupValue === value;

  // Handle change events
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!groupIsDisabled && groupOnChange && event.target.checked) {
      groupOnChange(value);
    }
  };

  // Build Spectrum CSS classes following the nuclear div approach
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Radio';
  const sizeClass = `spectrum-Radio--size${radioSize.toUpperCase()}`;
  
  // Build state classes
  const stateClasses = [
    isEmphasized && 'spectrum-Radio--emphasized',
    isChecked && 'is-checked',
    groupIsDisabled && 'is-disabled',
    isFocusVisible && 'is-focus-visible'
  ].filter(Boolean).join(' ');

  const radioClasses = [
    resetClasses,
    baseClasses,
    sizeClass,
    stateClasses,
    className
  ].filter(Boolean).join(' ');

  // Determine button size based on radio size
  const getButtonSize = () => {
    switch (radioSize) {
      case 's': return 'S';
      case 'm': return 'S'; // Medium radio uses small button per Spectrum
      case 'l': return 'M';
      case 'xl': return 'L';
      default: return 'S';
    }
  };

  const buttonSize = getButtonSize();

  return (
    <label className={radioClasses} htmlFor={inputId}>
      <input
        {...focusProps}
        ref={ref}
        type="radio"
        className="spectrum-Radio-input"
        id={inputId}
        name={groupName}
        value={value}
        checked={isChecked}
        disabled={groupIsDisabled}
        onChange={handleChange}
      />
      
      <span className={`spectrum-Radio-button spectrum-Radio-button--size${buttonSize}`}></span>
      
      {children && (
        <span className={`spectrum-Radio-label spectrum-Radio-label--size${buttonSize}`}>
          {children}
        </span>
      )}
    </label>
  );
}

export default Radio;