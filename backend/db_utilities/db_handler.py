"""Script to handle db operations"""

from contextlib import contextmanager
import sqlite3

@contextmanager
def cursor_handler(con):
    cur = con.cursor()
    yield cur
    cur.close()
    con.commit()

def insert_db(cur, query):
    cur.execute(query)

def db_select(cur, query):
    try:
        cur.execute(query)
        rows = cur.fetchall()
    except Exception as error:
        print(str(error))
    
    return rows

def db_setup(cur):
    for eachTable, allColumns in tableList.items():
        try:
            result = cur.execute(f"SELECT * FROM {eachTable}")
            print(f"table {eachTable} exists")
        except sqlite3.OperationalError as error:
            if "no such table" in str(error):
                print(eachTable)
                columnQuery = "(" + (",").join(allColumns) + ")"
                cur.execute(f"CREATE TABLE {eachTable} {columnQuery}")
                print()
                print("table created")

if __name__ == "__main__":
    from table_metadata import con, tableList
    with cursor_handler(con) as cur:
        db_setup(cur)
