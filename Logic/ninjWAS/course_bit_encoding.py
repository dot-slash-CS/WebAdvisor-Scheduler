#!/usr/bin/env python
# -*- coding: utf-8 -*-


"""
    File Name:      course_bit_encoding.py
    Author:         Jaures Ade
    Date Created:   4/23/2017
    Python Version: 3.x
    Description:    Bit Encoding and Decoding of Course Data

                    Module for Holding Constatnts and Functions 
                    related to the encoding of course data into
                    its bitwise representation and functions to
                    extract information from encoded bits
"""



__author__      = ['Jaures Ade']
__maintainer__  = ['Jaures Ade']
__email__       = 'jauresade@gmail.com'
__version__     = '1.0.1'
__status__      = 'Development'



from datetime import timedelta

class BitEncoding:

    class _TimeDuration:
        """ Bits to Time Duration Module    [ SIZE: 32 ]
        
            This module converts between bitwise representation of a period of time and its timedelta
            object representation

        
            Assumptions:
                Assumes that both the datetime.time object and the bitwise
                representation is one continuous period. In the bitwise
                representation, each period of time will be a 32-bit number
                spanning no more than 4 hours and 14 minutes over 20 hours

            Bit-Encoding:
                [0]  -  [6]     =>  Integer of how shift left operations are needed,
                                    i.e. the number of 15 minute intervals the duration
                                    is from the constant END time. Supports up to 20 hour
                                    time plus the additional 4 hours from the duration 
                                    bits, thereby giving it full support mapping to
                                    everything in full 24 hour day
            
                [7]  -  [22]    =>  Time/Duration, supports time durations of up
                                    to 4 hours and where each set bit indicates
                                    15 minutes
            
                [23] -  [26]    =>  Amount of additional time to Prepend to the 
                                    start time

                [27] -  [30]    =>  Amount of additional time to Append to the end
                                    time

                [31]            =>  Used to indicate if there is another set of time
                                    durations to decode following these 32 bits
 

        """
    
    
    class _DateLocation:
        """ Bits to Date and Location Module [ SIZE: 32 ]

            This module converts between the bitwise representation of the days of the week attended,
            the start and end date? (?) and the location of the course. Types of information include

            Bit-Encoding:
                [0]  - [6]      =>  Each bit represents a day of the week with the LSB represents Monday where it goes
                                    {Mon, Tues, Wed, Thurs, Fri, Sat, Sun}
            
                [7]  - [12]     =>  Each bit represents the day of the week
                                    Represents the index of the value of their campus location
                                    stored in a separate lookup-table
            
                [11]            =>  Parity Bit to check validity
            
                [12] - [17]     =>  Represents the index of the value of their room location
                                    stored in a separate lookup-table
            
                [18] - [21]     =>  Represents twice the value of the number of credits
                                    the course is. (Doing so allows for accounting for .5 credits)
            
                [22] - [24]     =>  Represents the index of the value of the start and 
                                    end dates (since there is only going to be a limited
                                    set since they shouldn't vary too much)
            
                [25] - [30]     =>  Represents the index of the value of the instructors information
            
                [31]            =>  Used to indicate if there is another 
        
        """
    

    class _MiscInfo:
        """ Miscellanies Information About the Course [ SIZE: 32 ]

            This module handles the encoding and decoding of other misc
            information about the course, although most of this information
            does not need to be decoded and retrieved as frequently as other
            encoded information, but does provide cached information that
            speeds up search results. 
        
            Bit-Encoding:
                [0]  - [7]   => Index value referencing the course major/subject
            
                [8]  - [17]  => Value of the course number
            
                [18]        => Parity Bit
            
                [19] - [22] => Course Letter { _,'A','B','C','D','E','F' }
            
                [23] - [30] => Course Section
            
                [31]        => Parity Bit
        """
 
   