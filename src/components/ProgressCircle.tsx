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

  // Calculate transforms for circular progress
  // The circular progress uses two masks to create a full 360° effect
  // First mask handles 0-50% (0-180°), second mask handles 50-100% (180-360°)
  const getProgressTransforms = (progress: number) => {
    if (showIndeterminate) {
      return { mask1: {}, mask2: {} };
    }

    const percentage = Math.max(0, Math.min(100, progress));
    
    // First half: 0% to 50% (0° to 180°)
    const firstHalfProgress = Math.min(50, percentage);
    const firstHalfDegrees = (firstHalfProgress / 50) * 180;
    
    // Second half: 50% to 100% (180° to 360°)
    const secondHalfProgress = Math.max(0, percentage - 50);
    const secondHalfDegrees = (secondHalfProgress / 50) * 180;
    
    return {
      mask1: {
        transform: firstHalfProgress > 0 ? `rotate(${firstHalfDegrees}deg)` : 'rotate(0deg)'
      },
      mask2: {
        transform: secondHalfProgress > 0 ? `rotate(${secondHalfDegrees}deg)` : 'rotate(0deg)',
        opacity: secondHalfProgress > 0 ? 1 : 0
      }
    };
  };

  const transforms = getProgressTransforms(progressValue);
  
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
              style={transforms.mask1}
            ></div>
          </div>
        </div>
        <div 
          className="spectrum-ProgressCircle-fillMask2"
          style={transforms.mask2}
        >
          <div className="spectrum-ProgressCircle-fillSubMask2">
            <div 
              className="spectrum-ProgressCircle-fill"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;