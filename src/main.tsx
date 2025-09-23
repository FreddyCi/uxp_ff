import { Login } from "./features/Login";
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
import { Tabs, TabList, Tab, TabPanel } from "./components/Tabs";
import { usePluginStore } from "./store/usePluginStore";


const App: React.FC = () => {
  const { host, fs, panelId, theme, setTheme } = useUxp();
  
  // Zustand state management
  const { 
    lastSavedFile, 
    recentFiles, 
    isDarkMode, 
    fileFormat,
    setLastSavedFile,
    addRecentFile,
    toggleDarkMode,
    setFileFormat,
    clearRecentFiles
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
  if (panelId === 'login-panel') return <Login />;
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
          <Tab id="tab5">Login</Tab>
          <Tab id="tab6">Gallery</Tab>
          <Tab id="tab7">Actions</Tab>
          <Tab id="tab8">Cards</Tab>
          <Tab id="tab9">Checkboxes</Tab>
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
          <Login />
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