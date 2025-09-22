'use client';
import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectProps as AriaSelectProps,
  SelectValue,
  ValidationResult
} from 'react-aria-components';
import { Label, FieldError } from './Form';

export interface SelectProps<T extends object> extends Omit<AriaSelectProps<T>, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  children?: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<T extends object>(
  { label, description, errorMessage, children, items, ...props }: SelectProps<T>
) {
  return (
    <AriaSelect 
      {...props}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        color: '#e5e7eb',
        ...props.style
      }}
    >
      {label && <Label>{label}</Label>}
      <Button
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          border: '1px solid #6b7280',
          borderRadius: '6px',
          backgroundColor: '#374151',
          fontSize: '14px',
          color: '#e5e7eb',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '150px'
        }}
      >
        <SelectValue />
        <span style={{ marginLeft: '8px' }}>▼</span>
      </Button>
      {description && (
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
          {description}
        </div>
      )}
      <FieldError>{errorMessage}</FieldError>
      <Popover
        style={{
          backgroundColor: '#374151',
          border: '1px solid #6b7280',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginTop: '4px',
          maxHeight: '200px',
          overflow: 'auto'
        }}
      >
        <ListBox
          items={items}
          style={{
            outline: 'none',
            padding: '4px'
          }}
        >
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export function SelectItem({ children, ...props }: any) {
  return (
    <ListBoxItem
      {...props}
      style={{
        padding: '8px 12px',
        fontSize: '14px',
        color: '#e5e7eb',
        cursor: 'pointer',
        borderRadius: '4px',
        outline: 'none',
        ...props.style
      }}
    >
      {({ isSelected, isFocused }) => (
        <div
          style={{
            backgroundColor: isFocused ? '#4b5563' : isSelected ? '#3b82f6' : 'transparent',
            padding: '4px',
            borderRadius: '4px'
          }}
        >
          {children}
        </div>
      )}
    </ListBoxItem>
  );
}