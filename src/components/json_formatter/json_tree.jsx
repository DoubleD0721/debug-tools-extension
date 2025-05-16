import { useState } from 'react';
import './json_formatter.styles.scss';

const JsonTree = ({ data, depth = 0 }) => {
  const [expanded, setExpanded] = useState(true);
  const isObject = typeof data === 'object' && data !== null;
  const isArray = Array.isArray(data);

  if (!isObject) {
    let valueClass = 'json-value';
    if (typeof data === 'number') {
      valueClass = 'number';
    } else if (typeof data === 'string') {
      valueClass = 'string';
    } else if (typeof data === 'boolean') {
      valueClass = 'boolean';
    } else if (data === null) {
      valueClass = 'null';
    }
    return <span className={valueClass}>{JSON.stringify(data)}</span>;
  }

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const keys = Object.keys(data);
  if (keys.length === 0) {
    return isArray ? <span className="json-value">[]</span> : <span className="json-value">{{}}</span>;
  }

  return (
    <div className="json-node">
      <div className="json-header" onClick={toggleExpand}>
        {isArray ? '[' : '{'}
        <span className="toggle-icon">{expanded ? '▼' : '▶'}</span>
        {isArray ? `] (${keys.length})` : `} (${keys.length})`}
      </div>
      {expanded && (
        <div className="json-children" style={{ marginLeft: `${depth * 5}px` }}>
          {keys.map((key, index) => (
            <div key={index} className="json-item">
              <span className="key">"{key}"</span>:{" "}
              <JsonTree data={data[key]} depth={depth + 1} />
              {index < keys.length - 1 && <span className="json-comma">,</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JsonTree;