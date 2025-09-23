import React from 'react';
import './ProgressCircle.css';

export interface ProgressCircleProps {
  /** Size of the progress circle */
  size?: 'small' | 'medium' | 'large';
  /** Progress value from 0 to 100 */
  value?: number;
  /** Whether the progress circle is indeterminate (spinning animation) */
  isIndeterminate?: boolean;
  /** Accessible label for the progress circle */
  'aria-label'?: string;
  /** ID for the progress circle */
  id?: string;
  /** Additional CSS classes */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}

/**
 * ProgressCircle component for showing progress in a circular format.
 * Supports both determinate (with value) and indeterminate (spinning) states.
 */
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  size = 'medium',
  value,
  isIndeterminate = false,
  'aria-label': ariaLabel,
  id,
  className = '',
  style,
  ...props
}) => {
  // Calculate if we should show indeterminate state
  const showIndeterminate = isIndeterminate || value === undefined;
  
  // Clamp value between 0 and 100
  const progressValue = value !== undefined ? Math.min(100, Math.max(0, value)) : 0;
  
  // Generate unique ID if not provided
  const progressId = id || `progress-circle-${Math.random().toString(36).substr(2, 9)}`;
  
  // Build CSS classes using nuclear div hybrid approach
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-ProgressCircle';
  const sizeClass = `spectrum-ProgressCircle--${size}`;
  const stateClass = showIndeterminate ? 'spectrum-ProgressCircle--indeterminate' : '';
  
  const classes = [
    resetClasses,
    baseClasses,
    sizeClass,
    stateClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={classes}
      id={progressId}
      role="progressbar"
      aria-label={ariaLabel || 'Progress indicator'}
      aria-valuenow={showIndeterminate ? undefined : progressValue}
      aria-valuemin={showIndeterminate ? undefined : 0}
      aria-valuemax={showIndeterminate ? undefined : 100}
      style={style}
      {...props}
    >
      <div className="spectrum-ProgressCircle-track"></div>
      <div className="spectrum-ProgressCircle-fills">
        <div className="spectrum-ProgressCircle-fillMask1">
          <div className="spectrum-ProgressCircle-fillSubMask1">
            <div 
              className="spectrum-ProgressCircle-fill"
              style={!showIndeterminate ? {
                transform: `rotate(${(progressValue / 100) * 180}deg)`
              } : undefined}
            ></div>
          </div>
        </div>
        <div className="spectrum-ProgressCircle-fillMask2">
          <div className="spectrum-ProgressCircle-fillSubMask2">
            <div 
              className="spectrum-ProgressCircle-fill"
              style={!showIndeterminate ? {
                transform: `rotate(${Math.max(0, (progressValue - 50) / 50) * 180}deg)`
              } : undefined}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;