import pandas as pd
import os
from flask import jsonify, send_file
from app.config import OUTPUT_FOLDER, REQUIRED_COLUMNS
from app.utils.visualization import create_bar_chart

def create_template():
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
    
    template_path = os.path.join(OUTPUT_FOLDER, 'template.xlsx')
    df.to_excel(template_path, index=False)
    
    return send_file(
        template_path,
        as_attachment=True,
        download_name='نموذج_درجات_التلاميذ.xlsx',
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

def process_uploaded_file(file):
    file_path = os.path.join(OUTPUT_FOLDER, file.filename)
    file.save(file_path)

    df = pd.read_excel(file_path)
    
    # Validate required columns
    missing_columns = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_columns:
        return jsonify({'error': f'الأعمدة التالية مفقودة: {", ".join(missing_columns)}'}), 400

    # Calculate final average
    df['المعدل النهائي'] = calculate_final_average(df)
    
    # Generate statistics and visualizations
    class_stats = calculate_class_stats(df)
    chart_path = os.path.join(OUTPUT_FOLDER, 'chart.png')
    create_bar_chart(df, chart_path)
    
    student_data = df[['اسم_التلميذ', 'المعدل النهائي']].to_dict(orient='records')
    
    return jsonify({
        'chart_url': f'/download/chart.png',
        'student_data': student_data,
        'class_stats': class_stats
    })

def calculate_final_average(df):
    return ((df['معدل تقويم النشاطات'] + df['الفرض']) / 2 + df['الإختبار'] * 2) / 3

def calculate_class_stats(df):
    return {
        'أعلى درجة': df['المعدل النهائي'].max(),
        'أدنى درجة': df['المعدل النهائي'].min(),
        'متوسط الفصل': df['المعدل النهائي'].mean()
    }