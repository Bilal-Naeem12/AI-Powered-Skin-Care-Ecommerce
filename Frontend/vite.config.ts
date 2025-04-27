import { defineConfig } from 'vite';
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";

export default defineConfig({
  envPrefix: 'VITE_',
  resolve: {
    alias: {
      '@': '/src', // Use the @ symbol as an alias for src folder
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
});
