
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from anthropic import Anthropic
import base64
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_root():
    return FileResponse("static/index.html")

@app.post("/upload")
async def analyze_poop(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        media_type = file.content_type or "image/jpeg"
        
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
                    "text": """Analyze this stool sample image as a health assessment tool. Provide your response in this EXACT JSON format:

{
    "bristolType": "Type X",
    "bristolDescription": "brief description",
    "healthStatus": "healthy" or "warning" or "concern",
    "healthScore": 85,
    "color": "description of color",
    "consistency": "description",
    "keyFindings": [
        "finding 1",
        "finding 2",
        "finding 3"
    ],
    "recommendations": [
        "recommendation 1",
        "recommendation 2"
    ],
    "detailedAnalysis": "paragraph of detailed analysis"
}

Bristol Stool Scale reference:
- Type 1-2: Hard/constipation (score 40-60)
- Type 3-4: Normal/healthy (score 80-100)
- Type 5-7: Loose/diarrhea (score 50-70)

Use "healthy" status for Types 3-4, "warning" for Types 2,5, and "concern" for Types 1,6,7."""
                }
            ],
        }
    ],
)
        
        analysis_text = message.content[0].text
        print(f"DEBUG - Claude's response: {analysis_text}")
        
        # Try to parse JSON response
        try:
            import json
            analysis_data = json.loads(analysis_text)
            return JSONResponse(content={
                "status": "success",
                "analysis": analysis_data
            })
        except:
            # Fallback if JSON parsing fails
            return JSONResponse(content={
                "status": "success",
                "analysis": {
                    "bristolType": "Type 4",
                    "bristolDescription": "Analysis complete",
                    "healthStatus": "healthy",
                    "healthScore": 75,
                    "detailedAnalysis": analysis_text,
                    "keyFindings": ["See detailed analysis below"],
                    "recommendations": ["Consult healthcare professional"]
                }
            })
        
    except Exception as e:
        return JSONResponse(
            content={"status": "error", "message": f"Analysis failed: {str(e)}"},
            status_code=500
        )