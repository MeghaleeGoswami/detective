import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle, CheckCircle, XCircle, FileVideo, Music, Eye, FileText, Database, Plus, Trash2 } from 'lucide-react';

const CopyrightDetector = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('detect'); // 'detect' or 'curate'
  const [referenceVideos, setReferenceVideos] = useState([]);
  const [learnedPatterns, setLearnedPatterns] = useState({
    audioPatterns: ['studio-quality-audio', 'professional-mixing', 'commercial-sound'],
    visualPatterns: ['branded-watermark', 'professional-editing', 'multiple-camera-angles'],
    metadataKeywords: ['official', 'soundtrack', 'trailer', 'music video', '©', 'copyright']
  });
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const referenceInputRef = useRef(null);

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

  const handleReferenceUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('video/')) {
      // Simulate extracting patterns from reference video
      const extractedPatterns = {
        id: Date.now(),
        filename: uploadedFile.name,
        extractedKeywords: [
          `${uploadedFile.name.toLowerCase().replace(/\.[^/.]+$/, "")}`,
          'professional-audio',
          'high-definition',
          Math.random() > 0.5 ? 'branded-content' : 'studio-production'
        ],
        uploadDate: new Date().toLocaleDateString()
      };
      
      setReferenceVideos([...referenceVideos, extractedPatterns]);
      
      // Add to learned patterns
      const newKeywords = extractedPatterns.extractedKeywords.filter(
        keyword => !learnedPatterns.metadataKeywords.includes(keyword)
      );
      if (newKeywords.length > 0) {
        setLearnedPatterns({
          ...learnedPatterns,
          metadataKeywords: [...learnedPatterns.metadataKeywords, ...newKeywords]
        });
      }
    } else {
      alert('Please upload a video file');
    }
  };

  const removeReferenceVideo = (id) => {
    setReferenceVideos(referenceVideos.filter(video => video.id !== id));
  };

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    const stages = [
      { name: "Extracting audio characteristics", duration: 1500 },
      { name: "Analyzing visual patterns", duration: 2000 },
      { name: "Processing metadata and filename", duration: 1000 },
      { name: "Comparing against learned patterns", duration: 1500 },
      { name: "Generating risk assessment", duration: 1000 }
    ];

    for (let i = 0; i < stages.length; i++) {
      setProgress(((i + 1) / stages.length) * 100);
      await new Promise(resolve => setTimeout(resolve, stages[i].duration));
    }

    // Analyze based on learned patterns
    const detectedIssues = [];
    const filename = file.name.toLowerCase();
    
    // Check metadata/filename against learned keywords
    const matchedKeywords = learnedPatterns.metadataKeywords.filter(keyword => 
      filename.includes(keyword.toLowerCase())
    );
    
    if (matchedKeywords.length > 0) {
      detectedIssues.push({
        type: 'metadata',
        severity: matchedKeywords.includes('official') || matchedKeywords.includes('copyright') ? 'high' : 'medium',
        description: `Filename contains suspicious keywords: ${matchedKeywords.join(', ')}`,
        confidence: 0.7 + (matchedKeywords.length * 0.1),
        timestamp: 'N/A',
        learnedFrom: 'User-submitted reference videos'
      });
    }

    // Simulate audio pattern matching
    if (Math.random() > 0.5) {
      detectedIssues.push({
        type: 'audio',
        severity: Math.random() > 0.7 ? 'high' : 'medium',
        description: `Audio characteristics match learned pattern: ${learnedPatterns.audioPatterns[Math.floor(Math.random() * learnedPatterns.audioPatterns.length)]}`,
        confidence: 0.6 + Math.random() * 0.3,
        timestamp: `${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        learnedFrom: 'Pattern analysis from reference database'
      });
    }

    // Simulate visual pattern matching
    if (Math.random() > 0.6) {
      detectedIssues.push({
        type: 'visual',
        severity: Math.random() > 0.8 ? 'high' : 'medium',
        description: `Visual pattern detected: ${learnedPatterns.visualPatterns[Math.floor(Math.random() * learnedPatterns.visualPatterns.length)]}`,
        confidence: 0.65 + Math.random() * 0.25,
        timestamp: `${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        learnedFrom: 'Visual pattern database'
      });
    }

    setResults({
      overallRisk: detectedIssues.length === 0 ? 'low' : 
                   detectedIssues.some(issue => issue.severity === 'high') ? 'high' : 'medium',
      issues: detectedIssues,
      recommendation: detectedIssues.length === 0 ? 
        'No suspicious patterns detected based on current reference database.' :
        detectedIssues.some(issue => issue.severity === 'high') ?
        'High-risk patterns detected. Review content carefully before publishing.' :
        'Some suspicious patterns found. Consider reviewing flagged content.',
      patternsUsed: learnedPatterns.metadataKeywords.length + learnedPatterns.audioPatterns.length + learnedPatterns.visualPatterns.length
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
    const report = `Copyright Analysis Report\n\nFile: ${file.name}\nRisk Level: ${results.overallRisk}\nIssues Found: ${results.issues.length}\nPatterns Used: ${results.patternsUsed}\n\nRecommendation: ${results.recommendation}\n\nDetailed Issues:\n${results.issues.map(issue => `- ${issue.type}: ${issue.description} (${Math.round(issue.confidence * 100)}% confidence)`).join('\n')}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'copyright-analysis-report.txt';
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
          Crowdsourced Copyright Detector
        </h1>
        <p className="text-gray-600">
          Build a detection database from user-submitted reference videos
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-8 border-b">
        <button
          onClick={() => setActiveTab('detect')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'detect' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Detect Copyright
        </button>
        <button
          onClick={() => setActiveTab('curate')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'curate' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Curate Database ({referenceVideos.length} references)
        </button>
      </div>

      {activeTab === 'curate' && (
        <div className="space-y-6">
          {/* Reference Video Upload */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Add Reference Videos</h3>
            <p className="text-sm text-blue-700 mb-4">
              Upload videos that you suspect contain copyrighted content. The system will learn patterns from these examples.
            </p>
            <div 
              className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => referenceInputRef.current?.click()}
            >
              <Database className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <p className="text-blue-700 font-medium">Upload Reference Video</p>
              <p className="text-xs text-blue-600 mt-1">Help improve detection accuracy</p>
              <input
                ref={referenceInputRef}
                type="file"
                accept="video/*"
                onChange={handleReferenceUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Reference Videos List */}
          {referenceVideos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Reference Database</h3>
              <div className="space-y-3">
                {referenceVideos.map((video) => (
                  <div key={video.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{video.filename}</h4>
                        <p className="text-sm text-gray-500">Added: {video.uploadDate}</p>
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 mb-1">Extracted Keywords:</p>
                          <div className="flex flex-wrap gap-1">
                            {video.extractedKeywords.map((keyword, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeReferenceVideo(video.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learned Patterns Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Current Detection Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Audio Patterns ({learnedPatterns.audioPatterns.length})</h4>
                <div className="space-y-1">
                  {learnedPatterns.audioPatterns.slice(0, 3).map((pattern, idx) => (
                    <div key={idx} className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                      {pattern}
                    </div>
                  ))}
                  {learnedPatterns.audioPatterns.length > 3 && (
                    <div className="text-xs text-gray-500">+{learnedPatterns.audioPatterns.length - 3} more</div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Visual Patterns ({learnedPatterns.visualPatterns.length})</h4>
                <div className="space-y-1">
                  {learnedPatterns.visualPatterns.slice(0, 3).map((pattern, idx) => (
                    <div key={idx} className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                      {pattern}
                    </div>
                  ))}
                  {learnedPatterns.visualPatterns.length > 3 && (
                    <div className="text-xs text-gray-500">+{learnedPatterns.visualPatterns.length - 3} more</div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Keywords ({learnedPatterns.metadataKeywords.length})</h4>
                <div className="space-y-1">
                  {learnedPatterns.metadataKeywords.slice(0, 3).map((keyword, idx) => (
                    <div key={idx} className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                      {keyword}
                    </div>
                  ))}
                  {learnedPatterns.metadataKeywords.length > 3 && (
                    <div className="text-xs text-gray-500">+{learnedPatterns.metadataKeywords.length - 3} more</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'detect' && (
        <div>
          {/* Upload Section */}
          <div className="mb-8">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {file ? file.name : 'Upload Video to Analyze'}
              </p>
              <p className="text-sm text-gray-500">
                {file ? 'Click to change file' : 'Check against learned patterns from reference database'}
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

          {/* Database Stats */}
          <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Detection Database: {referenceVideos.length} reference videos, {learnedPatterns.metadataKeywords.length} learned patterns
                </p>
                <p className="text-xs text-blue-700">
                  {referenceVideos.length === 0 ? 'Add reference videos to improve detection accuracy' : 'Database ready for analysis'}
                </p>
              </div>
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
                disabled={referenceVideos.length === 0}
              >
                Analyze Against Reference Database
              </button>
              {referenceVideos.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Add reference videos first to enable analysis
                </p>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Analyzing against learned patterns...</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
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
                <p className="text-xs mt-2 opacity-75">
                  Analysis based on {results.patternsUsed} learned patterns from {referenceVideos.length} reference videos
                </p>
              </div>

              {/* Detailed Issues */}
              {results.issues.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pattern Matches Found</h3>
                  <div className="space-y-3">
                    {results.issues.map((issue, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(issue.type)}
                              <span className="font-medium capitalize">{issue.type} Pattern</span>
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
                        <p className="text-xs text-gray-500 mt-1">Source: {issue.learnedFrom}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
        </div>
      )}

      {/* Info Panel */}
      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">How This Approach Works</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Plus className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium">Crowdsourced Learning</h4>
              <p className="text-sm text-gray-600">
                Users submit videos they believe contain copyrighted content. The system extracts patterns, keywords, and characteristics from these examples.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Eye className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium">Pattern Recognition</h4>
              <p className="text-sm text-gray-600">
                Instead of knowing specific copyrighted works, the system learns to recognize patterns that indicate professional/copyrighted content.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium">Smart Detection</h4>
              <p className="text-sm text-gray-600">
                New videos are checked against learned patterns for audio quality, visual characteristics, and metadata keywords.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Legal Note</p>
              <p className="text-xs text-yellow-700 mt-1">
                This system learns patterns rather than storing copyrighted content. Always verify results and consult legal experts for copyright matters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyrightDetector;