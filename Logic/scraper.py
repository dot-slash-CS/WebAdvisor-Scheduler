import os, re

# Use the Selenium WebDriver to access internet
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from section import Course


def scrape_courses(term, subject, course_number, section):
    """Returns the courses that meet the specified criteria.

    Arg data -- key-value pairs or a dictionary. Keys are strings corresponding to search fields. Values are the values
    to be searched for. Currently supported keys are term, subject, course_number, and section.
    """
    # Instantiate WebDriver; assumes executables are in the same directory as this script

    # GUI browser, for testing
    driver = webdriver.Chrome(os.path.join(os.path.abspath(os.path.dirname(__file__)), "chromedriver"))

    # Headless browser, for deploying
    # driver = webdriver.PhantomJS(os.path.join(os.path.abspath(os.path.dirname(__file__)), "phantomjs"))

    # Access WebAdvisor main page
    driver.get("https://webadvisor.ohlone.edu/WebAdvisor/WebAdvisor")

    # Navigate to search page
    driver.find_element_by_link_text('Search for Sections').click()

    # Select term from drop-down menu
    try:
        Select(driver.find_element_by_id('VAR1')).select_by_value(term)
    except NoSuchElementException:  # This shouldn't happen if validation is in place
        print("Invalid Term")
        driver.quit()
        return []
    # Select subject from drop-down menu
    try:
        Select(driver.find_element_by_id('LIST_VAR1_1')).select_by_value(subject)
    except NoSuchElementException:  # This shouldn't happen if validation is in place
        print("Invalid Subject")
        driver.quit()
        return []
    # Input course via text box
    driver.find_element_by_id('LIST_VAR3_1').send_keys(course_number)
    # Input section via text box
    driver.find_element_by_id('LIST_VAR4_1').send_keys(section)
    # Submit search parameters via the "SUBMIT" button
    driver.find_element_by_name('SUBMIT2').click()

    # Check how many pages of results were returned
    num_pages = int(re.search(r'\d+\Z', re.search(r'Page \d+ of \d+', driver.page_source).group(0)).group(0))

    # Loop through the pages and generate a list of courses
    courses = []

    for _ in range(num_pages):
        # Get info for each class in the table
        entry = 1
        id = 'SEC_SHORT_TITLE_' + str(entry)
        while entry <= 20 and id in driver.page_source:
            # Open link to entry in new tab
            driver.find_element_by_id('SEC_SHORT_TITLE_1').click()
            # Switch to entry tab
            driver.switch_to.window(driver.window_handles[1])

            # Read data from tab
            VAR1 = driver.find_element_by_id('VAR1').text  # Contains title
            VAR2 = driver.find_element_by_id('VAR2').text  # Contains subject, course number, and section
            VAR4 = driver.find_element_by_id('VAR4').text  # Contains credits
            VAR12_1 = driver.find_element_by_id('LIST_VAR12_1').text  # Contains everything else
            # Create a course object and add it to the list
            try:
                courses.append(Course(VAR1, VAR2, VAR4, VAR12_1))
            except ValueError:
                print("Not enough information available from WebAdvisor")
            driver.find_element_by_tag_name('body').send_keys(Keys.CONTROL + 'w')
        # Clicks "Next" button
        driver.find_elements_by_name("ACTION*Grp:WSS.COURSE.SECTIONS")[2].click()
    driver.quit()

    return courses
