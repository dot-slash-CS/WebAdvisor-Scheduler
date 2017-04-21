from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.select import Select
from bs4 import BeautifulSoup


class Fields:
	def __init__(self,terms,dept):
		self.terms = terms
		self.dept = dept

class DeptCourse:
	def __init__(self,dept,course):
		self.dept = dept
		self.course = course

def convertOptions(options):
	d = {}
	for i in options:
		try:
			startv = str(i).index('option value=\"') + len('option value=\"')
			endv = str(i).index('\">',startv)
			startd =str(i).index('\">') + len('\">')
			endd = str(i).index('</option>',startd)
			#print(str(i)[startv:endv])
			d[str(i)[startv:endv]] = str(i)[startd:endd]
		except:
			#print("Error")
			pass
	#print (d)
	return d


def gatherFields():
	browser = webdriver.Chrome()
	browser.implicitly_wait(5)
	browser.get('https://webadvisor.ohlone.edu')
	browser.find_element_by_link_text("Students").click()
	browser.find_element_by_link_text("Search for Sections").click()
	soup_html = BeautifulSoup(browser.page_source,'html.parser')
	termsList = convertOptions((soup_html.find(id="VAR1")).findAll('option'))
	deptList = convertOptions((soup_html.find(id="LIST_VAR1_1")).findAll('option'))
	browser.close()
	return Fields(termsList,deptList)