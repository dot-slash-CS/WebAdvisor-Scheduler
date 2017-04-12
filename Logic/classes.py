from bs4 import BeautifulSoup
import re
import datetime

subject_regex = re.compile(r'^\w+')
course_number_regex = re.compile(r'-(\w+)-')
section_number_regex = re.compile(r'\w+$')


class Course:
    def __init__(self, page_list):
        #  self.sections = sections  # array of section objects #
        #  self.credits = credits  # VAR4
        #  self.desc = desc  # VAR15
        # self.subject = subject  # VAR2
        # self.course_number = string  # VAR2
        # self.title = title # VAR1
        if page_list:
            soup = BeautifulSoup(page_list[0], 'lxml')
            self.title = soup.find(id='VAR1').text
            course_string = soup.find(id='VAR2').text
            self.subject = subject_regex.search(course_string).group(0)
            self.course_number = course_number_regex.search(course_string).group(1)
            self.credits = soup.find(id='VAR4').text
            self.desc = soup.find('input', {'name': 'VAR15'})['value']
            self.sections = list(map(parse_html, page_list))
        else:
            # TODO Handle empty page_list
            self.title = ''
            self.subject = ''
            self.course_number = ''
            self.credits = ''
            self.desc = ''
            self.sections = []


def parse_html(html_string):
    soup = BeautifulSoup(html_string, 'lxml')
    values = dict()
    # Get section number
    course_string = soup.find(id='VAR2').text
    values['course_string'] = course_string
    values['section_number'] = section_number_regex.search(course_string).group(0)
    # Get meeting string
    values['meeting_string'] = soup.find('input', {'name': 'LIST.VAR12_1'})['value']
    # Get start date
    start_date_string = soup.find(id='VAR6').text
    values['start_date'] = datetime.datetime.strptime(start_date_string, '%d %B %Y').date()
    # Get end date
    end_date_string = soup.find(id='VAR7').text
    values['end_date'] = datetime.datetime.strptime(end_date_string, '%d %B %Y').date()
    # Create and return Section object from dictionary
    return Section(**values)


class Section:
    def __init__(self, **values):
        # self.startDate = startDate  # date(2017,3,5) =VAR6
        # self.endDate = endDate  # date(2017,4,15) =VAR7
        # self.meetings = meetings # LIST_VAR12_1
        # self.section_number = number  # string # "02" # VAR2
        # TODO self.faculty = list of faculty
        self.course_string = values['course_string']
        self.section_number = values['section_number']
        self.start_date = values['start_date']
        self.end_date = values['end_date']
        self.meeting_string = values['meeting_string']
        self.meetings = parse_meeting_string(values['meeting_string'])


def parse_meeting_string(meeting_string):
    # Parse string into dictionary using regex

    # Create Meeting object from dictionary

    # return list of Meeting objects
    return []


class Meeting:
    def __init__(self, **kwargs):
        # self.meetingType = meetingType  # string # "Lecture"
        # self.campus = campus  # string # "Newark" "Fremont" "Distance Learning Via Web"
        # self.startTime = startTime  # Time object
        # self.endTime = endTime  # time object
        # self.professorName = professorName  # name string
        # self.room = room  # string
        # self.recurrence = recurrence # list ['mon', 'tues', 'wed']
        0
