export type UxpFS = {
  read(path: string, encoding?: "utf8" | "binary"): Promise<string | ArrayBuffer>;
  write(path: string, data: string | ArrayBuffer): Promise<void>;
  mkdirp(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  showSaveDialog(opts: { suggestedName?: string; types?: { description: string; accept: string[] }[] }): Promise<string | null>;
};
export type UxpShell = { openExternal(url: string): Promise<void> };
export type UxpHost = { name: string; version: string; showModal(opts: { title: string; message: string; okText?: string }): Promise<void> };
export interface UxpBridge { fs: UxpFS; shell: UxpShell; host: UxpHost; panelId: string; }
export const isUxp = () => {
  // Primary check for UXP global
  if (typeof (globalThis as any).uxp !== "undefined") {
    return true;
  }
  
  // Secondary check for UXP container (found in debugging)
  if (typeof document !== "undefined" && (document as any)._uxpContainer) {
    return true;
  }
  
  // Check for UXP-specific window properties
  if (typeof window !== "undefined" && (window as any).uxp) {
    return true;
  }
  
  return false;
};