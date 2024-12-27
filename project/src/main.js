import './style.css';
import { handleFileUpload } from './modules/fileHandler';
import { generateClassInputs } from './modules/classInputs';

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const generateClassesBtn = document.getElementById('generate-classes');
  const generateReportBtn = document.getElementById('generate-report');

  if (generateClassesBtn) {
    generateClassesBtn.addEventListener('click', generateClassInputs);
  }

  if (generateReportBtn) {
    generateReportBtn.addEventListener('click', handleFileUpload);
  }
});