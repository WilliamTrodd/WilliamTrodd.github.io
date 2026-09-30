# Interactive Worksheet

A small React app that marks typed short-answer responses in the browser,
using a local sentence-embedding model (no server, no API costs, nothing
the student types leaves their device).

## How it works

1. You provide a CSV of questions, each with a list of **key points** an
   answer should cover.
2. The student types a free-text answer.
3. On submit, the app loads a small (~25MB) sentence-transformer model
   ([`Xenova/all-MiniLM-L6-v2`](https://huggingface.co/Xenova/all-MiniLM-L6-v2))
   via [Transformers.js](https://huggingface.co/docs/transformers.js), which
   runs entirely client-side via WASM.
4. Each sentence of the student's answer is compared (via cosine similarity
   of sentence embeddings) against each required key point. A key point
   counts as "covered" if any sentence is semantically close enough
   (controlled by a per-question `threshold`, default 0.55).
5. The student gets an instant per-key-point breakdown (✓ / ✗ + similarity
   score) rather than just a single score, and can see a model answer if
   one is provided.

The model download happens once per device/browser and is cached
afterwards (standard browser HTTP cache), so repeat use is instant.

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build     # outputs static site to dist/
```

`dist/` is a fully static site — drop it into any subfolder of your
personal site (e.g. `yoursite.com/worksheets/unit3/`). `vite.config.js` is
already set to `base: './'` so it works from any path.

## CSV format

Columns (see `public/questions.sample.csv` for a full example):

| Column         | Required | Meaning                                                                 |
|----------------|----------|--------------------------------------------------------------------------|
| `id`           | no       | unique id, auto-numbered if left blank                                  |
| `question`     | yes      | the question text shown to the student                                  |
| `keypoints`    | yes      | ideas the answer should cover — see format below                        |
| `threshold`    | no       | 0–1 similarity cutoff for a "hit" (default `0.55`)                      |
| `model_answer` | no       | a sample full-credit answer, revealed after marking                     |

**`keypoints` format:** separate distinct required ideas with `;`. Within
one idea, list alternate acceptable phrasings separated by `|` — the app
checks whether the student's answer is semantically similar to *any* of
those phrasings.

```
stores a value|holds data;can be changed|is mutable;has a name|identifier
```

This means the answer should cover three ideas: (1) stores/holds a value,
(2) can change / is mutable, (3) has a name/identifier. Each is checked
independently, so partial credit / partial coverage is visible.

**Tuning `threshold`:** lower (e.g. 0.45–0.5) is more forgiving of loose
paraphrasing but risks false positives; higher (0.6+) is stricter. Start
around 0.55 and adjust per question after trying it with a few real
student answers — short, one-word-ish key points tend to need a slightly
different threshold than full-sentence ones, so it's worth testing.

Any spreadsheet tool (Google Sheets, Excel) can produce this CSV — just
remember to quote any cell containing a comma.

## Known limitations / next steps

- Embeddings are a decent proxy for meaning but not perfect — they can be
  fooled by answers that mention the right words in a confused or
  contradictory way (e.g. "RAM is non-volatile" would likely still match
  "RAM is volatile" as a similar-shaped sentence). Good for formative /
  low-stakes checks, not for high-stakes grading.
- No answer logging is built in yet. If you want to record student
  attempts (e.g. to your Obsidian vault or a small backend), that would be
  the natural next addition.
- No code-answer marking (syntax/test-case checking) — this is purely for
  short written explanations.
