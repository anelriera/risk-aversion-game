import os
import uuid
from datetime import datetime

import psycopg2
from flask import Flask, jsonify, redirect, render_template, request, session
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-key")


# -----------------------------
# DATABASE CONNECTION
# -----------------------------
def get_db_connection():
    return psycopg2.connect(
        host=os.environ["DB_HOST"],
        port=os.environ.get("DB_PORT", 5432),
        database=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
    )


# -----------------------------
# ROUTES
# -----------------------------
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

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO game_rounds
        (participant_id, round, block, probability, v_r, v_d, difference, audit, points, total_score, timestamp)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
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
            datetime.fromisoformat(data["timestamp"].replace("Z", "+00:00")),
        ),
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "ok"})


@app.route("/save_email", methods=["POST"])
def save_email():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "No email provided"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO emails (email, timestamp) VALUES (%s, %s)",
            (email, datetime.now()),
        )
        conn.commit()
        return jsonify({"status": "ok"})
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({"error": "Este email ya está registrado."}), 409
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


@app.route("/thanks")
def thanks():
    if "participant_id" not in session:
        return redirect("/")
    return render_template("thanks.html")


if __name__ == "__main__":
    app.run(debug=True)
