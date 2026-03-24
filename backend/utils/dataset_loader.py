import os
import pandas as pd
from functools import lru_cache

DATASETS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "datasets")

@lru_cache(maxsize=4)
def load_csv_dataset(filename: str, usecols=None) -> pd.DataFrame:
    """
    Load a CSV dataset into memory and cache it.
    If the file is missing, returns an empty DataFrame.
    """
    path = os.path.abspath(os.path.join(DATASETS_DIR, filename))
    if not os.path.isfile(path):
        print(f"[DatasetLoader] Warning: Dataset not found at {path}")
        return pd.DataFrame()
    
    print(f"[DatasetLoader] Loading {filename} into memory...")
    try:
        if usecols:
            df = pd.read_csv(path, usecols=usecols, low_memory=False)
        else:
            df = pd.read_csv(path, low_memory=False)
        return df
    except Exception as e:
        print(f"[DatasetLoader] Error loading {filename}: {e}")
        return pd.DataFrame()

def iter_csv_chunks(filename: str, chunksize: int = 10000, usecols=None):
    """
    Generator that yields chunks of a large CSV dataset to avoid OOM errors.
    """
    path = os.path.abspath(os.path.join(DATASETS_DIR, filename))
    if not os.path.isfile(path):
        print(f"[DatasetLoader] Warning: Dataset not found at {path}")
        return

    try:
        reader = pd.read_csv(path, usecols=usecols, low_memory=False, chunksize=chunksize)
        for chunk in reader:
            yield chunk
    except Exception as e:
        print(f"[DatasetLoader] Error reading {filename} in chunks: {e}")
