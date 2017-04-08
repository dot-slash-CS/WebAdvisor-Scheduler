class Course:
	def __init__(self,sections,credits,subject,course_number,tilte,desc):
		self.sections = sections # list of section objects #
		self.credits = credits # string #ex "" #
		self.subject = subject #string 
		self.course_number = course_number #string
		self.title = title
		self.desc = desc # string schedule description


class Section:
	def __init__(self,startDate,endDate,meetings,number):
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
