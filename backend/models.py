"""Pydantic model schemas"""

from typing import List
from pydantic import BaseModel

class ExpenseItem(BaseModel):
    category: str
    amount: float

class CategorizedExpenses(BaseModel):
    expenses: List[ExpenseItem]