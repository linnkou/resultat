import Chart from 'chart.js/auto';

export function createBarChart(distributions, className) {
  const ctx = document.getElementById('grades-chart');
  const labels = Object.keys(distributions);
  const data = Object.values(distributions);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'عدد التلاميذ',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `توزيع التقديرات - ${className}`,
          font: { size: 16 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'عدد التلاميذ'
          }
        },
        x: {
          title: {
            display: true,
            text: 'التقدير'
          }
        }
      }
    }
  });
}

export function createPieChart(distributions, className) {
  const ctx = document.getElementById('pie-chart');
  const labels = Object.keys(distributions);
  const data = Object.values(distributions);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `نسب التقديرات - ${className}`,
          font: { size: 16 }
        }
      }
    }
  });
}