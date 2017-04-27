from Logic import scraper
from Logic import classes
import pickle
import os
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import multiprocessing
from itertools import permutations

# Downloads lists of subjects and terms
if not os.path.exists('semesters.pickle') and not os.path.exists('subjects.pickle'):
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
else:
    with open('semesters.pickle', 'rb') as f:
        semesters = pickle.load(f)
    with open('subjects.pickle', 'rb') as f:
        subjects = pickle.load(f)

queries = []

for semester in semesters:
    for subject in subjects:
        queries.append({'term': semester, 'subject': subject, 'course_number': '', 'section': ''})

os.chdir('pickles')


def get_course(query):
    semester = query['term']
    subject = query['subject']
    print(semester + ' ' + subject)
    if not os.path.exists(semester + ' ' + subject + '.pickle'):
        query = {'term': semester, 'subject': subject, 'course_number': '', 'section': ''}
        with open(semester + ' ' + subject + '.pickle', 'wb') as f:
            pickle.dump(scraper.scrape_courses(debug=False, **query), f)


# pool = multiprocessing.Pool()
# pool.imap_unordered(get_course, queries)

for query in queries:
    get_course(query)

html_strings = []
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.pickle'):
            print(file)
            with open(file, 'rb') as f:
                html_strings += pickle.load(f)

os.chdir('..')
with open('html.pickle', 'wb') as f:
    pickle.dump(html_strings, f)

# sections = map(classes.parse_html, html_strings)
#
# meeting_strings = [section.meeting_string + '\n' for section in sections]
# with open('meetings.txt', 'w') as f:
#     f.writelines(meeting_strings)
