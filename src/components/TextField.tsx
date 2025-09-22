'use client';
import { useRef, ReactNode, useState } from 'react';
import './TextField-hybrid.css';

// Hybrid TextField - Nuclear div approach with official Spectrum CSS classes
// EXACTLY the same pattern as our successful Button and Tabs components

type SpectrumSize = 's' | 'm' | 'l';
type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

interface TextFieldProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  multiline?: boolean;
  size?: SpectrumSize;
  type?: InputType;
  rows?: number;
  maxLength?: number;
  pattern?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function TextField({
  label,
  value,
  defaultValue,
  placeholder,
  description,
  errorMessage,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
  isReadOnly = false,
  multiline = false,
  size = 'm',
  type = 'text',
  rows = 3,
  maxLength,
  pattern,
  name,
  id,
  autoComplete,
  autoFocus,
  onChange,
  onBlur,
  onFocus,
  className = '',
  style,
  ...props
}: TextFieldProps) {
  const [inputValue, setInputValue] = useState(value || defaultValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Build official Spectrum classes with hybrid approach - same as Button/Tabs
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Textfield spectrum-Textfield'; // Double class for ultra-high specificity
  const sizeClass = `spectrum-Textfield--size${size.toUpperCase()}`;
  const multilineClass = multiline ? 'spectrum-Textfield--multiline' : '';
  
  const textfieldClasses = [
    resetClasses,
    baseClasses,
    sizeClass,
    multilineClass,
    className
  ].filter(Boolean).join(' ');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const inputProps = {
    ref: inputRef as any,
    value: value !== undefined ? value : inputValue,
    placeholder,
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
    maxLength,
    pattern,
    name,
    id,
    autoComplete,
    autoFocus,
    onChange: handleInputChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  return (
    <div className="spectrum-Field" style={style}>
      {/* Label with official Spectrum classes */}
      {label && (
        <label className="spectrum-FieldLabel spectrum-FieldLabel--sizeM">
          {label}
          {isRequired && <span className="spectrum-FieldLabel-requiredIcon">*</span>}
        </label>
      )}
      
      {/* Nuclear div approach - EXACTLY like Button and Tabs */}
      <div
        role="textbox"
        className={textfieldClasses}
        aria-disabled={isDisabled}
        aria-invalid={isInvalid || !!errorMessage}
        aria-readonly={isReadOnly}
        aria-required={isRequired}
      >
        {multiline ? (
          <textarea
            {...inputProps}
            rows={rows}
          />
        ) : (
          <input
            {...inputProps}
            type={type}
          />
        )}
      </div>
      
      {/* Description text */}
      {description && (
        <div className="spectrum-HelpText spectrum-HelpText--sizeM">
          {description}
        </div>
      )}
      
      {/* Error message */}
      {errorMessage && (
        <div className="spectrum-HelpText spectrum-HelpText--sizeM spectrum-HelpText--negative">
          {errorMessage}
        </div>
      )}
    </div>
  );
}