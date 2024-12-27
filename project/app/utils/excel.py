import pandas as pd
import os
from app.config import OUTPUT_FOLDER, REQUIRED_COLUMNS

def create_template():
    """Create a template Excel file with sample data"""
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
    return template_path

def validate_columns(df):
    """Validate that all required columns are present"""
    missing_columns = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_columns:
        raise ValueError(f'الأعمدة التالية مفقودة: {", ".join(missing_columns)}')
    return True

def calculate_final_average(df):
    """Calculate final average based on the formula"""
    return ((df['معدل تقويم النشاطات /20'] + df['الفرض /20']) / 2 + df['الإختبار /20'] * 2) / 3

def get_class_statistics(df):
    """Calculate class statistics"""
    return {
        'أعلى درجة': float(df['المعدل النهائي'].max()),
        'أدنى درجة': float(df['المعدل النهائي'].min()),
        'متوسط الفصل': float(df['المعدل النهائي'].mean())
    }