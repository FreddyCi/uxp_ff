import React, { useState, useRef, useEffect } from "react";
import { ActionButton } from "./ActionButton";
import "./ActionMenu-hybrid.css";

// ActionMenu Size type
export type ActionMenuSize = "xs" | "s" | "m" | "l" | "xl";

// ActionMenu Props
export interface ActionMenuProps {
  /** ActionButton components to display in the menu */
  children: React.ReactNode;
  /** Label for the trigger button */
  label?: string;
  /** Alternative prop name for label */
  triggerLabel?: string;
  /** Icon for the trigger button */
  icon?: string;
  /** Alternative prop name for icon */
  iconName?: string;
  /** Whether to hide the label */
  hideLabel?: boolean;
  /** Size of the ActionMenu and contained ActionButtons */
  size?: ActionMenuSize;
  /** Whether the menu is open (controlled) */
  isOpen?: boolean;
  /** Whether the trigger is disabled */
  isDisabled?: boolean;
  /** Whether the trigger is quiet */
  isQuiet?: boolean;
  /** Whether the trigger is emphasized */
  isEmphasized?: boolean;
  /** Static color variant */
  staticColor?: "white" | "black";
  /** Popover alignment */
  align?: "start" | "end";
  /** Popover direction */
  direction?: "bottom" | "top" | "left" | "right";
  /** Aria label for accessibility */
  "aria-label"?: string;
  /** Called when menu open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Additional CSS class */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  children,
  label,
  triggerLabel,
  icon,
  iconName,
  hideLabel = false,
  size = "m",
  isOpen: controlledOpen,
  isDisabled = false,
  isQuiet = false,
  isEmphasized = false,
  staticColor,
  align = "start",
  direction = "bottom",
  onOpenChange,
  "aria-label": ariaLabel,
  className = "",
  style = {},
}) => {
  // Use alternative prop names if provided
  const displayLabel = triggerLabel || label || "More actions";
  const displayIcon = iconName || icon || "More";
  
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : isInternalOpen;
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const popoverId = `actionmenu-${Math.random().toString(36).substr(2, 9)}`;
  const triggerId = `actionmenu-trigger-${Math.random().toString(36).substr(2, 9)}`;

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleOpenChange(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setIsInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const handleTriggerClick = () => {
    if (!isDisabled) {
      handleOpenChange(!isOpen);
    }
  };

  // Clone children and add menu item styling and click handlers
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as any;
      return React.cloneElement(child, {
        ...childProps,
        className: `${childProps.className || ""} spectrum-ActionMenu-item`.trim(),
        size: childProps.size || size, // Inherit size from ActionMenu if not set
        onPress: (e: any) => {
          // Call original onPress if it exists
          childProps.onPress?.(e);
          // Close menu after action
          handleOpenChange(false);
        },
        // Ensure ActionButtons in menu are properly styled
        role: "menuitem",
      });
    }
    return child;
  });

  // Generate CSS classes for popover
  const popoverClasses = [
    "uxp-reset--complete",
    "spectrum-Popover",
    "spectrum-ActionMenu-popover",
    `spectrum-Popover--size${size.toUpperCase()}`,
    `spectrum-Popover--${direction}`,
    isOpen && "is-open",
  ]
    .filter(Boolean)
    .join(" ");

  // Generate CSS classes for menu container
  const menuClasses = [
    "uxp-reset--complete",
    "spectrum-ActionMenu-menu",
    `spectrum-ActionMenu--size${size.toUpperCase()}`,
    isOpen && "is-open",
  ]
    .filter(Boolean)
    .join(" ");

  // Positioning styles for popover
  const popoverPositionStyles: React.CSSProperties = {
    ...(direction === "bottom" && {
      insetBlockStart: "100%",
      insetInlineStart: align === "start" ? "0" : "auto",
      insetInlineEnd: align === "end" ? "0" : "auto",
    }),
    ...(direction === "top" && {
      insetBlockEnd: "100%",
      insetInlineStart: align === "start" ? "0" : "auto",
      insetInlineEnd: align === "end" ? "0" : "auto",
    }),
  };

  return (
    <div
      className={`uxp-reset--complete spectrum-ActionMenu ${className}`}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {/* ActionButton Trigger with Hold Icon */}
      <div ref={buttonRef} id={triggerId}>
        <ActionButton
          size={size}
          isQuiet={isQuiet}
          isEmphasized={isEmphasized}
          staticColor={staticColor}
          isSelected={isOpen}
          isDisabled={isDisabled}
          iconName={displayIcon}
          hasHold={true}
          hideLabel={hideLabel}
          aria-haspopup="menu"
          aria-controls={popoverId}
          aria-expanded={isOpen}
          aria-label={ariaLabel || displayLabel}
          onPress={handleTriggerClick}
        >
          {hideLabel ? "" : displayLabel}
        </ActionButton>
      </div>

      {/* Popover Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="presentation"
          className={popoverClasses}
          id={popoverId}
          style={popoverPositionStyles}
        >
          <div
            className={menuClasses}
            role="menu"
            aria-labelledby={triggerId}
          >
            {enhancedChildren}
          </div>
        </div>
      )}
    </div>
  );
};