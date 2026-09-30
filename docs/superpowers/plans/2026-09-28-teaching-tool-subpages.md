# Teaching Tool Sub-Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish William's browser-based teaching tools as their own pages on the portfolio site, at URLs that can be handed to a class.

**Architecture:** Tools are served as static files under `wtrodd/public/tools/<slug>/`, discovered from a new `#tools` section on the homepage. No router is introduced. Tools come in two kinds: *static* (a single HTML file, committed) and *built* (a Vite project whose source lives in `tools-src/` and whose output is generated at deploy time and gitignored).

**Tech Stack:** Create React App 5, React 18, Tailwind CSS 3.4, Jest + Testing Library, `gh-pages`. Tool-side: vanilla JS/CSS (Bit Panel), Vite + React 18 + Transformers.js (worksheet-app).

**Spec:** `docs/superpowers/specs/2026-09-28-teaching-tools-subpages-design.md`

## Global Constraints

- All npm commands run from `WilliamTrodd.github.io/wtrodd` unless stated otherwise.
- The site is **dark-only**: no `dark:` Tailwind variants anywhere in `wtrodd/src`. Dark values are applied directly. (Tool files are the documented exception — they keep light mode.)
- `<main>` owns the page container (`max-w-5xl px-6`). Sections must NOT add their own container, or they fall out of alignment.
- Tailwind is pinned `^3.4` for the `950` shades. jsdom does not compile CSS, so a bad utility class passes tests and fails only at `npm run build` — **always build before believing a styling change**.
- Portfolio palette: `#09090b` zinc-950 ground, `#18181b` zinc-900 surface, `#27272a` zinc-800 border, `#3f3f46` zinc-700 border-strong, `#f4f4f5` zinc-100 text, `#a1a1aa` zinc-400 dim, `#71717a` zinc-500 faint, `#fb923c` orange-400 accent.
- Tool URLs are always `/tools/<slug>/` with a trailing slash.
- Tool links are **internal**: same tab, no `target="_blank"`. Project links remain outbound.
- Never commit `wtrodd/public/tools/worksheet-app/` — it is build output.
- Tool source files are otherwise left byte-for-byte alone. Only the changes named in these tasks.

---

### Task 1: Publish Bit Panel at `/tools/bit-panel/`

Places the single-file app, aligns it to the site palette, removes its external font dependency, and adds a back link. No logic is touched.

**Files:**
- Create: `wtrodd/public/tools/bit-panel/index.html` (copied from `Bit Panel — binary conversion drills.html` at the Portfolio folder root, then modified)
- Test: none automated — see Step 7. The spec deliberately adds no test harness for tool files.

**Interfaces:**
- Consumes: nothing.
- Produces: a page at `/tools/bit-panel/`. Task 2's `tools.js` entry points at this URL.

- [ ] **Step 1: Copy the file into place**

```bash
cd /Users/0xgobl1n/Desktop/Portfolio
mkdir -p WilliamTrodd.github.io/wtrodd/public/tools/bit-panel
cp "Bit Panel — binary conversion drills.html" \
   WilliamTrodd.github.io/wtrodd/public/tools/bit-panel/index.html
```

- [ ] **Step 2: Remove the Google Fonts dependency**

In `wtrodd/public/tools/bit-panel/index.html`, delete these two lines (7–8):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap">
```

- [ ] **Step 3: Update the document head for sharing**

Replace line 6:

```html
<title>Bit Panel — binary conversion drills</title>
```

with:

```html
<title>Bit Panel — binary conversion drills</title>
<meta name="description" content="Practise converting between decimal and binary — unsigned, sign and magnitude, and two's complement — by flipping switches. Runs entirely in the browser.">
```

- [ ] **Step 4: Retokenise the palette**

Three `:root` blocks need new values. Replace the **light** block (currently lines 10–27):

```css
  :root {
    --font-sans: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
    --bg: #FAFAFA;
    --panel: #FFFFFF;
    --panel-border: #E4E4E7;
    --panel-border-strong: #D4D4D8;
    --track-off: #D4D4D8;
    --thumb-off: #FFFFFF;
    --accent: #EA580C;
    --accent-neg: #DC2626;
    --text: #18181B;
    --text-dim: #52525B;
    --text-faint: #71717A;
    --correct: #15803D;
    --wrong: #DC2626;
    --input-bg: #FFFFFF;
    --seg-bg: #F4F4F5;
    --shadow: rgba(24,24,27,0.08);
  }
