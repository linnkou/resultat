import os

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {'xlsx', 'xls'}

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Required Excel columns
REQUIRED_COLUMNS = [
    'رقم التعريف',
    'اللقب',
    'الاسم', 
    'تاريخ الميلاد',
    'معدل تقويم النشاطات /20',
    'الفرض /20',
    'الإختبار /20',
    'التقديرات'
]