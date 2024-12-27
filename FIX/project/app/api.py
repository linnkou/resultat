from flask import request, jsonify, send_file
import pandas as pd
import os
from app import app
from app.config import OUTPUT_FOLDER
from app.utils import excel, visualization

@app.route('/download-template', methods=['GET'])
def download_template():
    try:
        template_path = excel.create_template()
        return send_file(
            template_path,
            as_attachment=True,
            download_name='نموذج_درجات_التلاميذ.xlsx',
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'لم يتم تحميل أي ملف'}), 400
        
    file = request.files['file']
    if not file:
        return jsonify({'error': 'لم يتم تحميل أي ملف'}), 400

    try:
        # Read Excel file
        df = pd.read_excel(file)
        
        # Validate columns
        excel.validate_columns(df)
        
        # Calculate final average
        df['المعدل النهائي'] = excel.calculate_final_average(df)
        
        # Generate statistics and visualization
        class_stats = excel.get_class_statistics(df)
        chart_path = visualization.create_bar_chart(df)
        
        # Prepare student data for response
        student_data = df[['اسم', 'المعدل النهائي']].to_dict(orient='records')
        
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
    return jsonify({'error': 'الملف غير موجود'}), 404