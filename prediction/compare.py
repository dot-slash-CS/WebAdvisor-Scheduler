import datetime

##########################
# CONTAINER FUNCTION
##########################

# Only for use in compare module
class MeetingWrapper:
    """Wraps a meeting object and adds a 'day' field"""
    def __init__(self, meeting, day):
        self.meeting       = meeting # the raw meeting object to be wrapped
        self.day           = day     # the day of the week the meeting is on
        self.meetingType   = meeting.meetingType
        self.campus        = meeting.campus
        self.startTime     = meeting.startTime
        self.endTime       = meeting.endTime
        self.professorName = meeting.professorName
        self.room          = meeting.room
        self.recurrence    = meeting.recurrence

# Takes a meeting object (LogicComm's version) as a parameter
#
# Returns a list of MeetingWrapper objects that represent the one meeting
# parameter except split into different days of the week based on
# meeting.recurrence
def split_meeting(meeting):
    meetings_wrapped = []
    for day_of_week in meeting.recurrence:
        meetings_wrapped.append(MeetingWrapper(meeting, day_of_week))
    return meetings_wrapped

# Returns list of pairs of meetings that overlap
def overlapped_meeting_times(section1, section2):
    # TODO
    pass

# Takes a list of pairs of meeting objects whose times overlap
#
# Returns true if ALL meetings that are overlapping can be resolved based on
# location and duration of overlap
def can_be_resolved(omts):
    # TODO
    pass
        
def compare(section_list, section):
    # success_lis good iffy and bad status
    # status the status to append to suces_list
    success_list = [] 
    status = 0

    for sec in section_list:
        omts = overlapped_meeting_times(sec, section)
        if omts: # if there are overlapped meeting times
            status = 1 if can_be_resolved(omts) else 2
            if status == 2:
                return status

    return status 
