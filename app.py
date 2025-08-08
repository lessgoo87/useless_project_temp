from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

BRAIN_FILE = "braincells.json"
LEADERBOARD_FILE = "leaderboard.json"

# Initialize braincell count if not exists
if not os.path.exists(BRAIN_FILE):
    with open(BRAIN_FILE, "w") as f:
        json.dump({"braincells": 50}, f)

# Initialize leaderboard if not exists
if not os.path.exists(LEADERBOARD_FILE):
    with open(LEADERBOARD_FILE, "w") as f:
        json.dump([], f)

def load_braincells():
    with open(BRAIN_FILE, "r") as f:
        return json.load(f)["braincells"]

def save_braincells(count):
    with open(BRAIN_FILE, "w") as f:
        json.dump({"braincells": count}, f)

def load_leaderboard():
    with open(LEADERBOARD_FILE, "r") as f:
        return json.load(f)

def save_leaderboard(data):
    with open(LEADERBOARD_FILE, "w") as f:
        json.dump(data, f)

@app.route("/")
def index():
    return render_template("index.html", braincells=load_braincells(), leaderboard=load_leaderboard())

@app.route("/use_braincell", methods=["POST"])
def use_braincell():
    count = load_braincells()
    if count > 0:
        count -= 1
        save_braincells(count)
    return jsonify({"braincells": count})

@app.route("/add_score", methods=["POST"])
def add_score():
    name = request.form.get("name", "Anonymous").strip()
    score = load_braincells()
    leaderboard = load_leaderboard()
    leaderboard.append({"name": name, "score": score})
    leaderboard.sort(key=lambda x: x["score"], reverse=True)
    save_leaderboard(leaderboard)
    return jsonify({"leaderboard": leaderboard})

if __name__ == "__main__":
    app.run(debug=True)
