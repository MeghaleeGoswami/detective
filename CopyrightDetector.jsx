import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle, CheckCircle, XCircle, FileVideo, Music, Eye, FileText } from 'lucide-react';

const CopyrightDetector = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Simulated copyright database
  const copyrightDatabase = {
    audio: [
      { name: "Popular Song #1", artist: "Famous Artist", confidence: 0.95 },
      { name: "Movie Theme", artist: "Film Studio", confidence: 0.88 },
      { name: "Commercial Jingle", artist: "Brand Corp", confidence: 0.92 }
    ],
    visual: [
      { name: "Studio Logo", owner: "Major Studio", confidence: 0.87 },
      { name: "Cartoon Character", owner: "Animation Co", confidence: 0.94 },
      { name: "Sports Footage", owner: "Sports Network", confidence: 0.91 }
    ],
    metadata: [
      "copyrighted music", "official soundtrack", "movie clip", "tv show", "brand commercial"
    ]
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('video/')) {
      setFile(uploadedFile);
      setResults(null);
      setProgress(0);
    } else {
      alert('Please upload a video file');
    }
  };

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    const stages = [
      { name: "Extracting audio fingerprint", duration: 1500 },
      { name: "Analyzing video frames", duration: 2000 },
      { name: "Processing metadata", duration: 1000 },
      { name: "Comparing against database", duration: 1500 },
      { name: "Generating report", duration: 1000 }
    ];

    for (let i = 0; i < stages.length; i++) {
      setProgress(((i + 1) / stages.length) * 100);
      await new Promise(resolve => setTimeout(resolve, stages[i].duration));
    }

    // Simulate detection results
    const hasAudioMatch = Math.random() > 0.4;
    const hasVisualMatch = Math.random() > 0.6;
    const hasMetadataIssue = Math.random() > 0.7;

    const detectedIssues = [];
    
    if (hasAudioMatch) {
      const randomAudio = copyrightDatabase.audio[Math.floor(Math.random() * copyrightDatabase.audio.length)];
      detectedIssues.push({
        type: 'audio',
        severity: randomAudio.confidence > 0.9 ? 'high' : 'medium',
        description: `Potential match: "${randomAudio.name}" by ${randomAudio.artist}`,
        confidence: randomAudio.confidence,
        timestamp: `${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      });
    }

    if (hasVisualMatch) {
      const randomVisual = copyrightDatabase.visual[Math.floor(Math.random() * copyrightDatabase.visual.length)];
      detectedIssues.push({
        type: 'visual',
        severity: randomVisual.confidence > 0.9 ? 'high' : 'medium',
        description: `Visual content detected: "${randomVisual.name}" owned by ${randomVisual.owner}`,
        confidence: randomVisual.confidence,
        timestamp: `${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      });
    }

    if (hasMetadataIssue) {
      const randomMetadata = copyrightDatabase.metadata[Math.floor(Math.random() * copyrightDatabase.metadata.length)];
      detectedIssues.push({
        type: 'metadata',
        severity: 'low',
        description: `Metadata contains: "${randomMetadata}"`,
        confidence: 0.75,
        timestamp: 'N/A'
      });
    }

    setResults({
      overallRisk: detectedIssues.length === 0 ? 'low' : 
                   detectedIssues.some(issue => issue.severity === 'high') ? 'high' : 'medium',
      issues: detectedIssues,
      recommendation: detectedIssues.length === 0 ? 
        'No copyright issues detected. Video appears safe to upload.' :
        detectedIssues.some(issue => issue.severity === 'high') ?
        'High risk detected. Consider removing copyrighted content or obtaining proper licenses.' :
        'Potential issues detected. Review flagged content and consider fair use guidelines.'
    });

    setIsAnalyzing(false);
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'high': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default: return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'audio': return <Music className="w-4 h-4" />;
      case 'visual': return <Eye className="w-4 h-4" />;
      case 'metadata': return <FileText className="w-4 h-4" />;
      default: return <FileVideo className="w-4 h-4" />;
    }
  };

  const handleDownloadReport = () => {
    const report = `Copyright Analysis Report\n\nFile: ${file.name}\nRisk Level: ${results.overallRisk}\nIssues Found: ${results.issues.length}\n\nRecommendation: ${results.recommendation}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'copyright-report.txt';
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setResults(null);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          YouTube Copyright Detector
        </h1>
        <p className="text-gray-600">
          Upload a video to scan for potential copyright issues
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {file ? file.name : 'Upload Video File'}
          </p>
          <p className="text-sm text-gray-500">
            {file ? 'Click to change file' : 'Drag and drop or click to select'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Video Preview */}
      {file && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Video Preview</h3>
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={URL.createObjectURL(file)}
              controls
              className="w-full max-h-96"
            />
          </div>
        </div>
      )}

      {/* Analyze Button */}
      {file && !isAnalyzing && !results && (
        <div className="text-center mb-8">
          <button
            onClick={simulateAnalysis}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Analyze for Copyright Issues
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {isAnalyzing && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Analyzing...</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Checking audio fingerprints, visual content, and metadata...
          </p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Overall Risk Assessment */}
          <div className={`p-6 rounded-lg border-2 ${getRiskColor(results.overallRisk)}`}>
            <div className="flex items-center mb-3">
              {results.overallRisk === 'low' ? (
                <CheckCircle className="w-6 h-6 mr-3" />
              ) : results.overallRisk === 'medium' ? (
                <AlertTriangle className="w-6 h-6 mr-3" />
              ) : (
                <XCircle className="w-6 h-6 mr-3" />
              )}
              <h3 className="text-xl font-bold capitalize">
                {results.overallRisk} Risk Level
              </h3>
            </div>
            <p className="text-sm opacity-90">
              {results.recommendation}
            </p>
          </div>

          {/* Detailed Issues */}
          {results.issues.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Detected Issues</h3>
              <div className="space-y-3">
                {results.issues.map((issue, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(issue.type)}
                          <span className="font-medium capitalize">{issue.type} Detection</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {Math.round(issue.confidence * 100)}% confidence
                        </div>
                        <div className="text-xs text-gray-500">
                          {issue.timestamp}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Summary */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Music className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Audio Analysis</div>
                <div className="text-xs text-gray-600">Fingerprint matching</div>
              </div>
              <div className="text-center">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Visual Analysis</div>
                <div className="text-xs text-gray-600">Frame comparison</div>
              </div>
              <div className="text-center">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Metadata Check</div>
                <div className="text-xs text-gray-600">Title & description</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Analyze Another Video
            </button>
            <button
              onClick={handleDownloadReport}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Download Report
            </button>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Music className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h4 className="font-medium mb-2">Audio Fingerprinting</h4>
            <p className="text-sm text-gray-600">
              Extracts unique audio signatures and compares them against a database of copyrighted music and sounds.
            </p>
          </div>
          <div className="text-center">
            <Eye className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h4 className="font-medium mb-2">Visual Analysis</h4>
            <p className="text-sm text-gray-600">
              Analyzes video frames to detect logos, watermarks, and copyrighted visual content.
            </p>
          </div>
          <div className="text-center">
            <FileText className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h4 className="font-medium mb-2">Metadata Scanning</h4>
            <p className="text-sm text-gray-600">
              Examines file metadata, titles, and descriptions for copyright-related keywords.
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Demo Disclaimer</p>
              <p className="text-xs text-yellow-700 mt-1">
                This is a demonstration with simulated results. Real copyright detection requires 
                extensive databases and sophisticated algorithms. Always consult legal experts for 
                actual copyright matters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyrightDetector;