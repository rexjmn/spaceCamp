import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Add this to include .glb and .gltf files as assets
  assetsInclude: ['**/*.glb', '**/*.gltf'],
});
