import Chart from 'chart.js/auto';
import { calculateFinalGrade } from './dataProcessor';

export function createChart(data) {
  const ctx = document.getElementById('grades-chart');
  const grades = data.map(student => calculateFinalGrade(student));
  const names = data.map(student => student['اسم']);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: names,
      datasets: [{
        label: 'المعدل النهائي',
        data: grades,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 20
        }
      }
    }
  });
}