```

Note `--accent` is orange-600 (`#EA580C`) in light mode, not orange-400 — orange-400 on white fails contrast. `--correct` and `--wrong` keep green/red hues; they carry meaning to a learner and must not collapse into the accent.

Then replace the body of **both** dark blocks — the `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }` block and the `:root[data-theme="dark"] { ... }` block — with these same values in each:

```css
    --bg: #09090B;
    --panel: #18181B;
    --panel-border: #27272A;
    --panel-border-strong: #3F3F46;
    --track-off: #3F3F46;
    --thumb-off: #09090B;
    --accent: #FB923C;
    --accent-neg: #F87171;
    --text: #F4F4F5;
    --text-dim: #A1A1AA;
    --text-faint: #71717A;
    --correct: #4ADE80;
    --wrong: #F87171;
    --input-bg: #09090B;
    --seg-bg: #131316;
    --shadow: rgba(0,0,0,0.5);
```

Do not add `--font-sans`/`--font-mono` to the dark blocks — fonts do not vary by theme, and the light `:root` already defines them for all themes.

- [ ] **Step 5: Point every font declaration at the new variables**

There are 15 `font-family` declarations. Replace every occurrence of these exact strings:

| Find | Replace with |
|---|---|
| `'Space Grotesk', system-ui, -apple-system, sans-serif` | `var(--font-sans)` |
| `'Space Grotesk', sans-serif` | `var(--font-sans)` |
| `'JetBrains Mono', ui-monospace, monospace` | `var(--font-mono)` |

Verify none remain:

```bash
grep -n "Space Grotesk\|JetBrains Mono" wtrodd/public/tools/bit-panel/index.html
```

Expected: no output.

- [ ] **Step 6: Add the back-navigation bar**

Add this CSS immediately after the `.wrap { ... }` rule:

```css
  .site-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    background: var(--bg);
    border-bottom: 1px solid var(--panel-border);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    text-decoration: none;
    color: var(--text-dim);
    z-index: 50;
  }
  .site-bar:hover { color: var(--text); }
  .site-bar-tilde { color: var(--accent); }
```

A solid background is used rather than `backdrop-filter`/`color-mix`, which are not reliable on older school devices.

Change the `body` padding rule so content clears the fixed bar. Find:

```css
    padding: 28px 16px 48px;
```

Replace with:

```css
    padding: 72px 16px 48px;
```

Then insert this markup immediately after `<body>`, before `<div class="wrap">`:

```html
<a class="site-bar" href="/">
  <span><span class="site-bar-tilde">~/</span>wt</span>
  <span>&larr; back to site</span>
</a>
```

- [ ] **Step 7: Verify in a real browser against a production build**

```bash
cd WilliamTrodd.github.io/wtrodd
CI=true npx react-scripts build
npx serve -s build -l 5000
```

Open `http://localhost:5000/tools/bit-panel/` and confirm all of:

- page renders on the zinc-950 ground with orange accents, no navy or amber left
- devtools Network shows **no** request to `fonts.googleapis.com`
- a full round plays: set switches, press Check, get correct/incorrect feedback
- number keys toggle switches and Enter checks the answer
- start a 60-second sprint; it counts down and ends
- reload: best streak persists (`localStorage` key `bitpanel-stats-v2`)
- toggle OS appearance to light; layout stays legible, accent stays readable
- the back bar returns to `/` and the homepage loads

Stop the server when done.

- [ ] **Step 8: Commit**

```bash
cd /Users/0xgobl1n/Desktop/Portfolio/WilliamTrodd.github.io
git add wtrodd/public/tools/bit-panel/index.html
git commit -m "feat: publish Bit Panel at /tools/bit-panel/"
```

---

### Task 2: List tools on the homepage

Adds the tools data file, the row component, the `#tools` section and the nav entry — the pattern every future tool plugs into.

