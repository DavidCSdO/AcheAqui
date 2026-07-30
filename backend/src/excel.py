import pandas as pd
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import config

def save_to_excel(data: list):
    if not data:
        return
    df = pd.DataFrame(data)
    os.makedirs(config.OUTPUT_DIR, exist_ok=True)
    df.to_excel(config.OUTPUT_EXCEL, index=False)
