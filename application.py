from flask import Flask, request
import flask
from flaskext.mysql import MySQL
from HTML import createHTML
from HTML import testcase
from HTML import addEntry
from HTML import getSchedule

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
    createHTML.createHome()
    return application.send_static_file("home.html")

#this is the route that will be called when the "Get Schedules" button is clicked
@application.route("/calendar", methods=["post"])
def calendar():
    term = request.form['Semester']
    if term == "":
        createHTML.createHome({'error':"Error: You must choose a Semester Term"})
        return application.send_static_file("home.html")
    listCourses = list()
    for i in range(8):
        dept = request.form['Department'+str(i)]
        try:
            course = request.form['CourseNum'+str(i)]
        except:
            course = ""
        try:
            section = request.form['SectionNum'+str(i)]
        except:
            section = ""
        if dept!="":
            listCourses.append([{'term':term,'subject':dept,'course_number':course,'section':section}])
    if len(listCourses)==0:
        createHTML.createHome({'error':"Error: You must choose at least one course."})
        return application.send_static_file("home.html")
    print (listCourses)# Pass listCourse to parsing function
    # Pass parsed information to Prediction algorithm
    tempTest = testcase.testcase #this is merely a test case of a lists of schedules with lists of courses
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
	
	application.run()
