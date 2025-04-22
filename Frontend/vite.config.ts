import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src', // Use the @ symbol as an alias for src folder
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
});
