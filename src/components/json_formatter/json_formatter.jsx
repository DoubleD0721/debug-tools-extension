import { useEffect, useRef, useState } from 'react';
import JsonTree from './json_tree';

import './json_formatter.styles.scss'; 

const escape = (str) => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

const unescape = (str) => {
  return str
    .replace(/\\\\/g, '\\')
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t');
}

const getJsonErrorDetails = (error, source) => {
  const message = error?.message || 'Invalid JSON format';
  const positionMatch = message.match(/position\s+(\d+)/i);
  const lineColumnMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  let position = positionMatch ? Number(positionMatch[1]) : null;

  if (position === null && lineColumnMatch) {
    const targetLine = Number(lineColumnMatch[1]);
    const targetColumn = Number(lineColumnMatch[2]);
    const lines = source.split('\n');
    position = lines
      .slice(0, Math.max(0, targetLine - 1))
      .reduce((total, line) => total + line.length + 1, 0) + targetColumn - 1;
  }

  // "Unexpected end" errors do not always include a position.
  if (position === null && /end of json input|end of data/i.test(message)) {
    position = source.length;
  }

  if (position === null) {
    return { message, position: null, line: null, column: null, snippet: null };
  }

  const safePosition = Math.max(0, Math.min(position, source.length));
  const beforeError = source.slice(0, safePosition);
  const line = beforeError.split('\n').length;
  const lineStart = beforeError.lastIndexOf('\n') + 1;
  const lineEndIndex = source.indexOf('\n', safePosition);
  const lineEnd = lineEndIndex === -1 ? source.length : lineEndIndex;
  const snippet = source.slice(lineStart, lineEnd) || '(end of input)';

  return {
    message,
    position: safePosition,
    line,
    column: safePosition - lineStart + 1,
    snippet,
  };
};

const JsonFormatter = () => {
  const textareaRef = useRef(null);
  const [inputJson, setInputJson] = useState(() => {
    const json = localStorage.getItem('lastJsonResult');
    return json || ''
  });
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    localStorage.setItem('lastJsonResult', inputJson);
  }, [inputJson])

  const success = () => {
    setError(null);
    setIsEditing(false);
    setIsViewing(false)
  }

  const fail = (parseError) => {
    const details = getJsonErrorDetails(parseError, inputJson);
    setError(details);
    setIsEditing(true);
    setIsViewing(false);

    if (details.position !== null) {
      requestAnimationFrame(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.focus();
        textarea.setSelectionRange(
          details.position,
          Math.min(details.position + 1, inputJson.length)
        );
      });
    }
  }

  const copyToClipboard = () => {
    if (inputJson) {
      navigator.clipboard.writeText(inputJson);
      setToast('Copied to clipboard');
    } else {
      setToast('No content to copy');
    }
  };

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(null);
      }, 3000);
    }
  }, [toast])

  const formatJson = () => {
    try {
      const parsedJson = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsedJson, null, 2);
      setInputJson(formatted);
      success();
    } catch (e) {
      fail(e);
    }
  };

  const minifyJson = () => {
    try {
      const parsedJson = JSON.parse(inputJson);
      const minifiedJson = JSON.stringify(parsedJson);
      setInputJson(minifiedJson);
      success();
    } catch (e) {
      fail(e);
    }
  };

  const escapeJson = () => {
    try {
      const escapedJson = escape(inputJson);
      setInputJson(escapedJson);
      success();
    } catch (e) {
      fail(e.message || 'Escape JSON format');
    }
  };

  const unescapeJson = () => {
    try {
      const unescapedJson = unescape(inputJson);
      setInputJson(unescapedJson);
      success();
    } catch (e) {
      fail(e.message || 'Unescape JSON format');
    }
  }

  const highlightJson = (json) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][-+]?\d+)?)/g, (match) => {
      let cls = 'number';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'key' : 'string';
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  };

  const clearInput = () => {
    setInputJson('');
    setError(null);
    setToast(null);
    setIsEditing(true);
  };

  let parsedData;
  try {
    parsedData = JSON.parse(inputJson);
  } catch (e) {
    parsedData = null;
  }

  return (
    <div>
      <h1>Json Formatter</h1>
      <div className={`editor-container ${error ? 'has-error' : ''}`}>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={inputJson}
            onChange={(e) => {
              setInputJson(e.target.value);
              setError(null);
            }}
            placeholder="Enter JSON here"
            className="json-formatter-textarea"
            wrap="off"
          />
        ) : isViewing && parsedData ? (
          <div className="json-tree">
            <JsonTree data={parsedData} />
          </div>
        ) : (
          <pre 
            className="json-formatter-pre"
            dangerouslySetInnerHTML={{ __html: highlightJson(inputJson) }}
          />
        )}
        <button className="clear-button" onClick={clearInput}>Clear</button>
      </div>
      {error && (
        <div className="json-error-panel" role="alert">
          <div className="json-error-heading">
            <strong>JSON syntax error</strong>
            {error.line && <span>Line {error.line}, Column {error.column}</span>}
          </div>
          <p>{error.message}</p>
          {error.snippet && (
            <pre className="json-error-snippet">
              <code>{error.snippet}</code>
              <span style={{ '--error-column': error.column }}>{'^'}</span>
            </pre>
          )}
        </div>
      )}
      <div className="json-formatter-button-container">
        <button onClick={copyToClipboard} className="button">Copy to Clipboard</button>
        <button onClick={formatJson} className="button">Format JSON</button>
        <button onClick={minifyJson} className="button">Minify JSON</button>
        <button onClick={escapeJson} className="button">Escape JSON</button>
        <button onClick={unescapeJson} className="button">Unescape JSON</button>
        <button 
          onClick={() => {
            if (isViewing || isEditing) {
              return;
            }
            setIsViewing(true)
          }} 
          className={`button ${isViewing || isEditing ? 'disabled': ''}`}
        >View JSON</button> 
        <button 
          onClick={() => {
            if (isEditing) {
              return;
            }
            setIsEditing(true)
          }} 
          className={`button ${isEditing ? 'disabled': ''}`}
        >Start Editing</button>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default JsonFormatter;