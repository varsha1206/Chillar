from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from models import CategorizedExpenses
from ocr import OCR_text
from fastapi.middleware.cors import CORSMiddleware
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
@app.post("/upload-receipt/")
async def upload_receipt(file: UploadFile = File(...)):
    image_bytes = await file.read()
    try:
        # OCR + Gemini + parse (returns CategorizedExpenses or list of dicts)
        OCR_text(image_bytes)
        return JSONResponse(content="Your Expense has been noted")
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
            
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
