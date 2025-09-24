import React from "react";
import { useRef } from "react";
import { CloseButton } from "./CloseButton";
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
          <CloseButton
            aria-label="Clear selection"
            className="spectrum-ActionBar-closeButton"
            onPress={onClearSelection}
            size="small"
          />
        )}
      </div>
    </div>
  );
};