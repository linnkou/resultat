import matplotlib.pyplot as plt
import seaborn as sns
import os
from app.config import OUTPUT_FOLDER

def create_bar_chart(df):
    """Create a bar chart of final grades"""
    plt.figure(figsize=(12, 6))
    sns.barplot(x='اسم', y='المعدل النهائي', data=df, palette='viridis')
    plt.title('توزيع المعدلات النهائية للتلاميذ')
    plt.xticks(rotation=45, ha='right')
    plt.xlabel('اسم التلميذ')
    plt.ylabel('المعدل النهائي')
    plt.tight_layout()
    
    chart_path = os.path.join(OUTPUT_FOLDER, 'chart.png')
    plt.savefig(chart_path)
    plt.close()
    return chart_path