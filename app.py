from flask import Flask, render_template, jsonify, request
import json
import os
from pathlib import Path
import random
from flask import send_from_directory

app = Flask(__name__)

DATA_FILE = Path("braincells.json")

# helper to read/write JSON
def read_data():
    if not DATA_FILE.exists():
        with open(DATA_FILE, "w") as f:
            json.dump({"count": 50}, f)
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f)

@app.route("/")
def index():
    # just render, frontend will fetch count
    return render_template("index.html")

# API to get count
@app.route("/api/get_count", methods=["GET"])
def get_count():
    data = read_data()
    return jsonify({"count": data.get("count", 0)})

# API to decrement count by 1 (returns new count)
@app.route("/api/decrement", methods=["POST"])
def decrement():
    data = read_data()
    current = data.get("count", 0)
    new = max(0, current - 1)
    data["count"] = new
    write_data(data)
    return jsonify({"count": new})

# API to reset or set count
@app.route("/api/set_count", methods=["POST"])
def set_count():
    payload = request.json or {}
    value = int(payload.get("count", 50))
    value = max(0, value)
    data = {"count": value}
    write_data(data)
    return jsonify(data)

# API to get leaderboard (fake rats & IQs)
@app.route("/api/leaderboard", methods=["GET"])
def leaderboard():
    rats = [
        "Lab Rat #23", "Rock with Moss", "Goldfish Greg",
        "Sassy Squirrel", "Professor T. Toad", "Tim the Turtle"
    ]
    entries = []
    for r in rats:
        entries.append({"name": r, "iq": round(random.uniform(0.1, 8.0), 2)})
    # include user as final entry (approx)
    data = read_data()
    user_iq = round(max(0.0, data.get("count", 0) / 10.0), 2)
    entries.append({"name": "You", "iq": user_iq})
    # sort descending
    entries = sorted(entries, key=lambda e: e["iq"], reverse=True)
    return jsonify({"leaderboard": entries})

# optional: serve static sounds/images directly (flask already serves /static)
# If you need special static route uncomment if required:
# @app.route('/static/<path:filename>')
# def custom_static(filename):
#     return send_from_directory('static', filename)

if __name__ == "__main__":
    app.run(debug=True)
