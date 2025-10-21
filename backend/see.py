import db_utilities
from datetime import datetime

# #DROP
# with db_utilities.cursor_handler(db_utilities.con) as cur:
#     db_utilities.db_select(cur,"DROP TABLE SUBSCRIPTIONS")
    
# #SELECT
with db_utilities.cursor_handler(db_utilities.con) as cur:
    print(db_utilities.insert_db(cur,"INSERT INTO SUBSCRIPTIONS VALUES (5,'Aldi Sim',9)"))
