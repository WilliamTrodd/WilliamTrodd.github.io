import Papa from 'papaparse';

/**
 * Expected CSV columns:
 *   id           - optional, unique question id (auto-numbered if blank)
 *   question     - the question text shown to the student
 *   keypoints    - the ideas an answer should cover, separated by ";"
 *                  each idea can list alternate phrasings separated by "|"
 *                  e.g. "stores a value|holds data;can change|is mutable"
 *   threshold    - optional 0-1 similarity cutoff for a "hit" (default 0.55)
 *   model_answer - optional, a sample full-credit answer shown after marking
 *
 * A lower threshold is more lenient (catches loose paraphrases but also
 * more false positives); a higher one is stricter. 0.5-0.6 is a reasonable
 * starting range for short GCSE-style answers.
 */
export function parseQuestionsCsv(text) {
  const { data, errors } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length) {
    console.warn('CSV parse warnings:', errors);
  }

  return data
    .map((row, i) => {
      const question = (row.question || '').trim();
      const keypoints = (row.keypoints || '')
        .split(';')
        .map((k) => k.trim())
        .filter(Boolean)
        .map((k) => {
          const alts = k
            .split('|')
            .map((a) => a.trim())
            .filter(Boolean);
          return { label: alts[0] || k, alts: alts.length ? alts : [k] };
        });

      return {
        id: (row.id || '').trim() || String(i + 1),
        question,
        keypoints,
        threshold: row.threshold ? parseFloat(row.threshold) : 0.55,
        modelAnswer: (row.model_answer || '').trim(),
      };
    })
    .filter((q) => q.question && q.keypoints.length > 0);
}

export function questionsToCsv(questions) {
  const rows = questions.map((q) => ({
    id: q.id,
    question: q.question,
    keypoints: q.keypoints.map((kp) => kp.alts.join('|')).join(';'),
    threshold: q.threshold,
    model_answer: q.modelAnswer || '',
  }));
  return Papa.unparse(rows);
}
