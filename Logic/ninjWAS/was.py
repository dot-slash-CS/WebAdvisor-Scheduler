#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    File Name:      WAS.py
    Author:         Jaures Ade
    Date Created:   4/23/2017
    Python Version: 3.x
    Description:    Contains WebAdvisor Scraper Class and related
                    functions
"""

__author__      = ['Jaures Ade']
__maintainer__  = ['Jaures Ade']
__email__       = 'jauresade@gmail.com'
__version__     = '1.0.1'
__status__      = 'Development'

from selenium                           import webdriver
from selenium.webdriver.support.select  import Select

from time       import sleep, time
from datetime   import datetime
from threading  import Thread

from ninjWAS._aux import *


class WAScraper(object):
    """ WebAdvisor Scraper Class

        A Web Scraper class that collects course information from the
        Ohlone WebAdvisor page at: https://webadvisor.ohlone.edu/ and              
        stores the results in an output file for future parsing.

        Attributes:
            

    """

    def __init__(self, id, out, term, log = False):
        """ Init Scraper Object

            Initialize the WebAdviosr Scraper and its attributes
            
        """

        # Main URL starting point for accessing the server side WebAdvisor Application
        self.__main_url          = 'https://webadvisor.ohlone.edu:443/WebAdvisor/WebAdvisor'
        
        # 'Search For Sections URL' parameters
        self.__search_url_params = '?CONSTITUENCY=WBST&type=P&pid=ST-XWESTS12A&TOKENIDX={0}'
        
        # Init the Token
        self.__token = ''

        # Set Whether or not to log outputs
        self.log = Logger('{0}.log'.format(id)) if log else None

        # Assign Location/Name of output file
        self.__out = out

        # Set ID
        self.id = id

        # Set Term
        self.term = term

        # Initialize the Web Driver
        self._init_wd()

    def _init_wd(self):
        """ Init Web Driver

            Initializes the web driver object and navigates to the
            'Search for Sections' page
            
        """
        
        # Setting Base output message
        msg = '\nInitializing Web Driver...\n'
         
        # Attempts to initialize the Web Driver
        try:
            # Init Web Driver
            self.wdriver = webdriver.PhantomJS()
            
            # Generate a new token
            self._generate_token()

            # Visit the page
            self.wdriver.get(self.__main_url + self.__search_url_params.format(self.__token))
            
            # Verification Loop
            while True: 
                # Verify the page 
                if self._check_page():
                    # If its verified, exit the loop
                    break

                # Try again, and give it more time to load
                self.wdriver.get(self.__main_url + self.__search_url_params.format(self.__token))
                sleep(5)

            # Append a success message
            msg += '\t[\] Successfully Completed.\n' 

        except Exception as err:
            # Catch Errors
            msg += '<Init Error>: Unable to initialize the Web Driver.\n{0}\n'.format(err) 

        finally:
            # Logs the Results
            self._log(msg)
            
    def _log(self, msg):
        """ Log
            
            Internal function for logging message
    
        """
        # Log Message
        self.log.loggit(msg) if self.log else print('[{0}]:\n{1}\n'.format(self.id, msg))

            
    def _generate_token(self):
        """ Generate New Token

            Visits the Main URL to get a new token
            
        """

        # Base Message
        msg = '\nGenerating New Token...\n'
        
        try:
            # Visit Main URL to generate a new token
            self.wdriver.get(self.__main_url)

            # Strip Token from URL
            self.__token = self.wdriver.current_url.split('TOKENIDX=')[-1]
            
            # Append a success message
            msg += '\t[\] Successfully Completed.\n' 

        except Exception as err:
            # Generate the error message
            msg += '<Token Error> Unable to generate a new token.\n{0}\n'.format(err)
            
        finally:
            # Logs the Results
            self._log(msg)
            
        return self.__token

    def _check_page(self, title='Search for Sections', source='', strict=False):
        """ Check Page

            Check the current page the web driver is on

        """
        
        # Setting Base output message
        msg = '\nChecking Page...\n\t{0}\n'
        

        try:
            # If Set to strict, it checks for exact matches
            if strict: 
                # Strictly checks if title matches
                valid = self.wdriver.title == title
            
                # Strictly checks page source if source is specified
                if len(source): 
                    valid &= self.wdriver.page_source == source
            else:
                # Loosely check for title 
                valid = self.wdriver.title in title     \
                            or                          \
                          title in self.wdriver.title


                # Loosely check for source
                if len(source):
                    valid &= self.wdriver.page_source in source \
                                or                              \
                             source in self.wdriver.page_source
        except Exception as err:
            # Catch Errors
            msg += '<Checking Error> Unable to complete page check on\n\tTitle: {1}.\n{0}'.format(err, title)

            # Indicate a failed check
            valid = False

        
        # Add in result of the check into message
        msg.format('[\] Verified' if valid else '[X] Failed')
            
        # Log Results
        self._log(msg)

        # Return Whether or not the page has been Verified
        return valid
            
    def _get_number_of_pages(self, run = True):
        """ Get Number of Pages
        
            Internal function that gets the number of pages of 
            results pages to go through and leaves the browser
            on the search results page.
                **Assumes term is valid & browser is on the
                'Search for Sections' Page **
        
        """
        
        # Skips all this if no term is provided
        if not run:
            return

        # Setting Base Message
        msg = '\nChecking number of pages...\n\t{0}\n'
        
        # Build the term value
        term_query = str(datetime.now().year) + self.term[:2].upper()

        try:
            sleep(1)

            # Continuously check until found
            attemps = 10
            while attemps:
                try:
                    # Select the Term
                    Select(self.wdriver.find_element_by_id('VAR1')).select_by_value(term_query)
            
                    # Select 'start after' value
                    Select(self.wdriver.find_element_by_id('VAR7')).select_by_index(1)

                    # If no errors, exit loop
                    break
                except Exception as err:
                    msg += '<Select Error> Was unable to select web elements.\n{0} Attempting again...\n'.format(err)
                    self.wdriver.refresh() if attemps%2 else self._get_number_of_pages()
                    sleep(5)
                    attemps -= 1

            # Find submit button and submit form
            self.wdriver.find_element_by_name('SUBMIT2').click()

            # Verification Loop
            while True: 
                # Verify the page 
                if self._check_page('Section Selection Results'):
                    # If its verified, exit the loop
                    break

                # Try again, and give it more time to load
                self.wdriver.refresh()
                sleep(5)
            
            # Resolve number of pages and update message if no errors
            number_of_pages = int(self.wdriver.find_element_by_xpath('//*[@id="GROUP_Grp_WSS_COURSE_SECTIONS"]/table[1]/tbody/tr/td[2]').text.split()[-1])
            msg.format('[\] Success, {0} pages total'.format(number_of_pages))


        except Exception as err:
            # Catch errors
            msg += '<Page Resolution Error> Unable to resolve the number of pages.\n{0}\n'.format(err)
            msg.format('[X] Failed')


        # Log Results
        self._log(msg)
            
        # Return the value
        return number_of_pages

    def _start_scrape(self, start_page, end_page):
        """ Private Helper Function for start_scrape()
            
        """

        links = []
        link_id = 'SEC_SHORT_TITLE_{0}'

        # Setting Base Output message
        self._log('\nStarting to grab links...\n')

        # Necessary to point it at the right URL 
        self._get_number_of_pages()

        grab_msg =""
        
        try:
            # Loop through and get all the links
            for pg in range(start_page, end_page):
            
                self.wdriver.save_screenshot('curr.jpg')

                grab_msg += '\n\tJumping to page {0}...\n'.format(pg)
            
                # Jump to the appropriate page
                self.wdriver.find_element_by_xpath('//*[@id="GROUP_Grp_WSS_COURSE_SECTIONS"]/table[1]/tbody/tr/td[1]/input[5]').send_keys(str(pg))
                self.wdriver.find_element_by_css_selector('#GROUP_Grp_WSS_COURSE_SECTIONS > table:nth-child(3) > tbody > tr > td:nth-child(1) > input:nth-child(6)').click()

                sleep(1)

                # Grab all the links
                for row in range(1,22):
            
                    try:
                        # Get link to course info page from the row
                        link = self.wdriver.find_element_by_id(link_id.format(row))

                        #Append relative part of the link to links
                        links.append(link.get_property('onclick')[50:-101].split('TOKENIDX=')[0] + "&TOKENIDX={0}")

                        pass
                    except Exception as err:
                        # Catch Errors
                        if row < 21:
                            grab_msg += '\t\tStopped grabbing links on page: {0}, row: {1}\n'.format(row, pg)
                    
                        grab_msg += '\tSuccessfully grabbed {0} links from page {1}\n'.format(len(links)%21, pg)
                    
                        break;
                    
                    finally: 
                        # Log Results
                        self._log(grab_msg)

            self._log('\t[\] Successfully Grabbed {0}\n\n'.format(len(links)))
        except Exception as err:
            self._log('\t[X] Failed\n{0]\n\n'.format(err))

        return links

    def _scrape(self, links):
        """ Private Helper function for start_scrape

        """
        
        # Log 
        self._log('\n\nScraping Content...')

        # Init the Output File
        outFile = open(self.__out, 'w')

        # Scrapes all the Course Information Pages
        for link in enumerate(links):
            
            # Log
            self._log('\tWorking on #{0}:\n\t\t{1}'.format(*link))

            try:
                # Visit the link
                self.wdriver.get(self.__main_url + link[1].format(self.__token))
                
                sleep(1)
                
                # Verification Loop
                while True:
                    sleep(1)
                    #Check Page
                    if self._check_page('Section Information'):
                        # If verified, exit loop 
                        break
        
                    # Try again if not verified with more wait time
                    self.wdriver.get(self.__main_url + link[1].format(self.__token))
                    sleep(5)
                
                # Write Content to file
                outFile.write('<h1>{0}</h1>\n{1}\n<hr>\n</hr>'.format(link[0] + 1, self.wdriver.page_source.replace(u'\ufffd', '<?>')))
            
                # Log
                self._log('\t\t[\] Successfully wrote link #{0}:\n'.format(link[0]))
            
            except BaseException as err:
                # Log
                self._log('\t\t[X] Failed to write link #{0}:\n{1}\n\n'.format(link[0]))
            
        # Log 
        self._log('Done Scraping Content.')

        # Close Writer
        outFile.close()

    def start_scrape(self, thread_limit = 8):
        """ Start Scrape
            
            Public Start Scrape function that splits up work amongst
            multiple threads to prevent crashing issue, and then
            joins all the files together.
                ** It does verify the term **
            
        """
        
        # List of possible term values
        terms = ['fall', 'spring', 'summer']

        # Verify the term
        if self.term.lower() not in terms:
            self._log('<Invalid Term Error> Term {0} is not a valid term')
            ###TODO###
            # -Verify if a term is possible by checking the date as well

            return None

        # Get the number of pages needed to be scraped and
        #   split up the workload
        workload = page_splitter(WAScraper('', None, self.term)._get_number_of_pages(self.term))
        
        # Worker Function For Threads
        def do_work(term, id, pages, pool, outfiles):
            
            # Set up new instance of scraper for the thread
            worker = WAScraper(id, '[{0}]'.format(id) + self.__out , self.term, self.log)
            
            # Track Duration of its execution
            start_time = time()
            
            
            # Message indicating the start of the thread
            worker._log('\nThread [{0}] just began.\n'.format(id))

            try:
                
                # Starts Scraping it chunk of work
                worker._scrape( worker._start_scrape(*pages))

            except Exception as err:
                worker._log('<Worker Error> Thread [{0}] was unable to complete scraping job.\n\n'.format(id))

            finally:
                worker._log('**Thread [{0}] terminating. Lapse Time: {1} sec.\n'.format(id, time()-start_time))
                outfiles.append(worker.__out)
                del pool[id]

        # Dict & list for tracking completed operations
        thread_pool = {}
        thread_outfiles = []
        
        # Create Workers
        workers = [ Thread(target=do_work, args=(self.term, *w, thread_pool, thread_outfiles)) for w in enumerate(workload) ]
        
        # Start Distributing work amongst the threads
        for w in enumerate(workers):
            
            # Waits until there is available space in the thread pool to run the thread
            while len(thread_pool) > thread_limit:
                sleep(5)
            
            # Add thread to active threads pool and have it start working
            thread_pool[w[0]] = w
            
            #Start the thread
            w[1].start()

def start_scrape(scraper, thread_limit = 8):
        """ Start Scrape
            
            Public Start Scrape function that splits up work amongst
            multiple threads to prevent crashing issue, and then
            joins all the files together.
                ** It does verify the term **
            
        """
        
        # List of possible term values
        terms = ['fall', 'spring', 'summer']

        # Verify the term
        if scraper.term.lower() not in terms:
            scraper._log('<Invalid Term Error> Term {0} is not a valid term')
            ###TODO###
            # -Verify if a term is possible by checking the date as well

            return None

        # Get the number of pages needed to be scraped and
        #   split up the workload
        workload = page_splitter(WAScraper('', None, scraper.term)._get_number_of_pages(scraper.term))
        
        # Worker Function For Threads
        def do_work(term, id, pages, pool, outfiles):
            
            # Set up new instance of scraper for the thread
            worker = WAScraper(id, '[{0}]'.format(id) + scraper._WAScraper__out , scraper.term, scraper.log)
            
            # Track Duration of its execution
            start_time = time()
            
            
            # Message indicating the start of the thread
            worker._log('\nThread [{0}] just began.\n'.format(id))

            try:
                
                # Starts Scraping it chunk of work
                worker._scrape( worker._start_scrape(*pages))

            except Exception as err:
                worker._log('<Worker Error> Thread [{0}] was unable to complete scraping job.\n\n'.format(id))

            finally:
                worker._log('**Thread [{0}] terminating. Lapse Time: {1} sec.\n'.format(id, time()-start_time))
                outfiles.append(worker._WAScraper__out)
                del pool[id]

        # Dict & list for tracking completed operations
        thread_pool = {}
        thread_outfiles = []
        
        # Create Workers
        workers = [ Thread(target=do_work, args=(scraper.term, *w, thread_pool, thread_outfiles)) for w in enumerate(workload) ]
        
        # Start Distributing work amongst the threads
        for w in enumerate(workers):
            
            # Waits until there is available space in the thread pool to run the thread
            while len(thread_pool) > thread_limit:
                sleep(5)
            
            # Add thread to active threads pool and have it start working
            thread_pool[w[0]] = w
            
            #Start the thread
            w[1].start()

        