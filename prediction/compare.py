import datetime

#################
#The documentation in war_strategy.txt says we're using compare vs check
#But its chill so long as you push the change to the war_strategy
#with the exception that the final container function is named compare
#Because that is an interface which is used outside of this module
#################

#return a bool 


def compare_location(test_one, test_two):
    if test_one.sections.meetings.campus == "Newark" and test_two.sections.meetings.campus == "Newark":
        result = "Good"
    elif test_one.sections.meetings.campus == "Fremont" and test_two.sections.meetings.campus == "Fremont":
        result = "Good"
    else:
        result = "Different"        
    return result

#return 0,1,2

def compare_time( test_one, test_two):
    #will return in the middle of for loop sorry
    #checks that all meeting times work
    for i_meeting in test_one.meetings :
        for j_meeting in test_two.meetings :
            if j_meeting.startTime == time.time(0) :
                

##########################
# CONTAINER FUNCTION
##########################

        
def compare( section_list , section ):
    #success_lis good iffy and bad status
    #status the status to append to suces_list
    success_list = [] 
    status 

    for i_section in setion_list :
        #if compare_date equals true then class start date and end date
        #overlap
        #if they don't overlap then the classes are compatible

        if compare_date( i_section , section ) :
            #if they over lap check time and location
            if compare_location( i_section , section ) :
                #if they are at the same campus then there is no 
                #consideration for an iffy time
                if 2 > compare_time( i_section , section ) :
                status = 0
            else :
                #different campuses so struggle
                status = compare_time( i_section , section ) 
        
        else:
            status = 0

        success_list.append( status ) 

    if success_list.count( 2 ) > 0 :
        status = 2
    elif success_list.count( 1 ) > 0 :
        status = 1
    else :
        status = 0 

    return status 
	
	

