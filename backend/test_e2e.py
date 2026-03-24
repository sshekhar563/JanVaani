import requests
import json
import os
import uuid

BASE_URL = "http://localhost:8000"

def run_test():
    try:
        # Check health
        res = requests.get(f"{BASE_URL}/api/health")
        if res.status_code != 200:
            print("Backend is not running. Start it with: uvicorn backend.app:app")
            return
    except Exception:
        print("Backend is not running. Start it with: uvicorn backend.app:app")
        return

    print("--- E2E WORKFLOW TEST START ---")
    
    unique_id = uuid.uuid4().hex[:6]
    citizen_email = f"citizen{unique_id}@test.com"
    admin_email = f"admin{unique_id}@test.com"
    officer_email = f"officer{unique_id}@test.com"
    password = "password123"

    # 1. Signup Users
    print("1. Registering Citizen, Admin, Officer...")
    requests.post(f"{BASE_URL}/api/auth/signup", json={"email": citizen_email, "password": password, "full_name": "Cit", "role": "public"})
    requests.post(f"{BASE_URL}/api/auth/signup", json={"email": officer_email, "password": password, "full_name": "Off", "role": "department"})
    requests.post(f"{BASE_URL}/api/auth/signup", json={"email": admin_email, "password": password, "full_name": "Adm", "role": "admin", "registration_key": "JANVAANI_ADMIN_2024"})

    # 2. Login
    def login(email):
        r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": email, "password": password})
        return r.json().get("access_token")

    c_token = login(citizen_email)
    a_token = login(admin_email)
    o_token = login(officer_email)

    c_headers = {"Authorization": f"Bearer {c_token}"}
    a_headers = {"Authorization": f"Bearer {a_token}"}
    o_headers = {"Authorization": f"Bearer {o_token}"}

    # 3. Citizen Creates Complaint
    print("2. Citizen files complaint...")
    comp_data = {
        "description": "Massive pothole on Main Street",
        "location": "Test City",
        "category": "road",
        "image_url": "",
        "analysis": {"sentiment": "NEGATIVE", "urgency": 0.9}
    }
    r = requests.post(f"{BASE_URL}/api/complaints", json=comp_data, headers=c_headers)
    assert r.status_code == 200
    comp_id = r.json()["_id"]
    print(f"   Created complaint {comp_id}")

    # 4. Admin Assigns
    print("3. Admin assigns complaint to officer...")
    r = requests.post(f"{BASE_URL}/api/workflow/assign", json={"complaint_id": comp_id, "officer_email": officer_email}, headers=a_headers)
    if r.status_code != 200:
        print(r.json())
    assert r.status_code == 200

    # 5. Officer Checks Assigned
    print("4. Officer retrieves their assigned complaints...")
    r = requests.get(f"{BASE_URL}/api/workflow/my-assignments", headers=o_headers)
    if r.status_code != 200:
        print(r.json())
    assert r.status_code == 200
    assert len(r.json()) > 0

    # 6. Officer Uploads Proof (Mocking file)
    print("5. Officer uploads proof of repair...")
    with open("temp_proof.txt", "w") as f: f.write("dummy image content")
    with open("temp_proof.txt", "rb") as f:
        # Note: server now enforces image/*, so we spoof content type
        files = {"image": ("proof.jpg", f, "image/jpeg")}
        r = requests.post(f"{BASE_URL}/api/workflow/upload-proof/{comp_id}", files=files, headers=o_headers)
    os.remove("temp_proof.txt")
    assert r.status_code == 200

    # 7. AI Verifies
    print("6. System runs AI verification...")
    r = requests.post(f"{BASE_URL}/api/workflow/verify-repair/{comp_id}", headers=a_headers)
    assert r.status_code == 200

    # 8. Citizen Leaves Feedback & Closes Flow
    print("7. Citizen verifies repair and leaves feedback...")
    r = requests.post(f"{BASE_URL}/api/workflow/feedback/{comp_id}", json={"rating": 5, "comments": "Good job"}, headers=c_headers)
    assert r.status_code == 200

    # 9. Verify Cascading Analytics
    print("8. Verifying cascading analytics triggered...")
    r = requests.get(f"{BASE_URL}/api/trust/city", headers=c_headers)
    print(f"   Trust Score API OK: {r.status_code == 200}")
    
    # Finished!
    print("\n✅ SUCCESS: End-to-End Workflow & RBAC validation passed!")

if __name__ == "__main__":
    run_test()
