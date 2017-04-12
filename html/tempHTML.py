import os
from bs4 import BeautifulSoup


def tempHTML(call):
	# main.html contains the html code for the generic template portion of the schedule builder (html that will be present on every page)
	template = BeautifulSoup(open("main.html","r").read(),'html.parser')
	if call == "home":
		# home.html contains the html code for the form that will pop up first to ask the user for all the courses they want on their schedule
		home = BeautifulSoup(open("home.html","r").read(),'html.parser')
		template.body.append(home)
	elif call == "calendar":
		# calendar.html contains the html code for the calendar portion of the schedule builder
		calendar = BeautifulSoup(open("calendar.html","r").read(),'html.parser')
		template.body.append(calendar)
	return str(template)

# saves [text] to indicated [filename]
# creates file (if not already created), truncates it (deletes all information), and opens for reading and writing (we only will write to it)
# writes [text] to the file and closes it
def strToFile(text, filename):
	output = os.open( filename , os.O_CREAT | os.O_TRUNC | os.O_RDWR )
	os.write( output , text )
	os.close( output )

# the main call function (what you would call from other programs)
# calls tempHTML()
# calls strToFile()
def main(call):
	strToFile(tempHTML(call),"static/tempHTML.html")
