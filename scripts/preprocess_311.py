"""
Preprocess the NYC 311 Service Requests dataset.

Reads the large CSV in chunks, extracts required columns, takes a subset
of ~150k rows, and saves to datasets/311_small.csv.

Usage:
    python scripts/preprocess_311.py
"""

import os
import pandas as pd

# Paths ----------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
INPUT_CSV = os.path.join(PROJECT_ROOT, "311-service-requests-from-2010-to-present.csv")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "datasets")
OUTPUT_CSV = os.path.join(OUTPUT_DIR, "311_small.csv")

# Columns we care about ------------------------------------------------
REQUIRED_COLUMNS = [
    "Created Date",
    "Complaint Type",
    "Latitude",
    "Longitude",
    "Borough",
    "Status",
    "Closed Date",
    "Agency",
]

# Target row count ------------------------------------------------------
TARGET_ROWS = 150_000
CHUNK_SIZE = 10_000


def preprocess():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    if not os.path.isfile(INPUT_CSV):
        print(f"[WARN] Source CSV not found at {INPUT_CSV}")
        print("       Generating a synthetic 311_small.csv for development…")
        _generate_synthetic()
        return

    print(f"[INFO] Reading {INPUT_CSV} in chunks of {CHUNK_SIZE}…")
    collected = []
    total = 0

    for chunk in pd.read_csv(INPUT_CSV, chunksize=CHUNK_SIZE, usecols=lambda c: c in REQUIRED_COLUMNS,
                              low_memory=False, dtype=str):
        # Keep only rows that have lat/lng
        chunk = chunk.dropna(subset=["Latitude", "Longitude"])
        collected.append(chunk)
        total += len(chunk)
        if total >= TARGET_ROWS:
            break

    df = pd.concat(collected, ignore_index=True).head(TARGET_ROWS)

    # Type conversions
    df["Latitude"] = pd.to_numeric(df["Latitude"], errors="coerce")
    df["Longitude"] = pd.to_numeric(df["Longitude"], errors="coerce")
    df["Created Date"] = pd.to_datetime(df["Created Date"], errors="coerce")
    df["Closed Date"] = pd.to_datetime(df["Closed Date"], errors="coerce")

    df.dropna(subset=["Latitude", "Longitude"], inplace=True)

    df.to_csv(OUTPUT_CSV, index=False)
    print(f"[OK] Saved {len(df)} rows → {OUTPUT_CSV}")


def _generate_synthetic():
    """Create a small synthetic dataset when the real CSV is unavailable."""
    import random
    from datetime import datetime, timedelta

    boroughs = ["MANHATTAN", "BROOKLYN", "QUEENS", "BRONX", "STATEN ISLAND"]
    complaint_types = [
        "Pothole", "Noise - Residential", "HEAT/HOT WATER", "Blocked Driveway",
        "Street Light Condition", "Water System", "Illegal Parking",
        "Sewer", "Traffic Signal Condition", "Rodent",
    ]
    agencies = ["DOT", "NYPD", "HPD", "DEP", "DSNY", "DOB"]
    statuses = ["Closed", "Open", "Pending", "In Progress"]

    rows = []
    base = datetime(2020, 1, 1)
    n = TARGET_ROWS

    for i in range(n):
        borough = random.choice(boroughs)
        # Rough NYC bounding‑box
        lat = round(random.uniform(40.49, 40.92), 6)
        lng = round(random.uniform(-74.27, -73.68), 6)
        created = base + timedelta(hours=random.randint(0, 35_000))
        status = random.choice(statuses)
        closed = created + timedelta(hours=random.randint(1, 720)) if status == "Closed" else ""
        rows.append({
            "Created Date": created,
            "Complaint Type": random.choice(complaint_types),
            "Latitude": lat,
            "Longitude": lng,
            "Borough": borough,
            "Status": status,
            "Closed Date": closed,
            "Agency": random.choice(agencies),
        })

    df = pd.DataFrame(rows)
    df.to_csv(OUTPUT_CSV, index=False)
    print(f"[OK] Generated synthetic dataset with {n} rows → {OUTPUT_CSV}")


if __name__ == "__main__":
    preprocess()
