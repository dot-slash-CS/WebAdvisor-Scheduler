from flask import Flask, request
import flask
from flaskext.mysql import MySQL
import createHTML,testcase,addEntry,getSchedule

application = Flask(__name__)
mysql = MySQL()
application.config['MYSQL_DATABASE_DB'] = "Schedule"
application.config['MYSQL_DATABASE_HOST'] = "localhost"
application.config['MYSQL_DATABASE_USER'] = "root"
application.config['MYSQL_DATABASE_PASSWORD'] = "password"
mysql.init_app(application)


# this is the first route that will be called when the website is accessed
@application.route("/")
def index():
	return application.send_static_file("home.html")

#this is the route that will be called when the "Get Schedules" button is clicked
@application.route("/calendar", methods=["post"])
def calendar():
    tempTest = testcase.testcase
    addEntry.addEntry(tempTest,mysql)
    createHTML.createCalendar(len(tempTest))
    return application.send_static_file("calendar.html")

@application.route("/selectSchedule", methods=["get"])
def selectSchedule():
    index = request.args.get('i')
    schedule = request.args.get('s')
    return getSchedule.convertToJSON(schedule, index, mysql)

# run the application.
if __name__ == "__main__":
	# Setting debug to True enables debug output. This line should be
	# removed before deploying a production application.
	application.debug = True
	createHTML.createHome()
	application.run()
