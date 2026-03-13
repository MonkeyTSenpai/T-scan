from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from anthropic import Anthropic
import base64
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_root():
    return FileResponse("static/index.html")

@app.post("/analyze")
async def analyze_poop(file: UploadFile = File(...)):
    try:
        # Read and encode the image
        image_data = await file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        
        # Determine media type
        media_type = file.content_type or "image/jpeg"
        
        # Call Claude API with vision
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": base64_image,
                            },
                        },
                        {
                            "type": "text",
                            "text": """Analyze this stool sample image and provide a health assessment. Format your response as:

TYPE: [Bristol Stool Scale type 1-7 with description]
COLOR: [Color and what it indicates]
CONSISTENCY: [Texture description]
CONCERNS: [Any warning signs or "None detected"]
ASSESSMENT: [Overall health implications]
RECOMMENDATIONS: [2-3 specific suggestions]

Be clinical but accessible. If image is not a stool sample, politely indicate that."""
                        }
                    ],
                }
            ],
        )
        
        # Parse Claude's response
        analysis_text = message.content[0].text
        
        return JSONResponse(content={
            "status": "success",
            "analysis": {
                "raw_text": analysis_text,
                "model": "claude-sonnet-4-20250514"
            }
        })
        
    except Exception as e:
        return JSONResponse(
            content={
                "status": "error",
                "message": f"Analysis failed: {str(e)}"
            },
            status_code=500
        )

if _name_ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)