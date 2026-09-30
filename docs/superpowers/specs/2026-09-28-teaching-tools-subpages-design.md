# Teaching tool sub-pages — design

**Date:** 2026-09-28
**Status:** approved, pending implementation
**Revision:** 2 — revised after `worksheet-app` turned out to be a built Vite project,
not a single-file app. Revision 1 assumed all tools were single-file HTML.

## Problem

William builds small browser-based teaching tools. They need to live on the portfolio
site, each on its own page, at a URL that can be handed to a class.

The portfolio is a Create React App single-page site with no router. The two tools in
hand have **different shapes**, and the design must accommodate both:

| Tool | Shape | Size |
|---|---|---|
| Bit Panel — binary conversion drills | Single-file HTML, vanilla JS, inline CSS, no build | 1002 lines / 30KB |
| Interactive Worksheet (`worksheet-app`) | Vite + React 18 project, 4 runtime deps, `vite build` → `dist/` | ~550 lines source + a ~25MB ML model |

## Decision

Tools are served as **static files under `public/tools/<slug>/`**, discovered from a
new `#tools` section on the homepage. No router is introduced.

Tools come in two kinds, differing *only* in how the files get into `public/tools/`:

- **Kind A — static.** A single-file app. Committed directly to
  `wtrodd/public/tools/<slug>/index.html`.
- **Kind B — built.** A project with its own build. Source lives in
  `tools-src/<slug>/`; its build output is generated into
  `wtrodd/public/tools/<slug>/` at deploy time and is **not** committed.

Both end up at the same URL shape and use the same homepage row. A future tool of
either kind is an additive change.

### Approaches considered

| Approach | Verdict |
|---|---|
| **Static passthrough** (chosen) | No rewrite, no router, keyboard and storage untouched, both tool shapes accommodated. |
| **Port every tool to React components** | Rejected. Rewrites working, classroom-tested code; imposes a permanent porting tax; needs a GitHub Pages deep-link workaround. |
| **Iframe each tool in a React route** | Rejected. Bit Panel is keyboard-first (`document` `keydown`: number keys toggle switches, Enter checks); inside an iframe those fire only when the iframe holds focus, degrading its primary input. |

The deciding constraint was Bit Panel's keyboard handling, not effort.

## Architecture

### Repository layout

```
WilliamTrodd.github.io/
  tools-src/
    worksheet-app/              # Kind B source — versioned
  wtrodd/
    public/tools/
      bit-panel/index.html      # Kind A — versioned
      worksheet-app/            # Kind B output — GITIGNORED, built on deploy
    src/
      data/tools.js
      components/ToolRow.js
```

### URLs and deployment

`public/tools/<slug>/index.html` serves at `/tools/<slug>/` — clean, no `.html`
suffix, shareable with a class.

CRA copies `public/` into `build/` verbatim; `npm run deploy` ships `build/` to the
`master` branch via `gh-pages`. The site is a GitHub Pages **user** site at the domain
root, so absolute paths (`/tools/bit-panel/`, and `/` for back links) resolve. No
deploy configuration changes beyond the build orchestration below.

These are genuine static files, so deep links and refresh work without a `404.html`
fallback.

### Build orchestration (Kind B)

A `build:tools` script builds each Kind B tool and copies its `dist/` into
`public/tools/<slug>/`; `prebuild` chains it so `npm run build` — and therefore
`predeploy` and `npm run deploy` — always ships a fresh build.

`worksheet-app/vite.config.js` already sets `base: './'`, so its assets resolve from
any subpath with no change.

**Consequence for local dev:** `npm start` does not run `prebuild`. Kind B tool pages
will 404 locally until `npm run build:tools` has been run once. This is documented in
CLAUDE.md rather than solved, since it only bites when working on a tool page itself.

## Homepage integration

A `#tools` section between About and Work, using the established row pattern. Nav
becomes `tools / work / about / contact`.

Tools are kept separate from Work deliberately: Work is things to *read about*, Tools
are things to *use*. Merging them would bury the usable ones.

`src/data/tools.js` entries:

```js
{ id, name, slug, blurb, topic, kind, url: `/tools/${slug}/` }
```

`topic` carries the curriculum area ("Data representation") so rows show context a
tech-stack list would not. `kind` is `'static' | 'built'` — unused by rendering, but it
documents which tools the deploy pipeline is responsible for.

`ToolRow` is separate from `ProjectRow` because project links are outbound (new tab,
↗) whereas tool links are internal (same tab, →).

## Kind A: Bit Panel

Three changes; everything else left byte-for-byte alone.

### 1. Palette retokenisation

Every colour is already a CSS custom property with light, dark and
`prefers-color-scheme` variants wired up, so this is a value swap in three `:root`
blocks — no selector or rule changes.

| Token | Before | After |
|---|---|---|
| `--bg` | `#141B24` | `#09090b` (zinc-950) |
| `--panel` | `#1D2733` | `#18181b` (zinc-900) |
| `--panel-border` | `#2C3846` | `#27272a` (zinc-800) |
| `--panel-border-strong` | `#3B4A5C` | `#3f3f46` (zinc-700) |
| `--accent` | `#FFB454` | `#fb923c` (orange-400) |
| `--text` | `#EDEFF3` | `#f4f4f5` (zinc-100) |
| `--text-dim` | `#9AA4B2` | `#a1a1aa` (zinc-400) |
| `--text-faint` | `#6C7686` | `#71717a` (zinc-500) |

