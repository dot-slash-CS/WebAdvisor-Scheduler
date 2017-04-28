from prediction import schedule_iterator
from prediction import ourKey
 # -*- coding: utf-8 -*-
"""
Created on Fri Apr  7 18:02:49 2017

@author: ctoou <---- Romeo 
"""

def schedule_generator( course_list ):
	# sort course_list with ourKey		#this is a small optimization
    sorted_course_list = ourKey.ourKey(course_list)
    
	# instantiate empty schedule and iffy lists
    schedule_list = []
    iffy_list = []
    
	# call schedule_iterator with first course_list[0].sections[0]
   # call schedule_iterator with first course_list[0].sections[1]
	# call schedule_iterator with first course_list[0].sections[2]

    section_list = []
    for i_section in sorted_course_list[0].sections:
        section_list.append(i_section)
        schedule_iterator.schedule_iterator(section_list, sorted_course_list[1:], schedule_list, iffy_list)
    
    schedule_course_list = []
    
    for num in range(len(schedule_list)):
        schedule_course_list.append(schedule_list[num], sorted_course_list[num].credits, \
            sorted_course_list[num].subject, sorted_course_list[num].course_number, \
            sorted_course_list[num].title, sorted_course_list[num].desc)
        
    for num in range(len(schedule_list)):
        schedule_course_list.append(schedule_list[num], sorted_course_list[num].credits, \
            sorted_course_list[num].subject, sorted_course_list[num].course_number, \
            sorted_course_list[num].title, sorted_course_list[num].desc)
        
    print (schedule_course_list)
    return schedule_course_list
    


	#put schedule lists into courses for html to display


