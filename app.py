from flask import Flask, render_template, request, jsonify, session
import random

app = Flask(__name__)
app.secret_key = "supersecretkey"

# Motivational + Snarky Quotes
quotes = {
    "high": [
        "Knowledge is power. You’re running on fumes.",
        "You’re still holding on to a few neurons… for now.",
        "Think fast… oh wait, too late."
    ],
    "medium": [
        "You clicked that like it was a good idea.",
        "Ah yes… another braincell bites the dust.",
        "You’re playing Jenga with your own intelligence."
    ],
    "low": [
        "🎻 *Sad violin noises*",
        "A braincell just grew wings and flew away.",
        "Almost there… the void awaits."
    ],
    "zero": [
        "Congratulations. You’ve reached the intellectual level of a cheese stick.",
        "🧠💀 Your brain has left the chat.",
        "Screen is now upside down because so are your life choices."
    ]
}

@app.route('/')
def index():
    if "braincells" not in session:
        session["braincells"] = 50  # default starting braincells
    return render_template('index.html', braincells=session["braincells"])

@app.route('/remove_braincell', methods=['POST'])
def remove_braincell():
    braincells = session.get("braincells", 50)
    braincells = max(0, braincells - 1)
    session["braincells"] = braincells

    if braincells > 5:
        message = random.choice(quotes["high"])
    elif 3 <= braincells <= 5:
        message = random.choice(quotes["medium"])
    elif 1 <= braincells <= 2:
        message = random.choice(quotes["low"])
    else:
        message = random.choice(quotes["zero"])

    return jsonify({"braincells": braincells, "message": message})

if __name__ == "__main__":
    app.run(debug=True)
