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
import { Tabs, TabList, Tab, TabPanel } from "./components/Tabs";
import { usePluginStore } from "./store/usePluginStore";
import { Form } from "./components/Form";

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
    <div style={{ 
      padding: "12px", 
      display: "block",
      background: "var(--bg)", 
      color: "var(--text)", 
      minHeight: "200px",
      fontFamily: "system-ui, sans-serif",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <div style={{ 
        opacity: 0.8, 
        fontSize: "14px", 
        marginBottom: "12px",
        color: "var(--text-muted)"
      }}>
        Host: {host.name} {host.version}
        <br />
        Environment: {isInUxp ? 'UXP' : 'Web Browser'}
        <br />
        Theme: {theme}
        <br />
        UXP Object: {typeof (globalThis as any).uxp}
      </div>
      


      <Tabs defaultSelectedKey="tab1" style={{ marginBottom: "12px" }} size="m" emphasized>
        <TabList>
          <Tab id="tab1">Settings</Tab>
          <Tab id="tab2">Files</Tab>
          <Tab id="tab3">Form Demo</Tab>
          <Tab id="tab4">About</Tab>
          <Tab id="tab5">Login</Tab>
          <Tab id="tab6">Gallery</Tab>
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
      </Tabs>
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