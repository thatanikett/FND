# F.N.D. - Fake News Detector

F.N.D. is a web-based application that analyzes news articles and text to provide a credibility score. It uses a set of heuristics to identify potential fake news, propaganda, and misinformation. The application features a retro-terminal design for its user interface.

## Features

*   **Analyze by URL:** Analyze an article by providing its URL.
*   **Analyze by Text:** Paste the text of an article to analyze it directly.
*   **Credibility Score:** Get a credibility score from 0 to 100.
*   **Detailed Analysis:** See a breakdown of the analysis, including the rules that were passed or failed.
*   **Export Report:** Download a text file of the analysis report.
*   **Responsive Design:** The application is designed to work on different screen sizes.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Vite:** A fast build tool for modern web development.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **OGL:** A small, effective WebGL library.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm) must be installed on your system.

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/thatanikett/FND.git
    ```
2.  Install NPM packages:
    ```sh
    pnpm install
    ```
3.  Start the development server:
    ```sh
    pnpm dev
    ```
4.  Open your browser and navigate to `http://localhost:5173/` (or the address shown in your terminal).

## Project Structure

```
/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── FakeNewDetector.css
│   │   ├── FakeNewDetector.tsx
│   │   ├── FaultyTerminal.tsx
│   │   ├── LandingPage.css
│   │   └── LandingPage.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.ts
```

## Disclaimer

This application is a demonstration and should not be used to determine the credibility of real news articles. The analysis is based on a limited set of rules and does not guarantee accuracy. Always verify important claims through multiple reputable sources.