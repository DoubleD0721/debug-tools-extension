import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web/build/player/lottie_light';
import './lottie_preview.styles.scss';

const validateAnimation = (value) => {
  const parsed = JSON.parse(value);
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.layers)) {
    throw new Error('This does not look like a valid Lottie animation: "layers" is missing.');
  }
  return parsed;
};

const getAnimationInfo = (data) => ({
  name: data.nm || 'Untitled animation',
  width: data.w || '—',
  height: data.h || '—',
  frameRate: data.fr || '—',
  duration: data.fr && data.op != null && data.ip != null
    ? `${((data.op - data.ip) / data.fr).toFixed(2)}s`
    : '—',
  layers: data.layers?.length || 0,
});

const LottiePreview = () => {
  const previewRef = useRef(null);
  const animationRef = useRef(null);
  const fileInputRef = useRef(null);
  const loopRef = useRef(true);
  const speedRef = useRef(1);
  const [jsonText, setJsonText] = useState('');
  const [animationData, setAnimationData] = useState(null);
  const [animationInfo, setAnimationInfo] = useState(null);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [background, setBackground] = useState('checker');

  useEffect(() => {
    if (!animationData || !previewRef.current) return undefined;

    animationRef.current?.destroy();
    try {
      const animation = lottie.loadAnimation({
        container: previewRef.current,
        renderer: 'svg',
        loop: loopRef.current,
        autoplay: true,
        animationData: JSON.parse(JSON.stringify(animationData)),
      });
      animation.setSpeed(speedRef.current);
      animation.addEventListener('complete', () => setIsPlaying(false));
      animation.addEventListener('data_failed', () => setError('Lottie could not render this animation data.'));
      animationRef.current = animation;
      setIsPlaying(true);
    } catch (renderError) {
      setError(renderError.message || 'Unable to render this Lottie animation.');
    }

    return () => {
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [animationData]);

  useEffect(() => {
    loopRef.current = loop;
    if (animationRef.current) animationRef.current.loop = loop;
  }, [loop]);

  useEffect(() => {
    speedRef.current = speed;
    animationRef.current?.setSpeed(speed);
  }, [speed]);

  const loadJson = (value) => {
    try {
      const parsed = validateAnimation(value);
      setJsonText(JSON.stringify(parsed, null, 2));
      setAnimationData(parsed);
      setAnimationInfo(getAnimationInfo(parsed));
      setError('');
    } catch (parseError) {
      setError(parseError.message || 'Invalid Lottie JSON.');
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.json')) {
      setError('Please select a .json Lottie file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => loadJson(String(reader.result || ''));
    reader.onerror = () => setError('Unable to read this file.');
    reader.readAsText(file);
  };

  const togglePlayback = () => {
    if (!animationRef.current) return;
    if (isPlaying) {
      animationRef.current.pause();
      setIsPlaying(false);
    } else {
      animationRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    animationRef.current?.stop();
    setIsPlaying(false);
  };

  const clearAnimation = () => {
    animationRef.current?.destroy();
    animationRef.current = null;
    setJsonText('');
    setAnimationData(null);
    setAnimationInfo(null);
    setError('');
    setIsPlaying(false);
  };

  return (
    <div>
      <div className="tool-heading">
        <div>
          <h1>Lottie Preview</h1>
          <p>Inspect and play local Lottie JSON animations with the lightweight SVG renderer.</p>
        </div>
        <button className="secondary-action" onClick={() => fileInputRef.current?.click()}>
          Upload JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>

      <div className="lottie-workspace">
        <section className="lottie-source-panel">
          <div className="lottie-panel-heading">
            <div>
              <span>LOTTIE JSON</span>
              <small>{jsonText.length.toLocaleString()} characters</small>
            </div>
            <button onClick={clearAnimation} disabled={!jsonText}>Clear</button>
          </div>
          <textarea
            value={jsonText}
            onChange={(event) => {
              setJsonText(event.target.value);
              setError('');
            }}
            placeholder={'Paste your Lottie JSON here, then click "Load preview".'}
            spellCheck="false"
          />
          {error && <div className="inline-error">{error}</div>}
          <button
            className="primary-action lottie-load-button"
            onClick={() => loadJson(jsonText)}
            disabled={!jsonText.trim()}
          >
            Load preview
          </button>
        </section>

        <section className="lottie-preview-panel">
          <div className="lottie-preview-toolbar">
            <div className="background-switcher" aria-label="Preview background">
              {['checker', 'light', 'dark'].map((value) => (
                <button
                  key={value}
                  className={`${value} ${background === value ? 'active' : ''}`}
                  onClick={() => setBackground(value)}
                  title={`${value} background`}
                />
              ))}
            </div>
            <span>{animationInfo?.name || 'PREVIEW'}</span>
          </div>

          <div className={`lottie-canvas ${background}`}>
            <div ref={previewRef} className="lottie-animation" />
            {!animationData && (
              <div className="lottie-empty">
                <div className="lottie-empty-icon">▶</div>
                <strong>No animation loaded</strong>
                <span>Paste JSON or upload a local file.</span>
              </div>
            )}
          </div>

          <div className="lottie-controls">
            <button onClick={togglePlayback} disabled={!animationData}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={stopPlayback} disabled={!animationData}>Stop</button>
            <label>
              <input type="checkbox" checked={loop} onChange={(event) => setLoop(event.target.checked)} />
              Loop
            </label>
            <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))} disabled={!animationData}>
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={1.5}>1.5×</option>
              <option value={2}>2×</option>
            </select>
          </div>

          {animationInfo && (
            <div className="lottie-info">
              <div><span>Size</span><strong>{animationInfo.width} × {animationInfo.height}</strong></div>
              <div><span>Duration</span><strong>{animationInfo.duration}</strong></div>
              <div><span>Frame rate</span><strong>{animationInfo.frameRate} fps</strong></div>
              <div><span>Layers</span><strong>{animationInfo.layers}</strong></div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LottiePreview;
