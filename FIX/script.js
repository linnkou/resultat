document.getElementById('download-template').addEventListener('click', () => {
    fetch('/download-template')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'نموذج_درجات_التلاميذ.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('حدث خطأ أثناء تحميل النموذج');
        });
});

document.getElementById('generate-classes').addEventListener('click', () => {
    const numClasses = document.getElementById('num-classes').value;
    const classNamesContainer = document.getElementById('class-names-container');
    classNamesContainer.innerHTML = ''; // مسح الإدخالات القديمة

    if (numClasses && numClasses > 0) {
        for (let i = 1; i <= numClasses; i++) {
            const label = document.createElement('label');
            label.textContent = `اسم القسم ${i}:`;
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `class-${i}`;
            input.placeholder = `اسم القسم ${i}`;
            classNamesContainer.appendChild(label);
            classNamesContainer.appendChild(input);
        }
    } else {
        alert('يرجى إدخال عدد صحيح للأقسام.');
    }
});

document.getElementById('generate-report').addEventListener('click', () => {
    const numClasses = document.getElementById('num-classes').value;
    const excelFile = document.getElementById('excel-file').files[0];
    const statusMessage = document.getElementById('status-message');
    const progressBar = document.getElementById('progress');

    if (!numClasses || !excelFile) {
        alert('يرجى ملء جميع الحقول واختيار ملف Excel.');
        return;
    }

    const classNames = [];
    for (let i = 1; i <= numClasses; i++) {
        const className = document.getElementById(`class-${i}`).value;
        if (className) {
            classNames.push(className);
        } else {
            alert(`يرجى إدخال اسم القسم ${i}.`);
            return;
        }
    }

    const gradeComments = [];
    for (let i = 0; i <= 5; i++) {
        const comment = document.getElementById(`comment-${i}`).value;
        gradeComments.push(comment || '');
    }

    statusMessage.textContent = 'جاري معالجة البيانات...';
    progressBar.style.width = '30%';

    const formData = new FormData();
    formData.append('file', excelFile);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            statusMessage.textContent = 'حدث خطأ في معالجة الملف';
            progressBar.style.width = '0%';
            return;
        }

        progressBar.style.width = '100%';
        statusMessage.textContent = 'تم معالجة البيانات بنجاح!';

        // عرض النتائج
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';

        // عرض إحصائيات الفصل
        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats-container';
        statsDiv.innerHTML = `
            <h3>إحصائيات الفصل</h3>
            <p>أعلى درجة: ${data.class_stats['أعلى درجة'].toFixed(2)}</p>
            <p>أدنى درجة: ${data.class_stats['أدنى درجة'].toFixed(2)}</p>
            <p>متوسط الفصل: ${data.class_stats['متوسط الفصل'].toFixed(2)}</p>
        `;
        resultsContainer.appendChild(statsDiv);

        // عرض جدول درجات الطلاب
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>اسم التلميذ</th>
                <th>المعدل النهائي</th>
            </tr>
        `;

        data.student_data.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student['اسم_التلميذ']}</td>
               <td>${student['المعدل النهائي'].toFixed(2)}</td>
           `;
           table.appendChild(row);
       });
       resultsContainer.appendChild(table);

       // عرض الرسم البياني
       const chartImg = document.createElement('img');
       chartImg.src = data.chart_url;
       chartImg.alt = 'توزيع المعدلات النهائية';
       chartImg.className = 'grade-chart';
       resultsContainer.appendChild(chartImg);
   })
   .catch(error => {
       console.error('Error:', error);
       statusMessage.textContent = 'حدث خطأ في معالجة الملف';
       progressBar.style.width = '0%';
       alert('حدث خطأ أثناء معالجة الملف');
   });
});