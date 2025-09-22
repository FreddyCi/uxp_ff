import type { UxpBridge } from "../Bridge";
export const createWebAdapter = (): UxpBridge => ({
  fs: { async read() { throw new Error("web shim: read not implemented"); }, async write() { throw new Error("web shim: write not implemented"); }, async mkdirp() {}, async exists() { return false; }, async showSaveDialog() { return null; } },
  shell: { async openExternal(url) { window.open(url, "_blank", "noopener,noreferrer"); } },
  host: { name: "web", version: "dev", async showModal({ title, message }) { alert(`${title}

${message}`); } },
  panelId: "web-panel"
});