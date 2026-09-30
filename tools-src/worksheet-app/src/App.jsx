import React, { useEffect, useRef, useState } from 'react';
import { parseQuestionsCsv } from './lib/csv.js';
import { loadExtractor, scoreAnswer } from './lib/scoring.js';

const SAMPLE_CSV_URL = `${import.meta.env.BASE_URL}questions.sample.csv`;

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [csvName, setCsvName] = useState('questions.sample.csv');
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [marking, setMarking] = useState(false);
  const [modelStatus, setModelStatus] = useState('idle'); // idle | loading | ready | error
  const [modelProgress, setModelProgress] = useState(0);
  const [markError, setMarkError] = useState(false);
  const extractorRef = useRef(null);

  // Load the sample question set on first mount.
  useEffect(() => {
    fetch(SAMPLE_CSV_URL)
      .then((r) => r.text())
      .then((text) => setQuestions(parseQuestionsCsv(text)))
      .catch(() => setQuestions([]));
  }, []);

  const current = questions[index];

  function handleCsvUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseQuestionsCsv(String(reader.result));
      setQuestions(parsed);
      setIndex(0);
      setAnswer('');
      setFeedback(null);
    };
    reader.readAsText(file);
  }

  async function ensureModel() {
    if (extractorRef.current) return extractorRef.current;
    setModelStatus('loading');
    try {
      const extractor = await loadExtractor((p) => {
        if (p.status === 'progress' && p.total) {
          setModelProgress(Math.round((p.loaded / p.total) * 100));
        }
      });
      extractorRef.current = extractor;
      setModelStatus('ready');
      return extractor;
    } catch (err) {
      console.error(err);
      setModelStatus('error');
      throw err;
    }
  }

  async function handleSubmit() {
    if (!current || !answer.trim()) return;
    setMarking(true);
    setFeedback(null);
    setMarkError(false);

    let extractor;
    try {
      extractor = await ensureModel();
    } catch (err) {
      // ensureModel() already recorded the failure via modelStatus and the
      // network-oriented .model-error banner — nothing more to show here.
      setMarking(false);
      return;
    }

    try {
      const result = await scoreAnswer(extractor, answer, current.keypoints, current.threshold);
      setFeedback(result);
    } catch (err) {
      console.error(err);
      setMarkError(true);
    } finally {
      setMarking(false);
    }
  }

  function goTo(newIndex) {
    setIndex(newIndex);
    setAnswer('');
    setFeedback(null);
    setModelStatus((s) => (s === 'error' ? 'idle' : s));
    setModelProgress(0);
    setMarkError(false);
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Interactive Worksheet</h1>
        <p className="subtitle">Type your answer, then click "Check answer" for instant feedback.</p>
      </header>

      <section className="uploader">
        <label className="upload-label">
          Load a question set (CSV):
          <input type="file" accept=".csv" onChange={handleCsvUpload} />
        </label>
        <span className="csv-name">{csvName}</span>
        <a href={SAMPLE_CSV_URL} download className="sample-link">
          download sample CSV format
        </a>
      </section>

      {!current && <p>No questions loaded. Upload a CSV to begin.</p>}

      {current && (
        <section className="worksheet">
          <nav className="q-nav">
            {questions.map((q, i) => (
              <button
                key={q.id}
                className={`q-nav-btn ${i === index ? 'active' : ''}`}
                onClick={() => goTo(i)}
              >
                {i + 1}
              </button>
            ))}
          </nav>

          <div className="question-card">
            <h2>Question {index + 1}</h2>
            <p className="question-text">{current.question}</p>

            <textarea
              className="answer-box"
              rows={5}
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <div className="actions">
              <button onClick={handleSubmit} disabled={marking || !answer.trim()}>
                {marking
                  ? modelStatus === 'loading'
                    ? `Loading marking model… ${modelProgress}%`
                    : 'Checking…'
                  : 'Check answer'}
              </button>
              {index < questions.length - 1 && (
                <button className="secondary" onClick={() => goTo(index + 1)}>
                  Next question →
                </button>
              )}
            </div>

            {modelStatus === 'loading' && marking && (
              <p className="hint">
                First check on this device — downloading a small (~25MB) language model that runs
                fully in your browser. It's cached after this, so future checks are instant.
              </p>
            )}

            {modelStatus === 'error' && !marking && (
              <p className="model-error" role="alert">
                The marking model couldn't be downloaded, so answers can't be checked
                automatically. This is usually a network restriction — it needs access to{' '}
                <code>huggingface.co</code> (the model) and <code>cdn.jsdelivr.net</code>
                (the code that runs it). Everything else on this page still works.
              </p>
            )}

            {markError && modelStatus !== 'error' && !marking && (
              <p className="model-error" role="alert">
                Something went wrong while marking that answer. Please try again.
              </p>
            )}

            {feedback && (
              <div className="feedback">
                <h3>
                  {feedback.hits} / {feedback.total} key points covered ({feedback.percentage}%)
                </h3>
                <ul className="keypoint-list">
                  {feedback.results.map((r, i) => (
                    <li key={i} className={r.hit ? 'hit' : 'miss'}>
                      <span className="icon">{r.hit ? '✓' : '✗'}</span>
                      <span className="label">{r.label}</span>
                      <span className="score">({r.score.toFixed(2)})</span>
                    </li>
                  ))}
                </ul>
                {current.modelAnswer && (
                  <details className="model-answer">
                    <summary>Show model answer</summary>
                    <p>{current.modelAnswer}</p>
                  </details>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="footer">
        <p>
          Marking runs entirely in your browser using a small local AI model — nothing you type is
          sent anywhere.
        </p>
      </footer>
    </div>
  );
}
