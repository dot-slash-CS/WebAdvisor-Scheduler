from Logic import scraper
from Logic import classes
import pickle

# Searches fo MATH 101A, which has 7 sections in 1 page
# query_1 = {'term': '2017SP', 'subject': 'MATH', 'course_number': '101A', 'section': ''}
# calc1 = scraper.scrape_courses(debug=True, **query_1)
# print(len(calc1))

# Searches for ENGL 101A, which has 31 sections over 2 pages
query_2 = {'term': '2017SP', 'subject': 'ENGL', 'course_number': '', 'section': ''}
engl1 = scraper.scrape_courses(debug=True, **query_2)
c = classes.Course(engl1)
print(len(engl1))
# with open('query2.pickle', 'wb') as f:
#     pickle.dump(engl1, f)


# Searches for Air Force classes, which have 0 sections
# query_3 = {'term': '2017SU', 'subject': 'AF', 'course_number': '', 'section': ''}
# af1 = scraper.scrape_courses(**query_3)
# print(len(af1))  # Should be 0
# af = classes.Course(af1)
# print(len(af.sections))
