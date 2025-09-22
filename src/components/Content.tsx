'use client';
import React from 'react';

export interface TextProps {
  slot?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Text({ slot, children, className, style }: TextProps) {
  return (
    <div slot={slot} className={className} style={style}>
      {children}
    </div>
  );
}