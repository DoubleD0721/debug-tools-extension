import { useEffect, useState } from 'react';
import './url_encode.styles.scss'; 

const UrlEncode = () => {
  const [inputUrl, setInputUrl] = useState(() => {
    const url = localStorage.getItem('lastUrlResult');
    return url || ''
  });
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('lastUrlResult', inputUrl);
  }, [inputUrl])

  const success = () => {
    setError(null);
  }
  const fail = (message) => {
    setError(message);
  }

  const encodeUrl = () => {
    try {
      const encoded = encodeURIComponent(inputUrl);
      setInputUrl(encoded);
      success();
    } catch (e) {
      fail(e.message || 'Encoding failed');
    }
  };

  // 新增 URL 解码函数
  const decodeUrl = () => {
    try {
      const decoded = decodeURIComponent(inputUrl);
      setInputUrl(decoded);
      success();
    } catch (e) {
      fail(e.message || 'Decoding failed');
    }
  };

  const copyToClipboard = () => {
    if (inputUrl) {
      navigator.clipboard.writeText(inputUrl);
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

  return (
    <div>
      <h1>Url Encode</h1>
      <textarea
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        placeholder="Enter Url here"
        className="url-encode-textarea"
        wrap='off'
      />
      {error && <text className="error-message">{error}</text>}
      <div className="url-encode-button-container">
        <button onClick={copyToClipboard} className="button">Copy to Clipboard</button>
        <button onClick={encodeUrl} className="button">Encode</button>
        <button onClick={decodeUrl} className="button">Decode</button>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default UrlEncode;