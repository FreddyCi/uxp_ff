import React, { useState, useRef, useEffect } from "react";
import { useSelect } from "react-aria";
import "./Select-hybrid.css";

interface SelectOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  size?: "s" | "m" | "l";
  isQuiet?: boolean;
  name?: string;
  id?: string;
  description?: string;
  errorMessage?: string;
  validationState?: "valid" | "invalid";
  className?: string;
  style?: React.CSSProperties;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = "Select an option...",
  options = [],
  value,
  defaultValue,
  onChange,
  onBlur,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
  size = "m",
  isQuiet = false,
  name,
  id,
  description,
  errorMessage,
  validationState,
  className = "",
  style,
  ...props
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value || defaultValue);
  
  // Update selectedValue when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // Handle selection change
  const handleSelectionChange = (newValue: string) => {
    if (!isDisabled) {
      setSelectedValue(newValue);
      setIsOpen(false);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  // Get selected option for display
  const selectedOption = options.find(opt => opt.value === selectedValue);

  // Build CSS classes using proper Spectrum Combobox structure from docs
  const sizeClass = size !== "m" ? `spectrum-Combobox--size${size.toUpperCase()}` : "";
  const quietClass = isQuiet ? "spectrum-Combobox--quiet" : "";
  
  const comboboxClasses = [
    "uxp-reset--complete",
    "spectrum-Combobox",
    sizeClass,
    quietClass,
    isDisabled ? "is-disabled" : "",
    isInvalid || validationState === "invalid" ? "is-invalid" : "",
    isOpen ? "is-focused" : "",
    className
  ].filter(Boolean).join(" ");

  const pickerButtonClasses = [
    "uxp-reset--complete", 
    "spectrum-PickerButton",
    "spectrum-PickerButton", // Double class for ultra-high specificity
    size !== "m" ? `spectrum-PickerButton--size${size.toUpperCase()}` : "",
    quietClass ? "spectrum-PickerButton--quiet" : ""
  ].filter(Boolean).join(" ");

  const labelClasses = [
    "spectrum-FieldLabel",
    `spectrum-FieldLabel--size${size.toUpperCase()}`,
    `spectrum-FieldLabel--size${size.toUpperCase()}` // Double for specificity
  ].filter(Boolean).join(" ");

  const helpTextClasses = [
    "spectrum-HelpText",
    `spectrum-HelpText--size${size.toUpperCase()}`,
    `spectrum-HelpText--size${size.toUpperCase()}`, // Double for specificity
    isInvalid || validationState === "invalid" ? "spectrum-HelpText--negative" : ""
  ].filter(Boolean).join(" ");

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={comboboxClasses} style={style}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
          {isRequired && <span className="spectrum-FieldLabel-requiredIcon"> *</span>}
        </label>
      )}
      
      {/* NUCLEAR DIV APPROACH - Using proper Spectrum Combobox structure */}
      <div
        ref={triggerRef}
        role="combobox"
        className={pickerButtonClasses}
        aria-disabled={isDisabled}
        aria-invalid={isInvalid || validationState === "invalid"}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={isDisabled ? -1 : 0}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          } else if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        onBlur={(e) => {
          // Close dropdown if focus moves outside the component
          setTimeout(() => {
            if (!triggerRef.current?.contains(document.activeElement)) {
              setIsOpen(false);
              if (onBlur) onBlur();
            }
          }, 0);
        }}
      >
        <span className="spectrum-PickerButton-label">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-PickerButton-icon">
          <svg viewBox="0 0 8 8" style={{ width: '8px', height: '8px' }}>
            <path d="M0 2L4 6L8 2" fill="currentColor" />
          </svg>
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="spectrum-Popover spectrum-Popover--bottom spectrum-Combobox-popover"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: '2px'
          }}
        >
          <div className="spectrum-Menu" role="none">
            {options.map((option) => (
              <div
                key={option.value}
                role="option"
                className={`spectrum-Menu-item ${
                  selectedValue === option.value ? 'is-selected' : ''
                } ${option.isDisabled ? 'is-disabled' : ''}`}
                aria-selected={selectedValue === option.value}
                aria-disabled={option.isDisabled}
                onClick={() => {
                  if (!option.isDisabled) {
                    handleSelectionChange(option.value);
                  }
                }}
              >
                <span className="spectrum-Menu-itemLabel">{option.label}</span>
                {selectedValue === option.value && (
                  <span className="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark">
                    <svg viewBox="0 0 8 8" style={{ width: '8px', height: '8px' }}>
                      <path d="M0 4L3 7L8 2" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help text or error message */}
      {(description || errorMessage) && (
        <div
          className={helpTextClasses}
        >
          {isInvalid || validationState === "invalid" ? errorMessage : description}
        </div>
      )}
    </div>
  );
};
