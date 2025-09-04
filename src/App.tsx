import { useState } from 'react';
import FaultyTerminal from './components/FaultyTerminal';
import FakeNewsDetector from './components/FakeNewDetector';
// Import the AnalysisResult type from the component file
import type { AnalysisResult } from './components/FakeNewDetector';
import './App.css';

function App() {
  // The 'results' state is now managed by the App component
  const [results, setResults] = useState<AnalysisResult | null>(null);

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
          tint="#90EE90"
          mouseReact={true}
          mouseStrength={1}
          pageLoadAnimation={true}
          brightness={0.7}
        />
      </div>
      {/* Conditionally add the 'align-top' class when 'results' is not null */}
      <div className={`content ${results ? 'align-top' : ''}`}>
        {/* Pass the state and the function to update it as props */}
        <FakeNewsDetector results={results} setResults={setResults} />
      </div>
    </div>
  );
}

export default App;