**Files:**
- Create: `wtrodd/src/data/tools.js`
- Create: `wtrodd/src/components/ToolRow.js`
- Modify: `wtrodd/src/App.js`
- Modify: `wtrodd/src/components/Nav.js`
- Modify: `wtrodd/src/App.test.js`
- Modify: `CLAUDE.md` (Portfolio folder root)

**Interfaces:**
- Consumes: `/tools/bit-panel/` from Task 1.
- Produces: `src/data/tools.js` default-exports an array of
  `{ id: number, name: string, slug: string, blurb: string, topic: string, kind: 'static' | 'built', url: string }`.
  Task 3 adds the `worksheet-app` entry to this array.
  `src/components/ToolRow.js` default-exports `ToolRow({ index: string, tool: Tool })`.

- [ ] **Step 1: Write the failing tests**

Append to `wtrodd/src/App.test.js`, and add `import tools from './data/tools';` to the imports at the top:

```javascript
test('renders one tool row per tool', () => {
  render(<App />);
  const section = screen.getByRole('region', { name: /tools/i });
  expect(within(section).getAllByRole('link')).toHaveLength(tools.length);
});

test('every tool row links to its tool page', () => {
  render(<App />);
  const section = screen.getByRole('region', { name: /tools/i });
  tools.forEach(tool => {
    const row = within(section).getByRole('link', { name: new RegExp(tool.name, 'i') });
    expect(row).toHaveAttribute('href', `/tools/${tool.slug}/`);
  });
});

test('tool rows open in the same tab, unlike outbound project links', () => {
  render(<App />);
  const section = screen.getByRole('region', { name: /tools/i });
  within(section).getAllByRole('link').forEach(row => {
    expect(row).not.toHaveAttribute('target');
  });
});
```

Also update the existing nav test — change its array from `['work', 'about', 'contact']` to:

```javascript
  ['tools', 'work', 'about', 'contact'].forEach(label => {
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `CI=true npx react-scripts test --watchAll=false`

Expected: suite fails to run with `Cannot find module './data/tools'`. Create the file in Step 3 and the failures become real assertion failures (`Unable to find an accessible element with the role "region" and name /tools/i`).

- [ ] **Step 3: Create the tools data file**

Create `wtrodd/src/data/tools.js`:

```javascript
const tools = [
  {
    id: 1,
    name: 'Bit Panel',
    slug: 'bit-panel',
    blurb: "Flip switches to convert between decimal and binary — unsigned, sign and magnitude, and two's complement — with a 60-second sprint mode.",
    topic: 'Data representation',
    kind: 'static',
    url: '/tools/bit-panel/',
  },
]

export default tools
```

`kind` is not used for rendering. It records which tools the deploy pipeline is responsible for building.

- [ ] **Step 4: Create the ToolRow component**

Create `wtrodd/src/components/ToolRow.js`:

```javascript
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const ToolRow = ({ index, tool }) => (
  <li>
    <a
      href={tool.url}
      className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-t border-white/5 px-2 py-8 transition-colors hover:bg-white/[0.03] md:grid-cols-[4rem_1fr_auto] md:gap-8"
    >
      <span className="self-start pt-1 font-mono text-sm text-zinc-600 transition-colors group-hover:text-orange-400">
        {index}
      </span>

      <span>
        <span className="block text-xl font-medium tracking-tight text-zinc-100 transition-colors group-hover:text-orange-400 sm:text-2xl">
          {tool.name}
        </span>
        <span className="mt-2 block max-w-xl text-sm leading-relaxed text-zinc-400">
          {tool.blurb}
        </span>
        <span className="mt-2 block font-mono text-xs text-zinc-500">
          {tool.topic}
        </span>
      </span>

      <ArrowRightIcon
        aria-hidden="true"
        className="h-5 w-5 self-start text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-orange-400 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      />
    </a>
  </li>
)

export default ToolRow
```

Note the arrow is `ArrowRightIcon` (internal navigation), not `ArrowUpRightIcon` (outbound) as used by `ProjectRow`.

- [ ] **Step 5: Add the tools section to App.js**

In `wtrodd/src/App.js`, add to the imports:

```javascript
import ToolRow from './components/ToolRow'
import tools from './data/tools'
```

Then insert this section between the `#about` section's closing `</section>` and the `<section id="work"...>` opening tag:

