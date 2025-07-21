import db_utilities
from datetime import datetime

# #DROP
# with db_utilities.cursor_handler(db_utilities.con) as cur:
#     db_utilities.db_select(cur,"DROP TABLE EXPENSES")
#     print("Dropped table")
    
#SELECT
with db_utilities.cursor_handler(db_utilities.con) as cur:
    print(db_utilities.db_select(cur,"SELECT * FROM EXPENSES"))
