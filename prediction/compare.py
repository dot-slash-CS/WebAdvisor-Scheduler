#################
#The documentation in war_strategy.txt says we're using compare vs check
#But its chill so long as you push the change to the war_strategy
#with the exception that the final container function is named compare
#Because that is an interface which is used outside of this module
#################

def check_location(test_one, test_two):
    if test_one.sections.meetings.campus == "Newark" and test_two.sections.meetings.campus == "Newark":
        result = "Good"
    elif test_one.sections.meetings.campus == "Fremont" and test_two.sections.meetings.campus == "Fremont":
        result = "Good"
    else:
        result = "Different"        
    return result


def check_time(test_one, test_two):
    if test_one.sections.meetings.startTime == 0.00:
        result = 0 #good
    elif test_one.sections.meetings.startTime < test_two.sections.meetings.endTime and test_one.sections.meetings.endTime > test_two.sections.meetings.startTime:
        result = 0 #good
    else:
        result = 2 #bad

##########################
# CONTAINER FUNCTION
##########################

        
def compare( section_list , section ):
    
