// @huggingface/transformers is ~1MB of JS — the bulk of this app's bundle.
// It is loaded on demand rather than at import time, so a student who opens
// the worksheet and reads the questions never downloads it. By the time it is
// needed they are already waiting on the model, so the cost is invisible.
let libPromise = null;
function loadLib() {
  if (!libPromise) libPromise = import('@huggingface/transformers');
  return libPromise;
}

// A small (~23MB, quantised) sentence-embedding model that runs entirely
// in the browser via WASM. It downloads once and is cached by the browser
// (IndexedDB/Cache Storage), so repeat visits are instant.
const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

let extractorPromise = null;

export function loadExtractor(onProgress) {
  if (!extractorPromise) {
    extractorPromise = loadLib().then(({ pipeline }) =>
      pipeline('feature-extraction', MODEL_ID, { progress_callback: onProgress })
    );
  }
  return extractorPromise;
}

async function embed(extractor, text) {
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Scores a free-text answer against a list of required key points.
 *
 * keypoints: [{ label, alts: [alt phrasings...] }]
 * Each point counts as a "hit" if ANY sentence in the student's answer
 * is semantically close enough to ANY of that point's phrasings.
 */
export async function scoreAnswer(extractor, studentAnswer, keypoints, threshold = 0.55) {
  const trimmed = studentAnswer.trim();
  if (!trimmed) {
    return {
      results: keypoints.map((p) => ({ label: p.label, hit: false, score: 0 })),
      hits: 0,
      total: keypoints.length,
      percentage: 0,
    };
  }

  const { cos_sim } = await loadLib();

  const sentences = splitSentences(trimmed);
  const chunks = sentences.length ? sentences : [trimmed];
  const chunkEmbeddings = await Promise.all(chunks.map((c) => embed(extractor, c)));

  const results = [];
  for (const point of keypoints) {
    let best = { score: -1, sentence: null, alt: null };
    for (const alt of point.alts) {
      const altEmbedding = await embed(extractor, alt);
      chunkEmbeddings.forEach((emb, i) => {
        const score = cos_sim(emb, altEmbedding);
        if (score > best.score) {
          best = { score, sentence: chunks[i], alt };
        }
      });
    }
    results.push({
      label: point.label,
      hit: best.score >= threshold,
      score: Math.round(best.score * 100) / 100,
      matchedSentence: best.sentence,
    });
  }

  const hits = results.filter((r) => r.hit).length;
  return {
    results,
    hits,
    total: keypoints.length,
    percentage: keypoints.length ? Math.round((hits / keypoints.length) * 100) : 0,
  };
}
