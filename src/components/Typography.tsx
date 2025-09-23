'use client';
import { ReactNode, ElementType, HTMLAttributes } from 'react';
import './Typography-hybrid.css';

// =============================================================================
// Typography Container Component
// =============================================================================

export interface TypographyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  lang?: string;
}

export function Typography({
  children,
  className = '',
  lang = 'en-US',
  ...props
}: TypographyProps) {
  return (
    <div
      className={`uxp-reset--complete spectrum-Typography ${className}`.trim()}
      lang={lang}
      {...props}
    >
      {children}
    </div>
  );
}

// =============================================================================
// Heading Component
// =============================================================================

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  as?: ElementType;
}

export function Heading({
  children,
  size = 'm',
  level = 2,
  className = '',
  as,
  ...props
}: HeadingProps) {
  // Map level to semantic HTML element
  const Component = as || (`h${level}` as ElementType);
  
  // Map size to Spectrum size class
  const sizeClass = size ? `spectrum-Heading--size${size.toUpperCase()}` : '';
  
  return (
    <Component
      className={`uxp-reset--complete spectrum-Heading ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

// =============================================================================
// Body Text Component
// =============================================================================

export interface BodyProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  emphasized?: boolean;
  strong?: boolean;
  serif?: boolean;
  className?: string;
  as?: ElementType;
}

export function Body({
  children,
  size = 'm',
  emphasized = false,
  strong = false,
  serif = false,
  className = '',
  as = 'p',
  ...props
}: BodyProps) {
  const Component = as;
  
  // Build class names
  const sizeClass = size ? `spectrum-Body--size${size.toUpperCase()}` : '';
  const serifClass = serif ? 'spectrum-Body--serif' : '';
  const emphasizedClass = emphasized ? 'spectrum-Body-emphasized' : '';
  const strongClass = strong ? 'spectrum-Body-strong' : '';
  
  return (
    <Component
      className={`uxp-reset--complete spectrum-Body ${sizeClass} ${serifClass} ${emphasizedClass} ${strongClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

// =============================================================================
// Emphasized Text Component (for inline emphasized text)
// =============================================================================

export interface EmphasizedProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  strong?: boolean;
  className?: string;
  as?: ElementType;
}

export function Emphasized({
  children,
  strong = false,
  className = '',
  as = 'em',
  ...props
}: EmphasizedProps) {
  const Component = as;
  
  const strongClass = strong ? 'spectrum-Body-strong' : '';
  
  return (
    <Component
      className={`uxp-reset--complete spectrum-Body-emphasized ${strongClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

// =============================================================================
// Code Component
// =============================================================================

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  inline?: boolean;
  className?: string;
}

export function Code({
  children,
  size = 'm',
  inline = true,
  className = '',
  ...props
}: CodeProps) {
  const Component = inline ? 'code' : 'pre';
  
  // Map size to Spectrum size class
  const sizeClass = size ? `spectrum-Code--size${size.toUpperCase()}` : '';
  
  return (
    <Component
      className={`uxp-reset--complete spectrum-Code ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {inline ? children : <code>{children}</code>}
    </Component>
  );
}

// =============================================================================
// Detail Component (small/secondary text)
// =============================================================================

export interface DetailProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  className?: string;
  as?: ElementType;
}

export function Detail({
  children,
  size = 'm',
  className = '',
  as = 'span',
  ...props
}: DetailProps) {
  const Component = as;
  
  // Map size to Spectrum size class
  const sizeClass = size ? `spectrum-Detail--size${size.toUpperCase()}` : '';
  
  return (
    <Component
      className={`uxp-reset--complete spectrum-Detail ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

// =============================================================================
// Strong Component (for inline bold text)
// =============================================================================

export interface StrongProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  emphasized?: boolean;
  className?: string;
  as?: ElementType;
}

export function Strong({
  children,
  emphasized = false,
  className = '',
  as = 'strong',
  ...props
}: StrongProps) {
  const Component = as;
  
  const emphasizedClass = emphasized ? 'spectrum-Body-emphasized' : '';
  
  return (
    <Component
      className={`uxp-reset--complete spectrum-Body-strong ${emphasizedClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

// =============================================================================
// Exports
// =============================================================================

export default {
  Typography,
  Heading,
  Body,
  Emphasized,
  Code,
  Detail,
  Strong,
};