'use client';
import {
  Radio,
  RadioGroup as AriaRadioGroup,
  RadioGroupProps as AriaRadioGroupProps,
  RadioProps,
  ValidationResult
} from 'react-aria-components';
import { Label, FieldError } from './Form';

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'children'> {
  label?: string;
  children?: React.ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function RadioGroup(
  { label, description, errorMessage, children, ...props }: RadioGroupProps
) {
  return (
    <AriaRadioGroup 
      {...props}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        color: '#e5e7eb',
        ...props.style
      }}
    >
      {label && <Label>{label}</Label>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {children}
      </div>
      {description && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          {description}
        </div>
      )}
      <FieldError>{errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}

export function RadioOption({ children, ...props }: RadioProps) {
  return (
    <Radio 
      {...props}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#e5e7eb',
        ...props.style
      }}
    >
      {({ isSelected, isFocusVisible }) => (
        <>
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: '2px solid #6b7280',
              backgroundColor: '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: isFocusVisible ? '2px solid #3b82f6' : 'none',
              outlineOffset: '2px',
              transition: 'all 0.2s ease'
            }}
          >
            {isSelected && (
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6'
                }}
              />
            )}
          </div>
          {children}
        </>
      )}
    </Radio>
  );
}