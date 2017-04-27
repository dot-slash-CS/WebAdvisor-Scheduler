import json
from flaskext.mysql import MySQL

def accessDatabase(db_id,mysql):
    conn = mysql.connect()
    cur = conn.cursor()
    cur.execute("SELECT schedules FROM dotslash WHERE id=\'"+str(db_id)+"\'")
    schedules = cur.fetchall()[0][0]
    cur.close()
    conn.close()
    return schedules

def convertToJSON(s_index, db_id, mysql):
    schedules = accessDatabase(db_id,mysql)
    choice = json.loads(schedules)['schedules']['S'+str(s_index)]
    return json.dumps(choice)

"""
db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="password",  # your password
                     db="Schedule")        # name of the data base

cursor = db.cursor()
cursor.execute("SELECT schedules FROM dotslash WHERE id=\'"+str(26)+"\'")
"""