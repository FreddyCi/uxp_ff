import React from "react";
import { useRef } from "react";
import "./ActionGroup-hybrid.css";

interface ActionGroupProps {
  children: React.ReactNode;
  size?: "xs" | "s" | "m" | "l" | "xl";
  isQuiet?: boolean;
  isJustified?: boolean;
  isCompact?: boolean;
  orientation?: "horizontal" | "vertical";
  onSelectionChange?: (keys: Set<string>) => void;
  selectionMode?: "none" | "single" | "multiple";
  className?: string;
  style?: React.CSSProperties;
  role?: string;
}

export const ActionGroup: React.FC<ActionGroupProps> = ({
  children,
  size = "m",
  isQuiet = false,
  isJustified = false,
  isCompact = false,
  orientation = "horizontal",
  onSelectionChange,
  selectionMode = "none",
  className = "",
  style,
  role = "group",
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Build CSS classes using our proven ultra-high specificity pattern
  const sizeClass = `spectrum-ActionGroup--size${size.toUpperCase()}`;
  const quietClass = isQuiet ? "spectrum-ActionGroup--quiet" : "";
  const justifiedClass = isJustified ? "spectrum-ActionGroup--justified" : "";
  const compactClass = isCompact ? "spectrum-ActionGroup--compact" : "";
  const verticalClass = orientation === "vertical" ? "spectrum-ActionGroup--vertical" : "";
  
  const nuclearDivClasses = [
    "uxp-reset--complete",
    "spectrum-ActionGroup",
    "spectrum-ActionGroup", // Double class for ultra-high specificity
    sizeClass,
    quietClass,
    justifiedClass,
    compactClass,
    verticalClass,
    className
  ].filter(Boolean).join(" ");

  // Clone children and add spectrum-ActionGroup-item class
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as any;
      return React.cloneElement(child, {
        ...childProps,
        className: `${childProps.className || ""} spectrum-ActionGroup-item`.trim(),
        size: childProps.size || size, // Inherit size from ActionGroup if not set
      });
    }
    return child;
  });

  return (
    <div
      ref={ref}
      role={role}
      className={nuclearDivClasses}
      style={style}
      {...props}
    >
      {enhancedChildren}
    </div>
  );
};