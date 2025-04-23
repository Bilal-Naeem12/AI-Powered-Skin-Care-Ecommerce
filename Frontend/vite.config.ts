import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: 'VITE_',
  resolve: {
    alias: {
      '@': '/src', // Use the @ symbol as an alias for src folder
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
});
