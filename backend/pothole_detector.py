"""
AI Pothole Detection Module for JanVaani Platform.

Uses OpenCV-based image analysis (dark region segmentation, edge detection,
contour analysis) to detect potholes in road images. Falls back to a simulated
detection mode if OpenCV is not available.

Can be replaced with a real YOLOv5/v8 model by swapping the detect() method.
"""

import io
import os
import random
import xml.etree.ElementTree as ET
from pathlib import Path

# --- Optional heavy imports (graceful fallback) ---
try:
    import cv2
    import numpy as np
    CV2_AVAILABLE = True
except ImportError:
    cv2 = None
    np = None
    CV2_AVAILABLE = False

try:
    from PIL import Image as PILImage
    PIL_AVAILABLE = True
except ImportError:
    PILImage = None
    PIL_AVAILABLE = False


# -----------------------------------------------------------------------
# Annotation parser – reads Pascal VOC XMLs from the RDD2022 dataset
# -----------------------------------------------------------------------

def parse_voc_annotations(annotations_dir: str) -> dict:
    """Parse Pascal VOC XML annotations and return a lookup dict.

    Returns
    -------
    dict  – mapping from filename (e.g. ``India_000001.jpg``) to a list of
            dicts ``{label, xmin, ymin, xmax, ymax}``.
    """
    annotations = {}
    ann_path = Path(annotations_dir)

    if not ann_path.exists():
        return annotations

    for xml_file in ann_path.glob("*.xml"):
        try:
            tree = ET.parse(xml_file)
            root = tree.getroot()
            filename_el = root.find("filename")
            if filename_el is None:
                continue
            filename = filename_el.text

            objects = []
            for obj in root.findall("object"):
                name_el = obj.find("name")
                bbox_el = obj.find("bndbox")
                if name_el is None or bbox_el is None:
                    continue
                label = name_el.text
                xmin = int(float(bbox_el.findtext("xmin", "0")))
                ymin = int(float(bbox_el.findtext("ymin", "0")))
                xmax = int(float(bbox_el.findtext("xmax", "0")))
                ymax = int(float(bbox_el.findtext("ymax", "0")))
                objects.append({
                    "label": label,
                    "xmin": xmin,
                    "ymin": ymin,
                    "xmax": xmax,
                    "ymax": ymax,
                })

            annotations[filename] = objects
        except Exception:
            continue

    return annotations


# -----------------------------------------------------------------------
# Main detector class
# -----------------------------------------------------------------------

