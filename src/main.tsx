import { Gallery } from "./features/Gallery";

import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/uxp-reset.css";
import "./styles/tokens.css";
import "./styles/utilities.css";
import { UxpProvider, useUxp } from "./uxp/UxpProvider";
import { Label, Input } from "react-aria-components";
import { TextField } from "./components/TextField";
import { TextArea } from "./components/TextArea";
import { Select } from "./components/Select";
import { Button } from "./components/Button";
import { ActionBar } from "./components/ActionBar";
import { ActionButton } from "./components/ActionButton";
import { ActionGroup } from "./components/ActionGroup";
import { ActionMenu } from "./components/ActionMenu";
import { MenuItem } from "./components/MenuItem";
import { Card } from "./components/Card";
import { Checkbox } from "./components/Checkbox";
import { Typography, Heading, Body, Emphasized, Code, Detail, Strong } from "./components/Typography";
import { Tabs, TabList, Tab, TabPanel } from "./components/Tabs";
import { Divider } from "./components/Divider";
import { Radio, RadioGroup } from "./components/Radio";
import { Asset } from "./components/Asset";
import { AssetCard } from "./components/AssetCard";
import { usePluginStore } from "./store/usePluginStore";


const App: React.FC = () => {
  const { host, fs, panelId, theme, setTheme } = useUxp();
  
  // Zustand state management
  const { 
    lastSavedFile, 
    recentFiles, 
    isDarkMode, 
    fileFormat,
    radioPreferences,
    setLastSavedFile,
    addRecentFile,
    toggleDarkMode,
    setFileFormat,
    clearRecentFiles,
    setRadioPreference
  } = usePluginStore();
  
  console.log("App is rendering! Host:", host.name, host.version);
  
    const handleSaveFile = () => {
    console.log('Button clicked!');
    console.log('UXP object available:', (globalThis as any).uxp);
    
    // Enhanced debugging - check _uxpContainer
    const globalKeys = Object.keys(globalThis).filter(key => 
      key.toLowerCase().includes('uxp') || 
      key.toLowerCase().includes('adobe') ||
      key.toLowerCase().includes('cep')
    );
    const windowKeys = Object.keys(window).filter(key => 
      key.toLowerCase().includes('uxp') || 
      key.toLowerCase().includes('adobe') ||
      key.toLowerCase().includes('cep')
    );
    const docKeys = Object.keys(document).filter(key => 
      key.toLowerCase().includes('uxp') || 
      key.toLowerCase().includes('adobe') ||
      key.toLowerCase().includes('cep') ||
      key.startsWith('_')
    );
    
    console.log('Global keys:', globalKeys);
    console.log('Window keys:', windowKeys);
    console.log('Document keys:', docKeys);
    
    // Check _uxpContainer specifically
    if ((document as any)._uxpContainer) {
      console.log('_uxpContainer found:', (document as any)._uxpContainer);
      console.log('_uxpContainer type:', typeof (document as any)._uxpContainer);
      console.log('_uxpContainer keys:', Object.keys((document as any)._uxpContainer));
    }
    
    // Check if uxp is available anywhere else
    console.log('window.uxp:', (window as any).uxp);
    console.log('document.uxp:', (document as any).uxp);
    console.log('globalThis.require:', typeof (globalThis as any).require);
    
    // Try to access uxp through require if available
    if (typeof (globalThis as any).require === 'function') {
      try {
        const uxpModule = (globalThis as any).require('uxp');
        console.log('UXP via require:', uxpModule);
      } catch (e: any) {
        console.log('Cannot require uxp:', e?.message || e);
      }
    }
    
    // Get UXP bridge from context (already available from hook at component top)
    console.log('FS adapter:', fs);
    console.log('Host adapter:', host);
    
    console.log('Attempting to show save dialog...');
    
    fs.showSaveDialog({ 
      suggestedName: `test.${fileFormat}`,
      types: [{ description: `${fileFormat.toUpperCase()} files`, accept: [`.${fileFormat}`] }]
    })
      .then((result: any) => {
        console.log('Save dialog result:', result);
        if (result) {
          console.log('File saved successfully!');
          setLastSavedFile(result);
        } else {
          console.log('User cancelled save dialog');
        }
      })
      .catch((error: any) => {
        console.error('Save dialog error:', error);
      });
  };

  // Test UXP detection
  const isInUxp = typeof (globalThis as any).uxp !== 'undefined';
  console.log("Running in UXP environment:", isInUxp);

  // Panel routing
  if (panelId === 'gallery-panel') return <Gallery />;

  return (
    <div className="uxp-full-height" style={{ 
      padding: "12px", 
      display: "flex",
      flexDirection: "column",
      background: "var(--bg)", 
      color: "var(--text)", 
      fontFamily: "system-ui, sans-serif",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <div style={{ 
        opacity: 0.8, 
        fontSize: "14px", 
        marginBottom: "12px",
        color: "var(--text-muted)",
        flexShrink: 0
      }}>
        Host: {host.name} {host.version}
        <br />
        Environment: {isInUxp ? 'UXP' : 'Web Browser'}
        <br />
        Theme: {theme}
        <br />
        UXP Object: {typeof (globalThis as any).uxp}
      </div>
      
      {/* Main content area - scrollable and fills remaining height */}
      <div className="uxp-scrollable">
        <Tabs defaultSelectedKey="tab1" style={{ marginBottom: "12px" }} size="m" emphasized>
        <TabList>
          <Tab id="tab1">Settings</Tab>
          <Tab id="tab2">Files</Tab>
          <Tab id="tab3">Form Demo</Tab>
          <Tab id="tab4">About</Tab>
          <Tab id="tab5">Features</Tab>
          <Tab id="tab6">Gallery</Tab>
          <Tab id="tab7">Actions</Tab>
          <Tab id="tab8">Cards</Tab>
          <Tab id="tab9">Checkboxes</Tab>
          <Tab id="tab10">Typography</Tab>
          <Tab id="tab11">Progress Circles</Tab>
        </TabList>
        
        <TabPanel id="tab1">
          <div style={{ padding: "12px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Settings</h3>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text)" }}>
                Button Variants (Spectrum Design System):
              </label>
              
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-muted)" }}>Accent variant (default):</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <Button variant="accent" treatment="fill" size="small">Action</Button>
                  <Button variant="accent" treatment="outline" size="small">Action</Button>
                </div>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-muted)" }}>Primary variant:</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <Button variant="primary" treatment="fill">Action</Button>
                  <Button variant="primary" treatment="outline">Action</Button>
                </div>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-muted)" }}>Secondary variant:</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <Button variant="secondary" treatment="fill">Action</Button>
                  <Button variant="secondary" treatment="outline">Action</Button>
                </div>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-muted)" }}>Negative variant:</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <Button variant="negative" treatment="fill">Action</Button>
                  <Button variant="negative" treatment="outline">Action</Button>
                </div>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-muted)" }}>Disabled states:</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <Button variant="accent" isDisabled>Disabled Fill</Button>
                  <Button variant="accent" treatment="outline" isDisabled>Disabled Outline</Button>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text)" }}>
                Theme:
              </label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                <Button variant="accent" onPress={() => setTheme('light')}>
                  Light Theme
                </Button>
                <Button variant="secondary" onPress={() => setTheme('dark')}>
                  Dark Theme
                </Button>
              </div>
            </div>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text)" }}>
                File Format:
              </label>
              <select 
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value as 'txt' | 'json' | 'md')}
                style={{
                  padding: "8px",
                  backgroundColor: "var(--bg-3)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px"
                }}
              >
                <option value="txt">Text (.txt)</option>
                <option value="json">JSON (.json)</option>
                <option value="md">Markdown (.md)</option>
              </select>
            </div>
            
            <Button variant="secondary" onPress={toggleDarkMode}>
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </Button>
          </div>
        </TabPanel>                <TabPanel id="tab2">
          <div style={{ padding: "12px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Files</h3>
            
            {lastSavedFile && (
              <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "var(--bg-2)", borderRadius: "6px" }}>
                <p style={{ color: "var(--accent)", margin: "0 0 4px 0", fontSize: "14px", fontWeight: "500" }}>
                  Last Saved:
                </p>
                <p style={{ color: "var(--text)", margin: "0", fontSize: "12px", wordBreak: "break-all" }}>
                  {lastSavedFile}
                </p>
              </div>
            )}
            
            {recentFiles.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <p style={{ color: "var(--text)", margin: "0", fontSize: "14px", fontWeight: "500" }}>
                    Recent Files ({recentFiles.length}):
                  </p>
                  <Button variant="secondary" size="small" onPress={clearRecentFiles}>Clear</Button>
                </div>
                <div style={{ maxHeight: "120px", overflowY: "auto" }}>
                  {recentFiles.map((file, index) => (
                    <div key={index} style={{ 
                      padding: "8px", 
                      backgroundColor: "var(--bg-3)", 
                      marginBottom: "4px", 
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      wordBreak: "break-all"
                    }}>
                      {file}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Button variant="accent" onPress={handleSaveFile}>
              Save New File (.{fileFormat})
            </Button>
          </div>
        </TabPanel>
        <TabPanel id="tab3">
          <div style={{ padding: "12px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Contact Form</h3>
            
            <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <TextField
                label="Name"
                placeholder="Enter your full name"
                name="name"
                isRequired
              />

              <TextField
                label="Email"
                type="email"
                placeholder="your.email@example.com"
                name="email"
                isRequired
              />

              <Select
                label="Country"
                placeholder="Select your country"
                name="country"
                options={[
                  { value: "us", label: "United States" },
                  { value: "ca", label: "Canada" },
                  { value: "uk", label: "United Kingdom" },
                  { value: "de", label: "Germany" },
                  { value: "fr", label: "France" },
                  { value: "jp", label: "Japan" },
                  { value: "au", label: "Australia" }
                ]}
                description="Select your country of residence"
              />

              <Select
                label="Size"
                placeholder="Choose size"
                name="size"
                size="s"
                options={[
                  { value: "xs", label: "Extra Small" },
                  { value: "s", label: "Small" },
                  { value: "m", label: "Medium" },
                  { value: "l", label: "Large" },
                  { value: "xl", label: "Extra Large" },
                  { value: "xxl", label: "XXL", isDisabled: true }
                ]}
                description="Small size variant of Select component"
              />

              <TextField
                label="Message"
                placeholder="Enter your message here..."
                name="message"
                // Note: For multiline, we'd need a TextArea component
              />

              <TextArea
                label="Message (TextArea)"
                placeholder="Enter your message here..."
                rows={4}
                name="message-textarea"
                description="This is our new hybrid TextArea component"
              />

              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <Button 
                  variant="secondary"
                  onPress={() => {
                    console.log("Form cleared");
                    // Simple form clear - in a real app you'd use form state
                    const form = document.querySelector('form');
                    if (form) {
                      const inputs = form.querySelectorAll('input, textarea');
                      inputs.forEach((input: any) => input.value = '');
                    }
                  }}
                >
                  Clear
                </Button>
                <Button 
                  variant="accent"
                  onPress={() => {
                    console.log("Form submitted");
                    // Simple form submission - in a real app you'd collect the data
                    const form = document.querySelector('form');
                    if (form) {
                      const formData = new FormData(form as HTMLFormElement);
                      console.log("Form data:", Object.fromEntries(formData.entries()));
                      alert("Form submitted! Check console for data.");
                    }
                  }}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </TabPanel>

        <TabPanel id="tab4">
          <div style={{ padding: "12px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Spectrum CSS Tabs Demo</h3>
            
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Different Sizes</h4>
              
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-muted)" }}>Small (s):</p>
                <Tabs defaultSelectedKey="small1" size="s">
                  <TabList>
                    <Tab id="small1">Tab 1</Tab>
                    <Tab id="small2">Tab 2</Tab>
                    <Tab id="small3">Tab 3</Tab>
                  </TabList>
                  <TabPanel id="small1">Small tab content</TabPanel>
                  <TabPanel id="small2">Small tab 2 content</TabPanel>
                  <TabPanel id="small3">Small tab 3 content</TabPanel>
                </Tabs>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-muted)" }}>Medium (m) - Default:</p>
                <Tabs defaultSelectedKey="med1" size="m">
                  <TabList>
                    <Tab id="med1">Tab 1</Tab>
                    <Tab id="med2">Tab 2</Tab>
                    <Tab id="med3">Tab 3</Tab>
                  </TabList>
                  <TabPanel id="med1">Medium tab content</TabPanel>
                  <TabPanel id="med2">Medium tab 2 content</TabPanel>
                  <TabPanel id="med3">Medium tab 3 content</TabPanel>
                </Tabs>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-muted)" }}>Large (l):</p>
                <Tabs defaultSelectedKey="large1" size="l">
                  <TabList>
                    <Tab id="large1">Tab 1</Tab>
                    <Tab id="large2">Tab 2</Tab>
                    <Tab id="large3">Tab 3</Tab>
                  </TabList>
                  <TabPanel id="large1">Large tab content</TabPanel>
                  <TabPanel id="large2">Large tab 2 content</TabPanel>
                  <TabPanel id="large3">Large tab 3 content</TabPanel>
                </Tabs>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-muted)" }}>Emphasized:</p>
                <Tabs defaultSelectedKey="emp1" size="m" emphasized>
                  <TabList>
                    <Tab id="emp1">Emphasized</Tab>
                    <Tab id="emp2">Tabs</Tab>
                    <Tab id="emp3">Demo</Tab>
                  </TabList>
                  <TabPanel id="emp1">Emphasized styling with blue accent</TabPanel>
                  <TabPanel id="emp2">Emphasized tab 2 content</TabPanel>
                  <TabPanel id="emp3">Emphasized tab 3 content</TabPanel>
                </Tabs>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-muted)" }}>Quiet variant:</p>
                <Tabs defaultSelectedKey="quiet1" size="m" quiet>
                  <TabList>
                    <Tab id="quiet1">Quiet</Tab>
                    <Tab id="quiet2">Tabs</Tab>
                    <Tab id="quiet3">Style</Tab>
                  </TabList>
                  <TabPanel id="quiet1">Quiet tabs have no background divider</TabPanel>
                  <TabPanel id="quiet2">Quiet tab 2 content</TabPanel>
                  <TabPanel id="quiet3">Quiet tab 3 content</TabPanel>
                </Tabs>
              </div>
            </div>
            
            <div style={{ fontSize: "12px", color: "var(--text-disabled)" }}>
              <p><strong>Our Custom Spectrum CSS Features:</strong></p>
              <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                <li>Lightweight implementation (2KB vs 220KB+ official)</li>
                <li>UXP-optimized with !important overrides</li>
                <li>Automatic light/dark theme detection</li>
                <li>Spectrum design language and tokens</li>
                <li>Size variants (s, m, l, xl) with proper spacing</li>
                <li>Emphasized and quiet style variants</li>
                <li>Accessibility features from React Aria</li>
                <li>Fast performance and small bundle size</li>
              </ul>
            </div>
          </div>
        </TabPanel>

        <TabPanel id="tab5">
          <div style={{ padding: "12px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Features</h3>
            <p style={{ marginBottom: "24px", color: "var(--text)" }}>
              Overview of the hybrid component ecosystem and UXP compatibility features.
            </p>

            {/* Component Ecosystem Overview */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Hybrid Component Ecosystem</h4>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                gap: "16px" 
              }}>
                {/* Form Components */}
                <div style={{ 
                  padding: "16px", 
                  backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                  borderRadius: "8px",
                  border: "1px solid var(--spectrum-border-color-default)"
                }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>📝 Form Components</h5>
                  <ul style={{ margin: "0", paddingLeft: "20px", color: "var(--text)", fontSize: "13px" }}>
                    <li>TextField - Text input with validation</li>
                    <li>TextArea - Multi-line text input</li>
                    <li>Select - Dropdown selection</li>
                    <li>Checkbox - Boolean selection</li>
                    <li>Radio - Single choice selection</li>
                    <li>Button - Action triggers</li>
                  </ul>
                </div>

                {/* Action Components */}
                <div style={{ 
                  padding: "16px", 
                  backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                  borderRadius: "8px",
                  border: "1px solid var(--spectrum-border-color-default)"
                }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>⚡ Action Components</h5>
                  <ul style={{ margin: "0", paddingLeft: "20px", color: "var(--text)", fontSize: "13px" }}>
                    <li>ActionButton - Icon buttons</li>
                    <li>ActionGroup - Button groupings</li>
                    <li>ActionMenu - Dropdown menus</li>
                    <li>ActionBar - Selection toolbars</li>
                    <li>MenuItem - Menu items</li>
                  </ul>
                </div>

                {/* Layout Components */}
                <div style={{ 
                  padding: "16px", 
                  backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                  borderRadius: "8px",
                  border: "1px solid var(--spectrum-border-color-default)"
                }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>🎨 Layout Components</h5>
                  <ul style={{ margin: "0", paddingLeft: "20px", color: "var(--text)", fontSize: "13px" }}>
                    <li>Card - Content containers</li>
                    <li>Tabs - Navigation interface</li>
                    <li>Typography - Text styling</li>
                    <li>Divider - Visual separators</li>
                    <li>Content - Layout containers</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Nuclear Div Approach */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>🔬 Nuclear Div Approach</h4>
              <div style={{ 
                padding: "16px", 
                backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                borderRadius: "8px" 
              }}>
                <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "var(--text)" }}>
                  Our hybrid components use ultra-high specificity CSS to override UXP's aggressive resets:
                </p>
                <div style={{ 
                  padding: "12px", 
                  backgroundColor: "var(--spectrum-background-layer-1-color, #fff)", 
                  borderRadius: "4px",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "var(--text)",
                  border: "1px solid var(--spectrum-border-color-default)"
                }}>
                  <code>
                    div.uxp-reset--complete.spectrum-Button.spectrum-Button
                  </code>
                </div>
                <ul style={{ margin: "12px 0 0 0", paddingLeft: "20px", color: "var(--text)", fontSize: "13px" }}>
                  <li>Triple class specificity for maximum override power</li>
                  <li>All properties use !important for UXP compatibility</li>
                  <li>Nuclear reset with "all: unset !important"</li>
                  <li>Re-establishes styling with Spectrum design tokens</li>
                </ul>
              </div>
            </div>

            {/* UXP Compatibility Features */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>🔧 UXP Compatibility Features</h4>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                gap: "16px" 
              }}>
                {/* CSS Features */}
                <div style={{ 
                  padding: "16px", 
                  backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                  borderRadius: "8px",
                  border: "1px solid var(--spectrum-border-color-default)"
                }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>🎨 CSS Optimizations</h5>
                  <ul style={{ margin: "0", paddingLeft: "20px", color: "var(--text)", fontSize: "13px" }}>
                    <li>Ultra-high specificity selectors</li>
                    <li>!important declarations for overrides</li>
                    <li>UXP-safe property usage</li>
                    <li>Fallback values for unsupported features</li>
                    <li>Container queries for responsive design</li>
                  </ul>
                </div>

                {/* JavaScript Features */}
                <div style={{ 
                  padding: "16px", 
                  backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                  borderRadius: "8px",
                  border: "1px solid var(--spectrum-border-color-default)"
                }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>⚡ JavaScript Enhancements</h5>
                  <ul style={{ margin: "0", paddingLeft: "20px", color: "var(--text)", fontSize: "13px" }}>
                    <li>React Aria for accessibility</li>
                    <li>TypeScript type safety</li>
                    <li>UXP bridge adapters</li>
                    <li>State management with Zustand</li>
                    <li>Cross-environment compatibility</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>📊 Performance Benefits</h4>
              <div style={{ 
                padding: "16px", 
                backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                borderRadius: "8px" 
              }}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                  gap: "20px",
                  textAlign: "center"
                }}>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: "600", color: "var(--spectrum-accent-color-800)" }}>
                      ~90%
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Smaller than official Spectrum CSS
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: "600", color: "var(--spectrum-accent-color-800)" }}>
                      100%
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      UXP compatibility rate
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: "600", color: "var(--spectrum-accent-color-800)" }}>
                      12+
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Production-ready components
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: "600", color: "var(--spectrum-accent-color-800)" }}>
                      {"<1s"}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Build time for UXP
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Overview */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>🏗️ Architecture</h4>
              <div style={{ 
                padding: "16px", 
                backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                borderRadius: "8px" 
              }}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr 1fr", 
                  gap: "20px",
                  textAlign: "center"
                }}>
                  <div>
                    <div style={{ 
                      padding: "12px", 
                      backgroundColor: "var(--spectrum-accent-color-100)", 
                      borderRadius: "6px",
                      marginBottom: "8px"
                    }}>
                      <strong>React Components</strong>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      TypeScript interfaces, React Aria integration
                    </div>
                  </div>
                  <div>
                    <div style={{ 
                      padding: "12px", 
                      backgroundColor: "var(--spectrum-accent-color-200)", 
                      borderRadius: "6px",
                      marginBottom: "8px"
                    }}>
                      <strong>Hybrid CSS</strong>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Nuclear div selectors, UXP-safe properties
                    </div>
                  </div>
                  <div>
                    <div style={{ 
                      padding: "12px", 
                      backgroundColor: "var(--spectrum-accent-color-300)", 
                      borderRadius: "6px",
                      marginBottom: "8px"
                    }}>
                      <strong>UXP Bridge</strong>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Environment detection, API adapters
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider Component Showcase */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>🎯 Divider Component</h4>
              <div style={{ 
                padding: "16px", 
                backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                borderRadius: "8px" 
              }}>
                <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--text)" }}>
                  Visual separators with size variants and orientation support based on Adobe Spectrum specifications.
                </p>
                
                {/* Size Variants */}
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Size Variants</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Small</div>
                      <Divider size="S" />
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Medium</div>
                      <Divider size="M" />
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Large</div>
                      <Divider size="L" />
                    </div>
                  </div>
                </div>

                {/* Vertical Orientation */}
                <div style={{ marginBottom: "16px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Vertical Orientation</h5>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", height: "80px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Small</span>
                    <Divider size="S" orientation="vertical" />
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Medium</span>
                    <Divider size="M" orientation="vertical" />
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Large</span>
                    <Divider size="L" orientation="vertical" />
                  </div>
                </div>

                {/* Implementation Details */}
                <div style={{ 
                  padding: "12px", 
                  backgroundColor: "var(--spectrum-background-layer-1-color, #fff)", 
                  borderRadius: "4px",
                  border: "1px solid var(--spectrum-border-color-default)"
                }}>
                  <h6 style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text)" }}>Implementation Features:</h6>
                  <ul style={{ margin: "0", paddingLeft: "16px", fontSize: "11px", color: "var(--text-muted)" }}>
                    <li>Semantic HR element with proper ARIA role</li>
                    <li>Nuclear div CSS approach for UXP compatibility</li>
                    <li>Automatic min-inline-size for horizontal dividers</li>
                    <li>Automatic min-block-size for vertical dividers</li>
                    <li>Official Spectrum design tokens for thickness</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Radio Component Showcase */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>🔘 Radio Component</h4>
              <div style={{ 
                padding: "16px", 
                backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                borderRadius: "8px" 
              }}>
                <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--text)" }}>
                  Single choice selection components with size variants and group management based on Adobe Spectrum specifications.
                </p>
                
                {/* Basic Radio Group */}
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Basic Radio Group</h5>
                  <RadioGroup 
                    name="example-basic" 
                    label="Choose your preferred option:"
                    value={radioPreferences.basicOption}
                    onChange={(value) => setRadioPreference('basicOption', value)}
                  >
                    <Radio value="option1">First option</Radio>
                    <Radio value="option2">Second option (selected)</Radio>
                    <Radio value="option3">Third option</Radio>
                  </RadioGroup>
                </div>

                {/* Size Variants */}
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Size Variants</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Small</div>
                      <RadioGroup 
                        name="size-small" 
                        size="s"
                        value={radioPreferences.sizeSmall}
                        onChange={(value) => setRadioPreference('sizeSmall', value)}
                      >
                        <Radio value="small1">Small radio option</Radio>
                        <Radio value="small2">Another small option</Radio>
                      </RadioGroup>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Medium</div>
                      <RadioGroup 
                        name="size-medium" 
                        size="m"
                        value={radioPreferences.sizeMedium}
                        onChange={(value) => setRadioPreference('sizeMedium', value)}
                      >
                        <Radio value="medium1">Medium radio option</Radio>
                        <Radio value="medium2">Another medium option</Radio>
                      </RadioGroup>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Large</div>
                      <RadioGroup 
                        name="size-large" 
                        size="l"
                        value={radioPreferences.sizeLarge}
                        onChange={(value) => setRadioPreference('sizeLarge', value)}
                      >
                        <Radio value="large1">Large radio option</Radio>
                        <Radio value="large2">Another large option</Radio>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Horizontal Orientation */}
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Horizontal Layout</h5>
                  <RadioGroup 
                    name="horizontal-example" 
                    orientation="horizontal"
                    label="Select alignment:"
                    value={radioPreferences.horizontalAlignment}
                    onChange={(value) => setRadioPreference('horizontalAlignment', value)}
                  >
                    <Radio value="left">Left</Radio>
                    <Radio value="center">Center</Radio>
                    <Radio value="right">Right</Radio>
                  </RadioGroup>
                </div>

                {/* Disabled State */}
                <div style={{ marginBottom: "16px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Disabled State</h5>
                  <RadioGroup 
                    name="disabled-example" 
                    label="Disabled radio group:"
                    isDisabled={true}
                    value={radioPreferences.disabledExample}
                    onChange={(value) => setRadioPreference('disabledExample', value)}
                  >
                    <Radio value="disabled1">Disabled option</Radio>
                    <Radio value="disabled2">Disabled selected option</Radio>
                    <Radio value="disabled3">Another disabled option</Radio>
                  </RadioGroup>
                </div>

                {/* Implementation Details */}
                <div style={{ 
                  padding: "12px", 
                  backgroundColor: "var(--spectrum-background-layer-1-color, #fff)", 
                  borderRadius: "4px",
                  border: "1px solid var(--spectrum-border-color-default)"
                }}>
                  <h6 style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text)" }}>Implementation Features:</h6>
                  <ul style={{ margin: "0", paddingLeft: "16px", fontSize: "11px", color: "var(--text-muted)" }}>
                    <li>Context-based state management with RadioGroup</li>
                    <li>Nuclear div CSS approach for UXP compatibility</li>
                    <li>Proper semantic HTML with input[type="radio"]</li>
                    <li>Circular button with inner dot for checked state</li>
                    <li>Size variants (S, M, L, XL) with proportional scaling</li>
                    <li>Horizontal and vertical orientation support</li>
                    <li>Focus ring and hover states for accessibility</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Asset Component Showcase */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>🖼️ Asset Component</h4>
              <div style={{ 
                padding: "16px", 
                backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                borderRadius: "8px" 
              }}>
                <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--text)" }}>
                  Thumbnail components for displaying images, files, and media assets based on Adobe Spectrum specifications.
                </p>
                
                {/* Size Variants */}
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Size Variants</h5>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>XS (60px)</div>
                      <Asset 
                        size="xs" 
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjE1IiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                        alt="Extra small asset"
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>S (90px)</div>
                      <Asset 
                        size="s" 
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjkwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjQ1IiBjeT0iNDUiIHI9IjIyIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                        alt="Small asset"
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>M (120px)</div>
                      <Asset 
                        size="m" 
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                        alt="Medium asset"
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>L (160px)</div>
                      <Asset 
                        size="l" 
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjgwIiBjeT0iODAiIHI9IjQwIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                        alt="Large asset"
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>XL (200px)</div>
                      <Asset 
                        size="xl" 
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIAwIDIwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGNUY1RjUiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiBy0i1NTAiIGZpbGw9IiMyNTYzRUIiLz4KPC9zdmc+"
                        alt="Extra large asset"
                      />
                    </div>
                  </div>
                </div>

                {/* State Variants */}
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>State Variants</h5>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Default</div>
                      <Asset 
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                        alt="Default asset"
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Selected</div>
                      <Asset 
                        isSelected={true}
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                        alt="Selected asset"
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Drop Target</div>
                      <Asset 
                        isDropTarget={true}
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                        alt="Drop target asset"
                      />
                    </div>
                  </div>
                </div>

                {/* Variant Types */}
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Variant Types</h5>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Default</div>
                      <Asset 
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                        alt="Default variant"
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Overlay</div>
                      <Asset 
                        variant="overlay"
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                        alt="Overlay variant"
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>File</div>
                      <Asset 
                        variant="file"
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                        alt="File variant"
                      />
                    </div>
                  </div>
                </div>

                {/* Asset with Content */}
                <div style={{ marginBottom: "16px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Asset with Content Overlay</h5>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <Asset 
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                      alt="Asset with content"
                    >
                      <div style={{ fontSize: "10px", fontWeight: "600", color: "white" }}>JPG</div>
                    </Asset>
                    <Asset 
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPg=="
                      alt="Asset with longer content"
                    >
                      <div style={{ fontSize: "9px", fontWeight: "600", color: "white" }}>PHOTOSHOP</div>
                    </Asset>
                  </div>
                </div>

                {/* Implementation Details */}
                <div style={{ 
                  padding: "12px", 
                  backgroundColor: "var(--spectrum-background-layer-1-color, #fff)", 
                  borderRadius: "4px",
                  border: "1px solid var(--spectrum-border-color-default)"
                }}>
                  <h6 style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text)" }}>Implementation Features:</h6>
                  <ul style={{ margin: "0", paddingLeft: "16px", fontSize: "11px", color: "var(--text-muted)" }}>
                    <li>Nuclear div CSS approach for UXP compatibility with ultra-high specificity</li>
                    <li>Size variants (xs, s, m, l, xl) with proportional scaling</li>
                    <li>State management for selected, drop target, and hover states</li>
                    <li>Variant types: default, overlay, and file styles</li>
                    <li>Content overlay support for file type indicators</li>
                    <li>Proper semantic HTML with img elements and alt text</li>
                    <li>Focus ring and keyboard navigation support</li>
                    <li>Container queries for responsive behavior</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AssetCard Component Showcase */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>🃏 AssetCard Component</h4>
              <div style={{ 
                padding: "16px", 
                backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", 
                borderRadius: "8px" 
              }}>
                <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--text)" }}>
                  AssetCard components for displaying assets in card format with selection states and metadata based on Adobe Spectrum specifications.
                </p>
                
                {/* Selection Style Variants */}
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Selection Style Variants</h5>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Checkbox Selection</div>
                      <AssetCard
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI0IiBoZWlnaHQ9IjIyNCIgdmlld0JveD0iMCAwIDIyNCAyMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjQiIGhlaWdodD0iMjI0IiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjExMiIgY3k9IjExMiIgcj0iNDAiIGZpbGw9IiMyNTYzRUIiLz4KPHRleHQgeD0iMTEyIiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCI+Q0hFQ0tCT1g8L3RleHQ+Cjwvc3ZnPg=="
                        alt="Checkbox selection card"
                        title="Design File"
                        headerContent={<span style={{ fontSize: "12px", color: "#666" }}>Modified 2 hours ago</span>}
                        content="High-resolution design asset with multiple layers and effects."
                        selectionStyle="checkbox"
                        isSelected={true}
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Highlight Selection</div>
                      <AssetCard
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI0IiBoZWlnaHQ9IjIyNCIgdmlld0JveD0iMCAwIDIyNCAyMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjQiIGhlaWdodD0iMjI0IiBmaWxsPSIjRkY2QjZCIi8+CjxjaXJjbGUgY3g9IjExMiIgY3k9IjExMiIgcj0iNDAiIGZpbGw9IiNGNDlBMjAiLz4KPHRleHQgeD0iMTEyIiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCI+SElHSExJR0hUPXRoZXg+Cjwvc3ZnPg=="
                        alt="Highlight selection card"
                        title="Product Photo"
                        headerContent={<span style={{ fontSize: "12px", color: "#666" }}>JPG • 2.4 MB</span>}
                        content="Professional product photography for marketing materials."
                        selectionStyle="highlight"
                        isSelected={true}
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Ordered Selection</div>
                      <AssetCard
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI0IiBoZWlnaHQ9IjIyNCIgdmlld0JveD0iMCAwIDIyNCAyMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjQiIGhlaWdodD0iMjI0IiBmaWxsPSIjMTBCOTgxIi8+CjxjaXJjbGUgY3g9IjExMiIgY3k9IjExMiIgcj0iNDAiIGZpbGw9IiMwMEJGNDUiLz4KPHRleHQgeD0iMTEyIiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCI+T1JERVJFRCk8L3RleHQ+Cjwvc3ZnPg=="
                        alt="Ordered selection card"
                        title="Video Asset"
                        headerContent={<span style={{ fontSize: "12px", color: "#666" }}>MP4 • 45.2 MB</span>}
                        content="High-quality video content for multimedia presentations."
                        selectionStyle="ordered"
                        isSelected={true}
                        data-order="1"
                      />
                    </div>
                  </div>
                </div>

                {/* State Variants */}
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>State Variants</h5>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Default State</div>
                      <AssetCard
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI0IiBoZWlnaHQ9IjIyNCIgdmlld0JveD0iMCAwIDIyNCAyMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjQiIGhlaWdodD0iMjI0IiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjExMiIgY3k9IjExMiIgcj0iNDAiIGZpbGw9IiM2MzY2RjEiLz4KPHRleHQgeD0iMTEyIiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCI+REVGRUFVTFQ8L3RleHQ+Cjwvc3ZnPg=="
                        alt="Default state card"
                        title="Default Asset"
                        content="Standard asset card in default state."
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Selected State</div>
                      <AssetCard
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI0IiBoZWlnaHQ9IjIyNCIgdmlld0JveD0iMCAwIDIyNCAyMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjQiIGhlaWdodD0iMjI0IiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjExMiIgY3k9IjExMiIgcj0iNDAiIGZpbGw9IiMyNTYzRUIiLz4KPHRleHQgeD0iMTEyIiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCI+U0VMRUNURUQ8L3RleHQ+Cjwvc3ZnPg=="
                        alt="Selected state card"
                        title="Selected Asset"
                        content="Asset card in selected state with visual indicators."
                        selectionStyle="checkbox"
                        isSelected={true}
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Drop Target</div>
                      <AssetCard
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI0IiBoZWlnaHQ9IjIyNCIgdmlld0JveD0iMCAwIDIyNCAyMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjQiIGhlaWdodD0iMjI0IiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjExMiIgY3k9IjExMiIgcj0iNDAiIGZpbGw9IiNGNDlBMjAiLz4KPHRleHQgeD0iMTEyIiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCI+RFJPUCBUSEVSRTwvdGV4dD4KPC9zdmc+"
                        alt="Drop target card"
                        title="Drop Target"
                        content="Asset card showing drop target state for drag operations."
                        isDropTarget={true}
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Focused State</div>
                      <AssetCard
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI0IiBoZWlnaHQ9IjIyNCIgdmlld0JveD0iMCAwIDIyNCAyMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjQiIGhlaWdodD0iMjI0IiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjExMiIgY3k9IjExMiIgcj0iNDAiIGZpbGw9IiMxMEI5ODEiLz4KPHRleHQgeD0iMTEyIiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCI+Rk9DVVNFRDwvdGV4dD4KPC9zdmc+"
                        alt="Focused state card"
                        title="Focused Asset"
                        content="Asset card in focused state with focus ring."
                        isFocused={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Asset Size Variants */}
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "14px" }}>Asset Size Variants</h5>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Small (150px)</div>
                      <AssetCard
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNzUiIHI9IjMwIiBmaWxsPSIjMjU2M0VCIi8+Cjx0ZXh0IHg9Ijc1IiB5PSI5NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNjAwIj5TTUFMTDwvdGV4dD4KPC9zdmc+"
                        alt="Small asset card"
                        title="Small Asset"
                        assetSize={150}
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Default (224px)</div>
                      <AssetCard
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI0IiBoZWlnaHQ9IjIyNCIgdmlld0JveD0iMCAwIDIyNCAyMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjQiIGhlaWdodD0iMjI0IiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjExMiIgY3k9IjExMiIgcj0iNDAiIGZpbGw9IiMyNTYzRUIiLz4KPHRleHQgeD0iMTEyIiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCI+REVGRUFVTFQ8L3RleHQ+Cjwvc3ZnPg=="
                        alt="Default asset card"
                        title="Default Asset"
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Large (300px)</div>
                      <AssetCard
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iNTAiIGZpbGw9IiNGNDlBMjAiLz4KPHRleHQgeD0iMTUwIiB5PSIxODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCI+TEFWR0U8L3RleHQ+Cjwvc3ZnPg=="
                        alt="Large asset card"
                        title="Large Asset"
                        assetSize={300}
                      />
                    </div>
                  </div>
                </div>

                {/* Implementation Details */}
                <div style={{ 
                  padding: "12px", 
                  backgroundColor: "var(--spectrum-background-layer-1-color, #fff)", 
                  borderRadius: "4px",
                  border: "1px solid var(--spectrum-border-color-default)"
                }}>
                  <h6 style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text)" }}>Implementation Features:</h6>
                  <ul style={{ margin: "0", paddingLeft: "16px", fontSize: "11px", color: "var(--text-muted)" }}>
                    <li>Nuclear div CSS approach for UXP compatibility with ultra-high specificity</li>
                    <li>Selection styles: checkbox, highlight, and ordered variants</li>
                    <li>State management for selected, drop target, and focused states</li>
                    <li>Custom asset size control via --spectrum-assetcard-asset-size property</li>
                    <li>Flexible content areas: title, header content, and main content</li>
                    <li>Proper semantic HTML structure with accessibility support</li>
                    <li>Focus ring and keyboard navigation for interactive elements</li>
                    <li>Container queries for responsive grid layouts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel id="tab6">
          <Gallery />
        </TabPanel>

        <TabPanel id="tab7">
          <div style={{ padding: "12px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Actions Component Ecosystem</h3>
            
            {/* ActionButton Showcase */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "16px" }}>ActionButton Component</h4>
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--text-muted)" }}>
                Official Spectrum ActionButton with all size variants, states, and modifiers based on Adobe Spectrum metadata.
              </p>
              
              {/* Size Variants */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Size Variants</h5>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <ActionButton size="xs" iconName="⚡">Extra Small</ActionButton>
                  <ActionButton size="s" iconName="🔍">Small</ActionButton>
                  <ActionButton size="m" iconName="⭐">Medium</ActionButton>
                  <ActionButton size="l" iconName="🎯">Large</ActionButton>
                  <ActionButton size="xl" iconName="🚀">Extra Large</ActionButton>
                </div>
              </div>
              
              {/* Icon Only Buttons */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Icon-Only Buttons</h5>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <ActionButton size="xs" iconName="✏️" hideLabel aria-label="Edit" />
                  <ActionButton size="s" iconName="📋" hideLabel aria-label="Copy" />
                  <ActionButton size="m" iconName="🗑️" hideLabel aria-label="Delete" />
                  <ActionButton size="l" iconName="⚙️" hideLabel aria-label="Settings" />
                  <ActionButton size="xl" iconName="🔄" hideLabel aria-label="Refresh" />
                </div>
              </div>
              
              {/* State Variants */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>State Variants</h5>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <ActionButton iconName="📁">Default</ActionButton>
                  <ActionButton iconName="📁" isSelected>Selected</ActionButton>
                  <ActionButton iconName="📁" isEmphasized isSelected>Emphasized Selected</ActionButton>
                  <ActionButton iconName="📁" isQuiet>Quiet</ActionButton>
                  <ActionButton iconName="📁" isDisabled>Disabled</ActionButton>
                </div>
              </div>
              
              {/* Hold Icon Feature */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Hold Icon Feature</h5>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-muted)" }}>
                  Hold icons indicate buttons that trigger dropdowns or additional actions.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <ActionButton iconName="📂" hasHold>Open Menu</ActionButton>
                  <ActionButton iconName="💾" hasHold>Save Options</ActionButton>
                  <ActionButton iconName="🔗" hasHold>Share Menu</ActionButton>
                </div>
              </div>
              
              {/* Static Color Variants */}
              <div style={{ marginBottom: "24px", padding: "16px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: "8px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "white", fontSize: "14px" }}>Static Color Variants (On Colored Backgrounds)</h5>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <ActionButton iconName="⚡" staticColor="white">Static White</ActionButton>
                  <ActionButton iconName="⚡" staticColor="white" isSelected>White Selected</ActionButton>
                  <ActionButton iconName="⚡" staticColor="white" isQuiet>White Quiet</ActionButton>
                </div>
              </div>
              
              <div style={{ marginBottom: "24px", padding: "16px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "black", fontSize: "14px" }}>Static Black Variants</h5>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <ActionButton iconName="⚡" staticColor="black">Static Black</ActionButton>
                  <ActionButton iconName="⚡" staticColor="black" isSelected>Black Selected</ActionButton>
                  <ActionButton iconName="⚡" staticColor="black" isQuiet>Black Quiet</ActionButton>
                </div>
              </div>
            </div>
            
            {/* ActionBar Showcase */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "16px" }}>ActionBar Component</h4>
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--text-muted)" }}>
                ActionBars are floating bars that appear upon selection for bulk actions.
              </p>
              
              {/* Standard ActionBar with ActionButtons */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Standard ActionBar with ActionButtons</h5>
                <div style={{ position: "relative", height: "80px", backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", borderRadius: "4px", padding: "16px" }}>
                  <ActionBar
                    isOpen={true}
                    selectedCount={3}
                    onClearSelection={() => console.log("Clear selection")}
                  >
                    <ActionButton iconName="✏️" size="s">Edit</ActionButton>
                    <ActionButton iconName="🔗" size="s">Share</ActionButton>
                    <ActionButton iconName="📁" size="s">Move</ActionButton>
                    <ActionButton iconName="🗑️" size="s">Delete</ActionButton>
                  </ActionBar>
                </div>
              </div>
              
              {/* Emphasized ActionBar */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Emphasized ActionBar</h5>
                <div style={{ position: "relative", height: "80px", backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", borderRadius: "4px", padding: "16px" }}>
                  <ActionBar
                    isOpen={true}
                    isEmphasized={true}
                    selectedCount={5}
                    onClearSelection={() => console.log("Clear emphasized selection")}
                  >
                    <ActionButton iconName="📁" size="s" staticColor="white">Move</ActionButton>
                    <ActionButton iconName="📋" size="s" staticColor="white">Copy</ActionButton>
                    <ActionButton iconName="🗑️" size="s" staticColor="white">Remove</ActionButton>
                  </ActionBar>
                </div>
              </div>
              
              {/* Icon-Only ActionBar */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Compact Icon-Only ActionBar</h5>
                <div style={{ position: "relative", height: "80px", backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", borderRadius: "4px", padding: "16px" }}>
                  <ActionBar
                    isOpen={true}
                    selectedCount={7}
                    onClearSelection={() => console.log("Clear icon selection")}
                  >
                    <ActionButton iconName="✏️" size="s" hideLabel aria-label="Edit" />
                    <ActionButton iconName="📋" size="s" hideLabel aria-label="Copy" />
                    <ActionButton iconName="📁" size="s" hideLabel aria-label="Move" />
                    <ActionButton iconName="🔗" size="s" hideLabel aria-label="Share" />
                    <ActionButton iconName="🗑️" size="s" hideLabel aria-label="Delete" />
                  </ActionBar>
                </div>
              </div>
            </div>
            
            {/* ActionGroup Showcase */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "16px" }}>ActionGroup Component</h4>
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--text-muted)" }}>
                ActionGroups combine related ActionButtons with shared borders and visual cohesion.
              </p>
              
              {/* Basic ActionGroup */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Basic ActionGroup</h5>
                <ActionGroup>
                  <ActionButton iconName="📋">Copy</ActionButton>
                  <ActionButton iconName="✂️">Cut</ActionButton>
                  <ActionButton iconName="📄">Paste</ActionButton>
                </ActionGroup>
              </div>
              
              {/* Size Variants */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Size Variants</h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <ActionGroup size="xs">
                    <ActionButton>XS</ActionButton>
                    <ActionButton>Edit</ActionButton>
                    <ActionButton>Delete</ActionButton>
                  </ActionGroup>
                  
                  <ActionGroup size="s">
                    <ActionButton iconName="✏️">Small</ActionButton>
                    <ActionButton iconName="👁️">View</ActionButton>
                    <ActionButton iconName="🗑️">Delete</ActionButton>
                  </ActionGroup>
                  
                  <ActionGroup size="m">
                    <ActionButton iconName="📁">Medium</ActionButton>
                    <ActionButton iconName="🔄">Refresh</ActionButton>
                    <ActionButton iconName="⚙️">Settings</ActionButton>
                  </ActionGroup>
                  
                  <ActionGroup size="l">
                    <ActionButton iconName="🎯">Large</ActionButton>
                    <ActionButton iconName="📊">Analytics</ActionButton>
                    <ActionButton iconName="🔗">Share</ActionButton>
                  </ActionGroup>
                  
                  <ActionGroup size="xl">
                    <ActionButton iconName="🚀">Extra Large</ActionButton>
                    <ActionButton iconName="💎">Premium</ActionButton>
                    <ActionButton iconName="🎨">Customize</ActionButton>
                  </ActionGroup>
                </div>
              </div>
              
              {/* Quiet ActionGroup */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Quiet ActionGroup</h5>
                <ActionGroup isQuiet>
                  <ActionButton iconName="🔤">Bold</ActionButton>
                  <ActionButton iconName="🗇">Italic</ActionButton>
                  <ActionButton iconName="🗕">Underline</ActionButton>
                </ActionGroup>
              </div>
              
              {/* Selection States */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Selection States</h5>
                <ActionGroup>
                  <ActionButton iconName="↤">Left</ActionButton>
                  <ActionButton iconName="↿" isSelected>Center</ActionButton>
                  <ActionButton iconName="↦">Right</ActionButton>
                </ActionGroup>
              </div>
              
              {/* Icon-Only ActionGroup */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Icon-Only ActionGroup</h5>
                <ActionGroup>
                  <ActionButton iconName="🔤" hideLabel aria-label="Bold" />
                  <ActionButton iconName="🗇" hideLabel aria-label="Italic" />
                  <ActionButton iconName="🗕" hideLabel aria-label="Underline" />
                  <ActionButton iconName="🔗" hideLabel aria-label="Link" />
                </ActionGroup>
              </div>
              
              {/* Mixed ActionGroup */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Mixed Content ActionGroup</h5>
                <ActionGroup>
                  <ActionButton iconName="📂">Open</ActionButton>
                  <ActionButton iconName="💾" hasHold>Save</ActionButton>
                  <ActionButton iconName="📤" hideLabel aria-label="Export" />
                  <ActionButton iconName="🔄">Refresh</ActionButton>
                </ActionGroup>
              </div>
            </div>
            
            {/* ActionMenu Showcase */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "16px" }}>ActionMenu Component</h4>
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--text-muted)" }}>
                ActionMenus provide dropdown menus using ActionButton components as menu items.
              </p>
              
              {/* Basic ActionMenu */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Basic ActionMenu</h5>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <ActionMenu triggerLabel="File Actions" iconName="📁">
                    <MenuItem iconName="📄" onPress={() => console.log('New document')}>New Document</MenuItem>
                    <MenuItem iconName="📂" onPress={() => console.log('Open folder')}>Open Folder</MenuItem>
                    <MenuItem iconName="💾" onPress={() => console.log('Save as')}>Save As...</MenuItem>
                    <MenuItem iconName="📤" onPress={() => console.log('Export')}>Export</MenuItem>
                  </ActionMenu>
                  
                  <ActionMenu triggerLabel="Edit" iconName="✏️">
                    <MenuItem iconName="📋" onPress={() => console.log('Copy')}>Copy</MenuItem>
                    <MenuItem iconName="✂️" onPress={() => console.log('Cut')}>Cut</MenuItem>
                    <MenuItem iconName="📄" onPress={() => console.log('Paste')}>Paste</MenuItem>
                    <MenuItem iconName="🔄" onPress={() => console.log('Undo')}>Undo</MenuItem>
                  </ActionMenu>
                </div>
              </div>
              
              {/* Size Variants */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Size Variants</h5>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-start" }}>
                  <ActionMenu triggerLabel="XS Menu" size="xs">
                    <MenuItem onPress={() => console.log('XS Action 1')}>Action 1</MenuItem>
                    <MenuItem onPress={() => console.log('XS Action 2')}>Action 2</MenuItem>
                  </ActionMenu>
                  
                  <ActionMenu triggerLabel="Small Menu" size="s" iconName="⚙️">
                    <MenuItem iconName="👁️" onPress={() => console.log('View')}>View</MenuItem>
                    <MenuItem iconName="✏️" onPress={() => console.log('Edit')}>Edit</MenuItem>
                    <MenuItem iconName="🗑️" onPress={() => console.log('Delete')}>Delete</MenuItem>
                  </ActionMenu>
                  
                  <ActionMenu triggerLabel="Medium Menu" size="m" iconName="🎯">
                    <MenuItem iconName="📊" onPress={() => console.log('Analytics')}>Analytics</MenuItem>
                    <MenuItem iconName="📈" onPress={() => console.log('Reports')}>Reports</MenuItem>
                    <MenuItem iconName="🔗" onPress={() => console.log('Share')}>Share</MenuItem>
                  </ActionMenu>
                  
                  <ActionMenu triggerLabel="Large Menu" size="l" iconName="🚀">
                    <MenuItem iconName="🎨" onPress={() => console.log('Customize')}>Customize</MenuItem>
                    <MenuItem iconName="⚙️" onPress={() => console.log('Settings')}>Settings</MenuItem>
                    <MenuItem iconName="📧" onPress={() => console.log('Contact')}>Contact</MenuItem>
                  </ActionMenu>
                </div>
              </div>
              
              {/* Direction Variants */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Direction Variants</h5>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <ActionMenu triggerLabel="Down" iconName="⬇️" direction="bottom">
                    <MenuItem onPress={() => console.log('Option 1')}>Option 1</MenuItem>
                    <MenuItem onPress={() => console.log('Option 2')}>Option 2</MenuItem>
                    <MenuItem onPress={() => console.log('Option 3')}>Option 3</MenuItem>
                  </ActionMenu>
                  
                  <ActionMenu triggerLabel="Up" iconName="⬆️" direction="top">
                    <MenuItem onPress={() => console.log('Up 1')}>Up 1</MenuItem>
                    <MenuItem onPress={() => console.log('Up 2')}>Up 2</MenuItem>
                  </ActionMenu>
                  
                  <ActionMenu triggerLabel="Right" iconName="➡️" direction="right">
                    <MenuItem onPress={() => console.log('Right 1')}>Right 1</MenuItem>
                    <MenuItem onPress={() => console.log('Right 2')}>Right 2</MenuItem>
                  </ActionMenu>
                </div>
              </div>
              
              {/* Icon-Only ActionMenu */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Icon-Only ActionMenu</h5>
                <ActionMenu iconName="⋯" hideLabel aria-label="More options">
                  <MenuItem iconName="📋" onPress={() => console.log('Copy item')}>Copy</MenuItem>
                  <MenuItem iconName="🔗" onPress={() => console.log('Share item')}>Share</MenuItem>
                  <MenuItem iconName="✏️" onPress={() => console.log('Edit item')}>Edit</MenuItem>
                  <MenuItem iconName="🗑️" onPress={() => console.log('Delete item')}>Delete</MenuItem>
                </ActionMenu>
              </div>
              
              {/* Quiet ActionMenu */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Quiet ActionMenu</h5>
                <ActionMenu triggerLabel="Quiet Menu" iconName="🔧" isQuiet>
                  <MenuItem iconName="🔧" onPress={() => console.log('Tool 1')}>Tool 1</MenuItem>
                  <MenuItem iconName="⚙️" onPress={() => console.log('Tool 2')}>Tool 2</MenuItem>
                  <MenuItem iconName="🎯" onPress={() => console.log('Tool 3')}>Tool 3</MenuItem>
                </ActionMenu>
              </div>
              
              {/* Menu with Descriptions */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Menu with Descriptions</h5>
                <ActionMenu triggerLabel="Export Options" iconName="📤">
                  <MenuItem iconName="⚡" description="Share a snapshot" onPress={() => console.log('Quick export')}>Quick export</MenuItem>
                  <MenuItem iconName="📱" description="Illustrator for iPad" onPress={() => console.log('Open a copy')}>Open a copy</MenuItem>
                  <MenuItem iconName="🔗" description="Enable comments and download" isDisabled onPress={() => console.log('Share link')}>Share link</MenuItem>
                </ActionMenu>
              </div>
              
              {/* Menu with States */}
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "14px" }}>Menu with States</h5>
                <ActionMenu triggerLabel="Document Actions" iconName="📄">
                  <MenuItem iconName="✂️" onPress={() => console.log('Cut')}>Cut</MenuItem>
                  <MenuItem iconName="📋" isSelected onPress={() => console.log('Copy')}>Copy</MenuItem>
                  <MenuItem iconName="📄" isDisabled onPress={() => console.log('Paste')}>Paste</MenuItem>
                  <MenuItem iconName="🔄" onPress={() => console.log('Undo')}>Undo</MenuItem>
                </ActionMenu>
              </div>
            </div>

            {/* Interactive Demo */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "16px" }}>Interactive Demo</h4>
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--text-muted)" }}>
                Click ActionButtons to see their interactive states:
              </p>
              
              <div style={{ display: "flex", gap: "12px", padding: "16px", backgroundColor: "var(--spectrum-background-layer-2-color, #f9fafb)", borderRadius: "8px", flexWrap: "wrap" }}>
                <ActionButton 
                  iconName="❤️" 
                  onPress={(e) => {
                    const button = e.target as HTMLElement;
                    const parent = button.closest('[role="button"]') as HTMLElement;
                    if (parent) {
                      parent.classList.toggle('is-selected');
                      console.log('Like toggled!');
                    }
                  }}
                >
                  Like
                </ActionButton>
                
                <ActionButton 
                  iconName="⭐" 
                  onPress={(e) => {
                    const button = e.target as HTMLElement;
                    const parent = button.closest('[role="button"]') as HTMLElement;
                    if (parent) {
                      parent.classList.toggle('is-selected');
                      console.log('Favorite toggled!');
                    }
                  }}
                >
                  Favorite
                </ActionButton>
                
                <ActionButton 
                  iconName="🔖" 
                  onPress={(e) => {
                    const button = e.target as HTMLElement;
                    const parent = button.closest('[role="button"]') as HTMLElement;
                    if (parent) {
                      parent.classList.toggle('is-selected');
                      console.log('Bookmark toggled!');
                    }
                  }}
                >
                  Bookmark
                </ActionButton>
                
                <ActionButton 
                  iconName="🔔" 
                  hasHold 
                  onPress={() => {
                    alert('Notification settings menu would open here!');
                  }}
                >
                  Notifications
                </ActionButton>
              </div>
            </div>
            
            <div style={{ fontSize: "12px", color: "var(--text-disabled)" }}>
              <p><strong>Actions Ecosystem Features:</strong></p>
              <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                <li><strong>ActionButton:</strong> Official Spectrum implementation with all size variants (xs, s, m, l, xl)</li>
                <li><strong>ActionGroup:</strong> Cohesive grouping of ActionButtons with shared borders and size inheritance</li>
                <li><strong>ActionMenu:</strong> Dropdown menus using MenuItem components for proper semantic structure</li>
                <li><strong>MenuItem:</strong> Official Spectrum menu items with li elements, icons, descriptions, and states</li>
                <li><strong>State Management:</strong> Default, selected, emphasized, quiet, and disabled states</li>
                <li><strong>Icon Support:</strong> Full workflow icon integration with optional hold indicators</li>
                <li><strong>Static Colors:</strong> White and black variants for colored backgrounds</li>
                <li><strong>Accessibility:</strong> Full ARIA support with role="button" and proper labeling</li>
                <li><strong>ActionBar Integration:</strong> Floating toolbars for bulk selection workflows</li>
                <li><strong>UXP Optimized:</strong> Nuclear div approach with ultra-high specificity</li>
                <li><strong>Performance:</strong> Lightweight implementation based on official Spectrum metadata</li>
              </ul>
            </div>
          </div>
        </TabPanel>

        <TabPanel id="tab8">
          <div style={{ padding: "12px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Card Component Showcase</h3>
            
            {/* Card Component Introduction */}
            <div style={{ marginBottom: "32px" }}>
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--text-muted)" }}>
                Official Spectrum Card component with all variants, states, and sub-elements based on Adobe Spectrum metadata.
              </p>
              
              {/* Standard Card Examples */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ margin: "0 0 16px 0", color: "var(--text)", fontSize: "16px" }}>Standard Card Variants</h4>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                  {/* Standard Card with Cover Photo */}
                  <Card
                    title="Sample Design File"
                    subtitle="Adobe Photoshop"
                    description="A beautiful design showcasing modern UI patterns and color schemes."
                    footer="Last modified: 2 hours ago"
                    hasActions={true}
                    hasQuickActions={true}
                    coverPhoto="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI4MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxyZWN0IHg9IjgwIiB5PSI0MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4MCIgcng9IjgiIGZpbGw9IiMyNTYzRUIiLz4KPHN2ZyB4PSI5MCIgeT0iNTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAxMDAgNjAiIGZpbGw9Im5vbmUiPgo8cGF0aCBkPSJNMjAgMzBIMzBWNDBIMjBWMzBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAgMjBINTBWNDBINDBWMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNjAgMjVINzBWNDBINjBWMjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+"
                    actions={
                      <ActionButton size="m" isQuiet>
                        <svg width="18" height="18" viewBox="0 0 18 18">
                          <circle cx="3" cy="9" r="1.5" fill="currentColor"/>
                          <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
                          <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
                        </svg>
                      </ActionButton>
                    }
                    quickActions={
                      <div style={{ 
                        width: "20px", 
                        height: "20px", 
                        border: "2px solid white", 
                        borderRadius: "4px", 
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        cursor: "pointer"
                      }} />
                    }
                    onPress={() => console.log('Card pressed!')}
                  />

                  {/* Gallery Card */}
                  <Card
                    variant="gallery"
                    title="Product Photography"
                    description="High-resolution product images for e-commerce."
                    isSelected={true}
                    hasActions={true}
                    coverPhoto="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI4MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRkY2QjZCIi8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwLjgiLz4KPHN2ZyB4PSIxMjAiIHk9IjYwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAxMEM3IDEwIDcgMzAgMjAgMzBTMzMgMjcgMzMgMjBTMjcgMTAgMjAgMTBaIiBmaWxsPSIjRkY2QjZCIi8+Cjwvdmc+Cjwvc3ZnPg=="
                    actions={
                      <ActionButton size="m" isQuiet>
                        <svg width="18" height="18" viewBox="0 0 18 18">
                          <circle cx="3" cy="9" r="1.5" fill="currentColor"/>
                          <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
                          <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
                        </svg>
                      </ActionButton>
                    }
                    footer="Gallery • 24 items"
                  />

                  {/* Quiet Card */}
                  <Card
                    variant="quiet"
                    title="Sketch File"
                    subtitle="Design System"
                    description="Component library and design tokens."
                    hasQuickActions={true}
                    quickActions={
                      <div style={{ 
                        width: "20px", 
                        height: "20px", 
                        border: "2px solid #2563eb", 
                        borderRadius: "4px", 
                        backgroundColor: "#2563eb",
                        cursor: "pointer"
                      }} />
                    }
                  />
                </div>
              </div>

              {/* Horizontal Card Layout */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ margin: "0 0 16px 0", color: "var(--text)", fontSize: "16px" }}>Horizontal Layout Cards</h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  <Card
                    variant="horizontal"
                    title="Video Project"
                    subtitle="Adobe Premiere Pro"
                    description="Documentary footage with color grading and effects."
                    footer="Duration: 2:45:30"
                    hasActions={true}
                    coverPhoto="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEyMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNjM2NkYxIi8+Cjxwb2x5Z29uIHBvaW50cz0iNDUsNDAgNzUsNTUgNDUsNzAiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg=="
                    actions={
                      <ActionGroup>
                        <ActionButton size="m" isQuiet>
                          <svg width="18" height="18" viewBox="0 0 18 18">
                            <path d="M5 6L11 9L5 12V6Z" fill="currentColor"/>
                          </svg>
                        </ActionButton>
                        <ActionButton size="m" isQuiet>
                          <svg width="18" height="18" viewBox="0 0 18 18">
                            <circle cx="3" cy="9" r="1.5" fill="currentColor"/>
                            <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
                            <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
                          </svg>
                        </ActionButton>
                      </ActionGroup>
                    }
                  />

                  <Card
                    variant="horizontal"
                    title="Audio Recording"
                    subtitle="Adobe Audition"
                    description="Podcast episode with noise reduction and mastering."
                    isDropTarget={true}
                    coverPhoto="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEyMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMTBCOTgxIi8+CjxyZWN0IHg9IjQwIiB5PSI2MCIgd2lkdGg9IjQiIGhlaWdodD0iMjAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjUwIiB5PSI0MCIgd2lkdGg9IjQiIGhlaWdodD0iNDAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjYwIiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iNjAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjcwIiB5PSI1MCIgd2lkdGg9IjQiIGhlaWdodD0iMzAiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg=="
                  />
                </div>
              </div>

              {/* Card States Showcase */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ margin: "0 0 16px 0", color: "var(--text)", fontSize: "16px" }}>Card States & Interactions</h4>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                  <Card
                    title="Default State"
                    description="Hover to see actions appear"
                    hasActions={true}
                    actions={
                      <ActionButton size="m" isQuiet>Edit</ActionButton>
                    }
                  />

                  <Card
                    title="Selected State"
                    description="This card is currently selected"
                    isSelected={true}
                    hasActions={true}
                    actions={
                      <ActionButton size="m" isQuiet>Selected</ActionButton>
                    }
                  />

                  <Card
                    title="Focused State"
                    description="Focus ring visible around card"
                    isFocused={true}
                    hasActions={true}
                    actions={
                      <ActionButton size="m" isQuiet>Focused</ActionButton>
                    }
                  />

                  <Card
                    title="Drop Target"
                    description="Drag files here to upload"
                    isDropTarget={true}
                    hasQuickActions={true}
                    quickActions={
                      <div style={{ 
                        width: "24px", 
                        height: "24px", 
                        border: "2px dashed #2563eb", 
                        borderRadius: "6px", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2563eb",
                        fontSize: "12px"
                      }}>
                        +
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Feature Summary */}
              <div style={{ marginTop: "32px", padding: "16px", backgroundColor: "var(--background-alt)", borderRadius: "8px" }}>
                <p><strong>Card Component Features:</strong></p>
                <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                  <li><strong>Variants:</strong> Gallery, Quiet, and Horizontal layout options</li>
                  <li><strong>Sub-elements:</strong> Cover photo, title, subtitle, description, footer, actions, quick actions</li>
                  <li><strong>States:</strong> Default, selected, focused, drop target, and hover states</li>
                  <li><strong>Interactive:</strong> Click handlers, action buttons, selection controls</li>
                  <li><strong>Responsive:</strong> Container queries and flexible grid layouts</li>
                  <li><strong>Accessibility:</strong> Proper ARIA roles, focus management, and semantic structure</li>
                  <li><strong>Dark Theme:</strong> Full dark mode support with automatic detection</li>
                  <li><strong>UXP Optimized:</strong> Nuclear div approach with ultra-high specificity CSS</li>
                </ul>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel id="tab9">
          <div style={{ padding: "12px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Checkboxes</h3>
            <p style={{ marginBottom: "24px", color: "var(--text)" }}>
              Hybrid checkbox components following official Spectrum patterns with enhanced UXP compatibility.
            </p>

            {/* Basic Checkboxes */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Basic Checkboxes</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Checkbox>Basic checkbox</Checkbox>
                <Checkbox isSelected>Pre-checked checkbox</Checkbox>
                <Checkbox isIndeterminate>Indeterminate checkbox</Checkbox>
                <Checkbox isDisabled>Disabled checkbox</Checkbox>
                <Checkbox isDisabled isSelected>Disabled checked</Checkbox>
              </div>
            </div>

            {/* Size Variants */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Size Variants</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Checkbox size="s">Small checkbox</Checkbox>
                <Checkbox size="m">Medium checkbox (default)</Checkbox>
                <Checkbox size="l">Large checkbox</Checkbox>
                <Checkbox size="xl">Extra large checkbox</Checkbox>
              </div>
            </div>

            {/* States Demo */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Interactive States</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Checkbox>Hover over me</Checkbox>
                <Checkbox>Focus me with Tab</Checkbox>
                <Checkbox isSelected>Check/uncheck me</Checkbox>
                <Checkbox isIndeterminate>Click to clear indeterminate</Checkbox>
              </div>
            </div>

            {/* Validation States */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Validation States</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Checkbox isInvalid>Invalid checkbox</Checkbox>
                <Checkbox isInvalid isSelected>Invalid checked</Checkbox>
                <Checkbox isInvalid isIndeterminate>Invalid indeterminate</Checkbox>
              </div>
            </div>

            {/* Emphasized Variant */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Emphasized Variant</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Checkbox isEmphasized>Emphasized checkbox</Checkbox>
                <Checkbox isEmphasized isSelected>Emphasized checked</Checkbox>
                <Checkbox isEmphasized isIndeterminate>Emphasized indeterminate</Checkbox>
              </div>
            </div>

            {/* Read-only State */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Read-only</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Checkbox isReadOnly>Read-only unchecked</Checkbox>
                <Checkbox isReadOnly isSelected>Read-only checked</Checkbox>
                <Checkbox isReadOnly isIndeterminate>Read-only indeterminate</Checkbox>
              </div>
            </div>

            {/* All Size + State Combinations */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Size + State Matrix</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div>
                  <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "12px" }}>Small</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Checkbox size="s">Unchecked</Checkbox>
                    <Checkbox size="s" isSelected>Checked</Checkbox>
                    <Checkbox size="s" isIndeterminate>Indeterminate</Checkbox>
                  </div>
                </div>
                <div>
                  <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "12px" }}>Medium</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Checkbox size="m">Unchecked</Checkbox>
                    <Checkbox size="m" isSelected>Checked</Checkbox>
                    <Checkbox size="m" isIndeterminate>Indeterminate</Checkbox>
                  </div>
                </div>
                <div>
                  <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "12px" }}>Large</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Checkbox size="l">Unchecked</Checkbox>
                    <Checkbox size="l" isSelected>Checked</Checkbox>
                    <Checkbox size="l" isIndeterminate>Indeterminate</Checkbox>
                  </div>
                </div>
                <div>
                  <h5 style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "12px" }}>Extra Large</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Checkbox size="xl">Unchecked</Checkbox>
                    <Checkbox size="xl" isSelected>Checked</Checkbox>
                    <Checkbox size="xl" isIndeterminate>Indeterminate</Checkbox>
                  </div>
                </div>
              </div>
            </div>

            {/* Long Text */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Long Text Handling</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
                <Checkbox>
                  This is a very long checkbox label that should wrap nicely and demonstrate how the 
                  checkbox component handles multi-line text content while maintaining proper alignment 
                  and spacing.
                </Checkbox>
                <Checkbox isSelected>
                  Another long label that shows the checked state with extensive text that wraps to 
                  multiple lines and tests the layout stability of the checkbox component.
                </Checkbox>
              </div>
            </div>

            {/* Implementation Notes */}
            <div style={{ 
              padding: "16px", 
              backgroundColor: "var(--spectrum-global-color-gray-100)", 
              borderRadius: "4px",
              marginTop: "24px"
            }}>
              <h4 style={{ margin: "0 0 12px 0", color: "var(--text)" }}>Implementation Notes</h4>
              <ul style={{ margin: "0", paddingLeft: "20px", color: "var(--text)", fontSize: "14px" }}>
                <li><strong>Nuclear Div Approach:</strong> Ultra-high specificity CSS overrides UXP resets</li>
                <li><strong>Accessibility:</strong> Full keyboard navigation and screen reader support</li>
                <li><strong>States:</strong> Supports checked, unchecked, indeterminate, disabled, invalid</li>
                <li><strong>Sizes:</strong> S (12px), M (16px), L (20px), XL (24px) control sizes</li>
                <li><strong>Icons:</strong> SVG icons with CSS fallbacks for maximum compatibility</li>
                <li><strong>Focus Management:</strong> React Aria focus handling without state dependencies</li>
              </ul>
            </div>
          </div>
        </TabPanel>

        <TabPanel id="tab10">
          <div style={{ padding: "12px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Typography</h3>
            <p style={{ marginBottom: "24px", color: "var(--text)" }}>
              Complete Spectrum Typography system with all text styles, sizes, and semantic elements.
            </p>

            {/* Typography Container Demo */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Typography Container</h4>
              <div style={{ border: "1px solid var(--spectrum-border-color-default)", borderRadius: "4px", padding: "16px" }}>
                <Typography>
                  <Heading size="m" level={2}>Aliquet mauris eu</Heading>
                  
                  <Body size="m">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend est mollis ligula lobortis, 
                    tempus ultricies sapien lacinia. Nulla ut turpis velit. Sed finibus dapibus diam et sollicitudin. 
                    Phasellus in ipsum nec ante elementum congue eget in leo. Morbi eleifend justo non rutrum venenatis. 
                    Fusce cursus et lectus eu facilisis. Ut laoreet felis in magna dignissim feugiat.
                  </Body>
                  
                  <Body size="m">
                    <Emphasized>
                      Ut et lectus finibus, aliquet mauris eu, tincidunt mi. Donec scelerisque orci sit amet venenatis luctus. 
                      Morbi eget lacus est. Duis iaculis magna quis aliquam lacinia. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Emphasized>
                  </Body>
                  
                  <Code size="m">console.log('Hello World!');</Code>
                  
                  <Detail size="m">Aliquet mauris eu</Detail>
                  
                  <Body size="m">
                    Ut et lectus finibus, aliquet mauris eu, tincidunt mi. Donec scelerisque orci sit amet venenatis luctus. 
                    Morbi eget lacus est. Duis iaculis magna quis aliquam lacinia. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Body>
                </Typography>
              </div>
            </div>

            {/* Heading Variants */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Heading Sizes</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Heading size="xs" level={6}>Extra Small Heading (xs)</Heading>
                <Heading size="s" level={5}>Small Heading (s)</Heading>
                <Heading size="m" level={4}>Medium Heading (m)</Heading>
                <Heading size="l" level={3}>Large Heading (l)</Heading>
                <Heading size="xl" level={2}>Extra Large Heading (xl)</Heading>
                <Heading size="xxl" level={1}>Extra Extra Large Heading (xxl)</Heading>
              </div>
            </div>

            {/* Body Text Variants */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Body Text Sizes</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Body size="xs">Extra Small body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Body>
                <Body size="s">Small body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Body>
                <Body size="m">Medium body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Body>
                <Body size="l">Large body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Body>
                <Body size="xl">Extra Large body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Body>
              </div>
            </div>

            {/* Text Styling Variants */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Text Styling</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Body size="m">Regular text with <Strong>strong text</Strong> and <Emphasized>emphasized text</Emphasized>.</Body>
                <Body size="m">Combined <Strong emphasized>strong emphasized text</Strong> in body content.</Body>
                <Body size="m" emphasized>Entirely emphasized paragraph text.</Body>
                <Body size="m" strong>Entirely strong paragraph text.</Body>
                <Body size="m" serif>Serif body text for better readability in longer content.</Body>
                <Body size="m" as="div">Body text as div element instead of paragraph.</Body>
              </div>
            </div>

            {/* Code Examples */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Code Blocks</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--text)" }}>Inline code:</p>
                  <Body size="m">Use the <Code size="s">useState</Code> hook for state management.</Body>
                </div>
                
                <div>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--text)" }}>Code block:</p>
                  <Code size="m" inline={false}>
{`function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`}
                  </Code>
                </div>
                
                <div>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--text)" }}>Code sizes:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Code size="xs">Extra small code</Code>
                    <Code size="s">Small code</Code>
                    <Code size="m">Medium code</Code>
                    <Code size="l">Large code</Code>
                    <Code size="xl">Extra large code</Code>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Text Examples */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Detail Text</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Detail size="xs">EXTRA SMALL DETAIL</Detail>
                <Detail size="s">SMALL DETAIL</Detail>
                <Detail size="m">MEDIUM DETAIL</Detail>
                <Detail size="l">LARGE DETAIL</Detail>
                <Detail size="xl">EXTRA LARGE DETAIL</Detail>
                <div>
                  <Detail size="s">CATEGORY LABEL</Detail>
                  <Body size="m">Associated content with the detail label above.</Body>
                </div>
              </div>
            </div>

            {/* Real-world Examples */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Real-world Content</h4>
              
              <Typography>
                <Detail size="s">BLOG POST</Detail>
                <Heading size="l" level={1}>The Future of Design Systems</Heading>
                <Detail size="s">MARCH 15, 2024 • 5 MIN READ</Detail>
                
                <Body size="m">
                  Design systems have evolved significantly over the past decade. What started as simple style guides 
                  have transformed into comprehensive ecosystems that enable <Strong>consistent, scalable design</Strong> 
                  across organizations.
                </Body>
                
                <Heading size="m" level={2}>Key Components</Heading>
                
                <Body size="m">
                  Modern design systems typically include:
                </Body>
                
                <Body size="s" as="ul" style={{ paddingLeft: "20px", listStyle: "disc" }}>
                  <li>Design tokens for consistent styling</li>
                  <li>Component libraries with documentation</li>
                  <li>Guidelines for accessibility and usage</li>
                  <li>Tools for design and development workflows</li>
                </Body>
                
                <Body size="m">
                  <Emphasized>
                    The most successful design systems are those that balance flexibility with consistency, 
                    allowing teams to move quickly while maintaining quality standards.
                  </Emphasized>
                </Body>
                
                <Body size="m">
                  Implementation often involves tools like <Code>React</Code>, <Code>Vue</Code>, or <Code>Angular</Code> 
                  for component development, paired with design tools like <Code>Figma</Code> or <Code>Sketch</Code>.
                </Body>
              </Typography>
            </div>

            {/* Mixed Content Example */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Technical Documentation</h4>
              
              <Typography>
                <Heading size="m" level={2}>API Reference</Heading>
                
                <Body size="m">
                  The <Code>Typography</Code> component accepts the following props:
                </Body>
                
                <Code size="s" inline={false}>
{`interface TypographyProps {
  children?: ReactNode;
  className?: string;
  lang?: string;
}`}
                </Code>
                
                <Detail size="s">PARAMETERS</Detail>
                
                <Body size="s">
                  <Strong>children</Strong> - The content to render within the typography container<br/>
                  <Strong>className</Strong> - Additional CSS classes to apply<br/>
                  <Strong>lang</Strong> - Language attribute for accessibility and styling
                </Body>
                
                <Detail size="s">EXAMPLE USAGE</Detail>
                
                <Code size="s" inline={false}>
{`<Typography lang="en-US">
  <Heading size="l">Page Title</Heading>
  <Body size="m">Content goes here...</Body>
</Typography>`}
                </Code>
              </Typography>
            </div>

            {/* Implementation Notes */}
            <div style={{ 
              padding: "16px", 
              backgroundColor: "var(--spectrum-global-color-gray-100)", 
              borderRadius: "4px",
              marginTop: "24px"
            }}>
              <h4 style={{ margin: "0 0 12px 0", color: "var(--text)" }}>Implementation Notes</h4>
              <ul style={{ margin: "0", paddingLeft: "20px", color: "var(--text)", fontSize: "14px" }}>
                <li><strong>Semantic HTML:</strong> Uses proper heading levels (h1-h6) and semantic elements</li>
                <li><strong>Nuclear CSS:</strong> Ultra-high specificity overrides for UXP compatibility</li>
                <li><strong>Size System:</strong> xs, s, m, l, xl, xxl sizes matching Spectrum specifications</li>
                <li><strong>Text Styles:</strong> Emphasized (italic), Strong (bold), and combinations</li>
                <li><strong>Typography Container:</strong> Provides consistent spacing and language context</li>
                <li><strong>Accessibility:</strong> Proper semantic structure and ARIA support</li>
                <li><strong>Font Families:</strong> Sans-serif default, serif variant, monospace for code</li>
                <li><strong>Responsive:</strong> Container queries for mobile-friendly scaling</li>
              </ul>
            </div>
          </div>
        </TabPanel>

        <TabPanel id="tab11">
          <div style={{ padding: "12px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--text)" }}>Progress Circles</h3>
            <p style={{ marginBottom: "24px", color: "var(--text)" }}>
              Progress circle components have been removed.
            </p>
          </div>
        </TabPanel>
      </Tabs>
      </div>
    </div>
  );
};

console.log("=== ABOUT TO FIND ROOT ELEMENT ===");
const rootElement = document.getElementById("root");
console.log("Root element found:", !!rootElement);

if (rootElement) {
  console.log("=== CREATING REACT ROOT ===");
  const root = createRoot(rootElement);
  console.log("=== RENDERING APP ===");
  root.render(
    <React.StrictMode>
      <UxpProvider>
        <App />
      </UxpProvider>
    </React.StrictMode>
  );
  console.log("=== RENDER COMPLETE ===");
} else {
  console.error("NO ROOT ELEMENT FOUND!");
}

console.log("Main.tsx loaded successfully!");