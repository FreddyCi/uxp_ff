'use client';
import {
  Button,
  Group,
  Input,
  NumberField as AriaNumberField,
  NumberFieldProps as AriaNumberFieldProps,
  ValidationResult
} from 'react-aria-components';
import { Label, FieldError } from './Form';

export interface NumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function NumberField(
  { label, description, errorMessage, ...props }: NumberFieldProps
) {
  return (
    <AriaNumberField 
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
      <Group
        style={{
          display: 'flex',
          border: '1px solid #6b7280',
          borderRadius: '6px',
          backgroundColor: '#374151',
          overflow: 'hidden'
        }}
      >
        <Input 
          style={{
            // AGGRESSIVE UXP OVERRIDE - NUCLEAR STYLING
            WebkitAppearance: 'none',
            appearance: 'none',
            background: 'transparent',
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            border: 'none',
            borderRadius: '0',
            padding: '8px 12px',
            fontSize: '14px',
            color: '#e5e7eb',
            fontFamily: 'system-ui, sans-serif',
            outline: 'none',
            boxShadow: 'none',
            textShadow: 'none',
            filter: 'none',
            margin: '0',
            flex: '1',
            minWidth: '60px', // Changed from 'auto' - UXP doesn't support auto
            minHeight: '32px', // Changed from 'auto' - UXP doesn't support auto
            height: '32px', // Explicit height instead of auto
            boxSizing: 'border-box'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #6b7280' }}>
          <Button
            slot="increment"
            style={{
              // AGGRESSIVE UXP OVERRIDE - NUCLEAR STYLING
              WebkitAppearance: 'none',
              appearance: 'none',
              background: '#4b5563',
              backgroundColor: '#4b5563',
              backgroundImage: 'none',
              border: 'none',
              borderBottom: '1px solid #6b7280',
              borderRadius: '0',
              padding: '4px 8px',
              fontSize: '12px',
              color: '#e5e7eb',
              fontFamily: 'system-ui, sans-serif',
              outline: 'none',
              boxShadow: 'none',
              textShadow: 'none',
              filter: 'none',
              margin: '0',
              cursor: 'pointer',
              minWidth: '24px', // Changed from 'auto' - UXP doesn't support auto
              minHeight: '16px', // Changed from 'auto' - UXP doesn't support auto
              height: '16px' // Explicit height instead of auto
            }}
          >
            ▲
          </Button>
          <Button
            slot="decrement"
            style={{
              // AGGRESSIVE UXP OVERRIDE - NUCLEAR STYLING
              WebkitAppearance: 'none',
              appearance: 'none',
              background: '#4b5563',
              backgroundColor: '#4b5563',
              backgroundImage: 'none',
              border: 'none',
              borderRadius: '0',
              padding: '4px 8px',
              fontSize: '12px',
              color: '#e5e7eb',
              fontFamily: 'system-ui, sans-serif',
              outline: 'none',
              boxShadow: 'none',
              textShadow: 'none',
              filter: 'none',
              margin: '0',
              cursor: 'pointer',
              minWidth: '24px', // Changed from 'auto' - UXP doesn't support auto
              minHeight: '16px', // Changed from 'auto' - UXP doesn't support auto
              height: '16px' // Explicit height instead of auto
            }}
          >
            ▼
          </Button>
        </div>
      </Group>
      {description && (
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
          {description}
        </div>
      )}
      <FieldError>{errorMessage}</FieldError>
    </AriaNumberField>
  );
}