from flask import Flask, render_template, jsonify
import time

app = Flask(__name__)

# Store braincell count in memory (reset if server restarts)
braincell_count = 50

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_braincells')
def get_braincells():
    global braincell_count
    return jsonify({"count": braincell_count})

@app.route('/decrement_braincells')
def decrement_braincells():
    global braincell_count
    if braincell_count > 0:
        braincell_count -= 1
    return jsonify({"count": braincell_count})

if __name__ == "__main__":
    app.run(debug=True)