```javascript
      <section id="tools" aria-labelledby="tools-heading" className="pt-20">
        <h2 id="tools-heading" className="mb-2 font-mono text-sm uppercase tracking-widest text-zinc-500">
          Tools
        </h2>
        <p className="mb-2 max-w-xl text-sm leading-relaxed text-zinc-500">
          Free browser-based tools I've built for teaching computer science. Everything runs on your device.
        </p>
        <ul>
          {tools.map((tool, i) => (
            <ToolRow
              key={tool.id}
              index={String(i + 1).padStart(2, '0')}
              tool={tool}
            />
          ))}
        </ul>
      </section>
```

- [ ] **Step 6: Add the nav entry**

In `wtrodd/src/components/Nav.js`, change:

```javascript
const links = ['work', 'about', 'contact']
```

to:

```javascript
const links = ['tools', 'work', 'about', 'contact']
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `CI=true npx react-scripts test --watchAll=false`

Expected: PASS, 10 tests total (7 existing + 3 new).

- [ ] **Step 8: Build and check it visually**

```bash
CI=true npx react-scripts build
```

Expected: `Compiled successfully.` — this is the only thing that catches a bad Tailwind class.

Then serve and confirm the Tools section sits between About and Work, aligns on the same left edge as every other section, and the row navigates to Bit Panel:

```bash
npx serve -s build -l 5000
```

- [ ] **Step 9: Document the pattern in CLAUDE.md**

In `/Users/0xgobl1n/Desktop/Portfolio/CLAUDE.md`, add to the Architecture section after the page-structure code block:

```markdown
**Teaching tools** live at `/tools/<slug>/` as static files under `public/tools/`,
listed from `src/data/tools.js` on the homepage `#tools` section. They are NOT React
routes — there is no router. Two kinds:

- `kind: 'static'` — a single HTML file committed to `public/tools/<slug>/index.html`.
- `kind: 'built'` — source in `tools-src/<slug>/`, built into `public/tools/<slug>/`
  by `npm run build:tools`; the output is gitignored.
```

- [ ] **Step 10: Commit**

```bash
cd /Users/0xgobl1n/Desktop/Portfolio/WilliamTrodd.github.io
git add wtrodd/src/data/tools.js wtrodd/src/components/ToolRow.js \
        wtrodd/src/App.js wtrodd/src/components/Nav.js wtrodd/src/App.test.js
git commit -m "feat: add tools section to homepage"
```

`CLAUDE.md` sits outside the repo (in the Portfolio folder) and is not committed.

---

### Task 3: Bring worksheet-app into the repo and build it on deploy

Moves the Vite project under version control and wires its build into the deploy pipeline, so `npm run deploy` always ships a fresh build.

**Files:**
- Move: `Portfolio/worksheet-app/` → `WilliamTrodd.github.io/tools-src/worksheet-app/`
- Modify: `wtrodd/package.json`
- Modify: `wtrodd/.gitignore`
- Modify: `wtrodd/src/data/tools.js`
- Modify: `wtrodd/src/App.test.js` is NOT modified — its tests are data-driven and pick up the new entry automatically.
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: `tools.js` shape from Task 2.
- Produces: `npm run build:tools` in `wtrodd/package.json`, which populates `wtrodd/public/tools/worksheet-app/`. Task 4 modifies the source this script builds.

- [ ] **Step 1: Move the source into the repo**

```bash
cd /Users/0xgobl1n/Desktop/Portfolio
mkdir -p WilliamTrodd.github.io/tools-src
mv worksheet-app WilliamTrodd.github.io/tools-src/worksheet-app
```

Confirm its own `.gitignore` still lists `node_modules` and `dist`:

```bash
cat WilliamTrodd.github.io/tools-src/worksheet-app/.gitignore
```

- [ ] **Step 2: Ignore the build output**

Append to `wtrodd/.gitignore`:

```
# built teaching tools (see tools-src/)
/public/tools/worksheet-app
```

- [ ] **Step 3: Add the build scripts**

In `wtrodd/package.json`, add these two entries to `scripts`, immediately before `"predeploy"`:

```json
    "build:tools": "npm --prefix ../tools-src/worksheet-app install && npm --prefix ../tools-src/worksheet-app run build && rm -rf public/tools/worksheet-app && mkdir -p public/tools/worksheet-app && cp -R ../tools-src/worksheet-app/dist/. public/tools/worksheet-app/",
    "prebuild": "npm run build:tools",
