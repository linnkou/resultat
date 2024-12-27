import { generateReport } from './reportGenerator';
import * as XLSX from 'xlsx';

export function handleFileUpload() {
  const file = document.getElementById('excel-file').files[0];
  const statusMessage = document.getElementById('status-message');
  const progressBar = document.getElementById('progress');
  const classNameInput = document.getElementById('class-1');
  
  if (!file) {
    alert('يرجى اختيار ملف Excel.');
    return;
  }

  // Get grade comments
  const gradeComments = [];
  for (let i = 0; i < 6; i++) {
    const comment = document.getElementById(`comment-${i}`).value;
    if (!comment) {
      alert('يرجى إدخال جميع ملاحظات التقديرات');
      return;
    }
    gradeComments.push(comment);
  }

  statusMessage.textContent = 'جاري معالجة البيانات...';
  progressBar.style.width = '30%';

  const reader = new FileReader();
  
  reader.onerror = () => {
    statusMessage.textContent = 'حدث خطأ في قراءة الملف';
    progressBar.style.width = '0%';
    alert('حدث خطأ أثناء قراءة الملف');
  };

  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      if (!workbook.SheetNames.length) {
        throw new Error('الملف لا يحتوي على أي ورقة عمل');
      }

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      if (!jsonData.length) {
        throw new Error('لا توجد بيانات في الملف');
      }

      generateReport(jsonData, classNameInput.value, gradeComments);
      progressBar.style.width = '100%';
      statusMessage.textContent = 'تم معالجة البيانات بنجاح!';
    } catch (error) {
      console.error('Error processing file:', error);
      statusMessage.textContent = error.message || 'حدث خطأ في معالجة الملف';
      progressBar.style.width = '0%';
      alert(error.message || 'حدث خطأ أثناء معالجة الملف');
    }
  };

  reader.readAsArrayBuffer(file);
}