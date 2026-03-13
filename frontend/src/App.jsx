import { useState, useEffect, useRef } from 'react'
import './App.css'
import { API_BASE_URL } from './config'

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Bristol Stool Scale reference data with health categories
  const bristolScale = [
    {
      type: 1,
      emoji: "🔴",
      name: "Type 1",
      desc: "Separate hard lumps, like nuts",
      health: "Severe Constipation",
      color: "#e53e3e",
      category: "concern",
      longDesc: "Hard to pass. Indicates severe constipation and dehydration."
    },
    {
      type: 2,
      emoji: "🟠",
      name: "Type 2",
      desc: "Lumpy and sausage-like",
      health: "Mild Constipation",
      color: "#dd6b20",
      category: "caution",
      longDesc: "Difficult to pass. May indicate mild constipation."
    },
    {
      type: 3,
      emoji: "🟡",
      name: "Type 3",
      desc: "Sausage with cracks on surface",
      health: "Normal",
      color: "#d69e2e",
      category: "healthy",
      longDesc: "Normal and healthy. Easy to pass."
    },
    {
      type: 4,
      emoji: "🟢",
      name: "Type 4",
      desc: "Smooth, soft sausage or snake",
      health: "Ideal!",
      color: "#38a169",
      category: "healthy",
      longDesc: "Perfect! This is the gold standard of poop."
    },
    {
      type: 5,
      emoji: "🟢",
      name: "Type 5",
      desc: "Soft blobs with clear edges",
      health: "Normal",
      color: "#38a169",
      category: "healthy",
      longDesc: "Normal. Passed easily with good fiber intake."
    },
    {
      type: 6,
      emoji: "🟠",
      name: "Type 6",
      desc: "Fluffy pieces, mushy",
      health: "Mild Diarrhea",
      color: "#dd6b20",
      category: "caution",
      longDesc: "Too soft. May indicate mild diarrhea or dietary issues."
    },
    {
      type: 7,
      emoji: "🔴",
      name: "Type 7",
      desc: "Watery, no solid pieces",
      health: "Severe Diarrhea",
      color: "#e53e3e",
      category: "concern",
      longDesc: "Completely liquid. Indicates severe diarrhea. Seek medical attention if persistent."
    }
  ];

  // Calculate health score based on Bristol type
  const calculateHealthScore = (typeNumber) => {
    const scores = { 1: 45, 2: 65, 3: 85, 4: 100, 5: 90, 6: 70, 7: 50 };
    return scores[typeNumber] || 75;
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    setShowConfetti(false);

    try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append('file', selectedImage);

      // Call FastAPI backend
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success' && data.analysis) {
        const analysis = data.analysis;

        // Extract Bristol type number from type string (e.g., "Type 4" -> 4)
        const typeMatch = analysis.bristolType.match(/Type (\d)/);
        const typeNumber = typeMatch ? parseInt(typeMatch[1]) : 4;

        // Map health status to friendly message
        const healthMessages = {
          'healthy': '✨ Perfect! You\'re doing amazing!',
          'warning': '⚠️ Could be better - let\'s optimize!',
          'concern': '🚨 Needs attention - consider seeing a doctor'
        };

        setResults({
          type: analysis.bristolType,
          typeNumber: typeNumber,
          description: analysis.bristolDescription || analysis.detailedAnalysis,
          health: healthMessages[analysis.healthStatus] || analysis.healthStatus,
          healthScore: analysis.healthScore,
          color: analysis.color,
          consistency: analysis.consistency,
          recommendation: analysis.detailedAnalysis || 'Keep monitoring your digestive health',
          tips: analysis.recommendations || analysis.keyFindings || []
        });

        // Show confetti for healthy results only
        if (analysis.healthStatus === 'healthy' || (typeNumber >= 3 && typeNumber <= 5)) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert(`Failed to analyze image: ${error.message}\n\nMake sure the FastAPI backend is running on ${API_BASE_URL}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResults(null);
      setShowConfetti(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Swipe gesture handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Swipe left to open modal
    if (diff > 100 && !showChartModal) {
      setShowChartModal(true);
    }
    // Swipe right to close modal
    if (diff < -100 && showChartModal) {
      setShowChartModal(false);
    }
  };

  // Circular progress bar component
  const CircularProgress = ({ score }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference - (score / 100) * circumference;

    return (
      <div className="circular-progress">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            transform="rotate(-90 90 90)"
            className="progress-ring"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
        <div className="progress-content">
          <div className="progress-score">{score}</div>
          <div className="progress-label">Health Score</div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="app-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="confetti-piece" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'][Math.floor(Math.random() * 5)]
            }}></div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">
          <span className="app-emoji">💩</span>
          <span>Poop Scanner</span>
          <span className="app-emoji">💩</span>
        </h1>
        <p className="app-subtitle">Let's analyze your masterpiece! 🎨</p>
        <p className="tagline">Your gut health matters - let's make it fun! 🌟</p>
      </header>

      {/* Bristol Scale Chart Toggle */}
      <button
        className="chart-toggle-button"
        onClick={() => setShowChartModal(true)}
      >
        <span>📊</span>
        <span>View Bristol Scale Guide</span>
      </button>

      {/* Upload Card */}
      <div
        className={`upload-card ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-card-header">
          <h2 className="upload-title">📷 Ready? Let's Go!</h2>
          <p className="upload-subtitle">Snap, upload, or drag & drop</p>
        </div>

        <div className="upload-buttons">
          {/* Camera Capture Button (Mobile) */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="file-upload-input"
            id="camera-capture"
          />
          <label htmlFor="camera-capture" className="camera-button">
            <span className="camera-icon">📷</span>
            <span>Take Photo</span>
          </label>

          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-upload-input"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="upload-button">
            <span className="upload-icon">📤</span>
            <span>Choose File</span>
          </label>
        </div>

        <div className="upload-hint">
          <span>💡 Tip: You can also drag & drop on desktop!</span>
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="preview-section">
            <h3 className="preview-label">👀 Looking good! Ready to analyze?</h3>
            <div className="preview-image-wrapper">
              <img
                src={preview}
                alt="Preview"
                className="preview-image"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="analyze-button"
            >
              {isAnalyzing ? (
                <>
                  <span className="loading-poop">💩</span>
                  <span>Analyzing your masterpiece...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Analyze My Masterpiece!</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Results Card */}
      {results && (
        <div className="results-card">
          <div className="results-header">
            <h2 className="results-title">🎉 Your Results Are In!</h2>
          </div>

          {/* Health Score Circle */}
          <div className="health-score-section">
            <CircularProgress score={results.healthScore} />
          </div>

          <div className="result-item result-item-highlight">
            <div className="result-icon">🎯</div>
            <div className="result-content">
              <div className="result-label">Bristol Stool Type</div>
              <div className="result-value result-value-large">{results.type}</div>
            </div>
          </div>

          <div className="result-item">
            <div className="result-icon">📝</div>
            <div className="result-content">
              <div className="result-label">What This Means</div>
              <div className="result-value">{results.description}</div>
            </div>
          </div>

          <div className="result-item">
            <div className="result-icon">💚</div>
            <div className="result-content">
              <div className="result-label">Health Status</div>
              <div className="result-value">
                <span className="health-status">
                  <span>✓</span>
                  <span>{results.health}</span>
                </span>
              </div>
            </div>
          </div>

          {results.color && (
            <div className="result-item">
              <div className="result-icon">🎨</div>
              <div className="result-content">
                <div className="result-label">Color</div>
                <div className="result-value">{results.color}</div>
              </div>
            </div>
          )}

          {results.consistency && (
            <div className="result-item">
              <div className="result-icon">🔬</div>
              <div className="result-content">
                <div className="result-label">Consistency</div>
                <div className="result-value">{results.consistency}</div>
              </div>
            </div>
          )}

          <div className="result-item">
            <div className="result-icon">💡</div>
            <div className="result-content">
              <div className="result-label">Detailed Analysis</div>
              <div className="result-value">{results.recommendation}</div>
            </div>
          </div>

          {results.tips && results.tips.length > 0 && (
            <div className="tips-section">
              <h3 className="tips-title">🌟 Recommendations & Key Findings</h3>
              <ul className="tips-list">
                {results.tips.map((tip, index) => (
                  <li key={index} className="tip-item">
                    <span className="tip-bullet">✨</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className="new-scan-button" onClick={() => {
            setPreview(null);
            setSelectedImage(null);
            setResults(null);
            setShowConfetti(false);
          }}>
            <span>🔄</span>
            <span>Analyze Another Sample</span>
          </button>
        </div>
      )}

      {/* Bristol Scale Modal */}
      {showChartModal && (
        <div className="modal-overlay" onClick={() => setShowChartModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowChartModal(false)}>✕</button>

            <h2 className="modal-title">💡 Bristol Stool Scale</h2>
            <p className="modal-subtitle">Your complete guide to digestive health</p>

            <div className="modal-legend">
              <div className="legend-item">
                <span className="legend-dot healthy"></span>
                <span>Healthy</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot caution"></span>
                <span>Caution</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot concern"></span>
                <span>Concern</span>
              </div>
            </div>

            <div className="modal-grid">
              {bristolScale.map((item) => (
                <div
                  key={item.type}
                  className={`modal-item ${item.category}`}
                  style={{ borderColor: item.color }}
                >
                  <div className="modal-item-header">
                    <div className="modal-item-emoji">{item.emoji}</div>
                    <div className="modal-item-type">{item.name}</div>
                  </div>
                  <div className="modal-item-desc">{item.desc}</div>
                  <div className="modal-item-health" style={{ color: item.color }}>
                    {item.health}
                  </div>
                  <div className="modal-item-long">{item.longDesc}</div>
                </div>
              ))}
            </div>

            <button className="modal-button" onClick={() => setShowChartModal(false)}>
              Got it! 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;