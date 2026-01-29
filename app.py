import csv
import os
import uuid
from datetime import datetime

from flask import Flask, jsonify, redirect, render_template, request, session

app = Flask(__name__)
app.secret_key = "secret-key-cambia-esto"

DATA_FILE = "data.csv"

# crear CSV si no existe
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(
            [
                "participant_id",
                "round",
                "block",
                "probability",
                "V_R",
                "V_D",
                "difference",
                "audit",
                "points",
                "total_score",
                "timestamp",
            ]
        )


@app.route("/")
def consent():
    return render_template("consent.html")


@app.route("/start", methods=["POST"])
def start():
    if request.form.get("consent") != "on":
        return redirect("/")

    participant_id = str(uuid.uuid4())
    session["participant_id"] = participant_id
    return redirect("/game")


@app.route("/game")
def game():
    if "participant_id" not in session:
        return redirect("/")
    return render_template("game.html")


@app.route("/save", methods=["POST"])
def save_data():
    data = request.json

    with open(DATA_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(
            [
                data["participant_id"],
                data["round"],
                data["block"],
                data["probability"],
                data["V_R"],
                data["V_D"],
                data["difference"],
                data["audit"],
                data["points"],
                data["total_score"],
                data["timestamp"],
            ]
        )

    return jsonify({"status": "ok"})


@app.route("/thanks")
def thanks():
    if "participant_id" not in session:
        return redirect("/")
    return render_template("thanks.html")


if __name__ == "__main__":
    app.run(debug=True)
