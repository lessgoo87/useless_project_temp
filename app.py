from flask import Flask, render_template
import random

app = Flask(__name__)

@app.route("/")
def index():
    welcome_roasts = [
        "You're about to enter a productivity spiral — God help your braincell.",
        "This timer will track how many braincells you lose by trying to focus.",
        "Warning: prolonged use may result in involuntary drooling.",
    ]

    roast = random.choice(welcome_roasts)
    return render_template("index.html", roast=roast)

if __name__ == "__main__":
    app.run(debug=True)
