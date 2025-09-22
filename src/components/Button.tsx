'use client';
import { ButtonProps } from 'react-aria-components';
import { useButton, useHover } from 'react-aria';
import { useRef, ReactNode } from 'react';
import './Button-hybrid.css';

interface CustomButtonProps extends Omit<ButtonProps, 'children'> {
  children: ReactNode;
  variant?: 'accent' | 'primary' | 'secondary' | 'negative';
  treatment?: 'fill' | 'outline';
  size?: 'small' | 'medium' | 'large';
  iconOnly?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function Button({ 
  onPress, 
  children, 
  variant = 'accent',
  treatment = 'fill',
  size = 'medium',
  iconOnly = false,
  isLoading = false,
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

  // HYBRID APPROACH: Nuclear div + Official Spectrum classes
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Button';
  const variantClass = `spectrum-Button--${variant}`;
  const treatmentClass = `spectrum-Button--${treatment}`;
  const sizeClass = `spectrum-Button--size${size === 'small' ? 'S' : size === 'large' ? 'L' : 'M'}`;
  
  const spectrumClasses = `${baseClasses} ${variantClass} ${treatmentClass} ${sizeClass}`;
  const combinedClasses = `${resetClasses} ${spectrumClasses} ${className}`.trim();

  console.log('Button render:', { variant, treatment, size, iconOnly, isLoading, isDisabled, isPressed, isHovered });

  // Use DIV instead of BUTTON to completely bypass UXP's native styling
  return (
    <div
      {...buttonProps}
      {...hoverProps}
      ref={ref}
      role="button"
      tabIndex={isDisabled || isLoading ? -1 : 0}
      className={combinedClasses}
      aria-disabled={isDisabled || isLoading}
      onClick={(e) => {
        if (isLoading) return; // Prevent clicks during loading
        console.log('Button onClick fired!', e);
        buttonProps.onClick?.(e);
      }}
    >
      <span className="spectrum-Button-label">{children}</span>
    </div>
  );
}