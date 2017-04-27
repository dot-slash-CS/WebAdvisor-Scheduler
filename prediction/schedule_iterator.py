from prediction/compare import compare
#schedule_iterator.py
#Recurssively iterates through a list of courses (a list of sections)
#to concatenate a list of courses with a single section

#returns a int 0,1,2 
#corresponds, respectively, to good iffy and bad status

#section_list contains a potential schedule which is being validate by curre nt iteration
#schedule_list consists of good sections
#iffy_list consists of a list with atleast one section with iffy status

def schedule_iterator( section_list , course_list , schedule_list , iffy_list ):
    
    success_list = []                   #list to hold return statuses

########################## 
##  Base Case 
##########################
    if course_list.length() == 1:    
        for i_section in course_list[0].sections:
            
            #check for good , iffy , or bad class time/location
            status =  compare( section_list , i_section ) 
            
            #append good section list to schedule_list
            if status == 0:
                section_list.append( i_section ) 
                schedule_list.append( section_list ) 
                success_list.append( status )

            #append iffy section list to iffy_list 
            elif status == 1:
                section_list.append( i_section ) 
                iffy_list.append( section_list ) 
                success_list.append( status )

            #bad section list
            else status == 2 :
                success_list.append( status )

########################## 
##  Standard Case 
##########################
    else:                               #course_list is greater than 1
        for i_section in course_list[0].sections:
            #check for good , iffy , or bad class time/location
            status =  compare( section_list , i_section ) 
            
            if status == 0 or status == 1 :
                section_list.append( i_section )
                success_list.append( schedule_iterator( section_list , course_list[1:] , schedule_list , iffy_list ) )

            else:
                success_list.append( 2 ) 

########################## 
##  return 
##########################
    #schedule_list contains good schedules
    if success_list.count( 0 ) > 0 :
        status = 0
    #iffy_list contains iffy schedules
    elif success_list.count( 1 ) > 0 :
        status = 1
    #schedule list contains no iffy or good schedules
    else:
        status = 2

    return status 

