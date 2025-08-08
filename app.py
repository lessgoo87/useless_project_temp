from flask import Flask, render_template, jsonify, request
import json
import os
from pathlib import Path

app = Flask(__name__)

DATA_FILE = Path("braincells.json")
DEFAULT_COUNT = 50

def read_data():
    if not DATA_FILE.exists():
        write_data({"count": DEFAULT_COUNT})
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f)

@app.route("/")
def index():
    # Serve the page (frontend will request the count)
    return render_template("index.html")

@app.route("/get_braincells", methods=["GET"])
def get_braincells():
    data = read_data()
    return jsonify(data)

@app.route("/update_braincells", methods=["POST"])
def update_braincells():
    """
    POST body JSON: {"delta": -1}  (delta can be negative or positive)
    If no body or invalid, defaults to -1 (lose one).
    """
    data = read_data()
    delta = -1
    try:
        body = request.get_json(silent=True) or {}
        delta = int(body.get("delta", -1))
    except Exception:
        delta = -1

    # apply
    data["count"] = max(0, int(data.get("count", DEFAULT_COUNT)) + delta)
    write_data(data)
    return jsonify(data)

@app.route("/reset", methods=["POST"])
def reset():
    write_data({"count": DEFAULT_COUNT})
    return jsonify({"count": DEFAULT_COUNT})

if __name__ == "__main__":
    # ensure data file exists
    if not DATA_FILE.exists():
        write_data({"count": DEFAULT_COUNT})
    app.run(debug=True)
