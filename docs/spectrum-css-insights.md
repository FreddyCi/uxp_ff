# Spectrum CSS Token Architecture Insights

Based on analysis of the official Adobe Spectrum CSS documentation, here are key insights for implementing UXP-compatible design systems.

## Core Token Structure

### Official Spectrum CSS Token Naming Conventions

#### Color Tokens
- **Accent Colors**: `--spectrum-accent-content-color-default`
- **Neutral Colors**: `--spectrum-neutral-subdued-content-color-default`
- **Interactive States**: `--spectrum-neutral-subdued-content-color-hover`, `--spectrum-neutral-subdued-content-color-down`, `--spectrum-neutral-subdued-content-color-key-focus`

#### Component-Specific Tokens
- **Component Base**: `--spectrum-{component}-{property}`
- **State Variants**: `--spectrum-{component}-{property}-{state}`
- **Color Context**: `--spectrum-{component}-{property}-color-{state}`

### Tab Component Official Tokens

```css
/* Default tab tokens */
--spectrum-tabs-color: var(--spectrum-neutral-subdued-content-color-default);
--spectrum-tabs-color-selected: var(--spectrum-neutral-content-color-default);
--spectrum-tabs-color-hover: var(--spectrum-neutral-subdued-content-color-hover);
--spectrum-tabs-color-key-focus: var(--spectrum-neutral-subdued-content-color-key-focus);
--spectrum-tabs-color-disabled: var(--spectrum-disabled-content-color);
--spectrum-tabs-selection-indicator-color: var(--spectrum-neutral-subdued-content-color-down);

/* Emphasized variant uses accent colors */
--spectrum-tabs-color-selected: var(--spectrum-accent-content-color-default);
--spectrum-tabs-selection-indicator-color: var(--spectrum-accent-content-color-default);
```

## Key Design Principles

### 1. Token Hierarchy
1. **Core Tokens**: Base design data from @adobe/spectrum-tokens
2. **Custom Properties**: CSS variables generated via StyleDictionary
3. **Component Tokens**: Component-specific mappings to core tokens
4. **System Variables**: Generated `--system-*` prefixed variables (not for external use)

### 2. Context System
- **Context**: Design language (currently only Spectrum supported)
- **Color**: Light/dark modes only (lightest/darkest deprecated)
- **Scale**: Medium (desktop) and Large (mobile)

### 3. Selection Indicator Pattern
- **Default tabs**: Use neutral subdued colors for subtle indicators
- **Emphasized tabs**: Use accent colors for prominent indicators
- **Implementation**: `::after` pseudo-element with `background-color`

## Our UXP Implementation Strategy

### Simplified Token Mapping
We use a simplified token system that maps to Spectrum concepts:

```css
/* Our simplified tokens */
--text-muted → --spectrum-neutral-subdued-content-color-default
--text → --spectrum-neutral-content-color-default  
--accent → --spectrum-accent-content-color-default
--text-disabled → --spectrum-disabled-content-color
```

### UXP-Specific Adaptations
1. **!important overrides**: Required for UXP environment styling conflicts
2. **Lightweight implementation**: 2KB vs 220KB+ official packages
3. **Theme switching**: Manual light/dark mode detection via UXP bridge
4. **Simplified hierarchy**: Direct token mapping vs complex layered system
5. **CSS Layout Limitations**: CSS `gap` property doesn't work reliably - use traditional `margin` for spacing
6. **Flexbox Compatibility**: Standard flexbox works, but newer CSS Grid and gap features need fallbacks

## Component Architecture Insights

### Official Spectrum Pattern
```css
.spectrum-Tabs {
  /* Base component tokens */
  --spectrum-tabs-color: var(--core-token);
  
  /* Modifier variants */
  &.spectrum-Tabs--emphasized {
    --spectrum-tabs-color-selected: var(--accent-token);
  }
  
  /* State selectors */
  .spectrum-Tabs-item {
    &.is-selected::after {
      background-color: var(--spectrum-tabs-selection-indicator-color);
    }
  }
}
```

### Our React Aria Adaptation
```css
.react-aria-Tabs {
  /* Map to official tokens */
  --spectrum-tabs-selection-indicator-color: var(--text-muted);
  
  /* Variant data attributes */
  &[data-emphasized="true"] {
    --spectrum-tabs-selection-indicator-color: var(--accent);
  }
  
  /* React Aria state attributes */
  [role="tab"][data-selected]::after {
    background-color: var(--spectrum-tabs-selection-indicator-color) !important;
  }
}
```

## Recommendations for Future Components

### 1. Token Naming
- Use official `--spectrum-{component}-*` naming when possible
- Map our simplified tokens to official equivalents
- Document token relationships for maintainability

