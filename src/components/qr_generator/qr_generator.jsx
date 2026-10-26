import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import './qr_generator.styles.scss';

const QrGenerator = () => {
  const [content, setContent] = useState(() => localStorage.getItem('lastQrContent') || '');
  const [size, setSize] = useState(320);
  const [errorLevel, setErrorLevel] = useState('M');
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('lastQrContent', content);
  }, [content]);

  useEffect(() => {
    let cancelled = false;

    if (!content.trim()) {
      setDataUrl('');
      setError('');
      return () => {
        cancelled = true;
      };
    }

    QRCode.toDataURL(content, {
      width: size,
      margin: 2,
      errorCorrectionLevel: errorLevel,
      color: {
        dark: '#101827',
        light: '#FFFFFFFF',
      },
    })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setError('');
        }
      })
      .catch((generationError) => {
        if (!cancelled) {
          setDataUrl('');
          setError(generationError.message || 'Unable to generate this QR code.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [content, size, errorLevel]);

  const downloadQrCode = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div>
      <div className="tool-heading qr-heading">
        <div>
          <h1>QR Code Generator</h1>
          <p>Create a downloadable QR code locally. Your content never leaves this browser.</p>
        </div>
      </div>

      <div className="qr-workspace">
        <section className="qr-controls">
          <div className="qr-section-title">
            <span className="step-number">01</span>
            <div>
              <h2>Add your content</h2>
              <p>Paste a URL, text, Wi-Fi payload, or any content you want to share.</p>
            </div>
          </div>

          <label className="field-label" htmlFor="qr-content">Text or URL</label>
          <div className="qr-textarea-wrap">
            <textarea
              id="qr-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="https://example.com"
              maxLength={2000}
            />
            <span>{content.length} / 2000</span>
          </div>

          <div className="qr-options">
            <label>
              <span>Image size</span>
              <select value={size} onChange={(event) => setSize(Number(event.target.value))}>
                <option value={240}>240 × 240</option>
                <option value={320}>320 × 320</option>
                <option value={480}>480 × 480</option>
                <option value={640}>640 × 640</option>
              </select>
            </label>
            <label>
              <span>Error correction</span>
              <select value={errorLevel} onChange={(event) => setErrorLevel(event.target.value)}>
                <option value="L">Low · 7%</option>
                <option value="M">Medium · 15%</option>
                <option value="Q">Quartile · 25%</option>
                <option value="H">High · 30%</option>
              </select>
            </label>
          </div>

          <div className="qr-actions">
            <button className="primary-action" onClick={downloadQrCode} disabled={!dataUrl}>
              Download PNG
            </button>
            <button className="plain-action" onClick={() => setContent('')} disabled={!content}>
              Clear
            </button>
          </div>
          {error && <div className="inline-error">{error}</div>}
        </section>

        <section className="qr-preview-panel">
          <div className="qr-preview-label">
            <span>LIVE PREVIEW</span>
            {dataUrl && <small>{size} × {size} PNG</small>}
          </div>
          <div className={`qr-preview ${dataUrl ? 'has-code' : ''}`}>
            {dataUrl ? (
              <img src={dataUrl} alt="Generated QR code" />
            ) : (
              <div className="qr-empty-state">
                <div className="qr-placeholder-icon">
                  <i /><i /><i /><i />
                </div>
                <strong>Your QR code will appear here</strong>
                <span>Enter some content to start generating.</span>
              </div>
            )}
          </div>
          <p className="privacy-note"><span className="status-dot" /> Generated entirely on this device</p>
        </section>
      </div>
    </div>
  );
};

export default QrGenerator;
