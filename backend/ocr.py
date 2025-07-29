"""OCR reading of grocery receipts"""

from PIL import Image
import re
import pytesseract
from google import genai
from google.genai import types
import datetime
from typing import List
import db_utilities
from models import CategorizedExpenses, ExpenseItem
import io
import pandas as pd 

def extract_text_from_receipt(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    text = pytesseract.image_to_string(image)
    return text

def extract_expenses_from_text(text: str) -> List[ExpenseItem]:
    expense_pattern = re.compile(r"<LIST>(.+?): ([\d.]+)</LIST>")
    items = []
    for match in expense_pattern.finditer(text):
        category = match.group(1).strip()
        amount = float(match.group(2))
        items.append(ExpenseItem(category=category, amount=amount))
    print("The grocery list after Gemini: ", items) #print statement added just to check output of Gemini
    return items

def extract_expenses(airesponse):
    expenses = extract_expenses_from_text(airesponse)
    return CategorizedExpenses(expenses=expenses)

def OCR_text(image_path):
    bill = extract_text_from_receipt(image_path)
    print(bill)
    # The client gets the API key from the environment variable `GEMINI_API_KEY`.
    client = genai.Client()
    content = f"""
    Below is grocery bill. Spell check this bill and do not add or remove any items.
    Now categorize the items in the bill into snacks, vegetables, fruits, dairy, frozen food, water, miscellaneous, laundary, hygiene exclude PFAND
    Then only display the category and the total amount spent in that category like <LIST>fruits: 1.06</LIST>.
    DO NOT ADD OR REMOVE ITEMS ON YOUR OWN ACCOUNT
    {bill}
    """
    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=content,
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
        ),
    )
    grocery_list = extract_expenses(response.text)

    date = datetime.date.today().isoformat()
    with db_utilities.cursor_handler(db_utilities.con) as cur:
        for item in grocery_list.expenses:
            query = f'INSERT INTO EXPENSES VALUES ("{item.category}",{item.amount},"{date}")'
            db_utilities.insert_db(cur,query)
            print(f"inserted {item.category}")
