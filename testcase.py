from prediction.classes import Meeting, Course, Section
from prediction import schedule_generator
import datetime

#Meeting 1, Section 1, Course 1
meetingType = "Lecture"
campus = "Newark"
startTime = datetime.time(7,0)
endTime = datetime.time(8,5)
professorName = "Suporn Chenhansa"
room = "NC2308"
recurrence = ["MO","WE"]
C1S1M1 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

#Meeting 2, Section 1, Course 1
meetingtype = "Laboratory"
campus = "Newark"
startTime = datetime.time(8,5)
endTime = datetime.time(10,10)
professorName = "David D. Topham"
room = "NC2308"
recurrence = ["MO","WE"] 
C1S1M2 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

#Meeting 3, Section 1, Course 1
meetingtype = "Lab Overload"
campus = "TBA"
startTime = datetime.time(0,0)
endTime = datetime.time(0,0)
professorName = "David D. Topham"
room = "TBA"
recurrence = [] 
C1S1M3 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

# Section 1, Course 1
startDate = datetime.date(2017,8,28)
endDate = datetime.date(2017,12,15)
meetings = [C1S1M1,C1S1M2,C1S1M3]
section_number = "01"
C1S1 = Section(startDate,endDate,meetings,section_number)

###################################

#Meeting 1, Section 2, Course 1
meetingType = "Lecture"
campus = "Newark"
startTime = datetime.time(9,0)
endTime = datetime.time(11,30)
professorName = "Yukai Lin"
room = "NC2306"
recurrence = ["SA"]
C1S2M1 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

#Meeting 2, Section 2, Course 1
meetingType = "Text One-Way Lab Days"
campus = "TBADISTANCE LEARNING VIA WEB"
startTime = datetime.time(0,0)
endTime = datetime.time(0,0)
professorName = "Yukai Lin"
room = "WEB"
recurrence = []
C1S2M2 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

# Section 2, Course 1
startDate = datetime.date(2017,8,28)
endDate = datetime.date(2017,12,15)
meetings = [C1S2M1,C1S2M2]
section_number = "02"
C1S2 = Section(startDate,endDate,meetings,section_number)

####################################

#Meeting 1, Section 3, Course 1
meetingType = "Lecture"
campus = "Newark"
startTime = datetime.time(18,0)
endTime = datetime.time(20,5)
professorName = "Pamela R. Price"
room = "NC2308"
recurrence = ["TU","TH"]
C1S3M1 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

#Meeting 2, Section 3, Course 1
meetingType = "Laboratory"
campus = "Newark"
startTime = datetime.time(20,5)
endTime = datetime.time(21,10)
professorName = "Pamela R. Price"
room = "NC2308"
recurrence = ["TU","TH"] 
C1S3M2 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

# Section 3, Course 1
startDate = datetime.date(2017,8,28)
endDate = datetime.date(2017,12,15)
meetings = [C1S2M1,C1S2M2]
section_number = "03"
C1S3 = Section(startDate,endDate,meetings,section_number)

###################################

# Course 1
sections = [C1S1,C1S2,C1S3]
credits = "3.00"
subject = "CS"
course_number = "102"
title = "Intro to Programming Using C++"
desc = "An introduction to computer programming using the C++ language for students with no programming experience."
C1 = Course(sections,credits,subject,course_number,title,desc)

###################################
###################################
###################################

#Meeting 1, Section 1, Course 2
meetingType = "Lecture"
campus = "Newark"
startTime = datetime.time(8,0)
endTime = datetime.time(9,35)
professorName = "Bonnie Bennett-Walker"
room = "NC2119"
recurrence = ["MO","WE"]
C2S1M1 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

#Meeting 2, Section 1, Course 2
meetingtype = "Text One-Way Lab Days"
campus = "TBADISTANCE LEARNING VIA WEB"
startTime = datetime.time(0,0)
endTime = datetime.time(0,0)
professorName = "Bonnie Bennett-Walker"
room = "WEB"
recurrence = [] 
C2S1M2 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

# Section 1, Course 2
startDate = datetime.date(2017,8,28)
endDate = datetime.date(2017,12,15)
meetings = [C2S1M1,C2S1M2]
section_number = "01"
C2S1 = Section(startDate,endDate,meetings,section_number)

###################################

