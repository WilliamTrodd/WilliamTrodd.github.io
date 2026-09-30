/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scans the inline <script> text too, so class names used in JS-built
  // markup are still detected.
  content: ['./index.html'],
  theme: {
    extend: {
      // The tool's palette lives in CSS custom properties (src/input.css) so
      // light/dark can switch without a class swap. Mapping them here makes
      // them available as ordinary utilities: bg-panel, text-ink, border-line.
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        'panel-2': 'var(--panel-2)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        ink: 'var(--ink)',
        'ink-dim': 'var(--ink-dim)',
        'ink-faint': 'var(--ink-faint)',
        pc: 'var(--pc)',
        'pc-wash': 'var(--pc-wash)',
        'pc-ink': 'var(--pc-ink)',
        ok: 'var(--ok)',
        'ok-wash': 'var(--ok-wash)',
        bad: 'var(--bad)',
        'bad-wash': 'var(--bad-wash)',
        kw: 'var(--kw)',
        str: 'var(--str)',
      },
      fontFamily: {
        sans: 'var(--sans)',
        mono: 'var(--mono)',
      },
      boxShadow: {
        panel: '0 6px 20px var(--shadow)',
        seg: '0 1px 3px var(--shadow), inset 0 -2px 0 var(--pc)',
      },
      maxWidth: { wrap: "1040px" },
    },
  },
  plugins: [],
}
