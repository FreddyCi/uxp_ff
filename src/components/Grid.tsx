import React, { forwardRef, useEffect, useMemo, useContext } from "react";
import "./Grid-hybrid.css";

type GridVariant = "frame" | "compact" | "fixed" | "fluid" | "nested" | "debug";
type CSSPropertiesWithVars = React.CSSProperties & Record<string, string | number>;

interface GridContextValue {
  columns?: number;
  supportsGrid: boolean;
}

const GridContext = React.createContext<GridContextValue | null>(null);

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
  const isUxpHost = typeof document !== "undefined" && document.body?.dataset?.host === "uxp";
  const supportsGrid = false;
  const columnsCount = columns ?? 12;

  const variants = resolveVariants(variant);
  const nextStyle: CSSPropertiesWithVars = { ...(style as CSSPropertiesWithVars) };

  nextStyle["--columns"] = String(columnsCount);
  nextStyle["--spectrum-grid-item-flex-basis-default"] = `calc(100% / ${columnsCount})`;

  if (gap) {
    nextStyle["--spectrum-grid-gap"] = gap;
    nextStyle.gap = gap;
  }

  if (rowGap) {
    nextStyle["--spectrum-grid-row-gap"] = rowGap;
    nextStyle.rowGap = rowGap;
  }

  if (columnGap) {
    nextStyle["--spectrum-grid-column-gap"] = columnGap;
    nextStyle.columnGap = columnGap;
  }

  if (autoRows) {
    nextStyle["--spectrum-grid-item-min-height"] = autoRows;
  }

  if (minColumnWidth || maxColumnWidth) {
    const min = minColumnWidth ?? "0px";
    const max = maxColumnWidth ?? "1fr";
    nextStyle["--spectrum-grid-fluid-min"] = min;
    nextStyle["--spectrum-grid-fluid-max"] = max;
    nextStyle["--spectrum-grid-item-flex-basis"] = `min(${min}, 100%)`;
  }

  nextStyle.display = "flex";
  nextStyle.flexWrap = "wrap";
  nextStyle.alignContent = "flex-start";
  nextStyle.alignItems = "stretch";

  const classes = [
    "uxp-reset--complete",
    "spectrum-grid",
    ...variants.map((v) => `spectrum-grid--${v}`),
    "spectrum-grid--flex",
    className
  ].filter(Boolean).join(" ");

  useEffect(() => {
    if (!isUxpHost) return;
    console.log("[SpectrumGrid] host=UXP", {
      supportsGrid,
      columns,
      gap,
      rowGap,
      columnGap,
      minColumnWidth,
      maxColumnWidth,
      autoRows
    });
  }, [isUxpHost, supportsGrid, columns, gap, rowGap, columnGap, minColumnWidth, maxColumnWidth, autoRows]);

  const contextValue = useMemo<GridContextValue>(
    () => ({ columns: columnsCount, supportsGrid }),
    [columnsCount, supportsGrid]
  );

  return (
    <GridContext.Provider value={contextValue}>
      <div ref={ref} role={role} className={classes} style={nextStyle} {...props}>
        {children}
      </div>
    </GridContext.Provider>
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
  const context = useContext(GridContext);

  const resolvedColumnSpan = columnSpan ? (typeof columnSpan === "number" ? `span ${columnSpan}` : columnSpan) : undefined;
  const resolvedRowSpan = rowSpan ? (typeof rowSpan === "number" ? `span ${rowSpan}` : rowSpan) : undefined;

  if (columnSpan) {
    nextStyle["--spectrum-grid-item-column"] = resolvedColumnSpan!;
  }

  if (rowSpan) {
    nextStyle["--spectrum-grid-item-row"] = resolvedRowSpan!;
  }

  if (align) {
    nextStyle["--spectrum-grid-item-align"] = align;
    nextStyle.alignSelf = align;
  }

  if (justify) {
    nextStyle["--spectrum-grid-item-justify"] = justify;
    nextStyle.justifySelf = justify;
  }

  if (context && !context.supportsGrid) {
    nextStyle.flexGrow = 1;
    nextStyle.flexShrink = 1;
    nextStyle["--spectrum-grid-item-flex-grow"] = 1;
    nextStyle["--spectrum-grid-item-flex-shrink"] = 1;

    const { columns = 12 } = context;
    const computeBasisFromSpan = (span: number) => {
      if (columns <= 0) {
        return "100%";
      }
      const clamped = Math.min(Math.max(span, 1), columns);
      const percentage = (clamped / columns) * 100;
      return `${percentage}%`;
    };

    if (typeof columnSpan === "number") {
      const basis = computeBasisFromSpan(columnSpan);
      nextStyle.flexBasis = basis;
      nextStyle.maxWidth = basis;
      nextStyle["--spectrum-grid-item-flex-basis"] = basis;
      nextStyle["--spectrum-grid-item-flex-grow"] = 0;
    } else {
      nextStyle.flexBasis = "calc(100% / var(--columns, 12))";
      nextStyle.maxWidth = "calc(100% / var(--columns, 12))";
      nextStyle["--spectrum-grid-item-flex-basis"] = "calc(100% / var(--columns, 12))";
    }

    if (rowSpan) {
      const spanValue =
        typeof rowSpan === "number"
          ? rowSpan
          : parseInt(String(rowSpan).replace(/[^0-9]/g, ""), 10) || 1;
      const baseHeight = 48;
      nextStyle.minHeight = `calc(${spanValue} * var(--spectrum-grid-item-min-height, ${baseHeight}px))`;
    }
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
