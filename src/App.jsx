import { useEffect, useState } from 'react';
import JsonFormatter from './components/json_formatter';
import UrlEncode from './components/url_encode';
import ColorTransformer from './components/color_transformer';

import './styles.scss';

const SidebarButton = ({ buttonKey, title, selectedTab, onClick }) => {
  return (
    <button 
      key={buttonKey}
      className={selectedTab === buttonKey ? 'active' : ''}
      onClick={() => onClick(buttonKey)}
    >
      {title}
    </button>
  );
};

function App() {
  const [selectedTab, setSelectedTab] = useState(() => {
    const tab = localStorage.getItem('selectedTab');
    return tab || '';
  });

  useEffect(() => {
    localStorage.setItem('selectedTab', selectedTab);
  }, [selectedTab]);

  const tabs = [
    { key: 'json-formatter', title: 'Json Formatter' },
    { key: 'color-transformer', title: 'Color Transformer' },
    { key: 'url-encode', title: 'Url Encode'  }
  ];

  return (
    <div className="App">
      <div className="sidebar">
        {tabs.map((tab) => (
          <SidebarButton
            buttonKey={tab.key}
            title={tab.title}
            selectedTab={selectedTab}
            onClick={setSelectedTab}
          />
        ))}
      </div>
      <div className="main-content">
        {selectedTab === 'json-formatter' && <JsonFormatter />}
        {selectedTab === 'color-transformer' && <ColorTransformer />}
        {selectedTab === 'url-encode' && <UrlEncode />}
      </div>
    </div>
  );
}

export default App;