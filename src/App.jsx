import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isActive, setIsActive] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState('general')

  const configs = [
    { id: 'general', name: 'General' },
    { id: 'general-alt', name: 'General ALT' },
    { id: 'general-alt2', name: 'General ALT2' },
    { id: 'general-alt3', name: 'General ALT3' },
    { id: 'general-alt4', name: 'General ALT4' },
    { id: 'general-alt5', name: 'General ALT5' },
    { id: 'general-alt6', name: 'General ALT6' },
    { id: 'general-alt7', name: 'General ALT7' },
    { id: 'general-alt8', name: 'General ALT8' },
    { id: 'general-alt9', name: 'General ALT9' },
    { id: 'general-alt10', name: 'General ALT10' },
    { id: 'general-alt11', name: 'General ALT11' },
    { id: 'fake-tls', name: 'Fake TLS' },
    { id: 'fake-tls-alt', name: 'Fake TLS ALT' },
    { id: 'fake-tls-alt2', name: 'Fake TLS ALT2' },
    { id: 'fake-tls-alt3', name: 'Fake TLS ALT3' },
    { id: 'simple-fake', name: 'Simple Fake' },
    { id: 'simple-fake-alt', name: 'Simple Fake ALT' },
    { id: 'simple-fake-alt2', name: 'Simple Fake ALT2' },
  ]

  const toggleConnection = async () => {
    if (isActive) {
      const result = await window.electron.stopZapret()
      if (result.success) {
        setIsActive(false)
      }
    } else {
      const result = await window.electron.startZapret(selectedConfig)
      if (result.success) {
        setIsActive(true)
      }
    }
  }

  return (
    <div className="app">
      <div className="container">
        <div className="titlebar">
          <div className="titlebar-drag"></div>
          <div className="titlebar-buttons">
            <button className="titlebar-btn minimize" onClick={() => window.electron.minimizeApp()}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="0" y="5" width="12" height="2" fill="currentColor"/>
              </svg>
            </button>
            <button className="titlebar-btn maximize" onClick={() => window.electron.maximizeApp()}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="0" y="0" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            <button className="titlebar-btn close" onClick={() => window.electron.closeApp()}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M0 0 L12 12 M12 0 L0 12" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="header">
          <h1>ZAPRET</h1>
          <div className="status-indicator">
            <div className={`status-dot ${isActive ? 'active' : ''}`}></div>
            <span>{isActive ? 'CONNECTED' : 'DISCONNECTED'}</span>
          </div>
        </div>

        <div className="power-button-container">
          <button 
            className={`power-button ${isActive ? 'active' : ''}`}
            onClick={toggleConnection}
          >
            <div className="power-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v10M18.36 6.64a9 9 0 1 1-12.73 0" />
              </svg>
            </div>
          </button>
          <p className="power-label">{isActive ? 'Tap to Disconnect' : 'Tap to Connect'}</p>
        </div>

        <div className="config-section">
          <h2>Configuration</h2>
          <div className="config-grid">
            {configs.map((config) => (
              <button
                key={config.id}
                className={`config-item ${selectedConfig === config.id ? 'selected' : ''}`}
                onClick={() => setSelectedConfig(config.id)}
                disabled={isActive}
              >
                {config.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
