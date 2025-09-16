import React, { useState } from 'react';
import './FakeNewDetector.css';

// --- Type Definitions for Analysis Results ---
interface AnalysisItem {
  rule: string;
  passed: boolean | null;
  score: string;
  reasoning: string;
}

// The 'AnalysisResult' type is now exported
export type AnalysisResult = {
  source: string;
  headline: string;
  analysis: AnalysisItem[];
  finalConfidence: number;
  judgment: "Likely Credible" | "Likely False";
  level: "High Confidence" | "Medium Confidence" | "Low Confidence";
};

// Define the component's props
interface FNDProps {
  results: AnalysisResult | null;
  setResults: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;
}

const FakeNewsDetector: React.FC<FNDProps> = ({ results, setResults }) => {
  // 'results' and 'setResults' are now received as props
  // The component still manages its own input and loading states
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeArticle = (source: string, articleText: string): AnalysisResult => {
      let confidence = 50;
      const analysis: AnalysisItem[] = [];

      // 1. Source Credibility
      const reputableDomains = ['nytimes.com', 'bbc.com', 'reuters.com', 'apnews.com', 'wsj.com', 'theguardian.com', 'npr.org', 'indiatoday.in'];
      const suspiciousDomains = ['infowars.com', 'breitbart.com', 'dailycaller.com', 'naturalnews.com', 'worldnewsdailyreport.com', 'thegatewaypundit.com'];
      
      if (source !== "Pasted Text") {
          if (reputableDomains.some(d => source.includes(d))) {
              confidence += 10;
              analysis.push({ rule: 'Source Credibility', passed: true, score: '+10', reasoning: `Source domain '${source}' is on the list of reputable news outlets.` });
          } else if (suspiciousDomains.some(d => source.includes(d))) {
              confidence -= 20;
              analysis.push({ rule: 'Source Credibility', passed: false, score: '-20', reasoning: `Source domain '${source}' is on a list of outlets known for potential bias or misinformation.` });
          } else {
              analysis.push({ rule: 'Source Credibility', passed: null, score: '±0', reasoning: `Source domain '${source}' is not on our predefined lists. Its credibility is unverified but not penalized.` });
          }
      } else {
          analysis.push({ rule: 'Source Credibility', passed: null, score: 'N/A', reasoning: `Cannot assess source credibility for pasted text.` });
      }

      const headline = articleText.split('\n')[0].trim();
      const lowerCaseHeadline = headline.toLowerCase();

      // 2. Headline Style
      const sensationalWords = ['shocking', 'bombshell', 'unbelievable', 'secret', 'exposed', 'miracle', 'cover-up', 'hoax', 'scandal'];
      const isSensational = sensationalWords.some(word => lowerCaseHeadline.includes(word)) || (headline.toUpperCase() === headline && headline.length > 20) || headline.includes('!');
      if (isSensational) {
          confidence -= 15;
          analysis.push({ rule: 'Headline Style', passed: false, score: '-15', reasoning: 'Headline uses sensational language, excessive capitalization, or exclamation points, which are common clickbait tactics.' });
      } else {
          confidence += 10;
          analysis.push({ rule: 'Headline Style', passed: true, score: '+10', reasoning: 'Headline appears to be neutral and informative.' });
      }

      // 3. Citation Quality - Fixed regex
      const hasLinks = /(https?:\/\/[^\s]+)/g.test(articleText);
      const vagueSources = /sources say|experts believe|it is reported/i.test(articleText)
      if (vagueSources) {
          confidence -= 15;
          analysis.push({ rule: 'Citation Quality', passed: false, score: '-15', reasoning: 'The article relies on vague or anonymous sources (e.g., "sources say"), which weakens its credibility.' });
      } else if (hasLinks) {
          confidence += 10;
          analysis.push({ rule: 'Citation Quality', passed: true, score: '+10', reasoning: 'The article contains links, suggesting verifiable sources may be cited.' });
      } else {
           analysis.push({ rule: 'Citation Quality', passed: null, score: '±0', reasoning: 'No clear citations (links or vague phrases) were detected.' });
      }

      // 4. Writing Style
      const typos = (articleText.match(/\b(teh|wierd|definately)\b/ig) || []).length;
      const excessiveCaps = (articleText.match(/\b[A-Z]{4,}\b/g) || []).length > 3;
      const excessivePunctuation = (articleText.match(/!{2,}/g) || []).length > 1;
      if (typos > 0 || excessiveCaps || excessivePunctuation) {
          confidence -= 10;
          analysis.push({ rule: 'Writing Style', passed: false, score: '-10', reasoning: 'The text contains common typos, excessive capitalization, or punctuation, suggesting a lack of professional editing.' });
      } else {
          confidence += 5;
          analysis.push({ rule: 'Writing Style', passed: true, score: '+5', reasoning: 'The writing style appears professional and adheres to standard grammatical conventions.' });
      }

      // 5. Date & Context
      const hasDate = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2},?\s\d{4}\b/i.test(articleText);
      if(hasDate) {
          confidence += 5;
          analysis.push({ rule: 'Date & Context', passed: true, score: '+5', reasoning: 'A specific publication date was found, providing temporal context.' });
      } else {
          confidence -= 5;
          analysis.push({ rule: 'Date & Context', passed: false, score: '-5', reasoning: 'The article lacks a clear publication date, which can be a tactic to make old news seem current.' });
      }

      // 6. Emotional Language - Fixed logic consistency
      const emotionalWords = ['outrageous', 'disgusting', 'shameful', 'corrupt', 'liar', 'idiot', 'hates'];
      const usesEmotionalLanguage = emotionalWords.some(word => articleText.toLowerCase().includes(word));
      if (usesEmotionalLanguage) {
          confidence -= 10;
          analysis.push({ rule: 'Emotional Language', passed: false, score: '-10', reasoning: 'The article uses emotionally charged or inflammatory language, common in propaganda, not objective reporting.' });
      } else {
           analysis.push({ rule: 'Emotional Language', passed: true, score: '+5', reasoning: 'The article maintains a generally neutral tone.' });
           confidence += 5;
      }

      // Final Calculation
      const finalConfidence = Math.max(0, Math.min(100, confidence));
      const judgment = finalConfidence >= 50 ? "Likely Credible" : "Likely False";
      let level: "High Confidence" | "Medium Confidence" | "Low Confidence";
      if (finalConfidence > 80) level = "High Confidence";
      else if (finalConfidence >= 60) level = "Medium Confidence";
      else level = "Low Confidence";

      return { source, headline, analysis, finalConfidence, judgment, level };
  };

  const handleAnalyze = () => {
    setError(null);
    setResults(null);

    let source = '';
    let articleText = '';

    if (activeTab === 'url') {
        const urlValue = urlInput.trim();
        if (!urlValue) {
            setError("Please enter a URL.");
            return;
        }
        try {
            const url = new URL(urlValue);
            source = url.hostname;
            // Simulate fetching article text for client-side demo
            articleText = `Simulated article from ${source}. This is a demonstration. To analyze full text, please use the 'Paste Text' option.`;
        } catch (_) {
            setError("Invalid URL format. Please enter a valid URL.");
            return;
        }
    } else { // text mode
        const textValue = textInput.trim();
        if (!textValue) {
            setError("Please paste some article text.");
            return;
        }
        if (textValue.split(/\s+/).length < 100) {
            setError("Article too short. Please provide at least 100 words.");
            return;
        }
        const englishChars = (textValue.match(/[a-zA-Z]/g) || []).length;
        if (englishChars / textValue.length < 0.5) {
            setError("Only English articles are supported.");
            return;
        }
        source = "Pasted Text";
        articleText = textValue;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      try {
        const analysisResults = analyzeArticle(source, articleText);
        setResults(analysisResults);
      } catch (e) {
        setError("An unexpected error occurred during analysis.");
        console.error(e);
      } finally {
        setIsAnalyzing(false);
      }
    }, 2000);
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setUrlInput('');
    setTextInput('');
    setActiveTab('url');
  };

  const generateReportText = (results: AnalysisResult) => {
    let report = `F.N.D. Analysis Report\n`;
    report += `=====================================\n\n`;
    report += `Source: ${results.source}\n`;
    report += `Headline: ${results.headline}\n\n`;
    report += `Verdict: ${results.judgment}\n`;
    report += `Credibility Score: ${results.finalConfidence}% (${results.level})\n\n`;
    report += `Analysis Breakdown:\n`;
    report += `---------------------------\n`;
    results.analysis.forEach(item => {
        report += `\n[${item.score}] ${item.rule}:\n`;
        report += `  - ${item.reasoning}\n`;
    });
    
    report += `\n\nNote: This analysis is based on automated heuristics and should not be the sole factor in determining article credibility. Always verify important claims through multiple reputable sources.\n`;
    return report;
  };

  const downloadReport = () => {
    if (!results) return;

    const reportContent = generateReportText(results);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FND_Analysis_Report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

   const getRuleIcon = (passed: boolean | null) => {
    if (passed === true) {
      return <svg style={{ flexShrink: 0, marginRight: '0.75rem' }} width="24" height="24" fill="none" stroke="#4ade80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    }
    if (passed === false) {
      return <svg style={{ flexShrink: 0, marginRight: '0.75rem' }} width="24" height="24" fill="none" stroke="#f87171" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    }
    return <svg style={{ flexShrink: 0, marginRight: '0.75rem' }} width="24" height="24" fill="none" stroke="#6b7280" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
  };

  return (
    <div className="fnd-container">
      <div className="fnd-header">
        <h1>F.N.D.</h1>
        <p>Fake News Detection System</p>
      </div>

      {!results && !isAnalyzing && (
        <div>
          <div className="fnd-tabs-nav">
            <button onClick={() => setActiveTab('url')} className={`fnd-tab-btn ${activeTab === 'url' ? 'active' : ''}`}>
              Analyze URL
            </button>
            <button onClick={() => setActiveTab('text')} className={`fnd-tab-btn ${activeTab === 'text' ? 'active' : ''}`}>
              Paste Text
            </button>
          </div>
          {activeTab === 'url' ? (
            <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="Enter target URL..." className="fnd-input" />
          ) : (
            <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} rows={8} placeholder="Paste article manuscript..." className="fnd-textarea" />
          )}
          <button type='button' onClick={handleAnalyze} className="fnd-analyze-btn">
            INITIATE ANALYSIS
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="fnd-loader">
          <div className="fnd-dots">
          <div></div>
          <div></div>
          <div></div>
          </div>
          <p>ANALYZING...</p>
        </div>
      )}

      {error && !isAnalyzing && (
        <div className="fnd-error">
          <strong>Analysis Error: </strong>
          <span>{error}</span>
        </div>
      )}

      {results && (
        <div className="fnd-results">
          <div className="fnd-results-header">
            <p>Source: <span>{results.source}</span></p>
            <h2>Headline: <span>{results.headline}</span></h2>
          </div>
          <div className="fnd-threat-analysis">
            <h3>Analysis Breakdown</h3>
            <div className="fnd-rule-list">
              {results.analysis.map((item, index) => {
                const scoreColor = item.passed === true ? '#6ee7b7' : item.passed === false ? '#fca5a5' : '#d1d5db';
                return (
                  <div key={index} className="fnd-rule-item">
                    {getRuleIcon(item.passed)}
                    <div className="fnd-rule-item-text">
                      <p>{item.rule} <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: scoreColor }}>{item.score}</span></p>
                      <p>{item.reasoning}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="fnd-verdict-section">
            <div className="fnd-verdict-header">
              <h3>Verdict: <span style={{ color: results.judgment === "Likely Credible" ? '#10b981' : '#ef4444' }}>{results.judgment}</span></h3>
              <span className="fnd-confidence-badge" style={{ backgroundColor: results.level === 'High Confidence' ? '#059669' : results.level === 'Medium Confidence' ? '#d97706' : '#dc2626', color: results.level === 'Medium Confidence' ? 'black' : 'white' }}>{results.level}</span>
            </div>
            <div className="fnd-progress-container">
              <div className="fnd-progress-bar" style={{ width: `${results.finalConfidence}%`, backgroundColor: results.finalConfidence > 50 ? '#10b981' : results.finalConfidence >= 40 ? '#eab308' : '#ef4444' }}>
                {results.finalConfidence}%
              </div>
            </div>
            <p className="fnd-progress-label">Credibility Score</p>
          </div>
          <div className="fnd-actions">
            <button type='button' onClick={handleReset} className="fnd-action-btn reset">New Analysis</button>
            <button type='button' onClick={downloadReport} className="fnd-action-btn export">Export Report</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeNewsDetector;
