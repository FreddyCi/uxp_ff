import React from "react";
import { useRef } from "react";
import "./ActionBar-hybrid.css";

interface ActionBarProps {
  children: React.ReactNode;
  isOpen?: boolean;
  isEmphasized?: boolean;
  isSticky?: boolean;
  isFixed?: boolean;
  isFlexible?: boolean;
  selectedCount?: number;
  onClearSelection?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  children,
  isOpen = false,
  isEmphasized = false,
  isSticky = false,
  isFixed = false,
  isFlexible = false,
  selectedCount,
  onClearSelection,
  className = "",
  style,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Build CSS classes using our proven pattern
  const emphasizedClass = isEmphasized ? "spectrum-ActionBar--emphasized" : "";
  const stickyClass = isSticky ? "spectrum-ActionBar--sticky" : "";
  const fixedClass = isFixed ? "spectrum-ActionBar--fixed" : "";
  const flexibleClass = isFlexible ? "spectrum-ActionBar--flexible" : "";
  const openClass = isOpen ? "is-open" : "";
  
  const nuclearDivClasses = [
    "uxp-reset--complete",
    "spectrum-ActionBar",
    "spectrum-ActionBar", // Double class for ultra-high specificity
    emphasizedClass,
    stickyClass,
    fixedClass,
    flexibleClass,
    openClass,
    className
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      role="toolbar"
      className={nuclearDivClasses}
      aria-label="Bulk actions"
      style={style}
      {...props}
    >
      {/* Popover container - ActionBar uses nested popover structure */}
      <div className="spectrum-ActionBar-popover">
        {/* Item counter */}
        {selectedCount !== undefined && (
          <div className="spectrum-FieldLabel">
            {selectedCount} selected
          </div>
        )}
        
        {/* Action group container */}
        <div className="spectrum-ActionGroup">
          {children}
        </div>
        
        {/* Close button */}
        {onClearSelection && (
          <button
            className="spectrum-CloseButton"
            onClick={onClearSelection}
            aria-label="Clear selection"
          >
            <svg className="spectrum-Icon spectrum-CloseButton-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M12.207 10.793a1 1 0 0 1 0 1.414l-.5.5a1 1 0 0 1-1.414 0L8 10.414l-2.293 2.293a1 1 0 0 1-1.414 0l-.5-.5a1 1 0 0 1 0-1.414L6.086 8 3.793 5.707a1 1 0 0 1 0-1.414l.5-.5a1 1 0 0 1 1.414 0L8 6.086l2.293-2.293a1 1 0 0 1 1.414 0l.5.5a1 1 0 0 1 0 1.414L9.914 8l2.293 2.293z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};