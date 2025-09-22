import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { createUxpAdapter } from "./adapters/uxp";
import { createWebAdapter } from "./adapters/web";
import { isUxp } from "./Bridge";
import type { UxpBridge } from "./Bridge";

interface UxpContextValue extends UxpBridge {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Ctx = createContext<UxpContextValue>({
  ...createWebAdapter(),
  theme: 'dark',
  setTheme: () => {}
});

export const UxpProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const bridge = useMemo(() => (isUxp() ? createUxpAdapter() : createWebAdapter()), []);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Detect theme from UXP environment
    const detectTheme = () => {
      if (isUxp()) {
        try {
          // Try to get theme from UXP
          const uxp = (globalThis as any).uxp;
          
          // Check if app has theme API
          if (uxp?.app?.appTheme) {
            const appTheme = uxp.app.appTheme;
            console.log('UXP app theme:', appTheme);
            setTheme(appTheme === 'dark' ? 'dark' : 'light');
            return;
          }
          
          // Check host application theme
          if (uxp?.host?.theme) {
            const hostTheme = uxp.host.theme;
            console.log('UXP host theme:', hostTheme);
            setTheme(hostTheme === 'dark' ? 'dark' : 'light');
            return;
          }
          
          // Check computed styles of body/document
          const bodyStyle = getComputedStyle(document.body);
          const bgColor = bodyStyle.backgroundColor;
          console.log('Document background color:', bgColor);
          
          // Parse RGB to determine if it's light or dark
          if (bgColor) {
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const r = parseInt(rgb[0]);
              const g = parseInt(rgb[1]);
              const b = parseInt(rgb[2]);
              
              // Calculate brightness (luminance)
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              console.log('Calculated brightness:', brightness);
              
              setTheme(brightness > 128 ? 'light' : 'dark');
              return;
            }
          }
          
          // Check for CSS custom properties that might indicate theme
          const rootStyle = getComputedStyle(document.documentElement);
          const spectrumBg = rootStyle.getPropertyValue('--spectrum-global-color-gray-100');
          if (spectrumBg) {
            console.log('Found Spectrum theme property:', spectrumBg);
            // If Spectrum CSS is loaded, we can detect from that
          }
          
        } catch (e) {
          console.warn('Theme detection failed:', e);
        }
      } else {
        // Web environment - use system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme(mediaQuery.matches ? 'dark' : 'light');
        
        // Listen for changes
        const handler = (e: MediaQueryListEvent) => {
          setTheme(e.matches ? 'dark' : 'light');
        };
        mediaQuery.addEventListener('change', handler);
        
        return () => mediaQuery.removeEventListener('change', handler);
      }
    };

    detectTheme();
  }, []);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-host', isUxp() ? 'uxp' : 'web');
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-host', isUxp() ? 'uxp' : 'web');
    console.log('Applied theme and host to document:', theme, isUxp() ? 'uxp' : 'web');
  }, [theme]);

  const contextValue: UxpContextValue = {
    ...bridge,
    theme,
    setTheme
  };

  return <Ctx.Provider value={contextValue}>{children}</Ctx.Provider>;
};

export const useUxp = () => useContext(Ctx);