# ⚡ Fail‑Fast Quickstart: React + Vite + React Aria in UXP (Premiere Panel)

This is the smallest-working scaffold you can paste in and try **right now**. It runs in the browser first, then builds an **IIFE** bundle and a **UXP manifest** that points at it.

## 1) Commands

```bash
# from an empty folder (or your repo root)
pnpm add react react-dom react-aria-components
pnpm add -D typescript vite @vitejs/plugin-react @types/react @types/react-dom
```

## 2) Files to add

```
.
├─ package.json              # keep your scripts or add the ones below
├─ vite.config.ts
├─ index.html
├─ src/
│  ├─ main.tsx
│  ├─ styles/tokens.css
│  └─ uxp/
│     ├─ Bridge.ts
│     ├─ UxpProvider.tsx
│     └─ adapters/{uxp.ts,web.ts}
└─ uxp/
   └─ manifest.json          # points to dist-uxp/index.html (after build)
```

### `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isUxp = mode === "uxp" || process.env.UXP_BUILD === "true";
  return {
    plugins: [react()],
    build: {
      target: "es2019",
      sourcemap: true,
      outDir: isUxp ? "dist-uxp" : "dist",
      rollupOptions: isUxp ? { output: { format: "iife", name: "PluginApp", entryFileNames: "index.js" } } : undefined,
    },
  };
});
```

### `index.html`

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>UXP + React Aria</title>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'">
  </head>
  <body>
    <div id="root" class="app-root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `src/styles/tokens.css`

```css
.app-root, .app-root * { box-sizing: border-box; }
.app-root { font: 13px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: #e5e7eb; background: #1c1c1c; }
.btn { border:1px solid #3a3a3a; padding:8px 12px; border-radius:12px; background:#242424; }
.btn[data-pressed] { filter: brightness(1.08); }
.btn--primary { background:#4cc2ff; color:#111; border-color:transparent; font-weight:600; }
.input { padding:8px 10px; border-radius:10px; border:1px solid #333; background:#242424; color:#e5e7eb; }
.input:focus-visible { outline:2px solid white; outline-offset:2px; }
[role="tab"][data-selected] { font-weight:600; border-bottom:2px solid #4cc2ff; }
[role="option"][data-selected] { background:#2a3340; }
```

### `src/uxp/Bridge.ts`

```ts
export type UxpFS = {
  read(path: string, encoding?: "utf8" | "binary"): Promise<string | ArrayBuffer>;
  write(path: string, data: string | ArrayBuffer): Promise<void>;
  mkdirp(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  showSaveDialog(opts: { suggestedName?: string; types?: { description: string; accept: string[] }[] }): Promise<string | null>;
};
export type UxpShell = { openExternal(url: string): Promise<void> };
export type UxpHost = { name: string; version: string; showModal(opts: { title: string; message: string; okText?: string }): Promise<void> };
export interface UxpBridge { fs: UxpFS; shell: UxpShell; host: UxpHost; }
export const isUxp = () => typeof (globalThis as any).uxp !== "undefined";
```

### `src/uxp/adapters/uxp.ts`

```ts
import type { UxpBridge } from "../Bridge";

type UxpGlobal = {
  io: { readFile(p: string, o?: { format?: "utf8" | "binary" }): Promise<any>; writeFile(p: string, d: any): Promise<void>; mkdirp(p: string): Promise<void>; exists(p: string): Promise<boolean>; };
  dialogs: { showSaveDialog(o: any): Promise<{ path?: string } | null>; alert(o: { title: string; message: string; okText?: string }): Promise<void>; };
  shell: { openExternal(u: string): Promise<void> };
  host?: { name?: string; version?: string };
};

export const createUxpAdapter = (): UxpBridge => {
  const u = (globalThis as any).uxp as UxpGlobal;
  return {
    fs: {
      async read(p, encoding = "utf8") { return u.io.readFile(p, { format: encoding }); },
      async write(p, data) { await u.io.writeFile(p, data); },
      async mkdirp(p) { await u.io.mkdirp(p); },
      async exists(p) { return u.io.exists(p); },
      async showSaveDialog(opts) { const res = await u.dialogs.showSaveDialog(opts); return res?.path ?? null; }
    },
    shell: { async openExternal(url) { await u.shell.openExternal(url); } },
    host: { name: u.host?.name ?? "unknown", version: u.host?.version ?? "0.0.0", async showModal({ title, message, okText = "OK" }) { await u.dialogs.alert({ title, message, okText }); } }
  };
};
```

### `src/uxp/adapters/web.ts`

```ts
import type { UxpBridge } from "../Bridge";
export const createWebAdapter = (): UxpBridge => ({
  fs: { async read() { throw new Error("web shim: read not implemented"); }, async write() { throw new Error("web shim: write not implemented"); }, async mkdirp() {}, async exists() { return false; }, async showSaveDialog() { return null; } },
  shell: { async openExternal(url) { window.open(url, "_blank", "noopener,noreferrer"); } },
  host: { name: "web", version: "dev", async showModal({ title, message }) { alert(`${title}

${message}`); } }
});
```

### `src/uxp/UxpProvider.tsx`

```tsx
import React, { createContext, useContext, useMemo } from "react";
import { createUxpAdapter } from "./adapters/uxp";
import { createWebAdapter } from "./adapters/web";
import { isUxp } from "./Bridge";
import type { UxpBridge } from "./Bridge";

const Ctx = createContext<UxpBridge>(createWebAdapter());
export const UxpProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const bridge = useMemo(() => (isUxp() ? createUxpAdapter() : createWebAdapter()), []);
  return <Ctx.Provider value={bridge}>{children}</Ctx.Provider>;
};
export const useUxp = () => useContext(Ctx);
```

### `src/main.tsx`

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import { UxpProvider, useUxp } from "./uxp/UxpProvider";
import { Button, TextField, Label, Input } from "react-aria-components";

const App: React.FC = () => {
  const { host, fs } = useUxp();
  return (
    <div style={{ padding: 12, display: "grid", gap: 12 }}>
      <div style={{ opacity: 0.8 }}>Host: {host.name} {host.version}</div>
      <TextField>
        <Label>Name</Label>
        <Input className="input" />
      </TextField>
      <Button className="btn btn--primary" onPress={async () => {
        const path = await fs.showSaveDialog({ suggestedName: "hello.txt", types: [{ description: "Text", accept: [".txt"] }] });
        if (path) await fs.write(path, "Hello from UXP!");
      }}>Save File</Button>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UxpProvider>
      <App />
    </UxpProvider>
  </React.StrictMode>
);
```

### `uxp/manifest.json` (stub for Premiere — **replace versions/ids as needed**)

```json
{
  "id": "com.example.uxp.aria.panel",
  "name": { "default": "Aria Panel" },
  "version": "0.0.1",
  "requiredRuntime": { "type": "UXP", "minVersion": "7.0" },
  "host": [ { "app": "PPRO", "minVersion": "24.0.0" } ],
  "entryPoints": [
    {
      "type": "panel",
      "id": "aria-panel",
      "label": { "default": "Aria Panel" },
      "minimumSize": { "width": 260, "height": 200 },
      "maximumSize": { "width": 2000, "height": 2000 },
      "preferredDockedSize": { "width": 320, "height": 400 },
      "icons": { "light": "", "dark": "" },
      "main": "dist-uxp/index.html"
    }
  ]
}
```

> If your host or min versions differ, update the `host` array accordingly. The important part: `main` points to the **built** HTML.

## 3) Run it

```bash
# Browser sanity check
pnpm vite

# Build for UXP
pnpm build:uxp
# Then open UXP Developer Tool → Add Plugin (folder with manifest.json) → Load
```

That’s the “fail‑fast” path: browser dev first, then a single IIFE bundle + manifest for UXP. No Spectrum/SWC anywhere—just React Aria + your CSS.

