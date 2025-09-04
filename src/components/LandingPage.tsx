import React from 'react';
import './LandingPage.css'; // We will create this CSS file next

interface LandingPageProps {
  onLaunch: () => void; // A function to tell the parent component to launch the app
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="landing-container">
      <div className="glitch-text" data-text="F.N.D.">F.N.D.</div>
      <p className="landing-subtitle">A Rule-Based Heuristic Analyzer for Digital Media</p>
      <p className="landing-description">
        This tool performs a heuristic analysis on article text or URLs to identify common indicators of misinformation. It checks against a curated set of rules, including source credibility, headline sensationalism, and emotional language, to provide a preliminary credibility score.
      </p>
      <button type="button" className="launch-btn" onClick={onLaunch}>
        <span className="launch-btn-text">[ Initiate System ]</span>
      </button>
    </div>
  );
};

export default LandingPage;
