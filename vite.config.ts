import { defineConfig } from "vite";
import logseqDevPlugin from "vite-plugin-logseq";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [logseqDevPlugin(), react()],
});
