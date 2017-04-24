from flask import Flask, request
from flaskext.mysql import MySQL
import tempHTML

application = Flask(__name__)
mysql = MySQL()
application.config['MYSQL_DATABASE_DB'] = "Schedulep"
application.config['MYSQL_DATABASE_HOST'] = "localhost"
application.config['MYSQL_DATABASE_USER'] = "root"
application.config['MYSQL_DATABASE_PASSWORD'] = "password"
mysql.init_app(application)

# this is the first route that will be called when the website is accessed
@application.route("/")
def index():

	tempHTML.main("home")
	return application.send_static_file("tempHTML.html")

#this is the route that will be called when the "Get Schedules" button is clicked
@application.route("/calendar", methods=["post"])
def calendar():
	fields = []
	try:
		fields.append((request.form['course1'],request.form['dept1']))
	except:
		pass
	tempHTML.main("calendar")
	return application.send_static_file("tempHTML.html")


# run the application.
if __name__ == "__main__":
	# Setting debug to True enables debug output. This line should be
	# removed before deploying a production application.
	application.debug = True
	application.run()