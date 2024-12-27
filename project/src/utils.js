import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';

export function downloadTemplate() {
  const template = {
    'رقم التعريف': ['1', '2'],
    'اللقب': ['لقب 1', 'لقب 2'],
    'الاسم': ['اسم 1', 'اسم 2'],
    'تاريخ الميلاد': ['2010-01-01', '2010-02-01'],
    'معدل تقويم النشاطات /20': [15, 16],
    'الفرض /20': [14, 17],
    'الإختبار /20': [16, 18],
    'التقديرات': ['جيد', 'جيد جداً']
  };

  const ws = XLSX.utils.json_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, "نموذج_درجات_التلاميذ.xlsx");
}

export function generateClassInputs() {
  const numClasses = document.getElementById('num-classes').value;
  const container = document.getElementById('class-names-container');
  container.innerHTML = '';

  if (numClasses && numClasses > 0) {
    for (let i = 1; i <= numClasses; i++) {
      const label = document.createElement('label');
      label.textContent = `اسم القسم ${i}:`;
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `class-${i}`;
      input.placeholder = `اسم القسم ${i}`;
      container.appendChild(label);
      container.appendChild(input);
    }
  } else {
    alert('يرجى إدخال عدد صحيح للأقسام.');
  }
}

export function handleFileUpload() {
  const file = document.getElementById('excel-file').files[0];
  const statusMessage = document.getElementById('status-message');
  const progressBar = document.getElementById('progress');
  
  if (!file) {
    alert('يرجى اختيار ملف Excel.');
    return;
  }

  statusMessage.textContent = 'جاري معالجة البيانات...';
  progressBar.style.width = '30%';

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      processData(jsonData);
      progressBar.style.width = '100%';
      statusMessage.textContent = 'تم معالجة البيانات بنجاح!';
    } catch (error) {
      console.error('Error processing file:', error);
      statusMessage.textContent = 'حدث خطأ في معالجة الملف';
      progressBar.style.width = '0%';
      alert('حدث خطأ أثناء معالجة الملف');
    }
  };

  reader.readAsArrayBuffer(file);
}

function processData(data) {
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

function calculateFinalGrade(student) {
  const activities = student['معدل تقويم النشاطات /20'] || 0;
  const exam = student['الفرض /20'] || 0;
  const test = student['الإختبار /20'] || 0;
  return ((activities + exam) / 2 + test * 2) / 3;
}

function createGradesTable(data) {
  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>اسم التلميذ</th>
      <th>المعدل النهائي</th>
    </tr>
  `;

  data.forEach(student => {
    const finalGrade = calculateFinalGrade(student);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student['اسم']}</td>
      <td>${finalGrade.toFixed(2)}</td>
    `;
    table.appendChild(row);
  });

  return table;
}

function createChart(data) {
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