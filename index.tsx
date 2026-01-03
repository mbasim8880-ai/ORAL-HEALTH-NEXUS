
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("NEXUS BOOT FAILURE: Root element not found.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("NEXUS LINK SYNCHRONIZED: App mounted successfully.");
  } catch (error) {
    console.error("NEXUS RUNTIME CRASH:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: #ef4444; font-family: sans-serif; text-align: center;">
        <h2 style="font-weight: 900;">SYSTEM ANOMALY</h2>
        <p>The Nexus Neural Link encountered a runtime error during initialization.</p>
        <pre style="text-align: left; background: #f1f5f9; padding: 10px; border-radius: 8px; font-size: 12px; margin-top: 20px; overflow-x: auto;">
          ${error instanceof Error ? error.stack : String(error)}
        </pre>
      </div>
    `;
  }
}
