/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      // Utility names are kept the same across all the teaching tools
      // (ink / line / panel / accent) even though each tool's underlying
      // custom properties are named differently — so the markup reads the
      // same everywhere.
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        line: 'var(--panel-border)',
        'line-strong': 'var(--panel-border-strong)',
        'seg-bg': 'var(--seg-bg)',
        'input-bg': 'var(--input-bg)',
        ink: 'var(--text)',
        'ink-dim': 'var(--text-dim)',
        'ink-faint': 'var(--text-faint)',
        accent: 'var(--accent)',
        'accent-neg': 'var(--accent-neg)',
        correct: 'var(--correct)',
        wrong: 'var(--wrong)',
      },
      fontFamily: { sans: 'var(--font-sans)', mono: 'var(--font-mono)' },
      boxShadow: { panel: '0 8px 24px var(--shadow)', seg: '0 1px 4px var(--shadow)' },
      maxWidth: { wrap: '640px' },
    },
  },
  plugins: [],
}
