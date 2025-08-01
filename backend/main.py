from fastapi import FastAPI, UploadFile, File, Request, Query, HTTPException
from fastapi.responses import JSONResponse
from ocr import OCR_text
import db_utilities
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
app = FastAPI()
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def parse_month_str(month_str: str):
    try:
        return datetime.strptime(month_str, "%Y-%m")
    except ValueError:
        return None
    
@app.post("/upload-receipt/")
async def upload_receipt(file: UploadFile = File(...)):
    image_bytes = await file.read()
    try:
        # OCR + Gemini + parse (returns CategorizedExpenses or list of dicts)
        OCR_text(image_bytes)
        return JSONResponse(content="Your Expense has been noted")
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    
@app.post("/submit-expense")
async def submit_expense(request: Request):
    data = await request.json()  # list of dicts
    print(data)
    with db_utilities.cursor_handler(db_utilities.con) as cur:
        for entry in data:
            try:
                query = f'INSERT INTO EATOUT VALUES ("{entry.get("RESTAURANT")}","{entry.get("ORDER")}",{entry.get("PRICE")},"{entry.get("DATE")}")'
                db_utilities.insert_db(cur,query)
                print("inserted ",entry.get("RESTAURANT"))
            except Exception as e:
                print("error: ",e)
    return {"status": "success"}

@app.get("/total_expense")
def total_expense(month: str = Query(..., description="Month in YYYY-MM format")):
    dt = parse_month_str(month)
    if dt is None:
        raise HTTPException(status_code=400, detail="Invalid month format")

    start_date = month + "-01"
    # Calculate next month for range
    next_month = (dt.replace(day=28) + timedelta(days=4)).replace(day=1)
    end_date = next_month.strftime("%Y-%m-%d")

    with db_utilities.cursor_handler(db_utilities.con) as cur:
        # Sum prices from both tables for the month
        query = f"""
            SELECT
            (SELECT IFNULL(SUM(PRICE), 0) FROM EXPENSES WHERE DATE >= '{start_date}' AND DATE < '{end_date}') AS grocery_sum,
            (SELECT IFNULL(SUM(PRICE), 0) FROM EATOUT WHERE DATE >= '{start_date}' AND DATE < '{end_date}') AS eatout_sum
        """
        row = db_utilities.db_select(cur,query)
        print(row)
        total = row[0][0] + row[0][1]
        return {"total": total}

@app.get("/grocery_expenses")
def grocery_expenses(month: str = Query(..., description="Month in YYYY-MM format")):
    dt = parse_month_str(month)
    if dt is None:
        raise HTTPException(status_code=400, detail="Invalid month format")

    start_date = month + "-01"
    next_month = (dt.replace(day=28) + timedelta(days=4)).replace(day=1)
    end_date = next_month.strftime("%Y-%m-%d")

    with db_utilities.cursor_handler(db_utilities.con) as cur:
        # Group by category sum for grocery expenses
        query = f"""
            SELECT CATEGORY as category, SUM(PRICE) as price
            FROM EXPENSES
            WHERE DATE >= '{start_date}' AND DATE < '{end_date}'
            GROUP BY CATEGORY
            ORDER BY price DESC
        """
        rows = db_utilities.db_select(cur,query)
        print(rows)
        data = [{"category": r[0], "price": r[1]} for r in rows]
        return {"data": data}

@app.get("/eatout_expenses")
def eatout_expenses(month: str = Query(..., description="Month in YYYY-MM format")):
    dt = parse_month_str(month)
    if dt is None:
        raise HTTPException(status_code=400, detail="Invalid month format")

    start_date = month + "-01"
    next_month = (dt.replace(day=28) + timedelta(days=4)).replace(day=1)
    end_date = next_month.strftime("%Y-%m-%d")

    with db_utilities.cursor_handler(db_utilities.con) as cur:
        # Group by restaurant sum for eatout expenses
        query = f"""
            SELECT RESTAURANT as restaurant, SUM(PRICE) as price
            FROM EATOUT
            WHERE DATE >= '{start_date}' AND DATE < '{end_date}'
            GROUP BY RESTAURANT
            ORDER BY price DESC
        """
        rows = db_utilities.db_select(cur,query)
        data = [{"restaurant": r[0], "price": r[1]} for r in rows]
        return {"data": data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
