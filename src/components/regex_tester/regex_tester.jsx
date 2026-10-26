import { useMemo, useState } from 'react';
import './regex_tester.styles.scss';

const AVAILABLE_FLAGS = ['g', 'i', 'm', 's', 'u', 'y'];
const MAX_MATCHES = 1000;

const evaluateRegex = (pattern, flags, text, replacement) => {
  try {
    const regex = new RegExp(pattern, flags);
    const matches = [];
    let match;

    while ((match = regex.exec(text)) !== null && matches.length < MAX_MATCHES) {
      matches.push({
        value: match[0],
        index: match.index,
        groups: match.slice(1),
        namedGroups: match.groups || null,
      });

      if (!flags.includes('g') && !flags.includes('y')) break;
      if (match[0] === '') regex.lastIndex += 1;
    }

    return {
      regex,
      matches,
      replacement: text.replace(new RegExp(pattern, flags), replacement),
      truncated: matches.length === MAX_MATCHES,
      error: '',
    };
  } catch (error) {
    return { matches: [], replacement: '', truncated: false, error: error.message };
  }
};

const HighlightedText = ({ text, matches }) => {
  if (!matches.length) return <span>{text || 'No test text yet.'}</span>;

  const fragments = [];
  let cursor = 0;
  matches.forEach((match, index) => {
    if (match.index > cursor) fragments.push(<span key={`text-${index}`}>{text.slice(cursor, match.index)}</span>);
    if (match.value) {
      fragments.push(<mark key={`match-${index}`}>{match.value}</mark>);
      cursor = match.index + match.value.length;
    }
  });
  if (cursor < text.length) fragments.push(<span key="text-end">{text.slice(cursor)}</span>);
  return fragments;
};

const RegexTester = () => {
  const [pattern, setPattern] = useState('(https?):\\/\\/([^\\s/$.?#].[^\\s]*)');
  const [flags, setFlags] = useState(['g', 'i']);
  const [testText, setTestText] = useState('Visit https://example.com or http://localhost:3000 for more information.');
  const [replacement, setReplacement] = useState('[$1] $2');
  const [activePanel, setActivePanel] = useState('matches');

  const flagString = AVAILABLE_FLAGS.filter((flag) => flags.includes(flag)).join('');
  const result = useMemo(
    () => evaluateRegex(pattern, flagString, testText, replacement),
    [pattern, flagString, testText, replacement]
  );

  const toggleFlag = (flag) => {
    setFlags((current) => current.includes(flag)
      ? current.filter((item) => item !== flag)
      : [...current, flag]);
  };

  return (
    <div>
      <div className="tool-heading">
        <div>
          <h1>Regex Tester</h1>
          <p>Test JavaScript regular expressions, inspect capture groups, and preview replacements.</p>
        </div>
      </div>

      <div className="regex-card">
        <label className="field-label" htmlFor="regex-pattern">Regular expression</label>
        <div className={`regex-pattern-input ${result.error ? 'has-error' : ''}`}>
          <span>/</span>
          <input
            id="regex-pattern"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            spellCheck="false"
            placeholder="[a-z]+"
          />
          <span>/{flagString}</span>
        </div>
        <div className="regex-flags">
          <span>FLAGS</span>
          {AVAILABLE_FLAGS.map((flag) => (
            <button
              key={flag}
              className={flags.includes(flag) ? 'active' : ''}
              onClick={() => toggleFlag(flag)}
              title={{
                g: 'Global', i: 'Case insensitive', m: 'Multiline',
                s: 'Dot matches newline', u: 'Unicode', y: 'Sticky',
              }[flag]}
            >
              {flag}
            </button>
          ))}
        </div>
        {result.error && <div className="inline-error">{result.error}</div>}

        <div className="regex-editor-grid">
          <label>
            <span>TEST STRING</span>
            <textarea
              value={testText}
              onChange={(event) => setTestText(event.target.value)}
              spellCheck="false"
              placeholder="Enter text to test"
            />
          </label>
          <div>
            <span className="regex-panel-label">
              MATCH HIGHLIGHT
              <b>{result.matches.length}{result.truncated ? '+' : ''} matches</b>
            </span>
            <pre className="regex-highlight"><HighlightedText text={testText} matches={result.matches} /></pre>
          </div>
        </div>
      </div>

      <div className="regex-results-card">
        <div className="regex-result-tabs">
          <button className={activePanel === 'matches' ? 'active' : ''} onClick={() => setActivePanel('matches')}>
            Match details
          </button>
          <button className={activePanel === 'replace' ? 'active' : ''} onClick={() => setActivePanel('replace')}>
            Replace preview
          </button>
        </div>

        {activePanel === 'matches' ? (
          <div className="match-list">
            {!result.matches.length ? (
              <div className="regex-empty">{result.error ? 'Fix the expression to see matches.' : 'No matches found.'}</div>
            ) : result.matches.map((match, index) => (
              <div className="match-item" key={`${match.index}-${index}`}>
                <div className="match-meta">
                  <strong>Match {index + 1}</strong>
                  <span>Index {match.index}–{match.index + match.value.length}</span>
                </div>
                <code>{match.value || '(empty match)'}</code>
                {(match.groups.length > 0 || match.namedGroups) && (
                  <div className="capture-groups">
                    {match.groups.map((group, groupIndex) => (
                      <span key={groupIndex}><b>${groupIndex + 1}</b>{group ?? 'undefined'}</span>
                    ))}
                    {match.namedGroups && Object.entries(match.namedGroups).map(([name, value]) => (
                      <span key={name}><b>{name}</b>{value ?? 'undefined'}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="replace-panel">
            <label className="field-label" htmlFor="replacement-value">Replacement</label>
            <input
              id="replacement-value"
              value={replacement}
              onChange={(event) => setReplacement(event.target.value)}
              placeholder="$1"
            />
            <span>RESULT</span>
            <pre>{result.error ? 'Fix the expression to preview the result.' : result.replacement}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegexTester;
