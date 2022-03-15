import mariadb 
import sys
from flask import Flask,render_template

app = Flask(__name__)

try:
    conn=mariadb.connect(
        user='bookmed_admin',
        password="bookmedpassword1215",
        host="35.209.219.71",
        port=3306,
        database="bookmed"
    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

cur = conn.cursor()
#cur.execute("SELECT * FROM doctors") 
#tables = cur.fetchall()
#for row in tables:
#    print(row)

@app.route('/')
def homePage():
    return render_template('home.html')


if __name__ == '__main__':
    app.run(debug=True)
