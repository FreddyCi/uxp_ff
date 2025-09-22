'use client';
import {
  Tabs as RACTabs,
  TabList as RACTabList,
  TabListProps,
  TabProps,
  Tab as RACTab,
  TabsProps,
  TabPanelProps,
  TabPanel as RACTabPanel
} from 'react-aria-components';
import './Tabs.css';

// Clean React Aria Components - using default classes that work in both web and UXP!
// No custom wrappers or reset classes needed

// Spectrum CSS compatible size types
type SpectrumSize = 's' | 'm' | 'l' | 'xl';

interface SpectrumTabsProps extends TabsProps {
  size?: SpectrumSize;
  emphasized?: boolean;
  quiet?: boolean;
}

export function Tabs({ size = 'm', emphasized, quiet, className = '', ...props }: SpectrumTabsProps) {
  return (
    <RACTabs 
      {...props} 
      className={className}
      data-size={size}
      data-emphasized={emphasized}
      data-quiet={quiet}
    />
  );
}

export function TabList<T extends object>({ className = '', ...props }: TabListProps<T>) {
  return (
    <RACTabList 
      {...props} 
      className={className}
    />
  );
}

export function Tab({ className = '', ...props }: TabProps) {
  return (
    <RACTab 
      {...props}
      className={className}
    />
  );
}

export function TabPanel({ className = '', ...props }: TabPanelProps) {
  return (
    <RACTabPanel 
      {...props} 
      className={className}
    />
  );
}