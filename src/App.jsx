import { useEffect, useState } from 'react';
import JsonFormatter from './components/json_formatter';
import UrlEncode from './components/url_encode';
import ColorTransformer from './components/color_transformer';
import TimestampConverter from './components/timestamp_converter';
import QrGenerator from './components/qr_generator';

import './styles.scss';

const SidebarButton = ({ buttonKey, title, selectedTab, onClick }) => {
  const icons = {
    'json-formatter': '{ }',
    'color-transformer': '◐',
    'url-encode': '↗',
    'timestamp-converter': '◷',
    'qr-generator': '▦',
  };

  return (
    <button 
      key={buttonKey}
      className={selectedTab === buttonKey ? 'active' : ''}
      onClick={() => onClick(buttonKey)}
    >
      <span className="nav-icon">{icons[buttonKey]}</span>
      <span>{title}</span>
    </button>
  );
};

function App() {
  const [selectedTab, setSelectedTab] = useState(() => {
    const tab = localStorage.getItem('selectedTab');
    return tab || 'json-formatter';
  });

  useEffect(() => {
    localStorage.setItem('selectedTab', selectedTab);
  }, [selectedTab]);

  const tabs = [
    { key: 'json-formatter', title: 'Json Formatter' },
    { key: 'color-transformer', title: 'Color Transformer' },
    { key: 'url-encode', title: 'Url Encode' },
    { key: 'timestamp-converter', title: 'Timestamp' },
    { key: 'qr-generator', title: 'QR Code' },
  ];

  return (
    <div className="App">
      <div className="sidebar">
        <div className="brand">
          <div className="brand-mark">D</div>
          <div>
            <strong>Debug Tools</strong>
            <span>Developer utilities</span>
          </div>
        </div>
        <nav>
          <p className="nav-label">TOOLS</p>
          {tabs.map((tab) => (
            <SidebarButton
              key={tab.key}
              buttonKey={tab.key}
              title={tab.title}
              selectedTab={selectedTab}
              onClick={setSelectedTab}
            />
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" />
          Runs locally
        </div>
      </div>
      <div className="main-content">
        {selectedTab === 'json-formatter' && <JsonFormatter />}
        {selectedTab === 'color-transformer' && <ColorTransformer />}
        {selectedTab === 'url-encode' && <UrlEncode />}
        {selectedTab === 'timestamp-converter' && <TimestampConverter />}
        {selectedTab === 'qr-generator' && <QrGenerator />}
      </div>
    </div>
  );
}

export default App;