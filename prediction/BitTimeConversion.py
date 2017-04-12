#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__      = 'Jaures Ade'
__email__       = 'jauresade@gmail.com'
__version__     = '0.0.1'
__status__      = 'Testing'

from datetime import time, timedelta

class BitTimeConv:
    """ Bits to Time Conversion Module

        This module converts between bitwise representation of 
        a period of time and datetime.time objects.

        Assumptions:
            Assumes that both the datetime.time object and the bitwise
            representation is one continuous period. In the bitwise
            representation, each period of time will be a 32-bit number
            spanning no more than 4 hours and 14 minutes over 20 hours 
            where:
                
                [31]        => PROFIT??? **Extra bit, not sure what to encode it with**
                                Currently being used as a parity bit to validate
                                properly formatted bitwise representation
                [30]-[27]   => The amount of extra time to Preppend (Prepend? Can't spell for shit)
                [26]-[22]   => The amount of extra time to Append
                [21]-[16]   => Integer of how much to shift up,
                                i.e. amount of time from the END. Allows
                                for up to 20 hours spans (A bit overkill but whatever)
                [15]-[0]    => Time/Duration, can represent
                                courses that have up to 4
                                hours of duration
    
        Attributes:
            START       => The earliest a class can start (3:00)
            END         => The latest a class can end (23:00)
            T_UNIT      => Unit of time (15 minute chunks or (15*60) seconds)
            SPM         => Seconds per Minute (60)
            SPH         => Seconds per Hour (3600)
            
    """
        
    def __init__(self):
        """ __init__ Function
            
            Initializes Constant Attributes for BitTimeConv Class
                
        """

        # Initialize Class Attributes
        self.START  = timedelta(hours=3)
        self.END    = timedelta(hours=23)
        self.T_UNIT = 15*60
        self.SPM    = 60
        self.SPH    = 3600

    def convert(self, period = None, check = False):
        """ Convert Bitwise to datetime.time tuple or datetime.time 
                collection to bitwise
            
            Inputs:
                @param period: Either a Tuple/List of start and
                                end datetime.time objects or the
                                bitwise representation with set bits
                                indicating the duration. If it is None
                                or of the wrong data-type, an error is
                                printed.

                @param check:  Indicates whether the given period should
                                be checked to make sure it adheres to correct
                                bitwise format with a continuous time period or
                                that with the datetime.time object, the start
                                and end time are in the correct order.
                                    **Checking will be expensive, so it should
                                    almost always remain false and inputs should
                                    be validated beforehand

            Outputs:
                @return:       A datetime.time tuple where the first element is
                                the start time and the second element is the end
                                time if given the bitwise representation as input.

                               A bitwise representation of the time if given a
                                tuple of datetime.time objects as the input

                               None if there was an error or incorrectly formatted
                                inputs
        """
        if not period:
            # Print error message for no input
            print("\n<No Input Error>:\n\tNo input was provided")

        # Check to see if it is a bitwise -> datetime.time tuple conversion
        elif isinstance(period, int):                  
            # Either Checks the inputs first or immediately converts 
            #   it to datetime.time tuple
            return self.check_bits(period) if check else self.to_dt_time_conv(period)

        # Check to see if its a datetime.time tuple/list -> bitwise conversion
        elif (isinstance(period, (tuple, list)) and     
                len(period) is 2 and                    # Checks for only 2 elements
                isinstance(period[0], time) and         # Checks type of both elements
                isinstance(period[1], time) ):
            # Either Checks the inputs first or immediately converts 
            #   it to bits
            return self.check_dttime(*period) if check else self.to_bits_conv(*period)
        
        else:
            # Print error message for invalid type
            print("\n<Invalid Type or Formatting Error>:\n\tThe type or format of the period provided is invalid")

        # If code reaches the end, there was an error, and an error
        #   message is printed.
        return None

    def check_bits(self, bits):
        """ Check for Valid Bitwise Representation
            
            Inputs:
                @param bits:   A 32-bit (Technically doesn't matter in python)
                                number representing a duration of time from 3:00/3:00 am
                                to 23:00/11:00pm of up to 4 hours and 14 minutes

            Outputs:
                @return:       A datetime.time tuple of two elements representing
                                the start and end times
                               
                               None if there was an error validating the input
            
        """
        # Check to make sure only a 32-bit number is passed in (32-bit or less)
        if bits >> 32:
            print("\n<Error>:\n\tInput exceeds allowed number of bits (only <= 32 bits allowed)\n")
        # Check the parity bit to see if input was properly formatted
        elif bin(bits).count('1')%2:
            print("\n<Error>:\n\tIncorrectly set parity bit. Input may be improperly formatted.\n")
        else:
            # Input was valid
            return self.to_dt_time_conv(bits)
        
        # Input was invalid
        return None

    def check_dttime(self, start, end):
        """ Check for Valid datetime.time Objects

            Inputs:
                @param start:  A datetime.time object representing the start of the period.
                                Must begin before the end time.
                
                @param end:    A datetime.time object representing the end of the period. Must
                                end after the start time.

            Outputs:
                @return:       A 32-bit number representing a duration of time that can only span
                                up to 4 hours and 14 minutes, from 3:00-23:00
                               
                               None if there was an error validating the input        
        """

        # Convert to timedelta to make checking easier
        t1 = timedelta(hours = start.hour, minutes = start.minute)
        t2 = timedelta(hours = end.hour, minutes = end.minute)

        # Check to make sure times are in correct order
        if t1 > t2:
            print("\n<Error>:\n\tEnd time cannot be earlier than start time\n")
        # Check to make sure times don't exceed limit
        elif ( (t2 - t1) > timedelta(hours = 4, minutes = 14)): 
            print("\n<Error>:\n\tTotal duration cannot exceed 4 hrs and 14 min\n")
        else:
            # Inputs were valid        
            return self.to_bits_conv(start, end)

        # Inputs were invalid
        return None

    def to_bits_conv(self, start, end):
        """ Convert to Bitwise Representation

            Inputs:
                @param start:  A date

            Outputs:
                @return:       A datetime.time tuple of two elements representing
                                the start and end times

        """
        
        # Convert start and end to timedelta to make it easier to work with
        start, end = timedelta(hours = start.hour, minutes = start.minute), timedelta(hours = end.hour, minutes = end.minute)
        
        # Get the extra time to Prepend and Append to the start and end
        pre_et, ap_et = ( timedelta(seconds = start.seconds % self.T_UNIT ), 
                            timedelta(seconds = end.seconds % self.T_UNIT ) )

        # Adjust the start and end
        start, end = start - pre_et, end - ap_et

        # Convert pre_et and ap_et into minute integers
        pre_et, ap_et = int(pre_et.seconds / 60), int(ap_et.seconds / 60)
        
        # Gets the duration of the interval as number of 15 minutes chunks
        duration = int((end - start).seconds / (self.T_UNIT))

        # Get a span of set bits representing the duration
        bit_span = (1 << duration) - 1

        # Assuming the LSB indicates ending at 23:00 (11:00pm)
        #   get total amount of minutes from END
        from_end = int( (self.END - end).seconds / self.T_UNIT )

        # Encode the results
        bits = (    bit_span 
                |   from_end << 16
                |   ap_et    << 22
                |   pre_et   << 27
               )

        # Sign it as valid with a Parity bit
        bits |= (bin(bits).count('1') % 2) << 31

        # Return the result
        return bits
        
    def to_dt_time_conv(self, bits):
        """ Convert to 2-element tuple of datetime.time Objects

            Inputs:
                @param bits:   A 32-bit (Technically doesn't matter in python)
                                number representing a duration of time from 3:00/3:00 am
                                to 23:00/11:00pm of up to 4 hours and 15 minutes

            Outputs:
                @return:       A datetime.time tuple of two elements representing
                                the start and end times        
        """

        # Get Information form bits using bitmasks
        bit_span    = bits & 0xffff
        from_end    = (bits & 0x3f0000)   >> 16
        ap_et       = (bits & 0x7c00000)  >> 22
        pre_et      = (bits & 0x7c000000) >> 27
        
        # Resolve end and start using information and adjust
        #   them with the extra minutes 
        end = self.END - timedelta(seconds = from_end * self.T_UNIT - ap_et * self.SPM)
        start = end - timedelta(seconds = bin(bit_span).count('1') * self.T_UNIT - (pre_et - ap_et) * self.SPM )

        # Return a tuple of the resulting datetime.time objects
        return ( time( int(start.seconds / self.SPH), int( (start.seconds % self.SPH) / self.SPM)) ,
                 time( int(end.seconds / self.SPH), int( (end.seconds % self.SPH) / self.SPM)) )
                


def testing_bt_conv():
    """ Testing Function

        Allows you to test the functionality of the BitTimeConv Class

    """

    from datetime import datetime
    choice = ""
    b = BitTimeConv()
    while choice is not 'q':
        choice = input('''\nWould you like to convert to bitwise or to datetime.time?
                    \n\t1. To bitwise from time\n\t2. To time from bitwise\n\tq. quit\n>>> ''')

        if choice is '1':
            print(b.convert( (datetime.strptime(input('Enter Start time in 24-hour format (ex "14:45"): '), "%H:%M").time(),
                                 datetime.strptime(input('Enter End time in 24-hour format (ex "14:45"): '), "%H:%M").time()) ) )
        elif choice is '2':
            print(b.convert(int(input('Enter in bitwise notation as an integer: '))))
        else:
            print('Quitting Testing...\n\n')


if __name__ == '__main__':

    testing_bt_conv()
    
    input('Press <enter> to continue...')
