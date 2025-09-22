'use client';
import { ButtonProps } from 'react-aria-components';
import { useButton, useHover } from 'react-aria';
import { useRef, ReactNode } from 'react';
import './Button.css';

interface CustomButtonProps extends Omit<ButtonProps, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'negative';
  className?: string;
}

export function Button({ 
  onPress, 
  children, 
  variant = 'primary', 
  className = '',
  isDisabled,
  ...props 
}: CustomButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Use React Aria's useButton hook for proper behavior
  const { buttonProps, isPressed } = useButton({
    onPress: (e) => {
      console.log('Button pressed!', { variant, isDisabled });
      onPress?.(e);
    },
    isDisabled,
    ...props
  }, ref);

  // Use React Aria's useHover hook for better hover handling
  const { hoverProps, isHovered } = useHover({ 
    isDisabled,
    onHoverStart: () => console.log('Button hover start'),
    onHoverEnd: () => console.log('Button hover end')
  });

  // Clean class composition - reset + component + variant
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'uxp-button';
  const variantClasses = variant !== 'primary' ? `uxp-button--${variant}` : '';
  const combinedClasses = `${resetClasses} ${baseClasses} ${variantClasses} ${className}`.trim();

  // Data-driven state management (priority: disabled > pressed > hovered > rest)
  const getDataState = () => {
    if (isDisabled) return 'disabled';
    if (isPressed) return 'pressed';
    if (isHovered) return 'hover';
    return 'rest';
  };

  const dataState = getDataState();
  console.log('Button render:', { variant, dataState, isDisabled, isPressed, isHovered });

  // Use DIV instead of BUTTON to completely bypass UXP's native styling
  return (
    <div
      {...buttonProps}
      {...hoverProps}
      ref={ref}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      className={combinedClasses}
      data-state={dataState}
      data-disabled={isDisabled || undefined}
      aria-disabled={isDisabled}
      onClick={(e) => {
        console.log('Button onClick fired!', e);
        buttonProps.onClick?.(e);
      }}
    >
      {children}
    </div>
  );
}