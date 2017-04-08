# -*- coding: utf-8 -*-
"""
Created on Fri Mar 31 17:14:00 2017

@author: ctoou
"""

def ourKey(course_list):
    course_dict = {}
    for course in course_list:
        course_dict[course] = len(course.sections)
        
    if len(course_list) == 1:
        return course_list
    
    else:
        sorted_course_list = [] 
        while(len(sorted_course_list) != len(course_list)):
            for course in course_list:
                course_dict[course] = course.meetings
                min = 1000
                counter = ''
            for course in course_dict:
                if (course_dict[course] < min):
                    min = course_dict[course]
                    counter = course
            sorted_course_list.append(counter)
            del course_dict[counter]
        return sorted_course_list
               
                        
    
        
    