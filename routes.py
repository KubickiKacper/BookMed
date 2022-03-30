from flask import Blueprint, render_template
from db import get_db

bp = Blueprint("app", __name__)


@bp.route("/")
def index():
    cursor, db = get_db()   # get essential variables to connect with db

    # doctors all information list
    cursor.execute("select * from doctors")     # execute SQL statement
    doctors = cursor.fetchall()                 # fetch and save result to variable

    # distinct specializations list for dropdown
    cursor.execute("select distinct specialization from doctors")
    specializations = cursor.fetchall()

    return render_template(
        "home.html",
        doctors=doctors,     # pass variable (list of doctors in this case) to html template file
        specializations=specializations
    )


@bp.route("/doctorpage/<doctorid>")
def doctorpage(doctorid):
    cursor, db = get_db()
    cursor.execute("select * from doctors where id=%s",(doctorid,))  # execute SQL statement
    doctor = cursor.fetchone()

    return render_template(
             "doctorpage.html",
             doctor=doctor
        )
