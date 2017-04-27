#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    File Name:      DB.py
    Author:         Jaures Ade
    Date Created:   4/23/2017
    Python Version: 3.x
    Description:    Contains Functions for interacting with the
                    database
"""

class WADB(object):
    """ WebAdvisor Database Class
        
        A class for handling interactions from with the program and
        the database holding all the course information

        Database Layout:
            +---------+ +----------+ +------------+
            | Subject | | Location | | Instructor |
            |---------| |----------| |------------|
            | ID,     | | ID,      | | ID,        |
            | Name,   | | Name,    | | Name,      |
            | ABBRV,  | +----------+ | Email,     |
            +---------+     +        +------------+
                +           |            +
                |           |            |
                v           |            |
            +----------+    |            |
            |  Course  |    |            |
            |----------|    |            |
            | ID,      |    |            |
            | Title,   |    |            |
            | C_ID,    |    |            |
            | Credits, |    |            |
            |          |    |            |
            |*Subject, |    |            |
            +----------+    |            |
               +  +---------+            |
               |  |   +------------------+
               v  v   v
            +-------------+
            |   Section   |
            |-------------|
            | ID,         |
            | S_ID,       |
            | bVAL,       |
            |*Instructor, |
            |*Location,   |
            |*Course,     |
            +-------------+
        
    """

