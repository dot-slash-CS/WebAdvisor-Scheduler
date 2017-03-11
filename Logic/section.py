import sys
import re


class Course:
    def __init__(self, VAR1, VAR2, VAR4, VAR12_1):
        # Obtains general course information
        self.parse_info(VAR1, VAR2, VAR4)

        # Convert VAR12_1 from unicode to ascii string
        VAR12_1 = str(VAR12_1)
        # Split VAR12_1 into constituent sections
        pattern = r"([0-9]{2}/[0-9]{2}/[0-9]{4}-[0-9]{2}/[0-9]{2}/[0-9]{4} .*? Room [0-9A-Za-z\-]+)"
        VAR12_1 = re.split(pattern, VAR12_1)
        # Remove whitespace and empty strings from list
        VAR12_1 = [value for value in VAR12_1 if value is not ' ' and value is not '']

        # Creates Section objects
        self.secs = []
        for entry in VAR12_1:
            try:
                self.secs.append(Section(entry))
            except ValueError:
                pass
            if len(self.secs) is 0:
                raise ValueError("Not enough information available from WebAdvisor")
        return

    def parse_info(self, VAR1, VAR2, VAR4):
        self.title = VAR1
        self.subject_code = re.search(r"^[A-Z]+", VAR2).group(0)
        self.course_num = re.search(r"-.+-", VAR2).group(0)[1:-1]
        self.sec_num = re.search(r"[0-9]+$", VAR2).group(0)
        self.credits = VAR4
        return

    def to_string(self):
        result = (self.title + "\n"
                  + self.subject_code + " " + self.course_num + "-" + self.sec_num + "\n"
                  + self.credits + " credits" + "\n"
                  + "\n")
        for sec in self.secs:
            result += sec.to_string() + "\n\n"
        return result

    def get_num_sec(self):
        return len(self.secs)


class Section:
    def __init__(self, VAR12_1_sec):
        self.parse_info(VAR12_1_sec)

    def parse_info(self, VAR12_1_sec):
        if VAR12_1_sec.find('TBA') is not -1:
            raise ValueError("Not enough information available from WebAdvisor")
        self.type = re.search(r"(Lecture|Laboratory)", VAR12_1_sec).group(0)
        dates = re.search(r"[0-9]{2}/[0-9]{2}/[0-9]{4}-[0-9]{2}/[0-9]{2}/[0-9]{4}", VAR12_1_sec).group(0)
        self.start_date = dates[0:10]
        self.end_date = dates[11:21]
        self.sec_num = re.search(r"\([0-9]{2}\)", VAR12_1_sec).group(0)[1:3]
        self.days = re.findall("([A-Z][a-z]+day)", VAR12_1_sec)
        times = re.search(r"[0-9]{2}:[0-9]{2}[AP][M] - [0-9]{2}:[0-9]{2}[AP][M]", VAR12_1_sec).group(0)
        self.start_time = times[0:8]
        self.end_time = times[10:17]
        try:
            self.campus = re.search(r"(Fremont|Building|Newark)", VAR12_1_sec).group(0)
            if self.campus is "Building":
                self.campus = "Fremont"
        except AttributeError:
            self.campus = re.split(r", ", VAR12_1_sec)[1]
        self.classroom = re.search(r"(Building )?[0-9]?( , )?Room [0-9A-Za-z\-]+", VAR12_1_sec).group(0)
        return

    def to_string(self):
        return (self.type + " (" + self.sec_num + ")" + "\n"
                + self.start_date + " - " + self.end_date + "\n"
                + ", ".join(self.days) + "\n"
                + self.start_time + " - " + self.end_time + "\n"
                + self.campus + " " + self.classroom + "\n")
