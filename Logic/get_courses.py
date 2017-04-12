from Logic import scraper
from Logic import classes
import pickle
import os
from bs4 import BeautifulSoup
from selenium import webdriver
import time

# Downloads lists of subjects and terms
driver = webdriver.Chrome(os.path.join(os.path.abspath(os.path.dirname(__file__)), "chromedriver"))
driver.get("https://webadvisor.ohlone.edu/WebAdvisor/WebAdvisor")
driver.find_element_by_link_text('Search for Sections').click()
with open('webadvisor.html', 'w') as f:
    f.write(driver.page_source)
soup = BeautifulSoup(driver.page_source, 'lxml')
driver.quit()

date_box = soup.find('select', {'name': 'VAR1'})
semesters = [term['value'] for term in date_box.find_all('option')[1:]]
with open('semesters.pickle', 'wb') as f:
    pickle.dump(semesters, f)

subject_box = soup.find('select', {'name': 'LIST.VAR1_1'})
subjects = [subject['value'] for subject in subject_box.find_all('option')[1:]]
with open('subjects.pickle', 'wb') as f:
    pickle.dump(subjects, f)

meeting_strings = []
count = 0

for semester in semesters:
    for subject in subjects:
        query = {'term': semester, 'subject': subject, 'course_number': '', 'section': ''}
        courses = classes.Course(scraper.scrape_courses(**query))
        for section in courses.sections:
            meeting_strings.append(section.meeting_string)
            count += 1
            print(section.course_string)
        time.sleep(5)

with open('meetings.pickle', 'wb') as f:
    pickle.dump(meeting_strings, f)