`--correct` and `--wrong` keep their green/red hues — they carry meaning to a learner
and must not collapse into the accent.

**Light mode is retained**, against the main site's dark-only rule. Deliberate
exception: a tool on a classroom projector in a lit room is often more legible light,
the support already exists, and a tool is a different context from the portfolio. The
light palette is realigned to neutral zinc tones.

### 2. Drop the Google Fonts dependency

Remove the `fonts.googleapis.com` `<link>` and `preconnect`; use the site's system
stacks. School networks and filtering proxies not infrequently block Google Fonts, in
which case the stylesheet stalls render before falling back to system fonts anyway.

### 3. Back-navigation bar

A slim bar above the tool's own header matching the site nav: `~/wt` wordmark, back
link to `/`. The tool keeps its own `<h1>`. Also update `<title>` and add a
`<meta name="description">` so shared links preview sensibly.

## Kind B: worksheet-app

### Source relocation

`worksheet-app/` moves to `tools-src/worksheet-app/` inside the repo, so its history
is versioned alongside the site. Its own `.gitignore` (`node_modules`, `dist`) is kept.

### Model loading — keep the Hugging Face CDN

The app fetches `Xenova/all-MiniLM-L6-v2` (~25MB) from Hugging Face's CDN at first
use, cached by the browser thereafter. **This is left unchanged.**

Self-hosting the model was considered and rejected. The case for it rested on a class
of thirty fetching 25MB simultaneously and on school networks blocking
`huggingface.co`. Neither holds up here:

- The tool is **teacher-driven only** (see Known limitation) — in practice one device,
  downloading once. The concurrent-class scenario does not currently exist.
- HF's CDN is faster than GitHub Pages for a 25MB asset, and self-hosting moves that
  bandwidth onto the Pages quota rather than off it.
- The blocking risk is **testable in advance** rather than something to design around
  speculatively: open the tool on the school network once and find out.

Cost of the decision: if the network does block Hugging Face, the tool does not work
there. Mitigated below, and revisit if the tool ever goes into students' hands
directly — at which point both arguments regain their force.

**Required safeguard:** the app already tracks `modelStatus`
(`idle | loading | ready | error`). The `error` branch must state plainly that the
model could not be downloaded and that a network restriction is the likely cause,
rather than leaving a spinner. This turns a confusing mid-lesson failure into an
immediately legible one.

**Verification requirement:** confirm the app runs without cross-origin isolation
headers — GitHub Pages cannot set COOP/COEP, so if the WASM runtime wants threading it
must be configured single-threaded instead.

### Styling

Retokenise `src/styles.css` to the portfolio palette and add the same back bar. It is
a separate React app; no components or CSS are shared with the site. That independence
is what keeps new tools cheap.

## Known limitation: worksheet distribution

Questions load from a CSV the user uploads via a file input, with a bundled sample
fetched on mount. A student opening `/tools/worksheet-app/` therefore gets the sample,
not the lesson's questions — there is no way to link a class to a specific worksheet.

This is a **product gap, not a deployment one**, and is explicitly out of scope here.
The natural fix is a `?csv=<url>` parameter so a teacher can link
`/tools/worksheet-app/?csv=/worksheets/unit3.csv`. Recorded so it is a known decision
rather than a surprise; shipping without it means the tool is teacher-driven only.

## Adding a future tool

**Kind A (single-file):** save to `public/tools/<slug>/index.html`, apply the three
modifications, add an entry to `tools.js`.

**Kind B (built):** place source in `tools-src/<slug>/`, ensure its build base is
relative, add it to `build:tools`, add a `.gitignore` entry for its build output under
`public/tools/<slug>/`, add an entry to `tools.js`.

## Testing

**Homepage (Jest + Testing Library):** a row per entry in `tools.js`; each row's `href`
matches its tool URL; tool links are internal — no `target="_blank"`, unlike outbound
project links. The existing external-link test must keep passing, which it will, since
it filters on `http`-prefixed hrefs.

**Tool pages (browser verification against a production build):** the tools have no
test harness and this design does not add one — standing up a runner for files we are
changing cosmetically is not justified. Per tool:

- loads at `/tools/<slug>/`
- a full round / question plays correctly
- state persists across reload where applicable (`localStorage`)
- keyboard shortcuts still fire (Bit Panel)
- renders correctly in light and dark
- back link returns to the site
- **worksheet-app only:** model downloads and marking works end-to-end; the
  `modelStatus === 'error'` branch shows a legible message when the fetch is blocked
  (verifiable by blocking `huggingface.co` in devtools); works without COOP/COEP

## Non-goals

- No router, no SPA navigation between site and tools.
- No rewriting of tool logic.
- No shared component or asset library between the site and the tools.
- No analytics, accounts, or server-side storage. Work stays on-device.
- No worksheet-by-URL distribution (see Known limitation).
