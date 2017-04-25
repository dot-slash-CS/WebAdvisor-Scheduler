import os, getDept
from bs4 import BeautifulSoup

def createHome():
    soup = BeautifulSoup(open('templates/home.html'),'html.parser')
    soup.prettify()
    generated = '''
        <form action="/calendar" method="post">
        <select name="Semester">'''
    termsDepts = getDept.gatherFields()
    termsSorted = list(termsDepts.terms)
    deptsSorted = list(termsDepts.dept)
    termsSorted.sort()
    deptsSorted.sort()
    termField = ''''''
    for term in termsSorted:
        option = '<option value="'+str(term)+'">'+termsDepts.terms[term]+'</option>'
        termField += option
    termField += '</select><br><br>'
    generated += termField
    generated += '''
    <table style="text-align:center">
        <tr>
            <th><div class="text-center">Department</div></th>
            <th><div class="text-center">Course Number</div></th> 
        </tr>'''
    for fieldNum in xrange(8):
        dropdown = '<tr><td><select name="Department'+str(fieldNum)+'">'
        for dept in deptsSorted:
            option = '<option value="'+str(dept)+'">'+termsDepts.dept[dept]+'</option>'
            dropdown += option
        dropdown += '</select></td><td><input type="text" name="CourseNum'+str(fieldNum)+'"></td></tr>'
        generated += dropdown
    generated += '''
        </table><br>
            <input type="submit" value="Generate"/></center></form></body>'''
    generated = BeautifulSoup (generated,'html.parser')
    soup.center.append(generated)
    with open('static/home.html', mode='wt') as file:
        file.write(str(soup))

def createCalendar(db=None,db_id=None):
    soup = BeautifulSoup(open('templates/calendar.html'),'html.parser')
    soup.prettify()
    with open('static/calendar.html',mode='wt') as file:
        file.write(str(soup))