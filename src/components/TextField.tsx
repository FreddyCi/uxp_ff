'use client';
import { useRef, ReactNode } from 'react';
import { useTextField } from 'react-aria';
import './TextField-hybrid.css';

interface TextFieldProps {
  label?: ReactNode;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: ReactNode;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  size?: 's' | 'm' | 'l';
  isQuiet?: boolean;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
}

export function TextField({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  isDisabled = false,
  isRequired = false,
  isInvalid = false,
  errorMessage,
  type = 'text',
  size = 'm',
  isQuiet = false,
  className = '',
  style,
  name,
  ...props
}: TextFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  
  const { labelProps, inputProps, errorMessageProps } = useTextField({
    label: typeof label === 'string' ? label : undefined,
    placeholder,
    value,
    defaultValue,
    onChange,
    isDisabled,
    isRequired,
    isInvalid,
    type,
    name,
    ...props
  }, ref);

  // HYBRID APPROACH: Nuclear div + Official Spectrum classes - EXACTLY like Button/Tabs
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Textfield';
  const sizeClass = `spectrum-Textfield--size${size.toUpperCase()}`;
  const quietClass = isQuiet ? 'spectrum-Textfield--quiet' : '';
  
  const spectrumClasses = `${baseClasses} ${sizeClass} ${quietClass}`;
  const combinedClasses = `${resetClasses} ${spectrumClasses} ${className}`.trim();

  return (
    <div className="textfield-container" style={style}>
      {label && (
        <label 
          {...labelProps}
          className="spectrum-FieldLabel spectrum-FieldLabel--sizeM"
        >
          {label}
          {isRequired && <span className="spectrum-FieldLabel-requiredIcon">*</span>}
        </label>
      )}
      
      <div
        role="textbox"
        className={combinedClasses}
        aria-disabled={isDisabled}
        aria-invalid={isInvalid}
      >
        <input
          {...inputProps}
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={isDisabled}
          required={isRequired}
          name={name}
        />
      </div>
      
      {isInvalid && errorMessage && (
        <div 
          {...errorMessageProps}
          className="spectrum-HelpText spectrum-HelpText--sizeM spectrum-HelpText--negative"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}
