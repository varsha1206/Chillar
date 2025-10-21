"""The Schema of tables in the database"""

import os
import sqlite3

tableList = {
    "EATOUT": ["RESTAURANT", "ORDER_NAME", "PRICE", "DATE"],
    "SUBSCRIPTIONS": ["ID INTEGER PRIMARY KEY AUTOINCREMENT", "NAME", "PRICE"],
}

base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, "chillar.db")
con = sqlite3.connect(db_path, check_same_thread=False)
