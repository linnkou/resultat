from flask import Flask, request, jsonify, send_file
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

from app_init import app

# إعداد مسار تحميل الملفات
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def get_grade_comment(grade, grade_comments):
    if grade < 10:
        return grade_comments[0]
    elif grade < 12:
        return grade_comments[1]
    elif grade < 14:
        return grade_comments[2]
    elif grade < 16:
        return grade_comments[3]
    elif grade < 18:
        return grade_comments[4]
    else:
        return grade_comments[5]

# إنشاء مخطط عمودي
def create_bar_chart(data, output_path):
    plt.figure(figsize=(12, 6))
    sns.barplot(x='اسم_التلميذ', y='المعدل النهائي', data=data, palette='viridis')
    plt.title('توزيع المعدلات النهائية للتلاميذ')
    plt.xticks(rotation=45, ha='right')
    plt.xlabel('اسم التلميذ')
    plt.ylabel('المعدل النهائي')
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()

@app.route('/download-template', methods=['GET'])
def download_template():
    # Create a sample Excel file with the correct columns
    df = pd.DataFrame({
        'رقم التعريف': ['1', '2'],
        'اللقب': ['لقب 1', 'لقب 2'],
        'الاسم': ['اسم 1', 'اسم 2'],
        'تاريخ الميلاد': ['2010-01-01', '2010-02-01'],
        'معدل تقويم النشاطات /20': [15, 16],
        'الفرض /20': [14, 17],
        'الإختبار /20': [16, 18],
        'التقديرات': ['جيد', 'جيد جداً']
    })
    
    # Save to a temporary file
    template_path = os.path.join(OUTPUT_FOLDER, 'template.xlsx')
    df.to_excel(template_path, index=False)
    
    return send_file(
        template_path,
        as_attachment=True,
        download_name='نموذج_درجات_التلاميذ.xlsx',
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if not file:
        return jsonify({'error': 'لم يتم تحميل أي ملف'}), 400

    # حفظ ملف Excel
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        # قراءة البيانات وتحليلها
        df = pd.read_excel(file_path)

        # التحقق من وجود الأعمدة المطلوبة
        required_columns = ['رقم التعريف', 'اللقب', 'الاسم', 'تاريخ الميلاد', 
                           'معدل تقويم النشاطات /20', 'الفرض /20', 'الإختبار /20', 'التقديرات']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return jsonify({'error': f'الأعمدة التالية مفقودة: {", ".join(missing_columns)}'}), 400

        # حساب المعدل النهائي باستخدام المعادلة الجديدة
        df['المعدل النهائي'] = ((df['معدل تقويم النشاطات'] + df['الفرض']) / 2 + df['الإختبار'] * 2) / 3

        # إحصائيات الفصل
        class_stats = {
            'أعلى درجة': df['المعدل النهائي'].max(),
            'أدنى درجة': df['المعدل النهائي'].min(),
            'متوسط الفصل': df['المعدل النهائي'].mean()
        }

        # إنشاء مخطط
        chart_path = os.path.join(OUTPUT_FOLDER, 'chart.png')
        create_bar_chart(df, chart_path)

        # إعداد البيانات للعرض في الواجهة
        student_data = df[['اسم_التلميذ', 'المعدل النهائي']].to_dict(orient='records')

        return jsonify({
            'chart_url': f'/download/chart.png',
            'student_data': student_data,
            'class_stats': class_stats
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({'error': 'الملف غير موجود'}), 404

def initialize():
    pass