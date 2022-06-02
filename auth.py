import functools

from flask import Blueprint
from flask import flash
from flask import g
from flask import redirect
from flask import render_template
from flask import request
from flask import session
from flask import url_for
from werkzeug.security import check_password_hash

from db import get_db

bp = Blueprint("auth", __name__, url_prefix="/auth")


def login_required(view):
    """View decorator that redirects anonymous users to the login page."""

    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("auth.login"))

        return view(**kwargs)

    return wrapped_view


@bp.before_app_request
def load_logged_in_user():
    """If a user id is stored in the session, load the user object from
    the database into ``g.user``."""
    user_id = session.get("user_id")
    cursor, db = get_db()

    if user_id is None:
        g.user = None
    else:
        cursor.execute("SELECT * FROM doctors WHERE id = %s", (user_id,))
        user = cursor.fetchall()
        g.user = (user[0])


@bp.route("/login", methods=("GET", "POST"))
def login():
    """Log in a registered user by adding the user id to the session."""
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        cursor, db = get_db()
        error = None

        cursor.execute("SELECT id, password FROM doctors WHERE username = %s", (username,))
        user = cursor.fetchall()

        userId = user[0][0]
        userPassword = user[0][1]

        if username is None:
            error = "Incorrect username."
        elif not check_password_hash(userPassword, password):
            error = "Incorrect password."

        if error is None:
            # store the user id in a new session and return to the index
            session.clear()
            session["user_id"] = userId
            return redirect(url_for("app.doctorcalendar_page"))

        flash(error)

    return render_template("login.html")


@bp.route("/logout")
def logout():
    """Clear the current session, including the stored user id."""
    session.clear()
    return redirect(url_for("home"))
