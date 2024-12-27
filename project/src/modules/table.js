import { calculateFinalGrade } from './dataProcessor';

export function createGradesTable(data) {
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