```

`prebuild` is an npm lifecycle hook: it runs automatically before `build`, so `npm run build`, `predeploy` and `npm run deploy` all pick it up with no further wiring.

`worksheet-app/vite.config.js` already sets `base: './'`, so its assets resolve from `/tools/worksheet-app/` without modification. Do not change it.

- [ ] **Step 4: Verify the build produces the tool**

```bash
cd WilliamTrodd.github.io/wtrodd
rm -rf public/tools/worksheet-app
CI=true npm run build
ls build/tools/worksheet-app/
```

Expected: `index.html` and an `assets/` directory. If `index.html` is missing, the copy step failed — check that `../tools-src/worksheet-app/dist/` was produced.

- [ ] **Step 5: Confirm the output is not tracked by git**

```bash
cd /Users/0xgobl1n/Desktop/Portfolio/WilliamTrodd.github.io
git status --short wtrodd/public/tools/
```

Expected: only `bit-panel/` appears (already committed, so likely no output at all). `worksheet-app/` must NOT be listed. If it is, Step 2's gitignore entry is wrong.

- [ ] **Step 6: Add the tools.js entry**

Append to the `tools` array in `wtrodd/src/data/tools.js`, after the Bit Panel entry:

```javascript
  {
    id: 2,
    name: 'Interactive Worksheet',
    slug: 'worksheet-app',
    blurb: 'Marks typed short-answer responses in the browser against a list of key points, giving per-point feedback instead of a single score.',
    topic: 'Formative assessment',
    kind: 'built',
    url: '/tools/worksheet-app/',
  },
```

- [ ] **Step 7: Run the tests**

Run: `CI=true npx react-scripts test --watchAll=false`

Expected: PASS, 10 tests. The tool tests iterate `tools.js`, so they now cover two rows without modification.

- [ ] **Step 8: Document the deploy behaviour in CLAUDE.md**

In `/Users/0xgobl1n/Desktop/Portfolio/CLAUDE.md`, add to the Commands section:

```markdown
npm run build:tools  # build Vite-based tools from tools-src/ into public/tools/
```

And add this note under Deployment:

```markdown
`prebuild` chains `build:tools`, so `npm run build` and `npm run deploy` always ship a
fresh tool build. **`npm start` does not run it** — Kind B tool pages 404 on the dev
server until `npm run build:tools` has been run once.
```

- [ ] **Step 9: Commit**

```bash
cd /Users/0xgobl1n/Desktop/Portfolio/WilliamTrodd.github.io
git add tools-src/ wtrodd/package.json wtrodd/.gitignore wtrodd/src/data/tools.js
git commit -m "feat: build worksheet-app into /tools/worksheet-app/ on deploy"
```

---

### Task 4: Align worksheet-app with the site and make model failures legible

Restyles the worksheet app to the portfolio palette, adds the back bar, and replaces the silent model-download failure with a message that names the likely cause.

**Files:**
- Modify: `tools-src/worksheet-app/src/styles.css:1-11` (the `:root` block)
- Modify: `tools-src/worksheet-app/index.html`
- Modify: `tools-src/worksheet-app/src/App.jsx`

**Interfaces:**
- Consumes: `build:tools` from Task 3.
- Produces: nothing other tasks depend on. This is the final task.

- [ ] **Step 1: Retokenise the palette**

Replace the `:root` block at the top of `tools-src/worksheet-app/src/styles.css` (lines 1–11) with:

```css
:root {
  color-scheme: light dark;
  --bg: #FAFAFA;
  --fg: #18181B;
  --muted: #52525B;
  --border: #E4E4E7;
  --accent: #EA580C;
  --hit: #15803D;
  --miss: #DC2626;
  font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #09090B;
    --fg: #F4F4F5;
    --muted: #A1A1AA;
    --border: #27272A;
    --accent: #FB923C;
    --hit: #4ADE80;
    --miss: #F87171;
  }
}
```

The file declares `color-scheme: light dark` but never defined dark values, so it previously stayed white in dark mode. The `@media` block fixes that. `--hit`/`--miss` keep green/red hues — they carry meaning to a learner.

- [ ] **Step 2: Add the back bar styles**

Append to `tools-src/worksheet-app/src/styles.css`:

```css
.site-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.8rem;
  text-decoration: none;
  color: var(--muted);
  z-index: 50;
}
.site-bar:hover { color: var(--fg); }
.site-bar-tilde { color: var(--accent); }

