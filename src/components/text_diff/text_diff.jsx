import { useMemo, useState } from 'react';
import { diffLines, diffWordsWithSpace } from 'diff';
import './text_diff.styles.scss';

const toLines = (value) => {
  const lines = value.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
};

const buildSideBySideRows = (parts) => {
  const rows = [];

  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    const next = parts[index + 1];
    const isChangedPair = (part.removed && next?.added) || (part.added && next?.removed);

    if (isChangedPair) {
      const removedPart = part.removed ? part : next;
      const addedPart = part.added ? part : next;
      const removedLines = toLines(removedPart.value);
      const addedLines = toLines(addedPart.value);
      const length = Math.max(removedLines.length, addedLines.length);

      for (let rowIndex = 0; rowIndex < length; rowIndex += 1) {
        rows.push({
          type: 'modified',
          left: removedLines[rowIndex] ?? '',
          right: addedLines[rowIndex] ?? '',
        });
      }
      index += 1;
      continue;
    }

    toLines(part.value).forEach((line) => {
      rows.push({
        type: part.added ? 'added' : part.removed ? 'removed' : 'unchanged',
        left: part.added ? '' : line,
        right: part.removed ? '' : line,
      });
    });
  }

  return rows;
};

const WordDiff = ({ before, after, side }) => {
  const parts = diffWordsWithSpace(before, after);
  return parts.map((part, index) => {
    if (side === 'left' && part.added) return null;
    if (side === 'right' && part.removed) return null;
    const highlighted = side === 'left' ? part.removed : part.added;
    return highlighted
      ? <mark key={index}>{part.value}</mark>
      : <span key={index}>{part.value}</span>;
  });
};

const TextDiff = () => {
  const [original, setOriginal] = useState('');
  const [updated, setUpdated] = useState('');
  const [viewMode, setViewMode] = useState('split');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const parts = useMemo(
    () => diffLines(original, updated, { ignoreWhitespace, ignoreCase }),
    [original, updated, ignoreWhitespace, ignoreCase]
  );
  const rows = useMemo(() => buildSideBySideRows(parts), [parts]);
  const stats = useMemo(() => rows.reduce((result, row) => {
    if (row.type === 'added') result.added += 1;
    if (row.type === 'removed') result.removed += 1;
    if (row.type === 'modified') result.modified += 1;
    return result;
  }, { added: 0, removed: 0, modified: 0 }), [rows]);
  const hasInput = original.length > 0 || updated.length > 0;

  return (
    <div>
      <div className="tool-heading">
        <div>
          <h1>Text Diff</h1>
          <p>Compare two blocks of text with line and word-level highlighting.</p>
        </div>
        <div className="diff-heading-actions">
          <button className="plain-action" onClick={() => {
            setOriginal(updated);
            setUpdated(original);
          }}>Swap sides</button>
          <button className="plain-action" onClick={() => {
            setOriginal('');
            setUpdated('');
          }} disabled={!hasInput}>Clear</button>
        </div>
      </div>

      <div className="diff-input-grid">
        <label>
          <span>ORIGINAL</span>
          <textarea
            value={original}
            onChange={(event) => setOriginal(event.target.value)}
            placeholder="Paste the original text here"
            spellCheck="false"
          />
        </label>
        <label>
          <span>UPDATED</span>
          <textarea
            value={updated}
            onChange={(event) => setUpdated(event.target.value)}
            placeholder="Paste the updated text here"
            spellCheck="false"
          />
        </label>
      </div>

      <div className="diff-toolbar">
        <div className="segmented-control">
          <button className={viewMode === 'split' ? 'active' : ''} onClick={() => setViewMode('split')}>
            Side by side
          </button>
          <button className={viewMode === 'inline' ? 'active' : ''} onClick={() => setViewMode('inline')}>
            Inline
          </button>
        </div>
        <div className="diff-options">
          <label><input type="checkbox" checked={ignoreWhitespace} onChange={(event) => setIgnoreWhitespace(event.target.checked)} /> Ignore whitespace</label>
          <label><input type="checkbox" checked={ignoreCase} onChange={(event) => setIgnoreCase(event.target.checked)} /> Ignore case</label>
        </div>
        <div className="diff-stats">
          <span className="added">+{stats.added}</span>
          <span className="removed">−{stats.removed}</span>
          <span className="modified">~{stats.modified}</span>
        </div>
      </div>

      <div className="diff-result">
        {!hasInput ? (
          <div className="diff-empty">Enter text on both sides to see the differences.</div>
        ) : viewMode === 'split' ? (
          <div className="split-diff">
            <div className="diff-column-head"><span>Original</span><span>Updated</span></div>
            {rows.map((row, index) => (
              <div className={`diff-row ${row.type}`} key={`${index}-${row.type}`}>
                <pre>
                  <b>{row.left !== '' ? index + 1 : ''}</b>
                  <code>{row.type === 'modified'
                    ? <WordDiff before={row.left} after={row.right} side="left" />
                    : row.left || ' '}</code>
                </pre>
                <pre>
                  <b>{row.right !== '' ? index + 1 : ''}</b>
                  <code>{row.type === 'modified'
                    ? <WordDiff before={row.left} after={row.right} side="right" />
                    : row.right || ' '}</code>
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="inline-diff">
            {parts.map((part, index) => (
              <pre className={part.added ? 'added' : part.removed ? 'removed' : 'unchanged'} key={index}>
                <span>{part.added ? '+' : part.removed ? '−' : ' '}</span>
                <code>{part.value || ' '}</code>
              </pre>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextDiff;
