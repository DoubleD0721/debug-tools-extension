import { useEffect, useMemo, useState } from 'react';
import './timestamp_converter.styles.scss';

const toLocalInputValue = (date) => {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const parseTimestamp = (value, unit) => {
  if (!/^-?\d+(?:\.\d+)?$/.test(value.trim())) {
    throw new Error('Please enter a valid numeric timestamp.');
  }

  const numericValue = Number(value);
  const resolvedUnit = unit === 'auto'
    ? (Math.abs(numericValue) < 100000000000 ? 'seconds' : 'milliseconds')
    : unit;
  const date = new Date(resolvedUnit === 'seconds' ? numericValue * 1000 : numericValue);

  if (Number.isNaN(date.getTime())) {
    throw new Error('This timestamp is outside the supported date range.');
  }

  return { date, unit: resolvedUnit };
};

const CopyButton = ({ value, onCopied }) => (
  <button
    className="copy-value-button"
    onClick={() => {
      navigator.clipboard.writeText(String(value));
      onCopied();
    }}
  >
    Copy
  </button>
);

const TimestampConverter = () => {
  const [now, setNow] = useState(new Date());
  const [timestamp, setTimestamp] = useState(() => String(Date.now()));
  const [unit, setUnit] = useState('auto');
  const [dateInput, setDateInput] = useState(() => toLocalInputValue(new Date()));
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const timestampResult = useMemo(() => {
    try {
      const result = parseTimestamp(timestamp, unit);
      return {
        ...result,
        local: result.date.toLocaleString(),
        utc: result.date.toISOString(),
      };
    } catch (parseError) {
      return { error: parseError.message };
    }
  }, [timestamp, unit]);

  const dateResult = useMemo(() => {
    const date = new Date(dateInput);
    if (!dateInput || Number.isNaN(date.getTime())) return null;
    return {
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
      utc: date.toISOString(),
    };
  }, [dateInput]);

  const showCopied = () => setToast('Copied to clipboard');

  const useCurrentTime = () => {
    const current = new Date();
    setTimestamp(String(current.getTime()));
    setDateInput(toLocalInputValue(current));
    setUnit('milliseconds');
    setError('');
  };

  return (
    <div>
      <div className="tool-heading">
        <div>
          <h1>Timestamp Converter</h1>
          <p>Convert Unix timestamps and local dates without leaving your browser.</p>
        </div>
        <button className="secondary-action" onClick={useCurrentTime}>Use current time</button>
      </div>

      <div className="live-time-card">
        <div>
          <span>LOCAL TIME</span>
          <strong>{now.toLocaleString()}</strong>
        </div>
        <div>
          <span>UNIX SECONDS</span>
          <strong>{Math.floor(now.getTime() / 1000)}</strong>
          <CopyButton value={Math.floor(now.getTime() / 1000)} onCopied={showCopied} />
        </div>
        <div>
          <span>UNIX MILLISECONDS</span>
          <strong>{now.getTime()}</strong>
          <CopyButton value={now.getTime()} onCopied={showCopied} />
        </div>
      </div>

      <div className="timestamp-grid">
        <section className="converter-card">
          <div className="converter-card-title">
            <span className="step-number">01</span>
            <div>
              <h2>Timestamp to date</h2>
              <p>Seconds and milliseconds are detected automatically.</p>
            </div>
          </div>
          <label className="field-label" htmlFor="timestamp-value">Timestamp</label>
          <div className="joined-input">
            <input
              id="timestamp-value"
              value={timestamp}
              onChange={(event) => {
                setTimestamp(event.target.value);
                setError('');
              }}
              inputMode="numeric"
              placeholder="e.g. 1761465600000"
            />
            <select value={unit} onChange={(event) => setUnit(event.target.value)}>
              <option value="auto">Auto detect</option>
              <option value="seconds">Seconds</option>
              <option value="milliseconds">Milliseconds</option>
            </select>
          </div>
          {timestampResult.error ? (
            <div className="inline-error">{timestampResult.error}</div>
          ) : (
            <div className="conversion-results">
              <div>
                <span>Detected unit</span>
                <strong>{timestampResult.unit}</strong>
              </div>
              <div>
                <span>Local time</span>
                <strong>{timestampResult.local}</strong>
                <CopyButton value={timestampResult.local} onCopied={showCopied} />
              </div>
              <div>
                <span>UTC / ISO 8601</span>
                <strong>{timestampResult.utc}</strong>
                <CopyButton value={timestampResult.utc} onCopied={showCopied} />
              </div>
            </div>
          )}
        </section>

        <section className="converter-card">
          <div className="converter-card-title">
            <span className="step-number">02</span>
            <div>
              <h2>Date to timestamp</h2>
              <p>The entered date is interpreted in your local timezone.</p>
            </div>
          </div>
          <label className="field-label" htmlFor="date-value">Local date and time</label>
          <input
            id="date-value"
            className="date-time-input"
            type="datetime-local"
            step="1"
            value={dateInput}
            onChange={(event) => {
              setDateInput(event.target.value);
              setError('');
            }}
          />
          {dateResult ? (
            <div className="conversion-results">
              <div>
                <span>Seconds</span>
                <strong>{dateResult.seconds}</strong>
                <CopyButton value={dateResult.seconds} onCopied={showCopied} />
              </div>
              <div>
                <span>Milliseconds</span>
                <strong>{dateResult.milliseconds}</strong>
                <CopyButton value={dateResult.milliseconds} onCopied={showCopied} />
              </div>
              <div>
                <span>UTC / ISO 8601</span>
                <strong>{dateResult.utc}</strong>
                <CopyButton value={dateResult.utc} onCopied={showCopied} />
              </div>
            </div>
          ) : (
            <div className="inline-error">{error || 'Please select a valid date and time.'}</div>
          )}
        </section>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default TimestampConverter;
