'use client';
import { useRef, ReactNode, useState, Children, cloneElement, ReactElement, isValidElement } from 'react';
import './Tabs-hybrid.css';

// Hybrid Tabs - Nuclear div approach with official Spectrum CSS classes
// EXACTLY the same pattern as our successful Button component

type SpectrumSize = 's' | 'm' | 'l';

interface TabsProps {
  children: ReactNode;
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string) => void;
  size?: SpectrumSize;
  emphasized?: boolean;
  quiet?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

interface TabListProps {
  children: ReactNode;
}

interface TabProps {
  id: string;
  children: ReactNode;
  isDisabled?: boolean;
  isSelected?: boolean;
  onSelect?: (key: string) => void;
}

interface TabPanelProps {
  id: string;
  children: ReactNode;
}

export function Tabs({
  children,
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  size = 'm',
  emphasized = false,
  quiet = false,
  orientation = 'horizontal',
  className = '',
  style,
  ...props
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(selectedKey || defaultSelectedKey || '');

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    onSelectionChange?.(key);
  };

  // Extract TabList and TabPanel components from children
  const tabListElement = Children.toArray(children).find(
    (child): child is ReactElement => 
      isValidElement(child) && (child as any).type === TabList
  );
  
  const tabPanels = Children.toArray(children).filter(
    (child): child is ReactElement => 
      isValidElement(child) && (child as any).type === TabPanel
  );

  // Build official Spectrum classes with hybrid approach - same as Button
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Tabs';
  const sizeClass = `spectrum-Tabs--size${size.toUpperCase()}`;
  const emphasizedClass = emphasized ? 'spectrum-Tabs--emphasized' : '';
  const quietClass = quiet ? 'spectrum-Tabs--quiet' : '';
  const orientationClass = orientation === 'vertical' ? 'spectrum-Tabs--vertical' : '';
  
  const tabsClasses = [
    resetClasses,
    baseClasses,
    sizeClass,
    emphasizedClass,
    quietClass,
    orientationClass,
    className
  ].filter(Boolean).join(' ');

  // Find the first tab if no active tab is set
  let firstTabId = '';
  if (tabListElement && isValidElement(tabListElement)) {
    const tabChildren = Children.toArray((tabListElement.props as any).children);
    const firstTab = tabChildren.find((child): child is ReactElement => 
      isValidElement(child) && (child as any).type === Tab
    );
    if (firstTab && isValidElement(firstTab)) {
      firstTabId = ((firstTab.props as any) as TabProps).id;
    }
  }

  const currentActiveTab = activeTab || firstTabId;

  return (
    <div className="tabs-container" style={style}>
      {/* Render TabList with enhanced tabs */}
      {tabListElement && isValidElement(tabListElement) && cloneElement(tabListElement, {
        ...(tabListElement.props as any),
        className: tabsClasses,
        orientation,
        activeTab: currentActiveTab,
        onTabChange: handleTabChange
      } as any)}
      
      {/* Render active TabPanel */}
      {tabPanels.map((panel, index) => {
        if (isValidElement(panel)) {
          const panelProps = (panel.props as any) as TabPanelProps;
          const isActive = panelProps.id === currentActiveTab;
          return isActive ? <div key={index}>{panel}</div> : null;
        }
        return null;
      })}
    </div>
  );
}

export function TabList({ 
  children, 
  className = '', 
  orientation = 'horizontal',
  activeTab,
  onTabChange 
}: TabListProps & { 
  className?: string; 
  orientation?: 'horizontal' | 'vertical'; 
  activeTab?: string; 
  onTabChange?: (key: string) => void; 
}) {
  return (
    <div
      role="tablist"
      className={className}
      aria-orientation={orientation}
    >
      {Children.map(children, (child) => {
        if (isValidElement(child) && (child as any).type === Tab) {
          const tabProps = (child.props as any) as TabProps;
          return cloneElement(child, {
            ...(child.props as any),
            isSelected: tabProps.id === activeTab,
            onSelect: onTabChange
          } as any);
        }
        return child;
      })}
    </div>
  );
}

export function Tab({ 
  id, 
  children, 
  isDisabled = false,
  isSelected = false,
  onSelect
}: TabProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Build official Spectrum classes for individual tabs - EXACTLY like Button
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Tabs-item';
  const selectedClass = isSelected ? 'is-selected' : '';
  
  const tabClasses = [resetClasses, baseClasses, selectedClass].filter(Boolean).join(' ');

  // Nuclear div approach - EXACTLY like Button component
  return (
    <div
      ref={ref}
      role="tab"
      className={tabClasses}
      aria-disabled={isDisabled}
      aria-selected={isSelected}
      tabIndex={isDisabled ? -1 : 0}
      onClick={() => {
        if (!isDisabled && onSelect) {
          onSelect(id);
        }
      }}
    >
      {children}
    </div>
  );
}

export function TabPanel({ 
  id, 
  children 
}: TabPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Build official Spectrum classes for tab panels - EXACTLY like Button
  const resetClasses = 'uxp-reset--complete';
  const baseClasses = 'spectrum-Tabs-tabPanel';
  
  const panelClasses = `${resetClasses} ${baseClasses}`;

  // Nuclear div approach - EXACTLY like Button component
  return (
    <div
      ref={ref}
      role="tabpanel"
      className={panelClasses}
      tabIndex={0}
    >
      {children}
    </div>
  );
}