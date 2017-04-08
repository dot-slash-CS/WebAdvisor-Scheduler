def check_location(test_one, test_two):         
    result
    if test_one.sections.meetings.campus == "Newark" and test_two.sections.meetings.campus == "Newark":
        result = "Good"
    elif test_one.sections.meetings.campus == "Fremont" and test_two.sections.meetings.campus == "Fremont":
        result = "Good"
    else:
        result = "Different"        
    return result


def check_time(test_one, test_two):
    result
    if test_one.sections.meetings.startTime <= test_two.sections.meetings.endTime and test_one.sections.meetings.endTime >= test_two.sections.meetings.startTime:
        result = 0; #good
    else:
        result = 1; #bad
        
        