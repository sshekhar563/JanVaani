"""
Geo Intelligence Service — heatmap, clusters, area statistics.

Uses the preprocessed 311_small.csv dataset for analytics.
"""

import os
import pandas as pd
import numpy as np

DATASET_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "datasets", "311_small.csv"
)


def _load_dataset(nrows=None):
    """Load the reduced 311 dataset. Returns empty DataFrame on failure."""
    path = os.path.abspath(DATASET_PATH)
    if not os.path.isfile(path):
        return pd.DataFrame()
    return pd.read_csv(path, nrows=nrows, low_memory=False)


# ── Heatmap ───────────────────────────────────────────────────────────

def get_heatmap_data(limit: int = 5000):
    """Return lat/lng points with an intensity weight for heatmap rendering."""
    df = _load_dataset()
    if df.empty:
        return []

    df = df.dropna(subset=["Latitude", "Longitude"])
    df["Latitude"] = pd.to_numeric(df["Latitude"], errors="coerce")
    df["Longitude"] = pd.to_numeric(df["Longitude"], errors="coerce")
    df = df.dropna(subset=["Latitude", "Longitude"])

    # Sample if too many points
    if len(df) > limit:
        df = df.sample(n=limit, random_state=42)

    points = []
    for _, row in df.iterrows():
        points.append({
            "lat": round(float(row["Latitude"]), 6),
            "lng": round(float(row["Longitude"]), 6),
            "type": str(row.get("Complaint Type", "")),
            "weight": 1,
        })
    return points


# ── Clustering ────────────────────────────────────────────────────────

def get_clusters(n_clusters: int = 10):
    """KMeans clustering on complaint locations."""
    df = _load_dataset()
    if df.empty:
        return {"clusters": [], "n_clusters": 0}

    df["Latitude"] = pd.to_numeric(df["Latitude"], errors="coerce")
    df["Longitude"] = pd.to_numeric(df["Longitude"], errors="coerce")
    df = df.dropna(subset=["Latitude", "Longitude"])

    coords = df[["Latitude", "Longitude"]].values
    if len(coords) < n_clusters:
        n_clusters = max(1, len(coords))

    try:
        from sklearn.cluster import MiniBatchKMeans
        model = MiniBatchKMeans(n_clusters=n_clusters, random_state=42, batch_size=1024)
        labels = model.fit_predict(coords)
    except ImportError:
        # Fallback: simple grid clustering
        labels = np.zeros(len(coords), dtype=int)

    clusters = []
    for i in range(n_clusters):
        mask = labels == i
        cluster_coords = coords[mask]
        if len(cluster_coords) == 0:
            continue
        clusters.append({
            "id": i,
            "center_lat": round(float(cluster_coords[:, 0].mean()), 6),
            "center_lng": round(float(cluster_coords[:, 1].mean()), 6),
            "count": int(mask.sum()),
            "top_complaints": (
                df.loc[mask, "Complaint Type"]
                .value_counts()
                .head(3)
                .to_dict()
            ) if "Complaint Type" in df.columns else {},
        })

    return {"clusters": clusters, "n_clusters": len(clusters)}


# ── Area Statistics ───────────────────────────────────────────────────

def get_area_stats(borough: str | None = None):
    """Per‑borough complaint statistics."""
    df = _load_dataset()
    if df.empty:
        return []

    if "Borough" not in df.columns:
        return []

    if borough:
        df = df[df["Borough"].str.upper() == borough.upper()]

    stats = []
    for name, group in df.groupby("Borough"):
        top_types = group["Complaint Type"].value_counts().head(5).to_dict() if "Complaint Type" in group.columns else {}
        status_dist = group["Status"].value_counts().to_dict() if "Status" in group.columns else {}
        stats.append({
            "borough": str(name),
            "total_complaints": int(len(group)),
            "top_complaint_types": top_types,
            "status_distribution": status_dist,
        })

    stats.sort(key=lambda s: s["total_complaints"], reverse=True)
    return stats