#Meeting 1, Section 2, Course 2
meetingType = "Lecture"
campus = "Newark"
startTime = datetime.time(8,0)
endTime = datetime.time(9,35)
professorName = "Sobia Saleem"
room = "NP-3"
recurrence = ["MO","WE"]
C2S2M1 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

#Meeting 2, Section 2, Course 2
meetingtype = "Text One-Way Lab Days"
campus = "TBADISTANCE LEARNING VIA WEB"
startTime = datetime.time(0,0)
endTime = datetime.time(0,0)
professorName = "Sobia Saleem"
room = "WEB"
recurrence = [] 
C2S2M2 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

# Section 2, Course 2
startDate = datetime.date(2017,8,28)
endDate = datetime.date(2017,12,15)
meetings = [C2S2M1,C2S2M2]
section_number = "02"
C2S2 = Section(startDate,endDate,meetings,section_number)

###################################

#Meeting 1, Section 3, Course 2
meetingType = "Lecture"
campus = "Newark"
startTime = datetime.time(8,0)
endTime = datetime.time(9,35)
professorName = "Margaret McKenzie"
room = "FP-13"
recurrence = ["MO","WE"]
C2S3M1 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

#Meeting 2, Section 3, Course 2
meetingtype = "Text One-Way Lab Days"
campus = "TBADISTANCE LEARNING VIA WEB"
startTime = datetime.time(0,0)
endTime = datetime.time(0,0)
professorName = "Margaret McKenzie"
room = "WEB"
recurrence = [] 
C2S3M2 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

# Section 3, Course 2
startDate = datetime.date(2017,8,28)
endDate = datetime.date(2017,12,15)
meetings = [C2S3M1,C2S3M2]
section_number = "03"
C2S3 = Section(startDate,endDate,meetings,section_number)

###################################

# Course 2
sections = [C2S1,C2S2,C2S3]
credits = "4.00"
subject = "ENGL"
course_number = "101A"
title = "Reading & Written Composition"
desc = "Development of college-level reading, writing, and critical thinking skills. Essay writing includes argument, exposition, and research."
C2 = Course(sections,credits,subject,course_number,title,desc)

###################################
###################################
###################################

#Meeting 1, Section 1, Course 3
meetingType = "Lecture"
campus = "Fremont"
startTime = datetime.time(7,30)
endTime = datetime.time(8,45)
professorName = "No Information Availiable"
room = "FP-17"
recurrence = ["MO","TU","WE","TH"]
C3S1M1 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

# Section 1, Course 3
startDate = datetime.date(2017,8,28)
endDate = datetime.date(2017,12,15)
meetings = [C3S1M1]
section_number = "01"
C3S1 = Section(startDate,endDate,meetings,section_number)

###################################

#Meeting 1, Section 2, Course 3
meetingType = "Lecture"
campus = "Fremont"
startTime = datetime.time(12,30)
endTime = datetime.time(13,45)
professorName = "Jeffrey P. O'Connell"
room = "FP-15"
recurrence = ["MO","TU","WE","TH"]
C3S2M1 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

# Section 2, Course 3
startDate = datetime.date(2017,8,28)
endDate = datetime.date(2017,12,15)
meetings = [C3S2M1]
section_number = "02"
C3S2 = Section(startDate,endDate,meetings,section_number)

###################################

#Meeting 1, Section 3, Course 3
meetingType = "Lecture"
campus = "Newark"
startTime = datetime.time(18,30)
endTime = datetime.time(21,15)
professorName = "Noorullah Wardak"
room = "NC2120"
recurrence = ["MO","WE"]
C3S3M1 = Meeting(meetingType,campus,startTime,endTime,professorName,room,recurrence)

# Section 3, Course 3
startDate = datetime.date(2017,8,28)
endDate = datetime.date(2017,12,15)
meetings = [C3S3M1]
section_number = "03"
C3S3 = Section(startDate,endDate,meetings,section_number)

###################################

# Course 3
sections = [C3S1,C3S2]#,C3S3]
credits = "5.00"
subject = "MATH"
course_number = "101C"
title = "Calculus with Analytic Geom"
desc = "Vectors, functions of several variables, partial derivatives, multiple integration, and applications."
C3 = Course(sections,credits,subject,course_number,title,desc)

###################################
###################################
###################################

testcase = [C1,C2,C3]

schedule_generator.schedule_generator(testcase)