.app { padding-top: 4rem; }
```

`.app` already sets `padding: 2rem 1.25rem 4rem`; the later `padding-top` overrides only the top so content clears the fixed bar.

- [ ] **Step 3: Add the back bar markup and page metadata**

Replace the `<body>` contents of `tools-src/worksheet-app/index.html` so the file reads:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Interactive Worksheet — instant feedback on written answers</title>
    <meta name="description" content="Marks typed short-answer responses in the browser against a list of key points, giving per-point feedback. Nothing a student types leaves their device." />
  </head>
  <body>
    <a class="site-bar" href="/">
      <span><span class="site-bar-tilde">~/</span>wt</span>
      <span>&larr; back to site</span>
    </a>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Make the model-download failure legible**

**Current behaviour, confirmed by reading the source:** `ensureModel()` calls
`setModelStatus('error')` and rethrows; `handleSubmit`'s `finally` clears `marking`.
But **no branch renders `modelStatus === 'error'`** — the state is declared and set,
never displayed. So a blocked download looks like this to a student: click "Check
answer", brief spin, button returns to normal, no feedback, no explanation. The click
simply appears to do nothing.

In `tools-src/worksheet-app/src/App.jsx`, find this existing block:

```jsx
            {modelStatus === 'loading' && marking && (
              <p className="hint">
                First check on this device — downloading a small (~25MB) language model that runs
                fully in your browser. It's cached after this, so future checks are instant.
              </p>
            )}
```

Insert immediately after it:

```jsx
            {modelStatus === 'error' && !marking && (
              <p className="model-error" role="alert">
                The marking model couldn't be downloaded, so answers can't be checked
                automatically. This is usually a network restriction — some school and
                workplace networks block <code>huggingface.co</code>, which hosts the
                model. Everything else on this page still works.
              </p>
            )}
```

The `!marking` guard stops the error flashing while a retry is in flight.

Add to `tools-src/worksheet-app/src/styles.css`:

```css
.model-error {
  border: 1px solid var(--miss);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--fg);
  font-size: 0.9rem;
  line-height: 1.5;
}
```

- [ ] **Step 5: Verify in a real browser against a production build**

```bash
cd WilliamTrodd.github.io/wtrodd
CI=true npm run build
npx serve -s build -l 5000
```

Open `http://localhost:5000/tools/worksheet-app/` and confirm:

- renders on the zinc palette, orange accent, no blue left
- the bundled sample CSV loads and a question appears
- the model downloads (first load is slow — ~25MB) and marking returns per-key-point ✓/✗
- the back bar returns to `/`
- toggle OS appearance to dark: the page follows, rather than staying white
- in devtools, block `huggingface.co` (Network → right-click a request → Block request domain), reload, and confirm the new error message appears instead of a stuck spinner
- no cross-origin isolation errors in the console (GitHub Pages cannot set COOP/COEP)

- [ ] **Step 6: Commit**

```bash
cd /Users/0xgobl1n/Desktop/Portfolio/WilliamTrodd.github.io
git add tools-src/worksheet-app/
git commit -m "feat: align worksheet-app with site palette and surface model errors"
```

---

## Deferred / out of scope

Recorded in the spec, not implemented here:

- **Worksheet distribution by URL.** Questions come from a CSV the user uploads; a student opening the page gets the bundled sample, not the lesson's questions. The tool ships teacher-driven only. The natural fix is a `?csv=<url>` parameter.
- **Self-hosting the ML model.** Considered and rejected — see the spec. Revisit if the tool goes into students' hands directly.
- **A dev-server story for Kind B tools.** `npm start` does not build them; documented rather than solved.
