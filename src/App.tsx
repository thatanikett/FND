import { useState } from 'react';
import FaultyTerminal from './components/FaultyTerminal';
import FakeNewsDetector from './components/FakeNewDetector';
import LandingPage from './components/LandingPage'; // Import the new component
import type { AnalysisResult } from './components/FakeNewDetector';
import './App.css';

function App() {
  // The 'results' state is now managed by the App component
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [showApp, setShowApp] = useState(false); // State to control which component is shown

  const handleLaunchApp = () => {
    setShowApp(true);
  };

  // Conditionally set the alignment class
  // It should be centered for the landing page, and top-aligned for the FND results
  const contentAlignment = !showApp || !results ? '' : 'align-top';

  return (
    <div className='app-container'>
      <div className='background-wrapper'>
        <FaultyTerminal
          scale={3}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={1}
          pause={false}
          scanlineIntensity={0.1}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={0.7}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#5cea8c"
          mouseReact={true}
          mouseStrength={1}
          pageLoadAnimation={true}
          brightness={0.7}
        />
      </div>
      {/* Conditionally add the 'align-top' class when 'results' is not null */}
      <div className={`content ${contentAlignment}`}>
        {/* Pass the state and the function to update it as props */}
        {showApp ? (
          <FakeNewsDetector results={results} setResults={setResults} />
        ) : (
          <LandingPage onLaunch={handleLaunchApp} />
        )}
      </div>
    </div>
  );
}

export default App;

