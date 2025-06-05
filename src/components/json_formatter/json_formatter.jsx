import { useEffect, useState } from 'react';
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

const JsonFormatter = () => {
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
  const fail = (message) => {
    setError(message);
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
      fail(e.message || 'Invalid JSON format');
    }
  };

  const minifyJson = () => {
    try {
      const parsedJson = JSON.parse(inputJson);
      const minifiedJson = JSON.stringify(parsedJson);
      setInputJson(minifiedJson);
      success();
    } catch (e) {
      fail(e.message || 'Minify JSON format');
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
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
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
      <div className="editor-container">
        {isEditing ? (
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
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
      {error && <text className="error-message">{error}</text>}
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