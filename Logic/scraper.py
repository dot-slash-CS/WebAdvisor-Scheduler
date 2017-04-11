import os, re

# Use the Selenium WebDriver to access internet
from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException


def scrape_courses(**params):
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
        Select(driver.find_element_by_id('VAR1')).select_by_value(params['term'])
    except NoSuchElementException:  # This shouldn't happen if validation is in place
        print("Invalid Term")
        driver.quit()
        return []
    # Select subject from drop-down menu
    try:
        Select(driver.find_element_by_id('LIST_VAR1_1')).select_by_value(params['subject'])
    except NoSuchElementException:  # This shouldn't happen if validation is in place
        print("Invalid Subject")
        driver.quit()
        return []
    # Input course via text box
    driver.find_element_by_id('LIST_VAR3_1').send_keys(params['course_number'])
    # Input section via text box
    driver.find_element_by_id('LIST_VAR4_1').send_keys(params['section'])
    # Submit search parameters via the "SUBMIT" button
    driver.find_element_by_name('SUBMIT2').click()

    # Check if results were returned, exit if not
    if 'errorText' in driver.page_source:
        driver.quit()
        return []

    # Check how many pages of results were returned
    num_pages = int(re.search(r'Page \d+ of (\d+)', driver.page_source).group(1))

    # Loop through the pages and generate a list of courses
    courses = []

    for _ in range(num_pages):
        # Get info for each class in the table
        entry = 1
        id = 'SEC_SHORT_TITLE_' + str(entry)
        while entry <= 20 and id in driver.page_source:

            # Open link to entry in new tab
            driver.find_element_by_id(id).click()
            # Switch to entry tab
            driver.switch_to.window(driver.window_handles[-1])

            # Read data from tab
            courses.append(driver.page_source)

            driver.close()
            driver.switch_to.window(driver.window_handles[0])
            entry += 1
            id = 'SEC_SHORT_TITLE_' + str(entry)
        # Clicks "Next" button
        driver.find_elements_by_name("ACTION*Grp:WSS.COURSE.SECTIONS")[2].click()
    driver.quit()

    return courses