class PotholeDetector:
    """Detects potholes in road images using OpenCV-based analysis."""

    # RDD2022 damage type labels that indicate potholes
    POTHOLE_LABELS = {"D00", "D01", "D10", "D11", "D20", "D40", "D43", "D44", "D50"}

    def __init__(self, dataset_base: str | None = None):
        """Initialise the detector.

        Parameters
        ----------
        dataset_base : str, optional
            Path to the base dataset directory (e.g. ``data/India``).
            If provided, loads annotations for reference / demo mode.
        """
        self.annotations: dict = {}
        self.dataset_images_dir: str | None = None

        if dataset_base:
            ann_dir = os.path.join(dataset_base, "train", "annotations", "xmls")
            self.annotations = parse_voc_annotations(ann_dir)
            img_dir = os.path.join(dataset_base, "train", "images")
            if os.path.isdir(img_dir):
                self.dataset_images_dir = img_dir

        print(f"🔍 PotholeDetector initialised – {len(self.annotations)} annotations loaded, CV2={CV2_AVAILABLE}")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def detect(self, image_bytes: bytes, filename: str | None = None) -> dict:
        """Run pothole detection on raw image bytes.

        Returns a dict with keys:
        - detected (bool)
        - confidence (float 0-1)
        - priority ("HIGH" | "MEDIUM" | "LOW")
        - label (str description)
        - bounding_boxes (list of [xmin, ymin, xmax, ymax])
        - image_width, image_height (int)
        """
        # 1️⃣ Try OpenCV-based analysis first
        if CV2_AVAILABLE:
            return self._detect_cv2(image_bytes)

        # 2️⃣ Fallback: check if we have ground-truth annotations for this file
        if filename and filename in self.annotations:
            return self._detect_from_annotations(filename)

        # 3️⃣ Ultimate fallback: simulated detection
        return self._detect_simulated(image_bytes)

    # ------------------------------------------------------------------
    # OpenCV-based detection
    # ------------------------------------------------------------------

    def _detect_cv2(self, image_bytes: bytes) -> dict:
        """Analyse image with OpenCV for dark regions / cracks."""
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return self._empty_result(0, 0)

        h, w = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (7, 7), 0)

        # --- Dark region segmentation (potholes are typically darker) ---
        # Adaptive threshold to find dark patches
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV, 21, 8
        )

        # Morphological operations to clean up
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)

        # Focus on bottom 70% of image (road surface)
        road_region_start = int(h * 0.3)
        road_mask = np.zeros_like(thresh)
        road_mask[road_region_start:, :] = thresh[road_region_start:, :]

        # Find contours in the road area
        contours, _ = cv2.findContours(road_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Filter contours by area and aspect ratio
        min_area = (w * h) * 0.002  # At least 0.2% of image
        max_area = (w * h) * 0.35   # At most 35% of image
        bounding_boxes = []
        total_defect_area = 0

        for cnt in contours:
            area = cv2.contourArea(cnt)
            if min_area < area < max_area:
                x, y, bw, bh = cv2.boundingRect(cnt)
                aspect_ratio = bw / max(bh, 1)
                # Potholes tend to be wider than tall
                if 0.2 < aspect_ratio < 8.0:
                    bounding_boxes.append([int(x), int(y), int(x + bw), int(y + bh)])
                    total_defect_area += area

        # --- Edge-based analysis for cracks ---
        edges = cv2.Canny(blurred, 50, 150)
        road_edges = edges[road_region_start:, :]
        edge_density = np.count_nonzero(road_edges) / max(road_edges.size, 1)

        # --- Texture analysis (high variance = rough/damaged surface) ---
        road_gray = gray[road_region_start:, :]
        texture_var = float(np.var(road_gray)) / 255.0

        # --- Compute confidence score ---
        defect_ratio = total_defect_area / max(w * h, 1)

        # Combine signals
        confidence = 0.0
        if len(bounding_boxes) > 0:
            confidence += min(0.45, defect_ratio * 15)
            confidence += min(0.25, len(bounding_boxes) * 0.08)
        confidence += min(0.15, edge_density * 3)
        confidence += min(0.15, texture_var * 0.4)
        confidence = round(min(confidence, 0.98), 2)

        # Determine label and priority
        detected, label, priority = self._classify(confidence)

        return {
            "detected": detected,
            "confidence": confidence,
            "priority": priority,
            "label": label,
            "bounding_boxes": bounding_boxes[:10],  # cap at 10
            "image_width": w,
            "image_height": h,
        }

    # ------------------------------------------------------------------
    # Annotation-based detection (demo / reference images)
    # ------------------------------------------------------------------

    def _detect_from_annotations(self, filename: str) -> dict:
        """Return detection result from ground-truth annotations."""
        objs = self.annotations.get(filename, [])
        pothole_objs = [o for o in objs if o["label"] in self.POTHOLE_LABELS]

        bboxes = [[o["xmin"], o["ymin"], o["xmax"], o["ymax"]] for o in pothole_objs]

        if pothole_objs:
            confidence = round(min(0.75 + len(pothole_objs) * 0.05, 0.98), 2)
        elif objs:
            confidence = round(0.45 + random.uniform(0, 0.15), 2)
            bboxes = [[o["xmin"], o["ymin"], o["xmax"], o["ymax"]] for o in objs]
        else:
            confidence = round(random.uniform(0.05, 0.25), 2)

        detected, label, priority = self._classify(confidence)

        return {
            "detected": detected,
            "confidence": confidence,
            "priority": priority,
            "label": label,
            "bounding_boxes": bboxes[:10],
            "image_width": 720,
            "image_height": 720,
        }

    # ------------------------------------------------------------------
    # Simulated detection (ultimate fallback)
    # ------------------------------------------------------------------

    def _detect_simulated(self, image_bytes: bytes) -> dict:
        """Simulated detection when neither CV2 nor annotations are available."""
        # Use file size as a rough heuristic (larger files = more detail)
        file_size = len(image_bytes)

        # Simple heuristic: analyse byte histogram
        byte_data = image_bytes[:4096]  # sample first 4KB
        dark_bytes = sum(1 for b in byte_data if b < 80)
        dark_ratio = dark_bytes / max(len(byte_data), 1)

        # Simulate confidence based on dark content ratio
        base_confidence = 0.3 + dark_ratio * 0.5
        noise = random.uniform(-0.1, 0.1)
        confidence = round(max(0.1, min(base_confidence + noise, 0.95)), 2)

        detected, label, priority = self._classify(confidence)

        # Generate plausible bounding box if detected
        bboxes = []
        if detected:
            cx, cy = random.randint(150, 550), random.randint(400, 650)
            bw, bh = random.randint(60, 200), random.randint(40, 120)
            bboxes.append([cx - bw // 2, cy - bh // 2, cx + bw // 2, cy + bh // 2])

        return {
            "detected": detected,
            "confidence": confidence,
            "priority": priority,
            "label": label,
            "bounding_boxes": bboxes,
            "image_width": 720,
            "image_height": 720,
        }

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _classify(self, confidence: float) -> tuple[bool, str, str]:
        """Map confidence to (detected, label, priority)."""
        if confidence >= 0.7:
            return True, "Pothole Detected", "HIGH"
        elif confidence >= 0.4:
            return True, "Minor Crack / Surface Damage", "MEDIUM"
        else:
            return False, "No Significant Damage", "LOW"

    def _empty_result(self, w: int, h: int) -> dict:
        return {
            "detected": False,
            "confidence": 0.0,
            "priority": "LOW",
            "label": "Unable to process image",
            "bounding_boxes": [],
            "image_width": w,
            "image_height": h,
        }
