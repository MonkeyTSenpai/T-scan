# 💩 Poop Scanner - AI-Powered Digestive Health App

A modern, mobile-first health application that uses AI to analyze stool samples and provide digestive health insights based on the Bristol Stool Scale.

## 🌟 Features

### Mobile-First Design
- ✅ Fully responsive layout optimized for phones
- 📷 Direct camera capture on mobile devices
- 👆 Touch-friendly buttons with large tap targets
- 🎯 Swipe gestures for navigation
- 📱 Perfect mobile stacking and spacing

### AI-Powered Analysis
- 🤖 Claude AI analyzes uploaded images
- 📊 Bristol Stool Scale classification (Types 1-7)
- 💯 Health score out of 100
- 🎨 Color and consistency analysis
- 💡 Personalized recommendations

### Interactive Features
- 🎊 Confetti celebration for healthy results
- 💩 Spinning poop loading animation
- 📊 Interactive Bristol Scale modal with color-coding
- 🎯 Drag & drop image upload (desktop)
- ⭕ Circular progress bar with gradient
- ✨ Smooth animations throughout

### Educational
- 📚 Complete Bristol Stool Scale guide
- 🟢 Green = Healthy (Types 3, 4, 5)
- 🟡 Yellow = Caution (Types 2, 6)
- 🔴 Red = Concern (Types 1, 7)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ with pip
- Node.js 18+ with npm
- Anthropic API key

### 1. Clone & Setup Backend

```bash
# Navigate to project directory
cd my-first-fastapi-app

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo ANTHROPIC_API_KEY=your_key_here > .env
```

### 2. Setup Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not done)
npm install
```

### 3. Start the App

**Option A: Use the startup script (Windows)**
```bash
# From project root
start-app.bat
```

**Option B: Start manually**

Terminal 1 - Backend:
```bash
# From project root
venv\Scripts\activate
uvicorn main:app --reload
```

Terminal 2 - Frontend:
```bash
# From frontend directory
npm run dev
```

### 4. Open the App

- Frontend: http://localhost:5175
- Backend API: http://localhost:8000

## 📱 How to Use

### On Mobile:
1. **Tap "Take Photo"** to use your camera
2. Or **tap "Choose File"** to select from gallery
3. **Tap "Analyze My Masterpiece!"** button
4. **Swipe left** anywhere to view Bristol Scale guide
5. Watch the **confetti celebration** for healthy results! 🎉

### On Desktop:
1. **Drag & drop** an image onto the upload area
2. Or **click "Choose File"** to browse
3. **Click "Analyze My Masterpiece!"**
4. **Hover** over elements for cool effects
5. **Click "View Bristol Scale Guide"** for educational modal

## 🏗️ Project Structure

```
my-first-fastapi-app/
├── main.py                 # FastAPI backend
├── .env                    # Environment variables (API key)
├── requirements.txt        # Python dependencies
├── start-app.bat          # Windows startup script
├── uploads/               # Uploaded images storage
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main React component
    │   ├── App.css        # Mobile-first styles
    │   └── index.css      # Global styles
    ├── package.json       # Node dependencies
    └── vite.config.js     # Vite configuration
```

## 🔧 API Endpoints

### POST `/upload`
Analyzes an uploaded stool sample image.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
```json
{
  "status": "success",
  "analysis": {
    "bristolType": "Type 4",
    "bristolDescription": "Smooth, soft sausage or snake",
    "healthStatus": "healthy",
    "healthScore": 100,
    "color": "Medium brown",
    "consistency": "Well-formed",
    "keyFindings": ["Optimal fiber intake", "Good hydration"],
    "recommendations": ["Continue current diet", "Maintain hydration"],
    "detailedAnalysis": "Your stool shows excellent health markers..."
  }
}
```

## 🎨 Design Features

### Mobile-First CSS
- Base styles for mobile devices
- Progressive enhancement for tablets/desktop
- Touch-optimized with `:active` states
- Min-height tap targets (56-120px)
- Responsive grid layouts

### Animations
- 🎊 Confetti falling (50 pieces, random colors)
- 💩 Spinning poop loader
- 📊 Circular progress bar fill
- ✨ Slide, scale, and fade transitions
- 🌊 Float and bounce effects

### Color Palette
- Primary: Purple gradient (#667eea → #764ba2)
- Warm: Pink gradient (#f093fb → #f5576c)
- Success: Blue gradient (#4facfe → #00f2fe)
- Background: Multi-stop gradient (peach → coral → purple → blue)

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## 🐛 Troubleshooting

### Backend won't start
- Check if virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Ensure `.env` file exists with valid API key
- Check if port 8000 is available

### Frontend won't connect to backend
- Verify backend is running on http://localhost:8000
- Check browser console for CORS errors
- Ensure both servers are running

### Camera not working on mobile
- Grant camera permissions in browser
- Use HTTPS in production (camera requires secure context)
- Try "Choose File" as alternative

### Images not analyzing
- Check API key is valid
- Verify image format is supported (JPEG, PNG)
- Check network tab for API response
- Look at backend logs for errors

## 📊 Bristol Stool Scale Reference

| Type | Description | Health Status | Score Range |
|------|-------------|---------------|-------------|
| Type 1 | Separate hard lumps | 🔴 Concern | 40-50 |
| Type 2 | Lumpy sausage | 🟡 Caution | 60-70 |
| Type 3 | Sausage with cracks | 🟢 Healthy | 80-90 |
| Type 4 | Smooth, soft sausage | 🟢 Ideal! | 100 |
| Type 5 | Soft blobs | 🟢 Healthy | 85-95 |
| Type 6 | Fluffy pieces | 🟡 Caution | 65-75 |
| Type 7 | Watery liquid | 🔴 Concern | 45-55 |

## 🚀 Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- Anthropic Claude AI - Image analysis
- Uvicorn - ASGI server
- python-multipart - File uploads

**Frontend:**
- React 19 - UI library
- Vite - Build tool & dev server
- CSS3 - Mobile-first styling
- Fetch API - HTTP requests

## 📝 License

This project is for educational and personal health tracking purposes.

## 🙏 Acknowledgments

- Bristol Stool Scale classification system
- Anthropic Claude AI for image analysis
- FastAPI and React communities

## 💡 Future Enhancements

- [ ] History tracking (save past scans)
- [ ] Trends and charts over time
- [ ] Export reports as PDF
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PWA for offline use
- [ ] Share results with healthcare provider

---

**Made with 💩 and ❤️ for better digestive health!**
