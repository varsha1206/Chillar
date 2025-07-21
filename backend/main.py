from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from backend.models import CategorizedExpenses
from backend.ocr import OCR_text

app = FastAPI()
image_path = r"C:/Users/Varsha/OneDrive/Desktop/rewe.jpg"
@app.post("/upload-receipt/")
async def upload_receipt(file: UploadFile = File(...)):
    image_bytes = await file.read()
    try:
        # OCR + Gemini + parse (returns CategorizedExpenses or list of dicts)
        OCR_text(image_bytes)
        return JSONResponse(content={"message": "Receipt processed and stored successfully."})
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
