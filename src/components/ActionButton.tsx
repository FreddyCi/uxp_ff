import React from "react";
import { useRef } from "react";
import "./ActionButton-hybrid.css";

interface ActionButtonProps {
  children?: React.ReactNode;
  size?: "xs" | "s" | "m" | "l" | "xl";
  isSelected?: boolean;
  isEmphasized?: boolean;
  isQuiet?: boolean;
  isDisabled?: boolean;
  hideLabel?: boolean;
  hasHold?: boolean;
  iconName?: string;
  label?: string;
  staticColor?: "white" | "black";
  onPress?: (e?: any) => void;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  size = "m",
  isSelected = false,
  isEmphasized = false,
  isQuiet = false,
  isDisabled = false,
  hideLabel = false,
  hasHold = false,
  iconName,
  label,
  staticColor,
  onPress,
  className = "",
  style,
  "aria-label": ariaLabel,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Build CSS classes using our proven ultra-high specificity pattern
  const sizeClass = size !== "m" ? `spectrum-ActionButton--size${size.toUpperCase()}` : "";
  const emphasizedClass = isEmphasized ? "spectrum-ActionButton--emphasized" : "";
  const quietClass = isQuiet ? "spectrum-ActionButton--quiet" : "";
  const selectedClass = isSelected ? "is-selected" : "";
  const disabledClass = isDisabled ? "is-disabled" : "";
  const staticColorClass = staticColor ? `spectrum-ActionButton--static${staticColor.charAt(0).toUpperCase() + staticColor.slice(1)}` : "";
  
  const nuclearDivClasses = [
    "uxp-reset--complete",
    "spectrum-ActionButton",
    "spectrum-ActionButton", // Double class for ultra-high specificity
    sizeClass,
    emphasizedClass,
    quietClass,
    selectedClass,
    disabledClass,
    staticColorClass,
    className
  ].filter(Boolean).join(" ");

  // Handle click
  const handleClick = () => {
    if (!isDisabled && onPress) {
      onPress();
    }
  };

  // Determine what content to show
  const showIcon = iconName || children;
  const showLabel = label && !hideLabel;
  const isIconOnly = showIcon && !showLabel;

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      className={nuclearDivClasses}
      onClick={handleClick}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      aria-label={ariaLabel || (isIconOnly ? label : undefined)}
      style={style}
      {...props}
    >
      {/* Hold icon - must come first per Spectrum docs */}
      {hasHold && (
        <div className="spectrum-ActionButton-hold">
          <svg className="spectrum-Icon" width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
            <path d="M1 1h6l-3 6z"/>
          </svg>
        </div>
      )}
      
      {/* Icon */}
      {showIcon && (
        <div className="spectrum-ActionButton-icon">
          {typeof children === "string" ? (
            // Simple text icon fallback
            <span>{children}</span>
          ) : children ? (
            children
          ) : iconName ? (
            // SVG icon placeholder - in real app would use icon system
            <svg className="spectrum-Icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
          ) : null}
        </div>
      )}
      
      {/* Label */}
      {showLabel && (
        <span className="spectrum-ActionButton-label">
          {label}
        </span>
      )}
    </div>
  );
};