#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    File Name:      _aux.py
    Author:         Jaures Ade
    Date Created:   4/23/2017
    Python Version: 3.x
    Description:    Contains various auxiliary classes and function
                    for internal use
"""

from time import ctime


class Logger(object):
    """ Logger Class
        
        Logs operation of program to a specified file, primarily for
        debugging purposes.

        Attributes
            out     - Handle to the output file
    """

    def __init__(self, id, out = None):
        """ Init _Logger

            Initializes the self.__out attribute and sets it up for
            logging data

            Attribute:
                @param out:     Name/Location of output file
        
        """

        # Check for default value
        if out is None:
            out = 'out[{0}].log'.format( ctime().split[:-2] )

        # Set the ID
        self.id = id
        
        try:
            # Open the file for appending to
            self.__out = open(out, 'a')

        except BaseException as err:
            # Output Error Message
            print('<Logger Error>: Unable to Initialize logger\n\t{0}\n\n'.format(err))

            # Continues on to raise the error
            raise err
        

    def __del__(self):
        """ Delete _Logger

            Appends a line to the end of the output file to indicate
            the end of the logging session and makes sure that the
            handle to the output file is closed

        """

    def _time_stamp(self, ending = False):
        """ Time Stamp
        
            Appends a time stamp line to the output file

        """
        
        # Log Time Stamp            
        self._log( 
                    (
                        'Session ' + ('Close: ' if ending else 'Open: ') + ctime()
                    ).join( ['='*25]*2) 
                )
            
    def loggit(self, msg):
        """ Log Message
        
            Logs the specified message to the output file
            

            Inputs:
                @param msg:     The message to log to the output
                                file

            Outputs:
                @return:        Whether or not the message was
                                logged to the file
        """ 
        
        try:
            # Log the message
            self._Logger__out.write('[{0}]:\n{1}\n'.format(self.id, msg))
        
        except BaseException as err:
            # Catch Any Errors
            print('<Logger Error>: Unable to log message:{1}\n\t{0}\n\n'.format(err, msg))

            # Continues on to raise the error
            raise err
            
   

def page_splitter(num):
    page_indices = [[1 + 2*d, 1 + 2*(d+1)] for d in range((num + num%2) >> 1)]
    # page_indices[-1][1] -= num%2

    return page_indices