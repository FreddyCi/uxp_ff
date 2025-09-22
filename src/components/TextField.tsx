'use client';
import {
  Input,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult
} from 'react-aria-components';
import { Label, FieldError } from './Form';
import './TextField.css';

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
}

export function TextField(
  { label, description, errorMessage, onChange, placeholder, ...props }: TextFieldProps
) {
  return (
    <AriaTextField 
      onChange={onChange} 
      {...props}
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px',
        ...props.style
      }}
    >
      {label && <Label style={{
        color: '#e5e7eb',
        marginBottom: '6px',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: 'system-ui, sans-serif'
      }}>{label}</Label>}
      <Input 
        placeholder={placeholder}
        style={{
          // AGGRESSIVE UXP OVERRIDE - NUCLEAR STYLING
          WebkitAppearance: 'none',
          appearance: 'none',
          background: '#374151',
          backgroundColor: '#374151',
          backgroundImage: 'none',
          border: '1px solid #6b7280',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '14px',
          color: '#e5e7eb',
          fontFamily: 'system-ui, sans-serif',
          outline: 'none',
          boxShadow: 'none',
          textShadow: 'none',
          filter: 'none',
          margin: '0',
          width: '100%',
          minWidth: '0px', // Changed from 'auto' - UXP doesn't support auto
          minHeight: '32px', // Changed from 'auto' - UXP doesn't support auto
          height: '32px', // Explicit height instead of auto
          boxSizing: 'border-box'
        }}
      />
      {description && (
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
          {description}
        </div>
      )}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}