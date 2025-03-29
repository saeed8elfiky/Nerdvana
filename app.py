from flask import Flask, request, jsonify
import requests
import json
import base64
import time

app = Flask(__name__)

# GitHub Configuration
GITHUB_REPO = "your-username/your-repo"  # Change to your repo
GITHUB_TOKEN = "your_github_personal_access_token"  # Replace with your GitHub token

# GitHub API URL
GITHUB_API_URL = f"https://api.github.com/repos/{GITHUB_REPO}/contents/"

@app.route("/submit", methods=["POST"])
def submit_form():
    data = {
        "name": request.form.get("yourname"),
        "email": request.form.get("email"),
        "subject": request.form.get("subject"),
        "date": time.strftime("%Y-%m-%d %H:%M:%S"),
    }

    json_data = json.dumps(data, indent=4)
    file_name = f"contact_data_{int(time.time())}.json"

    # GitHub API request to create a new file
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "User-Agent": "Python-Flask",
        "Content-Type": "application/json",
    }
    payload = {
        "message": "New contact form submission",
        "content": base64.b64encode(json_data.encode()).decode(),
    }

    response = requests.put(GITHUB_API_URL + file_name, headers=headers, json=payload)

    if response.status_code == 201:
        return jsonify({"message": "Form submitted successfully!"})
    else:
        return jsonify({"error": "Failed to store data on GitHub", "details": response.json()}), 400

if __name__ == "__main__":
    app.run(debug=True)
