# Aria + Spectrum CSS Hybrid Installation Guide

This document explains how to port the hybrid "Aria + Spectrum CSS with UXP Bridge" system to another repository so you can reproduce the same UXP-ready component experience. It also provides guidance for AI coding agents that contribute to the codebase.

---

## 1. Overview

The hybrid stack combines:

- **React 19** and **React Aria** for accessible, headless interaction logic.
- **Spectrum CSS** class names, tokens, and high-specificity overrides to match Adobe design specs inside a UXP host.
- **`uxp-reset--complete` nuclear div pattern** to neutralise UXP's default element styling.
- **Bridge adapters (`src/uxp/`)** that expose a consistent file system, shell, and host API whether you run inside a web browser or the UXP runtime.

Porting the system requires installing the correct dependencies, copying the hybrid CSS and component patterns, and wiring the provider that selects the correct adapter at runtime.

---

## 2. Prerequisites

| Requirement | Recommended Version | Notes |
|-------------|---------------------|-------|
| Node.js | 18.17+ or 20.x LTS | Align with Vite support matrix. |
| Package manager | `pnpm` 8.x | Scripts use `pnpm`; adapt if you prefer `npm`/`yarn`. |
| Build tool | Vite 7 | Already configured in this repo via `vite.config.ts`. |
| React stack | `react@^19`, `react-dom@^19` | Matches hooks used by React Aria. |

Install pnpm globally if needed:

```bash
npm install -g pnpm
```

---

## 3. Install Dependencies in the Target Repo

From the root of the destination repo:

```bash
pnpm add react@^19 react-dom@^19 react-aria@^3 react-aria-components@^1 zustand@^5 hugeicons-react@^0.3
pnpm add -D vite@^7 @vitejs/plugin-react@^5 typescript@^5 @types/react@^19 @types/react-dom@^19 @types/node@^24 @esbuild-plugins/node-globals-polyfill@^0.2 @esbuild-plugins/node-modules-polyfill@^0.2
```

> Adjust the command if your project already includes some of these packages. Keep the major versions aligned with the hybrid stack to avoid React Aria incompatibilities.

Add (or merge) the following scripts into the target `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:uxp": "vite build --mode uxp"
  }
}
```

---

## 4. Copy Required Source Folders

Bring over these directories (preserving relative paths):

| Source folder | Purpose |
|---------------|---------|
| `src/styles/` | Spectrum token mappings (`tokens.css`), utility helpers (`utilities.css`), and the UXP reset sheet (`uxp-reset.css`). |
| `src/uxp/` | Bridge, provider, and adapters for UXP vs web execution. |
| `src/components/` | Hybrid Spectrum components (each uses the nuclear div + Aria patterns). |
| `src/store/` | Global Zustand store, including shared state such as StepList progress. |
| `src/features/` (optional) | Feature demos that stitch components together. |

Use your version-control tool or run a copy command from the source repo, e.g.:

```bash
# From the source project root
rsync -av src/styles/ ../other-repo/src/styles/
rsync -av src/uxp/ ../other-repo/src/uxp/
rsync -av src/components/ ../other-repo/src/components/
rsync -av src/store/ ../other-repo/src/store/
```

> Review the destination repo structure first. If you already have components with the same names, reconcile exports carefully.

---

## 5. Wire the UxpProvider at the App Root

Wrap your application with the provider that chooses the correct adapter:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { UxpProvider } from "./uxp/UxpProvider";
import App from "./App";
import "./styles/uxp-reset.css";
import "./styles/tokens.css";
import "./styles/utilities.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UxpProvider>
      <App />
    </UxpProvider>
  </React.StrictMode>
);
```

The provider:

- Detects whether you are running inside UXP or the web.
- Applies theme attributes (`data-theme`, `data-host`) to the document.
- Exposes file system and shell utilities through the `useUxp()` hook.

---

## 6. Configure Vite for Dual Targets

Copy `vite.config.ts` from the source repo or merge the relevant pieces:

- Uses React plugin with JSX automatic runtime.
- Supplies UXP-friendly build options (e.g. `build:uxp` entry emits assets into `dist-uxp/`).
- Polyfills Node globals required by React Aria during UXP builds.

Ensure the repo contains `index.html` (web) and, if building a UXP plugin, a manifest such as `src/uxp-manifest.json` matching your host application.

---

## 7. Adopt the Hybrid CSS Conventions

Every Spectrum component follows these rules:

1. **Nuclear reset:** selectors use `div[role="*"] .uxp-reset--complete` to wipe host styles.
2. **Double Spectrum class:** `.spectrum-Button.spectrum-Button` boosts specificity to out-rank UXP resets.
3. **Token fallbacks:** each property references a Spectrum token with a hard-coded fallback for hosts missing the token.
4. **No `gap`:** spacing uses margin combinators because UXP’s flex `gap` is unreliable.

When creating new components, start from an existing file (e.g. `Button.tsx`) and keep the same pattern.

---

## 8. Testing the Integration

Run both build modes after copying the system:

```bash
pnpm run build
pnpm run build:uxp
```

Fix any missing imports or type errors before committing. For UXP testing, load the `dist-uxp/` output into your host application panel.

---

## 9. AI Agent Workflow Guidelines

When an AI coding agent contributes to this project (or a repo using this hybrid system), ensure it follows these practices:

1. **Always plan first:** outline the change, update the task tracker (TODO list), and work incrementally.
2. **Respect the nuclear pattern:** new interactive elements must wrap content in `div[role="…"]` with the `uxp-reset--complete` class and duplicate Spectrum class names.
3. **Reuse tokens:** prefer Spectrum CSS custom properties declared in `tokens.css`. Add new mappings there rather than hard-coding colors.
4. **Preserve adapters:** never bypass `UxpProvider`; use the `useUxp()` hook for host-specific APIs (file system, shell, theme).
5. **Avoid `gap` and unsupported CSS features:** use margin-based spacing and test in both web and UXP builds.
6. **Write docs alongside features:** update markdown guides (like this one) when introducing new components or patterns.
7. **Validate with builds:** after code changes, run `pnpm run build` and `pnpm run build:uxp`, reporting PASS/FAIL for each.

Following this checklist keeps the hybrid stack consistent and prevents regressions when AI tools modify the codebase.

---

## 10. Quick Checklist for New Repositories

- [ ] Dependencies installed (`react`, `react-aria`, `zustand`, Vite tooling).
- [ ] `src/styles/`, `src/uxp/`, `src/components/`, and `src/store/` copied or recreated.
- [ ] `UxpProvider` wraps the app entry point.
- [ ] Vite scripts configured for `build` and `build:uxp`.
- [ ] Hybrid CSS conventions followed (nuclear reset, token fallbacks).
- [ ] Both build commands succeed.

With these steps completed, your new repository will deliver the same Aria + Spectrum CSS experience, ready for UXP or web deployment.
