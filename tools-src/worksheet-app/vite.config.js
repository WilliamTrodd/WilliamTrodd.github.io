import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' so the built app works when dropped into any subfolder
// of your personal site (e.g. yoursite.com/worksheets/unit3/).
export default defineConfig({
  base: './',
  plugins: [react()],
});
