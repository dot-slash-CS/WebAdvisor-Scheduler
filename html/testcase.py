import datetime

class Course:
	def __init__(self,sections,credits,subject,course_number,title,desc):
		self.sections = sections # list of section objects #
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



#MATH 101C
coursecredit101C = "5.00"
coursesubject101C = "MATH"
coursecourse101C = "101C"
coursetitle101C = "Calculus with Analytic Geom"
coursedesc101C = "Vectors, functions of several variables, partial derivatives, multiple integration, and applications." 

#SECTION 1
sectionstartd1 = datetime.date(2017,1,23)
sectionendd1 = datetime.date(2017,5,19)
sectionnumber1 = "01"

#MEETING A
meetingtype1A = "Lecture"
meetingcampus1A = "Fremont"
meetingstartt1A = datetime.time(7,45)
meetingendt1A = datetime.time(9,0)
meetingprofessor1A = "Chieko Honma"
meetingroom1A = "FP-7"
meetingrecurrence1A = ["Monday","Tuesday","Wednesday","Thursday"]

#SECTION 2
sectionstartd2 = datetime.date(2017,1,23)
sectionendd2 = datetime.date(2017,5,19)
sectionnumber2 = "02"

#MEETING A
meetingtype2A = "Lecture"
meetingcampus2A = "Fremont"
meetingstartt2A = datetime.time(12,0)
meetingendt2A = datetime.time(13,15)
meetingprofessor2A = "Anh Thai Nhan"
meetingroom2A = "FP-15"
meetingrecurrence2A = ["Monday","Tuesday","Wednesday","Thursday"]

#SECTION 3
sectionstartd3 = datetime.date(2017,1,23)
sectionendd3 = datetime.date(2017,5,19)
sectionnumber3 = "03"

#MEETING A
meetingtype3A = "Lecture"
meetingcampus3A = "Fremont"
meetingstartt3A = datetime.time(18,30)
meetingendt3A = datetime.time(21,15)
meetingprofessor3A = "Steven D. Bitzer"
meetingroom3A = "FP-7"
meetingrecurrence3A = ["Tuesday","Thursday"]

#CS 102
coursecredit102 = "3.00"
coursesubject102 = "CS"
coursecourse102 = "102"
coursetitle102 = "Intro to Programming Using C++"
coursedesc102 = "An introduction to computer programming using the C++ language for students with no programming experience." 

#SECTION 1
CSsectionstartd1 = datetime.date(2017,1,23)
CSsectionendd1 = datetime.date(2017,5,19)
CSsectionnumber1 = "01"

#MEETING A
CSmeetingtype1A = "Lecture"
CSmeetingcampus1A = "Newark"
CSmeetingstartt1A = datetime.time(8,0)
CSmeetingendt1A = datetime.time(9,5)
CSmeetingprofessor1A = "David D. Topham"
CSmeetingroom1A = "NC2308"
CSmeetingrecurrence1A = ["Monday","Wednesday"]

#MEETING B
CSmeetingtype1B = "Laboratory"
CSmeetingcampus1B = "Newark"
CSmeetingstartt1B = datetime.time(9,5)
CSmeetingendt1B = datetime.time(11,15)
CSmeetingprofessor1B = "David D. Topham"
CSmeetingroom1B = "NC2308"
CSmeetingrecurrence1B = ["Monday","Wednesday"]

#SECTION 2
CSsectionstartd2 = datetime.date(2017,1,23)
CSsectionendd2 = datetime.date(2017,5,19)
CSsectionnumber2 = "02"

#MEETING A
CSmeetingtype2A = "Lecture"
CSmeetingcampus2A = "Newark"
CSmeetingstartt2A = datetime.time(9,0)
CSmeetingendt2A = datetime.time(11,5)
CSmeetingprofessor2A = "Yukai Lin"
CSmeetingroom2A = "NC2306"
CSmeetingrecurrence2A = ["Saturday"]

#MEETING B
CSmeetingtype2B = "Text One-Way Lab Days"
CSmeetingcampus2B = "TBADISTANCE LEARNING VIA WEB"
CSmeetingstartt2B = datetime.time(0,0)
CSmeetingendt2B = datetime.time(0,0)
CSmeetingprofessor2B = "Yukai Lin"
CSmeetingroom2B = "WEB"
CSmeetingrecurrence2B = []

meeting101C1A = Meeting(meetingtype1A,meetingcampus1A,meetingstartt1A,meetingendt1A,meetingprofessor1A,meetingroom1A,meetingrecurrence1A)
meeting101C2A = Meeting(meetingtype2A,meetingcampus2A,meetingstartt2A,meetingendt2A,meetingprofessor2A,meetingroom2A,meetingrecurrence2A)
meeting101C3A = Meeting(meetingtype3A,meetingcampus3A,meetingstartt3A,meetingendt3A,meetingprofessor3A,meetingroom3A,meetingrecurrence3A)
meeting102C1A = Meeting(CSmeetingtype1A,CSmeetingcampus1A,CSmeetingstartt1A,CSmeetingendt1A,CSmeetingprofessor1A,CSmeetingroom1A,CSmeetingrecurrence1A)
meeting102C1B = Meeting(CSmeetingtype1B,CSmeetingcampus1B,CSmeetingstartt1B,CSmeetingendt1B,CSmeetingprofessor1B,CSmeetingroom1B,CSmeetingrecurrence1B)
meeting102C2A = Meeting(CSmeetingtype2A,CSmeetingcampus2A,CSmeetingstartt2A, CSmeetingendt2A,CSmeetingprofessor2A,CSmeetingroom2A,CSmeetingrecurrence2A)
meeting102C2B = Meeting(CSmeetingtype2B,CSmeetingcampus2B,CSmeetingstartt2B, CSmeetingendt2B,CSmeetingprofessor2B,CSmeetingroom2B,CSmeetingrecurrence2B)

section101C1 = Section(sectionstartd1,sectionendd1,[meeting101C1A],sectionnumber1)
section101C2 = Section(sectionstartd2,sectionendd2,[meeting101C2A],sectionnumber2)
section101C3 = Section(sectionstartd3,sectionendd3,[meeting101C3A],sectionnumber3)
section1021 = Section(CSsectionstartd1,CSsectionendd1,[meeting102C1A,meeting102C1B],CSsectionnumber1)
section1022 = Section(CSsectionstartd2,CSsectionendd2,[meeting102C2A,meeting102C2B],CSsectionnumber2)

course101C = Course([section101C1,section101C2,section101C3],coursecredit101C,coursesubject101C,coursecourse101C,coursetitle101C,coursedesc101C)
course102 = Course([section1021,section1022],coursecredit102,coursesubject102,coursecourse102,coursetitle102,coursedesc102)

schedule1 = [Course([section101C2],coursecredit101C,coursesubject101C,coursecourse101C,coursetitle101C,coursedesc101C),Course([section1021],coursecredit102,coursesubject102,coursecourse102,coursetitle102,coursedesc102)]
schedule2 = [Course([section101C3],coursecredit101C,coursesubject101C,coursecourse101C,coursetitle101C,coursedesc101C),Course([section1021],coursecredit102,coursesubject102,coursecourse102,coursetitle102,coursedesc102)]

testcase = [schedule1,schedule2]



# The test case is a list of lists of courses
# testcase = [[Course1A,Course2A],[Course1B,Course2A]]
# The courses contain a single section