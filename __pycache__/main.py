from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to my first FastAPI app!", "status": "running"}

@app.get("/about")
def about():
    return {"page": "About", "description": "This is my first web app"}  