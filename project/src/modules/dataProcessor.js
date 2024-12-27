import { createGradesTable } from './table';
import { createChart } from './chart';

export function processData(data) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = '';

  // Calculate statistics
  const grades = data.map(student => calculateFinalGrade(student));
  const stats = {
    'أعلى درجة': Math.max(...grades),
    'أدنى درجة': Math.min(...grades),
    'متوسط الفصل': grades.reduce((a, b) => a + b) / grades.length
  };

  // Display statistics
  const statsDiv = document.createElement('div');
  statsDiv.className = 'stats-container';
  statsDiv.innerHTML = `
    <h3>إحصائيات الفصل</h3>
    <p>أعلى درجة: ${stats['أعلى درجة'].toFixed(2)}</p>
    <p>أدنى درجة: ${stats['أدنى درجة'].toFixed(2)}</p>
    <p>متوسط الفصل: ${stats['متوسط الفصل'].toFixed(2)}</p>
  `;
  resultsContainer.appendChild(statsDiv);

  // Create table
  const table = createGradesTable(data);
  resultsContainer.appendChild(table);

  // Create chart
  const chartContainer = document.createElement('canvas');
  chartContainer.id = 'grades-chart';
  resultsContainer.appendChild(chartContainer);
  createChart(data);
}

export function calculateFinalGrade(student) {
  const activities = student['معدل تقويم النشاطات /20'] || 0;
  const exam = student['الفرض /20'] || 0;
  const test = student['الإختبار /20'] || 0;
  return ((activities + exam) / 2 + test * 2) / 3;
}