### 2. Variant Implementation
- Use data attributes for React Aria compatibility: `data-emphasized`, `data-quiet`
- Override tokens at component level rather than individual properties
- Maintain UXP `!important` overrides for styling conflicts

### 3. Theme Integration
- Leverage our existing `--text`, `--accent`, `--bg` simplified system
- Map to official tokens in component CSS for accuracy
- Support both light/dark themes through CSS custom properties

### 4. Bundle Optimization
- Continue lightweight custom implementation approach
- Use official documentation for accurate visual patterns
- Avoid heavy official packages that conflict with UXP environment

## UXP CSS Compatibility Insights

### CSS Feature Support Matrix

| CSS Feature | UXP Support | Recommended Alternative | Notes |
|------------|-------------|------------------------|-------|
| `gap` property | ❌ Unreliable | `margin` spacing | Use `margin-right` for horizontal spacing |
| `flexbox` | ✅ Full support | - | Works perfectly for layouts |
| `grid` | ⚠️ Partial | `flexbox` | Basic grid works, complex features may fail |
| `::before/::after` | ✅ Full support | - | Perfect for selection indicators |
| `CSS custom properties` | ✅ Full support | - | Essential for theming system |
| `clamp()` | ❌ Limited | `calc()` + media queries | Use traditional responsive approaches |
| `container queries` | ❌ Not supported | Media queries | Use viewport-based responsive design |

### Spacing Strategy for UXP

#### ❌ What Doesn't Work
```css
/* CSS Gap - Unreliable in UXP */
.tabs-container {
  display: flex;
  gap: 24px; /* This won't create visible spacing */
}
```

#### ✅ What Works Reliably
```css
/* Direct margin spacing - Reliable */
.tab-item {
  margin-right: 24px; /* Creates consistent 24px spacing */
}

.tab-item:last-child {
  margin-right: 0; /* Remove trailing margin */
}
```

### Component-Specific UXP Learnings

#### Buttons
- **Challenge**: UXP's aggressive native button styling overrides
- **Solution**: "Nuclear" div-based approach with `uxp-reset--complete`
- **Key insight**: Sometimes bypassing native elements is more reliable than overriding

#### Tabs
- **Challenge**: Modern CSS spacing methods don't work
- **Solution**: Traditional margin-based spacing
- **Key insight**: React Aria default classes work perfectly with custom CSS

### UXP Environment Characteristics

1. **Chromium-based but limited**: Not all modern CSS features are available
2. **Aggressive native styling**: Some HTML elements have strong default styles
3. **Reset requirements**: Need comprehensive CSS resets for complex components
4. **Layout engine differences**: Flexbox reliable, Grid and newer features inconsistent

### Best Practices for UXP Development

1. **Test CSS features early**: Don't assume modern CSS works without testing
2. **Use fallbacks**: Always have traditional CSS alternatives ready
3. **Leverage working features**: `flexbox`, `custom properties`, `pseudo-elements` work great
4. **Document compatibility**: Keep notes on what works vs what doesn't
5. **Progressive enhancement**: Start with basic CSS, enhance where UXP supports it

## Conclusion

Our implementation successfully balances:
- **Spectrum accuracy**: Using official token names and patterns
- **UXP compatibility**: Required overrides and lightweight bundle
- **React Aria integration**: Data attribute-based variants
- **Theme support**: Automatic light/dark mode switching

The key insight is that we can achieve Spectrum design fidelity without the full complexity of the official implementation by mapping our simplified tokens to official patterns at the component level.

**Critical UXP Learning**: CSS `gap` property is unreliable in UXP environments - always use traditional `margin` spacing for consistent results. This applies to other modern CSS features that may not have full UXP support.

## Responsive Layout Strategy

### Official Spectrum CSS Responsive Approach

Spectrum CSS uses a **scale-based responsive system** rather than traditional breakpoint-based media queries:

#### 1. Scale System
```css
/* Desktop/Tablet - Default */
.spectrum--medium {
  /* Medium scale tokens for desktop interfaces */
}

/* Mobile/Touch - Large scale for better touch targets */
.spectrum--large {
  /* Large scale tokens for mobile interfaces */
}
```

#### 2. Responsive Patterns
Official Spectrum components use three main responsive strategies:

**A. Scale-Based Adaptation**
- Components automatically adjust based on `.spectrum--medium` or `.spectrum--large` class
- No media queries needed - scale is set at application level
- Icons, spacing, and touch targets scale proportionally

**B. Component-Specific Breakpoints**
```css
/* Modal responsive behavior */
@media only screen and (device-width <= 400px), 
       only screen and (device-height <= 350px) {
  .spectrum-Modal--responsive {
    inline-size: 100%;
    block-size: 100%;
    max-inline-size: 100%;
    max-block-size: 100%;
    border-radius: 0;
  }
}
```

