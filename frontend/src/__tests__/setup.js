// Setup file for vitest
// This file runs before all tests

// Add CSS to the document for font testing
const style = document.createElement('style');
style.textContent = `
  body {
    font-family: 'ITC Avant Garde Gothic Std', Arial, Helvetica, sans-serif;
  }
`;
document.head.appendChild(style);
