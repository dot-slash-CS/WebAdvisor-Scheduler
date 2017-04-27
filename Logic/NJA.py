#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    File Name:      WAS.py
    Author:         Jaures Ade
    Date Created:   4/23/2017
    Python Version: 3.x
    Description:    Driver Modules for ninjWAS
"""

from ninjWAS.was import WAScraper, start_scrape
from ninjWAS._aux import page_splitter
from threading import Thread
from time import time, sleep



if __name__ == '__main__':
    scraper = WAScraper('Summer Courses', 'su.html', 'summer')
    start_scrape(scraper)
        