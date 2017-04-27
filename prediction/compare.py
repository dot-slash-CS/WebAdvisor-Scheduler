import datetime

##########################
# CONTAINER FUNCTION
##########################

# Only for use in compare module
class MeetingWrapper:
    """
    Wraps a meeting object (LogicComm's version) changes the following:
    - Adds a 'day' instance attribute
    - Removes 'recurrence' instance attribute (still accessible through 'raw')
    - Converts startTime and endTime from datetime.time to datetime.timedelta
    """
    def __init__(self, meeting, day):
        self.raw           = meeting # the raw meeting object to be wrapped
        self.day           = day     # the day of the week the meeting is on
        self.meetingType   = meeting.meetingType
        self.campus        = meeting.campus
        self.professorName = meeting.professorName
        self.room          = meeting.room

        self.startTime = datetime.timedelta(
            hours   = meeting.startTime.hour,
            minutes = meeting.startTime.minute,
            seconds = meeting.startTime.second
        )

        self.endTime = datetime.timedelta(
            hours   = meeting.endTime.hour,
            minutes = meeting.endTime.minute,
            seconds = meeting.endTime.second
        )

    # returns the duration of class meeting in seconds
    def duration(self):
        return (end - start).total_seconds()

    # allowance is the number of seconds that two classes can overlap and not return true
    # returns true if other_meeting overlaps with this one, false otherwise
    def overlaps_with(self, other_meeting, allowance=0):
        if self.day == other_meeting.day:
            earlier = min(meeting1, meeting2, key=lambda m: m.startTime)
            later   = max(meeting1, meeting2, key=lambda m: m.startTime)
            return (later.startTime - earlier.endTime).total_seconds() < -allowance
        return False


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

# Returns a list of pairs of meetings that overlap
def overlapped_meeting_times(section1, section2):
    overlap = []
    section_one_meetings = map(section1.meetings, lambda m: split_meeting(m))
    section_two_meetings = map(section2.meetings, lambda m: split_meeting(m))

    for meeting1 in section_one_meetings:
        for meeting2 in section_two_meetings:
            if meeting1.overlaps_with(meeting2):
                overlap.append(meeting1, meeting2)

    return overlap

# Takes a list of pairs of meeting objects whose times overlap
#
# Returns true if ALL meetings that are overlapping can be resolved based on
# location and duration of overlap
def can_be_resolved(omts):
    # 15 minutes = 900 seconds
    allowance = 900
    for m_pair in omts:
        earlier, later = min(m_pair), max(m_pair)
        if m_pair[0].overlaps_with(m_pair[1], allowance):
            return False
    return True
        
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
