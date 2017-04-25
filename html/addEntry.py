import json
from flaskext.mysql import MySQL

#Class Definition of Course, Section and Meeting
"""
class Course:
    def __init__(self,sections[0],credits,subject,course_number,title,desc):
        self.sections[0] = sections[0] # list of section objects #
        self.credits = credits # string #ex "" #
        self.subject = subject #string 
        self.course_number = course_number #string
        self.title = title
        self.desc = desc # string schedule description
    

class Section:
    def __init__(self,startDate,endDate,meetings,section_number):
        self.startDate = startDate # date(2017,3,5) == March 5th,2017
        self.endDate = endDate # date(2017,4,15) == April 15th, 2017
        self.meetings = meetings  #list of meeting objects
        self.section_number = section_number # string # "02" #

class Meeting:
    def __init__(self,meetingType,campus,startTime,endTime,professorName,room,recurrence):
        self.meetingType = meetingType # string # "Lecture"
        self.campus = campus # string # "Newark"
        self.startTime = startTime #Time object  datetime.time()
        self.endTime = endTime #Time object  datetime.time()
        self.professorName = professorName #name string
        self.room = room #string
        self.recurrence = recurrence #list of strings
"""

#schedules parameter is a list of schedules (which are a list of course objects with 1 section)
def convertDict(schedules):
    scheduleDict = {} #initializes scheduleDict as a dictionary 
    scheduleDict['schedules'] = {}
    for s in xrange(len(schedules)): #for every schedule in the list of schedules (from the parameter) we want to create an entry in the schedules dictionary
        scheduleDict['schedules']['S'+str(s)]={} #initializes the first schedule with it's index starting at 0 (it will be called "S0")
        for c in xrange(len(schedules[s])): #for every course in the s'th schedule
            scheduleDict['schedules']['S'+str(s)]['C'+str(c)]={
                'credits' : schedules[s][c].credits,
                'subject' : schedules[s][c].subject,
                'course_number' : schedules[s][c].course_number,
                'title' : schedules[s][c].title,
                'desc' : schedules[s][c].desc
            }
            scheduleDict['schedules']['S'+str(s)]['C'+str(c)]['section'] = {
                'startDate': str(schedules[s][c].sections[0].startDate),
                'endDate': str(schedules[s][c].sections[0].endDate),
                'section_number': schedules[s][c].sections[0].section_number,
                'meetings': {}
            }
            for m in xrange(len(schedules[s][c].sections[0].meetings)):
                scheduleDict['schedules']['S'+str(s)]['C'+str(c)]['section']['meetings']['M'+str(m)]= {
                    'meetingType' : schedules[s][c].sections[0].meetings[m].meetingType,
                    'campus' : schedules[s][c].sections[0].meetings[m].campus,
                    'startTime' : str(schedules[s][c].sections[0].meetings[m].startTime),
                    'endTime' : str(schedules[s][c].sections[0].meetings[m].endTime),
                    'professorName' : schedules[s][c].sections[0].meetings[m].professorName,
                    'room' : schedules[s][c].sections[0].meetings[m].room,
                    'recurrence' : {}
                }
                for r in xrange(len(schedules[s][c].sections[0].meetings[m].recurrence)):
                    scheduleDict['schedules']['S'+str(s)]['C'+str(c)]['section']['meetings']['M'+str(m)]['recurrence']['R'+str(r)]= schedules[s][c].sections[0].meetings[m].recurrence[r]
    return json.dumps(scheduleDict)

def addEntry(schedules, mysql):
    jsonStr = convertDict(schedules)
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO dotslash (schedules) VALUES(\'"+jsonStr+"\')")
    conn.commit()
    tokenID = cursor.lastrowid
    cursor.close()
    conn.close()