**C. Orientation-Based Layout**
```css
/* Tray component adapts to orientation */
@media screen and (orientation: landscape) {
  .spectrum-Tray {
    border-start-start-radius: var(--spectrum-tray-corner-radius);
    border-start-end-radius: var(--spectrum-tray-corner-radius);
    max-inline-size: var(--spectrum-tray-max-inline-size);
  }
}
```

### UXP-Specific Responsive Considerations

#### 1. Fixed Panel Sizes
UXP panels typically have fixed dimensions determined by the host application:
- **Small panels**: 230px - 320px width
- **Medium panels**: 400px - 600px width  
- **Large panels**: 800px+ width

#### 2. No Device Scaling
UXP runs within Adobe applications, so traditional mobile/desktop distinctions don't apply:
- Always use medium scale (`.spectrum--medium`)
- Focus on content density rather than touch targets
- Optimize for mouse/keyboard interaction

#### 3. Responsive Patterns for UXP

**A. Container-Query Approach** (Recommended)
```css
/* Responsive tabs that collapse to vertical on narrow panels */
.react-aria-Tabs {
  /* Default horizontal layout */
  
  /* Use CSS container queries for narrow panels */
  container-type: inline-size;
}

@container (max-width: 300px) {
  .react-aria-Tabs {
    /* Switch to vertical orientation */
    flex-direction: column;
    
    [role="tablist"] {
      flex-direction: column;
      border-bottom: none;
      border-right: 1px solid var(--border);
    }
    
    [role="tab"] {
      text-align: left;
      border-radius: var(--radius) 0 0 var(--radius);
    }
  }
}
```

**B. Density Variants**
```css
/* Compact variant for narrow panels */
.react-aria-Tabs[data-density="compact"] {
  --spectrum-tabs-font-size: 12px;
  --spectrum-tabs-icon-size: 16px;
  --spectrum-tabs-icon-to-text: 6px;
  --spectrum-tabs-bottom-to-text: 8px;
}

/* Spacious variant for wide panels */
.react-aria-Tabs[data-density="spacious"] {
  --spectrum-tabs-font-size: 16px;
  --spectrum-tabs-icon-size: 20px;
  --spectrum-tabs-icon-to-text: 10px;
  --spectrum-tabs-bottom-to-text: 16px;
}
```

**C. Overflow Handling**
```css
/* Tabs that overflow horizontally */
.react-aria-Tabs {
  [role="tablist"] {
    overflow-x: auto;
    scrollbar-width: thin;
    
    /* Fade edges on overflow */
    mask: linear-gradient(90deg, 
      transparent 0px, 
      black 10px, 
      black calc(100% - 10px), 
      transparent 100%);
  }
}
```

### Implementation Recommendations

#### 1. UXP Panel Detection
```typescript
// Detect panel width for responsive behavior
function useResponsiveLayout() {
  const [panelWidth, setPanelWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setPanelWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    isNarrow: panelWidth < 300,
    isWide: panelWidth > 600,
    density: panelWidth < 300 ? 'compact' : 
             panelWidth > 600 ? 'spacious' : 'comfortable'
  };
}
```

#### 2. Responsive Component Props
```typescript
interface ResponsiveTabsProps {
  density?: 'compact' | 'comfortable' | 'spacious';
  orientation?: 'horizontal' | 'vertical' | 'auto';
  overflow?: 'scroll' | 'collapse' | 'menu';
}

// Usage
<Tabs 
  density="auto" 
  orientation="auto" 
  overflow="scroll"
>
```

#### 3. CSS Custom Properties for Flexibility
```css
.react-aria-Tabs {
  /* Responsive spacing */
  --tab-padding-x: clamp(8px, 2vw, 16px);
  --tab-padding-y: clamp(6px, 1.5vh, 12px);
  
  /* Responsive typography */
  --tab-font-size: clamp(12px, 3.5vw, 14px);
  
  /* Container-based scaling */
  font-size: var(--tab-font-size);
  padding: var(--tab-padding-y) var(--tab-padding-x);
}
```

### Key Responsive Insights

1. **Scale over breakpoints**: Use Spectrum's scale system rather than arbitrary breakpoints
2. **Container queries**: Better than viewport-based media queries for panel components
3. **Density variants**: Provide compact/comfortable/spacious options for different panel sizes
4. **Logical properties**: Use `inline-size`, `block-size` for better internationalization
5. **Overflow strategies**: Handle content that exceeds panel boundaries gracefully
6. **UXP constraints**: Design for fixed panel dimensions rather than fluid viewports