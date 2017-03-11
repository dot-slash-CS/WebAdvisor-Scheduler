import scraper

# Searches fo MATH 101A, which has 7 sections in 1 page
query_1 = {'term': '2017SP', 'subject': 'MATH', 'course_number': '101A', 'section': ''}
calc1 = scraper.scrape_courses(**query_1)
for i in calc1:
    print(i)

# # Searches for ENGL 101A, which has 26 sections over 2 pages
# query_2 = {'term': '2017SP', 'subject': 'ENGL', 'course_number': '101A', 'section': ''}
# engl1 = scraper.scrape_courses(**query_2)
# for i in engl1:
#     print(i)