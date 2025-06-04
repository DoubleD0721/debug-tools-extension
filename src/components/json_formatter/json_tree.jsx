import { useState } from 'react';
import './json_formatter.styles.scss';

const getKeysNumber = (data) => {
  const isObject = typeof data === 'object' && data!== null;
  if (!isObject) {
    return 0;
  }
  return Object.keys(data).length;
}

const JsonTreeNode = ({ nodeKey, value, depth }) => {
  const [expanded, setExpanded] = useState(true);
  const isArray = Array.isArray(value);
  const keysLength = getKeysNumber(value);

  return (
    <div className="json-item">
      {keysLength === 0 ? (
        <>
          {nodeKey && <span className="key">"{nodeKey}: "</span>}
          <JsonTree data={value} depth={depth + 1} />
        </>
      ) : (
        <>
          <div className="json-header" onClick={() => setExpanded(!expanded)}>
            {nodeKey && <span className="key">"{nodeKey}: "</span>}
            {isArray ? '[' : '{'}
            <div className='toggle-container'>
              <span>{expanded ? ' ▼' : ' ▶'}</span>
              {` // ${keysLength} ${keysLength === 1 ? 'item' : 'items'} `}
            </div>
            {!expanded && `${isArray ? ']' : '}'}`}
          </div>
          {expanded && <JsonTree data={value} depth={depth + 1} />}
        </>
      )}
    </div>
  );
};


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
    return isArray ? (
      <span>{JSON.stringify([])}</span>
    ) : (
      <span>{JSON.stringify({})}</span>
    );
  }

  return (
    <div>
      {!depth && (
        <div className="json-header" onClick={toggleExpand}>
          {isArray ? '[' : '{'}
          <div className='toggle-container'>
            <span>{expanded ? ' ▼' : ' ▶'}</span>
            {` // ${keys.length} ${keys.length === 1 ? 'item' : 'items'} `}
          </div>
          {!expanded && `${isArray ? ']' : '}'}`}
        </div>
      )}
      {expanded && (
        <div>
          {keys.map((key, index) => (
            <JsonTreeNode 
              key={index}
              nodeKey={isArray ? null : key}
              value={data[key]} 
              depth={depth} 
            />
          ))}
          <div>{isArray ? ']' : '}'}</div>
        </div>
      )}
    </div>
  );
};

export default JsonTree;