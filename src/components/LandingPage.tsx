import React, { useEffect, useState } from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onLaunch: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [systemStatus, setSystemStatus] = useState<'ONLINE' | 'SCANNING' | 'READY'>('SCANNING');

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
    }, 1000);

    // Simulate system initialization
    const statusTimeout = setTimeout(() => {
      setSystemStatus('ONLINE');
      setTimeout(() => setSystemStatus('READY'), 2000);
    }, 1500);

    return () => {
      clearInterval(timeInterval);
      clearTimeout(statusTimeout);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return '#00ff41';
      case 'SCANNING': return '#ffff00';
      case 'READY': return '#00ff41';
      default: return '#666';
    }
  };

  return (
    <div className="landing-container">
      <div className="terminal-header">
        <div className="terminal-status">
          <div className="status-indicator">
            <div 
              className="status-dot" 
              style={{ backgroundColor: getStatusColor(systemStatus) }}
            />
            <span>SYS: {systemStatus}</span>
          </div>
          <div className="status-indicator">
            <div className="status-dot" />
            <span>NET: SECURE</span>
          </div>
        </div>
        <div className="terminal-time">
          [{currentTime}] UTC
        </div>
      </div>

      <div className="glitch-text" data-text="F.N.D.">F.N.D.</div>
      
      <p className="landing-subtitle">
        Fake News Detection Protocol
      </p>
      
      <div className="landing-description">
        Advanced heuristic analysis engine for digital media verification. 
        Employs rule-based algorithms to assess content credibility through 
        multi-vector analysis including source authentication, linguistic 
        pattern recognition, and sentiment classification matrices.
        <br /><br />
        <strong style={{ color: 'var(--accent-color)' }}>WARNING:</strong> This 
        system provides preliminary assessment only. Human verification recommended 
        for critical applications.
      </div>
      
      <button 
        type="button" 
        className="launch-btn" 
        onClick={onLaunch}
        disabled={systemStatus !== 'READY'}
        style={{ 
          opacity: systemStatus === 'READY' ? 1 : 0.6,
          cursor: systemStatus === 'READY' ? 'pointer' : 'not-allowed'
        }}
      >
        <span className="launch-btn-text">
          {systemStatus === 'READY' ? 'INITIALIZE PROTOCOL' : 'SYSTEM LOADING...'}
        </span>
      </button>

      <div className="terminal-prompt">
        root@fnd-terminal:~$
      </div>
    </div>
  );
};

export default LandingPage;