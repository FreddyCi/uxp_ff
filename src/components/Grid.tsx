import React, { forwardRef } from "react";
import "./Grid-hybrid.css";

type GridVariant = "frame" | "compact" | "fixed" | "fluid" | "nested" | "debug";
type CSSPropertiesWithVars = React.CSSProperties & Record<string, string | number>;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns for fixed grids (defaults to Spectrum 12-column grid). */
  columns?: number;
  /** Gap applied between columns and rows (CSS length). */
  gap?: string;
  /** Row gap overrides column gap when provided. */
  rowGap?: string;
  /** Column gap overrides the default gap when provided. */
  columnGap?: string;
  /** Optional min column width for fluid grids (auto-fit/minmax pattern). */
  minColumnWidth?: string;
  /** Optional max column width for fluid grids. */
  maxColumnWidth?: string;
  /** Custom grid-auto-rows value for vertical sizing. */
  autoRows?: string;
  /** Spectrum grid variants (frame, compact, fixed, fluid, nested, debug). */
  variant?: GridVariant | GridVariant[];
}

function resolveVariants(variant?: GridVariant | GridVariant[]) {
  if (!variant) return [];
  return Array.isArray(variant) ? variant : [variant];
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  {
    columns,
    gap,
    rowGap,
    columnGap,
    minColumnWidth,
    maxColumnWidth,
    autoRows,
    variant,
    role = "grid",
    style,
    className,
    children,
    ...props
  },
  ref
) {
  const variants = resolveVariants(variant);
  const nextStyle: CSSPropertiesWithVars = { ...(style as CSSPropertiesWithVars) };

  if (columns) {
    nextStyle["--columns"] = String(columns);
  }

  if (gap) {
    nextStyle["--spectrum-grid-gap"] = gap;
  }

  if (rowGap) {
    nextStyle["--spectrum-grid-row-gap"] = rowGap;
  }

  if (columnGap) {
    nextStyle["--spectrum-grid-column-gap"] = columnGap;
  }

  if (autoRows) {
    nextStyle["--spectrum-grid-auto-rows"] = autoRows;
  }

  if (minColumnWidth || maxColumnWidth) {
    const min = minColumnWidth ?? "0px";
    const max = maxColumnWidth ?? "1fr";
    nextStyle["--spectrum-grid-template-columns"] = `repeat(auto-fit, minmax(${min}, ${max}))`;
    nextStyle["--spectrum-grid-fluid-min"] = min;
  }

  const classes = [
    "uxp-reset--complete",
    "spectrum-grid",
    "spectrum-grid",
    ...variants.map((v) => `spectrum-grid--${v}`),
    className
  ].filter(Boolean).join(" ");

  return (
    <div ref={ref} role={role} className={classes} style={nextStyle} {...props}>
      {children}
    </div>
  );
});

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column span - accepts number (auto converted to `span n`) or raw CSS grid-column value. */
  columnSpan?: number | string;
  /** Row span - accepts number (auto converted to `span n`) or raw CSS grid-row value. */
  rowSpan?: number | string;
  /** Shortcut for align-self. */
  align?: "start" | "center" | "end" | "stretch";
  /** Shortcut for justify-self. */
  justify?: "start" | "center" | "end" | "stretch";
  /** Optional emphasis styling hook (applies data attribute). */
  emphasis?: "strong" | "accent";
  /** Optional outline styling hook (applies data attribute). */
  outline?: "dashed" | "muted";
}

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(function GridItem(
  { columnSpan, rowSpan, align, justify, emphasis, outline, role = "gridcell", style, className, children, ...props },
  ref
) {
  const nextStyle: CSSPropertiesWithVars = { ...(style as CSSPropertiesWithVars) };

  if (columnSpan) {
    nextStyle["--spectrum-grid-item-column"] = typeof columnSpan === "number" ? `span ${columnSpan}` : columnSpan;
  }

  if (rowSpan) {
    nextStyle["--spectrum-grid-item-row"] = typeof rowSpan === "number" ? `span ${rowSpan}` : rowSpan;
  }

  if (align) {
    nextStyle["--spectrum-grid-item-align"] = align;
  }

  if (justify) {
    nextStyle["--spectrum-grid-item-justify"] = justify;
  }

  const classes = [
    "uxp-reset--complete",
    "spectrum-grid-item",
    "spectrum-grid-item",
    className
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      role={role}
      className={classes}
      style={nextStyle}
      data-emphasis={emphasis}
      data-outline={outline}
      {...props}
    >
      {children}
    </div>
  );
});
