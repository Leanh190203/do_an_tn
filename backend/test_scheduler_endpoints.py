#!/usr/bin/env python3
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

API_BASE_URL = os.environ.get('API_BASE_URL', 'http://localhost:5000')
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')

def get_token():
    url = f"{API_BASE_URL}/auth/login"
    payload = json.dumps({
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    })
    headers = {
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(url, headers=headers, data=payload)
        if response.status_code == 200:
            return response.json().get('token')
        else:
            print(f"Error getting token: {response.text}")
            return None
    except Exception as e:
        print(f"Exception getting token: {str(e)}")
        return None

def test_send_reminders(token):
    url = f"{API_BASE_URL}/api/appointments/send-reminders"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = json.dumps({
        "days_ahead": 1
    })
    
    try:
        response = requests.post(url, headers=headers, data=payload)
        print(f"Send Reminders Response ({response.status_code}):")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"Exception testing send reminders: {str(e)}")
        return False

def test_auto_update_status(token):
    url = f"{API_BASE_URL}/api/appointments/auto-update-status"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(url, headers=headers)
        print(f"Auto Update Status Response ({response.status_code}):")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"Exception testing auto update status: {str(e)}")
        return False

def main():
    print("Testing Scheduler Endpoints...")
    print(f"API Base URL: {API_BASE_URL}")
    
    # Get token
    token = get_token()
    if not token:
        print("Failed to get authentication token. Check your credentials.")
        return False
    
    print("Successfully obtained authentication token.")
    
    # Test send reminders endpoint
    print("\nTesting 'send-reminders' endpoint...")
    reminders_success = test_send_reminders(token)
    
    # Test auto update status endpoint
    print("\nTesting 'auto-update-status' endpoint...")
    update_success = test_auto_update_status(token)
    
    # Final result
    if reminders_success and update_success:
        print("\n✅ All scheduler endpoints are working correctly!")
        return True
    else:
        print("\n❌ Some scheduler endpoints failed. Check the logs above.")
        return False

if __name__ == "__main__":
    result = main()
    exit(0 if result else 1) 