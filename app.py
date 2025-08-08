from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

LEADERBOARD_FILE = "leaderboard.json"

# Load leaderboard from file
def load_leaderboard():
    if os.path.exists(LEADERBOARD_FILE):
        with open(LEADERBOARD_FILE, "r") as f:
            return json.load(f)
    return []

# Save leaderboard to file
def save_leaderboard(data):
    with open(LEADERBOARD_FILE, "w") as f:
        json.dump(data, f)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/leaderboard")
def leaderboard():
    data = load_leaderboard()
    return render_template("leaderboard.html", leaderboard=data)

@app.route("/submit_score", methods=["POST"])
def submit_score():
    name = request.json.get("name")
    score = request.json.get("score")
    global_lb = request.json.get("global")

    if global_lb:
        leaderboard_data = load_leaderboard()
        leaderboard_data.append({"name": name, "score": score})
        leaderboard_data = sorted(leaderboard_data, key=lambda x: x["score"], reverse=True)[:10]
        save_leaderboard(leaderboard_data)
        return jsonify({"status": "saved", "leaderboard": leaderboard_data})
    else:
        return jsonify({"status": "private"})

if __name__ == "__main__":
    app.run(debug=True)
