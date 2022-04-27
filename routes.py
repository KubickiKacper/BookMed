from flask import Blueprint, render_template, request, jsonify
from db import get_db
import datetime

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

@bp.route("/doctor_list")
def doctorlist_page():
    cursor, db = get_db()
    cursor.execute("select * from doctors")
    doctors = cursor.fetchall()

    cursor.execute("select distinct specialization from doctors")
    specializations = cursor.fetchall()

    return render_template(
        "doctor_list.html",
        doctors=doctors,
        specializations=specializations
    )

@bp.route('/add_reservation', methods=['POST'])
def add_reservation():
    cursor, db = get_db()
    cursor.execute("select * from doctors")
    doctors = cursor.fetchall()

    cursor.execute("select distinct specialization from doctors")
    specializations = cursor.fetchall()

    #acquiring reservation log content
    content = request.get_json()

    #converting date format
    month_name = content["selectedDate"].split()[1]
    datetime_object = datetime.datetime.strptime(month_name, "%b")
    month_number_str = str(datetime_object.month) 

    if len(month_number_str) < 2:
        month_number_str = '0' + month_number_str

    date_to_save = content["selectedDate"].split()[3] + "-" + month_number_str + "-" + content["selectedDate"].split()[2]
    
    query = """INSERT INTO reservations VALUES ('', %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    tuple = (content["doctorId"], content["testType"], date_to_save, content["hourFrom"], content["hourTo"], content["patientName"].split()[0],content["patientName"].split()[1], content["patientPhone"], content["infoForDoctor"])
    cursor.execute(query, tuple)
    db.commit()
    
    return render_template(
        "doctor_list.html",
        doctors=doctors,
        specializations=specializations
    )
