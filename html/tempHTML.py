
'''
The purpose of this program is to create a dynamic html file in the static folder
The html file changes depending on what options you pass through parameters
'''

import os

# the main call function (what you would call from other programs)
# calls tempHTML()
# calls strToFile()

def main(option, db_id=None,notes=None):
	html = tempHTML(option, db_id, notes)
	strToFile(html,"static/tempHTML.html")

# saves [text] to indicated [filename]
# creates file (if not already created), truncates it (deletes all information), and opens for reading and writing (we only will write to it)
# writes [text] to the file and closes it
def strToFile(text, filename):
	output = os.open( filename , os.O_CREAT | os.O_TRUNC | os.O_RDWR )
	os.write( output , text )
	os.close( output )

# concatenates strings
# takes an html template and adds parts depending on [type] and the [message]
# flag indicates what color the message is (ERROR (1) = RED, NO ERROR (0) = GREY)
# returns a string of the concatenated text
def tempHTML(option, db_id, notes):
	main_html_top ='''
<!DOCTYPE HTML>
<html>
	<head>
		<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
		<link rel="stylesheet" href="static/assets/css/main.css" />
		<!--[if lte IE 9]><link rel="stylesheet" href="assets/css/ie9.css" /><![endif]-->
		<!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
		<link rel="stylesheet" type="text/css" href="static/assets/css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="static/assets/css/bootstrap-theme.min.css">
		<link rel="stylesheet" type="text/css" href="static/assets/css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="static/assets/css/bootstrap-theme.css">
	</head>
	<body>
	<div class="header">
		<a href="http://www.ohlone.edu/" target="_blank">
        <img class="logo" src="http://www.ohlone.edu/org/collegeadvancement/downloads/ohlone50thannivlogo-horizontal.jpg" target="_blank" />
      </a>
	</div>
'''
	main_html_bot = '''</body>
</html>'''
	variable = ''''''
	if option == "calendar":
		variable = '''
    <div class="row">
      <div class="col-xs-6 col-sm-8 col-lg-10">
		<div class="schedule">
			<div class="times-container">
				<table class="calendartimes">
					<tr class="times">
						<td class="times">6:00 am</td>
					</tr>
					<tr class="times">
						<td class="times">7:00 am</td>
					</tr>
					<tr class="times">
						<td class="times">8:00 am</td>
					</tr>
					<tr class="times">
						<td class="times">9:00 am</td>
					</tr>
					<tr class="times">
						<td class="times">10:00 am</td>
					</tr>
					<tr class="times">
						<td class="times">11:00 am</td>
					</tr>
					<tr class="times">
						<td class="times">12:00 pm</td>
					</tr>
					<tr class="times">
						<td class="times">1:00 pm</td>
					</tr>
					<tr class="times">
						<td class="times">2:00 pm</td>
					</tr>
					<tr class="times">
						<td class="times">3:00 pm</td>
					</tr>
					<tr class="times">
						<td class="times">4:00 pm</td>
					</tr>
					<tr class="times">
						<td class="times">5:00 pm</td>
					</tr>
					<tr class="times">
						<td class="times">6:00 pm</td>
					</tr>
					<tr class="times">
						<td class="times">7:00 pm</td>
					</tr>
					<tr class="times">
						<td class="times">8:00 pm</td>
					</tr>
					<tr class="times">
						<td class="times">9:00 pm</td>
					</tr>
					<tr class="times">
						<td class="times">10:00 pm</td>
					</tr>
					<tr class="times">
						<td class="times">11:00 pm</td>
					</tr>
				</table>
			</div>
			<div class="calendar-container">
				<div class="grid-container">
					<table class="calendarbody">
						<tr class="scbldr-head">
							<th class="scbldr">Monday</th>
							<th class="scbldr">Tuesday</th>
							<th class="scbldr">Wednesday</th>
							<th class="scbldr">Thursday</th>
							<th class="scbldr">Friday</th>
							<th class="scbldr">Saturday</th>
						</tr>
						<tr class="scbldr even" name="cal 6">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="cal 7">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="scbldr 8">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="cal 9">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="cal 10">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="scbldr 11">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="cal 12">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="cal 13">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="scbldr 14">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="cal 15">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="cal 16">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="scbldr 17">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="cal 18">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="scbldr 19">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="cal 20">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="cal 21">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
						<tr class="scbldr even" name="scbldr 22">
							<td class="scbldr" id="scbldr-mon-even"></td>
							<td class="scbldr" id="scbldr-tue-even"></td>
							<td class="scbldr" id="scbldr-wed-even"></td>
							<td class="scbldr" id="scbldr-thu-even"></td>
							<td class="scbldr" id="scbldr-fri-even"></td>
							<td class="scbldr" id="scbldr-sat-even"></td>
						</tr>
						<tr class="scbldr odd">
							<td class="scbldr" id="scbldr-mon-odd"></td>
							<td class="scbldr" id="scbldr-tue-odd"></td>
							<td class="scbldr" id="scbldr-wed-odd"></td>
							<td class="scbldr" id="scbldr-thu-odd"></td>
							<td class="scbldr" id="scbldr-fri-odd"></td>
							<td class="scbldr" id="scbldr-sat-odd"></td>
						</tr>
					</table>
				</div>
			</div>
      <div class="events-container">
				</div>
		</div>
   </div>
      <div class="col-xs-6 col-sm-4 col-lg-2">
        <div class="rightSchedule">
          <p class="text-center">Your Schedule</p>
          <div class="listSchedule">

          </div>
        </div>
      </div>
    </div>
'''
	elif option == "home":
		variable = '''
		<form action="/calendar" method="post"><center><font size="4"><b>
    <br>Welcome to Dot Slash Computer Science Schedule Builder</b></font><br><font size="4"><b>
    for Ohlone College</b></font><br><br><select name="Semester">
			<option selected="selection"></option>
			<option>Summer 2017 - Placeholder</option>
			<option>Fall 2017 - Placeholder</option>
    </select><br><br>
<table style="text-align:center">
  <tr>
    <th><div class="text-center">Department</div></th>
    <th><div class="text-center">Course Number</div></th> 
  </tr>
  <tr>
    <td>		<select name="Department - 1">
			<option selected="Chosen Department - 1"></option>
			<option>Department 1 - Placeholder</option>
			<option>Department 2 - Placeholder</option>
		</select></td>
    <td>
<input type="text" name="Course Number">
</td>
  </tr>  <tr>
    <td>		<select name="Department - 2">
			<option selected="Chosen Department - 2"></option>
			<option>Department 1 - Placeholder</option>
			<option>Department 2 - Placeholder</option>
		</select></td>
    <td>
<input type="text" name="Course Number">
</td>
  </tr> 
    <tr>
    <td>		<select name="Department - 3">
			<option selected="Chosen Department - 3"></option>
			<option>Department 1 - Placeholder</option>
			<option>Department 2 - Placeholder</option>
		</select></td>
    <td>
<input type="text" name="Course Number">
</td>
  </tr>  <tr>
    <td>		<select name="Department - 4">
			<option selected="Chosen Department - 4"></option>
			<option>Department 1 - Placeholder</option>
			<option>Department 2 - Placeholder</option>
		</select></td>
    <td>
<input type="text" name="Course Number">
</td>
  </tr>  <tr>
    <td>		<select name="Department - 5">
			<option selected="Chosen Department - 5"></option>
			<option>Department 1 - Placeholder</option>
			<option>Department 2 - Placeholder</option>
		</select></td>
    <td>
<input type="text" name="Course Number">
</td>
  </tr>  <tr>
    <td>		<select name="Department - 6">
			<option selected="Chosen Department - 6"></option>
			<option>Department 1 - Placeholder</option>
			<option>Department 2 - Placeholder</option>
		</select></td>
    <td>
<input type="text" name="Course Number">
</td>
  </tr>  <tr>
    <td>		<select name="Department - 7">
			<option selected="Chosen Department - 7"></option>
			<option>Department 1 - Placeholder</option>
			<option>Department 2 - Placeholder</option>
		</select></td>
    <td>
<input type="text" name="Course Number">
</td>
  </tr>  <tr>
    <td>		<select name="Department - 8">
			<option selected="Chosen Department - 8"></option>
			<option>Department 1 - Placeholder</option>
			<option>Department 2 - Placeholder</option>
		</select></td>
    <td>
<input type="text" name="Course Number">
</td>
  </tr>  <tr>
    <td>		<select name="Department - 9">
			<option selected="Chosen Department - 9"></option>
			<option>Department 1 - Placeholder</option>
			<option>Department 2 - Placeholder</option>
		</select></td>
    <td>
<input type="text" name="Course Number">
</td>
  </tr>  <tr>
    <td>		<select name="Department - 10">
			<option selected="Chosen Department - 10"></option>
			<option>Department 1 - Placeholder</option>
			<option>Department 2 - Placeholder</option>
		</select></td>
    <td>
<input type="text" name="Course Number">
</td>
  </tr>
</table><br>
  <input type="submit" value="Generate"></center><br></form>'''

	#f_variable = variable.format(**locals())
	html = main_html_top + variable + main_html_bot
	return html
