"""Main application setting up the FASTAPI"""

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to Chillar API!"}