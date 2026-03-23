# 🏛️ JanVaani — जनवाणी | Smart Civic Governance Platform

> **जनता की आवाज़, नेता की दिशा** — *Voice of the People, Direction for Leaders*

An AI-powered Smart Civic Governance Platform built with **React + Vite** (frontend) and **FastAPI + MongoDB** (backend). Citizens can report civic issues like potholes, officers resolve them, and AI verifies repairs — all tracked with real-time trust scores.

---

## 🎯 Features

### 🧑‍🤝‍🧑 Citizen Portal
- Submit complaints with image upload + text description
- AI-powered pothole detection from road images
- NLP sentiment & urgency analysis of complaint text
- Real-time complaint tracking with timeline
- Community validation of completed repairs

### 👷 Officer Dashboard
- View assigned complaints
- Upload after-repair proof images
- AI-powered repair verification (before/after comparison)
- Performance stats & resolution tracking

### 🏢 Admin Dashboard (Leadership War Room)
- Real-time stats: Total Issues, Resolved, Pending, Pothole Alerts
- Public Trust Index with 4 key metrics (Resolution Speed, Citizen Sentiment, Verified Proof, Communication)
- AI Priority Inbox — issues ranked by urgency × public impact
- Proof of Work gallery — verified completions
- Quick Insights — Critical Alerts, Misinformation, Trending issues

### 🤖 Governance AI Suite (Admin Only)
- **Heatmaps** — Geographic complaint clustering with KMeans
- **Fraud Detection** — Duplicate images, suspicious timing, unresolved damage checks
- **Officer Performance** — Rankings, resolution time, citizen ratings
- **Trust Score Analytics** — Area-wise and city-wide trust computation
- **Digital Twin** — City simulation with what-if scenario modeling
- **Predictions** — Complaint volume forecasting with linear regression

### 🔐 Security
- JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control (RBAC):**
  - Admin → Full access to all governance endpoints
  - Department/Officer → Proof upload, assignment views
  - Public/Citizen → Complaint submission, feedback
- Frontend route protection with role checks

---

## 📁 Project Structure

```
JanVaani/
├── backend/                    # FastAPI Backend
│   ├── main.py                 # App entry point + all API routes
│   ├── db.py                   # Shared MongoDB handle
│   ├── register_routers.py     # Governance router registration
│   ├── routes/
│   │   ├── rbac.py             # RBAC dependency helpers
│   │   ├── workflow.py         # Complaint lifecycle endpoints
│   │   ├── fraud.py            # Fraud detection APIs
│   │   ├── trust.py            # Trust score APIs
│   │   ├── officer_analytics.py # Officer performance APIs
│   │   ├── geo.py              # Heatmap & clustering APIs
│   │   ├── digital_twin.py     # City simulation APIs
│   │   ├── prediction.py       # Forecasting APIs
│   │   └── verification.py     # Work verification APIs
│   ├── services/
│   │   ├── trust_service.py    # Trust computation logic
│   │   ├── officer_service.py  # Officer metrics from complaints
│   │   ├── fraud_service.py    # Fraud checks
│   │   ├── prediction_service.py # Linear regression forecasting
│   │   ├── digital_twin_service.py # Simulation engine
│   │   └── geo_service.py      # Geographic analytics
│   └── requirements.txt
├── src/                        # React Frontend
│   ├── App.jsx                 # Routes + RBAC protection
│   ├── pages/
│   │   ├── CitizenPortal.jsx   # Complaint submission
│   │   ├── Dashboard.jsx       # Admin dashboard
│   │   └── GovernanceDashboard.jsx # AI governance suite
│   └── components/dashboard/
│       ├── StatsCards.jsx       # Real-time stats
│       ├── TrustIndex.jsx       # Trust score visualization
│       ├── PriorityInbox.jsx    # AI-ranked issue queue
│       └── ProofOfWork.jsx      # Verified completions
├── datasets/                   # Analytics datasets
│   └── 311_small.csv           # NYC 311 complaint data
├── data/India/                 # Road damage detection images
├── package.json
└── vite.config.js
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** with pip
- **Node.js 18+** with npm
- **MongoDB** — running locally or on Atlas (default: `mongodb://localhost:27017`)

