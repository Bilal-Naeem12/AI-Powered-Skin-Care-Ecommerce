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
 optimizeDeps: {
  include: ['@mediapipe/face_mesh', '@mediapipe/camera_utils'],
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
   server: {
    allowedHosts: [
      // You can add your tunnel hostname here (from the error message)
     "skincare-test.loca.lt"
      // optionally add others as needed
    ],
    // ...other server config
  },
});
