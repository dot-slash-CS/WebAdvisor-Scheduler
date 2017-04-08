Prediction Team:

Hello World*,

So you'll probably be reading this if you missed a few meetings (which is okay**).
As it is right now at this moment subject to change in the future:

	schedule_iterator:
		Samah , Kaishin
	compare:
		Ifran , Hervin
		Hamza , 
	ourKey:
		Christian , Thanh

If you want to git in on one of these message slack channel prediction, 
and also it'd be great if you push some changes to the list of people above.

Let me get down what we're looking at in terms of functions:

compare( section_list , section ):
	""" 
	this guy will return an int***:
	0 = good
	1 = iffy
	2 = bad
	"""
	#sub methods
	compare_date( some_parameters' )
	compare_time( some_parameters' )
	compare_location( some_parameters' )
	



schedule_iterator( section_list , course_list , schedule_list , iffy_list ):
	"""
	makes a schedule_list which is  list of courses with one section in it
	this guy returns a boolean for now
	"""

#the data we get is going to be a 2 demensional list  Bwa ha ha ha  H A !!!
#its not actually that bad its just a list of courses which is in turn a bunch of sections
#so we are going to use python's built in sorted( list ) function which can take a key= argument

ourKey( some_parameters ):
	"""
	will sort courses by least sections to most sections
	"""

#container module 

schedule_generator( course_list ):
	
	sort course_list with ourKey		#this is a small optimization 

	instantiate empty schedule and iffy lists

	call schedule_iterator with first course_list[0].sections[0]
	call schedule_iterator with first course_list[0].sections[1]
	call schedule_iterator with first course_list[0].sections[2]
	. 
	.
	.

	put schedule lists into courses for html to display

	return list of schedules


./Kaishin Kawada

* sorry lame cs joke, but if you weren't at the last meeting ** I hate you, okay**?

***     we're definetly going to have to change the names okay, iffy, and bad for
	the ocd nerds in management, but on our branch is okay.
	if you're good with words make sure to push that change.