### 1. Clone the Repository

```bash
git clone https://github.com/sshekhar563/JanVaani.git
cd JanVaani
```

### 2. Setup Backend (Python Virtual Environment)

```bash
# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 3. Setup Frontend

```bash
npm install
```

### 4. Configure Environment

Create a `.env` file inside `backend/` (optional — defaults are provided):

```env
MONGODB_URL=mongodb://localhost:27017
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
```

### 5. Start the Application

```bash
npm run dev
```

This starts **both** servers concurrently:
- **Frontend** → `http://localhost:5173`
- **Backend API** → `http://localhost:8000`

### 6. Create Admin Account

1. Go to `http://localhost:5173/admin/signup`
2. Enter your details
3. Use access key: `JANVAANI_ADMIN_2024`
4. Login at `http://localhost:5173/admin/login`

### 7. Create Citizen Account

1. Go to `http://localhost:5173/signup`
2. Register with email and password
3. Login at `http://localhost:5173/login`

---

## 🔄 Complete Workflow

```
Citizen uploads pothole image
  → AI detects pothole (YOLOv8-based detection)
  → NLP analyzes complaint text (sentiment + urgency)
  → Complaint created in MongoDB
  → Appears in Admin Priority Inbox
  → Admin assigns officer
  → Officer fixes issue & uploads proof image
  → AI verifies repair (before/after comparison)
  → Citizen gives feedback (1-5 rating)
  → Trust score auto-recalculated
  → Officer performance auto-updated
```

---

## 📡 API Endpoints

### Public (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/workflow/stats` | Dashboard statistics |
| GET | `/api/workflow/completed-works` | Verified completions |
| GET | `/api/trust/city` | City-wide trust score |

### Authenticated (JWT Required)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/complaints` | Any | Create complaint |
| GET | `/api/complaints` | Any | List complaints |
| POST | `/api/detect-pothole` | Any | AI pothole detection |
| POST | `/api/analyze` | Any | NLP text analysis |
| POST | `/api/workflow/feedback/{id}` | Any | Submit citizen feedback |

### Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/workflow/assign` | Assign complaint to officer |
| GET | `/api/workflow/officers` | List all officers |
| GET | `/api/fraud/reports` | View fraud reports |
| GET | `/api/predict/complaints` | Complaint forecasts |
| GET | `/api/geo/heatmap` | Geographic heatmap data |
| GET | `/api/officer/ranking` | Officer performance ranking |
| GET | `/api/digital-twin/state` | Digital twin city state |

### Officer / Department
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workflow/my-assignments` | View assigned cases |
| POST | `/api/workflow/upload-proof/{id}` | Upload repair proof |
| POST | `/api/workflow/verify-repair/{id}` | AI verification |

---

## 🗃️ Datasets Used

| Dataset | Size | Purpose |
|---------|------|---------|
| `datasets/311_small.csv` | ~16 MB | Complaint volume prediction & digital twin |
| `News_Dataset/Fake.csv` + `True.csv` | ~50 MB | Misinformation/fraud detection |
| `twcs/twcs.csv` | ~45 MB | Customer service sentiment training |
| `data/India/` images | ~200 MB | Road damage detection (7706 annotations) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, Framer Motion, Lucide Icons, Chart.js |
| Backend | FastAPI, Uvicorn, Motor (async MongoDB) |
| Database | MongoDB |
| AI/ML | OpenCV (pothole detection), HuggingFace Transformers (NLP), Whisper (voice) |
| Auth | JWT + bcrypt + RBAC |
| Styling | Tailwind CSS + custom glassmorphism theme |

---

## 📄 License

This project is built for academic and civic governance research purposes.

---

<p align="center">
  Built with ❤️ for Smart Governance
</p>
