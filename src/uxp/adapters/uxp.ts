import type { UxpBridge } from "../Bridge";

type UxpGlobal = {
  storage?: any;
  dialog?: { showSaveDialog(o: any): Promise<{ path?: string } | null>; alert(o: { title: string; message: string; okText?: string }): Promise<void>; };
  dialogs?: { showSaveDialog(o: any): Promise<{ path?: string } | null>; alert(o: { title: string; message: string; okText?: string }): Promise<void>; };
  io?: { readFile(p: string, o?: { format?: "utf8" | "binary" }): Promise<any>; writeFile(p: string, d: any): Promise<void>; mkdirp(p: string): Promise<void>; exists(p: string): Promise<boolean>; };
  shell: { openExternal(u: string): Promise<void> };
  host?: { name?: string; version?: string };
};

export const createUxpAdapter = (): UxpBridge => {
  // Try to find UXP object from multiple sources
  let uxpObject: UxpGlobal | null = null;
  
  // Try globalThis.uxp first
  if ((globalThis as any).uxp) {
    uxpObject = (globalThis as any).uxp as UxpGlobal;
    console.log('UXP found at globalThis.uxp');
  }
  // Try window.uxp
  else if (typeof window !== 'undefined' && (window as any).uxp) {
    uxpObject = (window as any).uxp as UxpGlobal;
    console.log('UXP found at window.uxp');
  }
  // Try require('uxp')
  else if (typeof (globalThis as any).require === 'function') {
    try {
      uxpObject = (globalThis as any).require('uxp') as UxpGlobal;
      console.log('UXP found via require("uxp")');
    } catch (e) {
      console.log('Cannot require uxp:', e);
    }
  }
  
  if (!uxpObject) {
    console.error('UXP object not found! Available globals:', Object.keys(globalThis));
    console.error('Document keys:', Object.keys(document || {}));
    throw new Error('UXP object not accessible - cannot create UXP adapter');
  }
  
  const u = uxpObject;
  console.log('UXP object structure:', {
    hasIo: !!u.io,
    hasDialog: !!u.dialog,
    hasDialogs: !!u.dialogs,
    hasStorage: !!u.storage,
    hasShell: !!u.shell,
    hasHost: !!u.host
  });
  
  // Log the actual UXP object to understand its structure
  console.log('Full UXP object:', u);
  console.log('UXP keys:', Object.keys(u));
  
  if (u.storage) {
    console.log('UXP.storage keys:', Object.keys(u.storage));
    console.log('UXP.storage.localFileSystem:', u.storage.localFileSystem);
    if (u.storage.localFileSystem) {
      console.log('localFileSystem keys:', Object.keys(u.storage.localFileSystem));
    }
  }
  if (u.dialog) {
    console.log('UXP.dialog keys:', Object.keys(u.dialog));
    console.log('UXP.dialog type:', typeof u.dialog);
    console.log('UXP.dialog value:', u.dialog);
    // Check if it's a function or object with methods
    if (typeof u.dialog === 'function') {
      console.log('UXP.dialog is a function');
    } else if (typeof u.dialog === 'object') {
      console.log('UXP.dialog methods:', Object.getOwnPropertyNames(u.dialog));
    }
  }
  if (u.dialogs) {
    console.log('UXP.dialogs keys:', Object.keys(u.dialogs));
  } else {
    console.log('UXP.dialogs is missing - will use u.dialog if available');
  }
  
  return {
    fs: {
      async read(p, encoding = "utf8") { 
        if (u.io) {
          return u.io.readFile(p, { format: encoding });
        } else if (u.storage) {
          console.log('Using UXP.storage for read');
          // Try storage API - this might be different
          throw new Error('UXP.storage read not implemented yet');
        } else {
          throw new Error('No UXP file API available (checked io, storage)');
        }
      },
      async write(p, data) { 
        if (u.io) {
          await u.io.writeFile(p, data);
        } else if (u.storage) {
          console.log('Using UXP.storage for write');
          throw new Error('UXP.storage write not implemented yet');
        } else {
          throw new Error('No UXP file API available (checked io, storage)');
        }
      },
      async mkdirp(p) { 
        if (u.io) {
          await u.io.mkdirp(p);
        } else {
          throw new Error('UXP.io not available for mkdirp');
        }
      },
      async exists(p) { 
        if (u.io) {
          return u.io.exists(p);
        } else {
          throw new Error('UXP.io not available for exists');
        }
      },
      async showSaveDialog(opts) { 
        // Try dialog (singular) first, then dialogs (plural)
        const dialogAPI = u.dialog || u.dialogs;
        
        if (dialogAPI) {
          console.log('Using UXP dialog API for save dialog');
          console.log('Dialog API type:', typeof dialogAPI);
          
          // Check if it's a function/class (like UXP dialog class)
          if (typeof dialogAPI === 'function') {
            try {
              console.log('Calling dialog class methods');
              
              // Try showSaveDialog method
              if ((dialogAPI as any).showSaveDialog) {
                console.log('Found showSaveDialog method');
                const res = await (dialogAPI as any).showSaveDialog({
                  defaultPath: opts.suggestedName,
                  title: 'Save File',
                  buttonLabel: 'Save',
                  filters: ['.txt', '.json', '.md'] // No wildcards, specific extensions
                });
                return res?.path ?? null;
              }
              
              // Try showOpenDialog with save mode
              if ((dialogAPI as any).showOpenDialog) {
                console.log('Using showOpenDialog for save (might work)');
                const res = await (dialogAPI as any).showOpenDialog({
                  defaultPath: opts.suggestedName,
                  title: 'Save File',
                  buttonLabel: 'Save'
                });
                return res?.path ?? null;
              }
              
              console.log('Available dialog methods:', Object.getOwnPropertyNames(dialogAPI));
              console.log('Available dialog prototype methods:', Object.getOwnPropertyNames((dialogAPI as any).prototype || {}));
              
            } catch (e: any) {
              console.error('Dialog class method call failed:', e?.message || e);
            }
          }
          
          // Check if it has showSaveDialog method
          if ((dialogAPI as any).showSaveDialog) {
            try {
              console.log('Calling dialogAPI.showSaveDialog');
              const res = await (dialogAPI as any).showSaveDialog(opts); 
              return res?.path ?? null;
            } catch (e: any) {
              console.error('dialogAPI.showSaveDialog failed:', e?.message || e);
            }
          }
          
          console.log('Available dialog methods:', Object.getOwnPropertyNames(dialogAPI));
        }
        
        // Try UXP storage file picker if available
        if (u.storage && (u.storage as any).localFileSystem) {
          try {
            console.log('Trying UXP storage file picker');
            const fs = (u.storage as any).localFileSystem;
            if (fs.getFileForSaving) {
              const file = await fs.getFileForSaving(opts.suggestedName);
              return file?.nativePath || file?.name || null;
            }
          } catch (e: any) {
            console.error('UXP storage file picker failed:', e?.message || e);
          }
        }
        
        console.warn('No UXP dialog API available - falling back to web API');
        try {
          const handle = await (window as any).showSaveFilePicker?.({
            suggestedName: opts.suggestedName,
            types: opts.types
          });
          return handle?.name || null;
        } catch (e) {
          console.warn('Web file API also failed:', e);
          return null;
        }
      }
    },
    shell: { 
      async openExternal(url) { 
        if (u.shell && u.shell.openExternal) {
          await u.shell.openExternal(url); 
        } else {
          console.warn('UXP.shell.openExternal not available');
          throw new Error('UXP.shell.openExternal not available');
        }
      } 
    },
    host: { 
      name: u.host?.name ?? "unknown", 
      version: u.host?.version ?? "0.0.0", 
      async showModal({ title, message, okText = "OK" }) { 
        const dialogAPI = u.dialog || u.dialogs;
        if (dialogAPI && dialogAPI.alert) {
          await dialogAPI.alert({ title, message, okText }); 
        } else {
          console.warn('No UXP dialog API available - using window.alert');
          window.alert(`${title}: ${message}`);
        }
      } 
    },
    panelId: (u as any).entrypoints?.getCurrentPanel?.()?.id ?? "unknown-panel"
  };
};