import { analyzeGrades } from './gradeAnalysis';
import { createBarChart, createPieChart } from './visualization';

export function generateReport(data, className, gradeComments) {
  const analysis = analyzeGrades(data, gradeComments);
  
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = '';

  // Add statistics
  addStatistics(resultsContainer, analysis.stats);

  // Add charts
  addCharts(resultsContainer, analysis.distributions, className);

  // Add detailed table
  addDetailedTable(resultsContainer, analysis.students);
}

function addStatistics(container, stats) {
  const statsDiv = document.createElement('div');
  statsDiv.className = 'stats-container';
  statsDiv.innerHTML = `
    <h3>إحصائيات الفصل</h3>
    <p>أعلى درجة: ${stats.highest.toFixed(2)}</p>
    <p>أدنى درجة: ${stats.lowest.toFixed(2)}</p>
    <p>المتوسط: ${stats.average.toFixed(2)}</p>
    <p>عدد الناجحين (≥10): ${stats.aboveTen}</p>
    <p>عدد الراسبين (<10): ${stats.belowTen}</p>
    <p>نسبة النجاح: ${((stats.aboveTen / stats.total) * 100).toFixed(2)}%</p>
  `;
  container.appendChild(statsDiv);
}

function addCharts(container, distributions, className) {
  // Bar Chart
  const barCanvas = document.createElement('canvas');
  barCanvas.id = 'grades-chart';
  container.appendChild(barCanvas);
  createBarChart(distributions, className);

  // Pie Chart
  const pieCanvas = document.createElement('canvas');
  pieCanvas.id = 'pie-chart';
  container.appendChild(pieCanvas);
  createPieChart(distributions, className);
}

function addDetailedTable(container, students) {
  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>رقم التعريف</th>
      <th>اللقب</th>
      <th>الاسم</th>
      <th>المعدل النهائي</th>
      <th>التقدير</th>
    </tr>
  `;

  students.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student['رقم التعريف'] || ''}</td>
      <td>${student['اللقب'] || ''}</td>
      <td>${student['اسم'] || ''}</td>
      <td>${student.finalGrade.toFixed(2)}</td>
      <td>${student.gradeComment}</td>
    `;
    table.appendChild(row);
  });

  container.appendChild(table);
}