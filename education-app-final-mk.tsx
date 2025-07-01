import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, History, Play, User, Bot, Clock, AlertCircle, Zap, Settings, Sparkles } from 'lucide-react';

const EducationApp = () => {
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [queryHistory, setQueryHistory] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mcpServerUrl, setMcpServerUrl] = useState('http://localhost:3001');
  const [showSettings, setShowSettings] = useState(false);
  const [mcpLogs, setMcpLogs] = useState([]);
  const messagesEndRef = useRef(null);

  // Sample educational topics for demonstration
  const sampleTopics = [
    "linear algebra basics",
    "photosynthesis process", 
    "calculus derivatives",
    "world war 2 timeline",
    "python programming fundamentals",
    "quantum physics introduction",
    "organic chemistry basics",
    "machine learning basics",
    "data structures algorithms"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add log entry to show MCP flow
  const addMcpLog = (step, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setMcpLogs(prev => [...prev, { step, message, timestamp }].slice(-5)); // Keep last 5 logs
  };

  // Simulate the full MCP architecture flow
  const simulateMCPFlow = async (userMessage) => {
    setIsLoading(true);
    setMcpLogs([]); // Clear previous logs
    
    try {
      // Step 1: User prompt → Claude model
      addMcpLog('1', 'User query received by Claude');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Claude makes tool call via MCP
      addMcpLog('2', 'Claude calling youtube_search tool via MCP');
      await new Promise(resolve => setTimeout(resolve, 700));

      // Step 3: MCP Server processes request
      addMcpLog('3', 'MCP Server processing YouTube Data API request');
      const videoData = await simulateMCPServer(userMessage);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 4: YouTube Data API search results
      addMcpLog('4', 'YouTube Data API returned video results');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 5: Claude responds with video snippet
      addMcpLog('5', 'Claude processing tool result and generating response');
      const claudeResponse = await generateEducationalResponse(userMessage, videoData);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 6: Web front-end renders iframe
      setCurrentVideo(videoData);
      addMcpLog('6', 'Front-end rendering YouTube iframe');

      return claudeResponse;
      
    } catch (error) {
      console.error('Error in MCP flow:', error);
      addMcpLog('ERROR', 'MCP flow encountered an error');
      return "I encountered an issue processing your request. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate your MCP server that interfaces with YouTube Data API
  const simulateMCPServer = async (query) => {
    // This simulates what your actual MCP server would return from YouTube Data API
    const educationalVideos = {
      "linear algebra": {
        id: "fNk_zzaMoSs",
        title: "Linear Algebra - Full College Course",
        description: "Learn Complete Linear Algebra in this Full College Course. This comprehensive tutorial covers vectors, matrices, eigenvalues, eigenvectors, linear transformations, and applications in computer graphics and machine learning.",
        channel: "freeCodeCamp.org",
        channelId: "UC8butISFwT-Wl7EV0hUK0BQ",
        publishedAt: "2021-05-17T14:00:00Z",
        duration: "PT20H33M52S",
        viewCount: "2847391",
        likeCount: "89234",
        tags: ["linear algebra", "mathematics", "vectors", "matrices", "education"],
        embedUrl: "https://www.youtube.com/embed/fNk_zzaMoSs"
      },
      "photosynthesis": {
        id: "uixA8ZXx0KU", 
        title: "Photosynthesis: Crash Course Biology #8",
        description: "Hank explains the extremely complex series of reactions whereby plants feed themselves on sunlight, carbon dioxide and water, and also create some by products we're pretty fond of, like oxygen.",
        channel: "CrashCourse",
        channelId: "UCX6b17PVsYBQ0ip5gyeme-Q",
        publishedAt: "2012-03-19T17:00:00Z",
        duration: "PT13M24S",
        viewCount: "3247891",
        likeCount: "67543",
        tags: ["photosynthesis", "biology", "plants", "education", "crash course"],
        embedUrl: "https://www.youtube.com/embed/uixA8ZXx0KU"
      },
      "calculus": {
        id: "WUvTyaaNkzM",
        title: "Calculus 1 - Introduction to Limits",
        description: "This calculus video tutorial provides a basic introduction into limits. It explains how to evaluate limits algebraically and graphically with plenty of examples and practice problems.",
        channel: "The Organic Chemistry Tutor",
        channelId: "UCEWpbFLzoYGPfuWUMFPSaoA",
        publishedAt: "2017-08-15T20:00:00Z",
        duration: "PT2H43M09S",
        viewCount: "1847293",
        likeCount: "45782",
        tags: ["calculus", "limits", "mathematics", "tutorial"],
        embedUrl: "https://www.youtube.com/embed/WUvTyaaNkzM"
      },
      "python": {
        id: "rfscVS0vtbw",
        title: "Learn Python - Full Course for Beginners [Tutorial]",
        description: "This course will give you a full introduction into all of the core concepts in Python. Follow along with the videos and you'll be a Python programmer in no time!",
        channel: "freeCodeCamp.org", 
        channelId: "UC8butISFwT-Wl7EV0hUK0BQ",
        publishedAt: "2018-07-11T16:00:00Z",
        duration: "PT4H26M51S",
        viewCount: "15847392",
        likeCount: "298456",
        tags: ["python", "programming", "tutorial", "beginners"],
        embedUrl: "https://www.youtube.com/embed/rfscVS0vtbw"
      },
      "quantum physics": {
        id: "7u_UQG1La6o",
        title: "Quantum Physics for 7 Year Olds | Dominic Walliman | TEDxEastVan",
        description: "Dominic Walliman is a physicist, and author of the book 'Quantum Theory Cannot Hurt You'. A presentation that introduces quantum physics in an accessible way.",
        channel: "TEDx Talks",
        channelId: "UCsT0YIqwnpJCM-mx7-gSA4Q",
        publishedAt: "2017-02-22T15:00:00Z",
        duration: "PT8M12S",
        viewCount: "2134567",
        likeCount: "78923",
        tags: ["quantum physics", "science", "education", "TEDx"],
        embedUrl: "https://www.youtube.com/embed/7u_UQG1La6o"
      },
      "machine learning": {
        id: "ukzFI9rgwfU",
        title: "Machine Learning Explained | Machine Learning Tutorial | Simplilearn",
        description: "This Machine Learning tutorial introduces you to machine learning and its types. You'll learn supervised, unsupervised learning, and reinforcement learning with examples.",
        channel: "Simplilearn",
        channelId: "UCsvqVGtbbyHaMoevxPAq9Fg",
        publishedAt: "2020-01-15T10:00:00Z",
        duration: "PT45M23S",
        viewCount: "987432",
        likeCount: "34521",
        tags: ["machine learning", "AI", "data science", "tutorial"],
        embedUrl: "https://www.youtube.com/embed/ukzFI9rgwfU"
      }
    };

    // Find matching video based on query keywords
    const queryLower = query.toLowerCase();
    let selectedVideo = null;
    
    for (const [key, video] of Object.entries(educationalVideos)) {
      if (queryLower.includes(key.toLowerCase())) {
        selectedVideo = video;
        break;
      }
    }

    // Check for partial matches
    if (!selectedVideo) {
      const keywords = ['math', 'science', 'program', 'code', 'biology', 'physics', 'chemistry'];
      for (const keyword of keywords) {
        if (queryLower.includes(keyword)) {
          if (keyword === 'math') selectedVideo = educationalVideos["calculus"];
          else if (keyword === 'science') selectedVideo = educationalVideos["photosynthesis"];
          else if (keyword.includes('program') || keyword.includes('code')) selectedVideo = educationalVideos["python"];
          break;
        }
      }
    }

    // Default to linear algebra if no match
    if (!selectedVideo) {
      selectedVideo = educationalVideos["linear algebra"];
    }

    return selectedVideo;
  };

  // Generate educational response that incorporates video context
  const generateEducationalResponse = async (userMessage, videoData) => {
    const responses = {
      "linear algebra": `Linear algebra is a fundamental branch of mathematics that deals with vectors, vector spaces, linear mappings, and systems of linear equations. It's essential for computer graphics, machine learning, quantum mechanics, and engineering.

Key concepts include:
• **Vectors**: Objects with magnitude and direction
• **Matrices**: Rectangular arrays of numbers representing linear transformations  
• **Eigenvalues/Eigenvectors**: Special scalars and vectors that characterize matrix behavior
• **Linear Independence**: When vectors cannot be expressed as combinations of others

The video I found provides a comprehensive 20+ hour course covering all these fundamentals with practical examples and applications. It's perfect for building a solid foundation in this crucial mathematical field.`,

      "photosynthesis": `Photosynthesis is the remarkable process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This process is vital for all life on Earth and occurs in two main stages:

**Light-Dependent Reactions (Thylakoids):**
• Chlorophyll absorbs light energy
• Water molecules are split, releasing oxygen
• Energy is captured in ATP and NADPH

**Calvin Cycle (Stroma):**
• CO₂ is fixed into organic molecules
• ATP and NADPH provide energy
• Glucose is produced as the final product

The Crash Course video explains this complex biochemical process with clear animations and easy-to-understand analogies, making it perfect for visual learners.`,

      "calculus": `Calculus is the mathematics of change and motion, consisting of two main branches:

**Differential Calculus:**
• Studies rates of change (derivatives)
• Finds slopes of curves at any point
• Applications in optimization and physics

**Integral Calculus:**
• Studies accumulation and area under curves
• Reverses the process of differentiation
• Applications in physics, engineering, and economics

**Fundamental Theorem of Calculus:**
Connects derivatives and integrals, showing they are inverse operations.

The tutorial I found focuses on limits - the foundation of calculus - with step-by-step examples that build intuition before diving into more advanced concepts.`,

      "python": `Python is a powerful, versatile programming language known for its simplicity and readability. Here's why it's perfect for beginners:

**Key Features:**
• **Simple Syntax**: Reads almost like English
• **Interpreted**: No compilation step needed
• **Dynamic Typing**: Variables don't need type declarations
• **Extensive Libraries**: Massive ecosystem for any application

**Common Applications:**
• Web development (Django, Flask)
• Data science and analytics (pandas, NumPy)
• Machine learning (TensorFlow, scikit-learn)
• Automation and scripting

The freeCodeCamp course I found is comprehensive, taking you from absolute beginner to confident programmer with hands-on projects and real-world examples.`,

      "quantum physics": `Quantum physics describes the behavior of matter and energy at the smallest scales, where classical physics breaks down. Key principles include:

**Wave-Particle Duality:**
• Particles can behave like waves and vice versa
• Depends on how we observe them

**Uncertainty Principle:**
• Cannot know both position and momentum precisely
• Fundamental limit, not measurement limitation

**Superposition:**
• Particles can exist in multiple states simultaneously
• Collapses to definite state when observed

**Quantum Entanglement:**
• Particles can be mysteriously connected across vast distances

The TEDx talk I found makes these mind-bending concepts accessible by using simple analogies and avoiding complex mathematics while maintaining scientific accuracy.`
    };

    const messageLower = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (messageLower.includes(key)) {
        return response;
      }
    }

    return `Great question! I'd be happy to help you learn about that topic. The educational video I found will provide excellent visual explanations to complement our discussion.

Feel free to ask me specific questions about any concepts you'd like me to explain further, or let me know what aspect interests you most. I can break down complex ideas into simpler parts, provide examples, or suggest related topics to explore.

Learning is most effective when it's interactive, so don't hesitate to ask follow-up questions!`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    const timestamp = new Date().toLocaleTimeString();

    // Add user message
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp
    };

    setMessages(prev => [...prev, newUserMessage]);
    
    // Add to query history
    setQueryHistory(prev => [
      { query: userMessage, timestamp, id: Date.now() },
      ...prev.slice(0, 9) // Keep last 10 queries
    ]);

    setInputValue('');

    // Simulate full MCP architecture flow
    const claudeResponse = await simulateMCPFlow(userMessage);
    
    const newClaudeMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: claudeResponse,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newClaudeMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectHistoryItem = (query) => {
    setInputValue(query);
  };

  const formatDuration = (duration) => {
    // Parse YouTube duration format (PT20H33M52S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 'N/A';
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen min-h-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Settings Panel - Modern Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                MCP Configuration & API Setup
              </h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">MCP Server URL</label>
                <input
                  type="text"
                  value={mcpServerUrl}
                  onChange={(e) => setMcpServerUrl(e.target.value)}
                  placeholder="http://localhost:3001"
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
                <h4 className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-2">
                  🔑 YouTube Data API Key Setup
                </h4>
                <div className="text-xs text-amber-700 space-y-3">
                  <p><strong>Important:</strong> API key goes in your MCP server, NOT the front-end!</p>
                  <div className="bg-gray-900 p-4 rounded-lg border">
                    <p className="font-mono text-xs text-green-400">// In your MCP server (e.g., server.js)</p>
                    <p className="font-mono text-xs text-blue-300">const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="font-semibold text-amber-800 text-xs mb-1">Steps:</p>
                      <ol className="list-decimal list-inside space-y-1 text-xs">
                        <li>Get API key from Google Cloud Console</li>
                        <li>Enable YouTube Data API v3</li>
                        <li>Set environment variable in MCP server</li>
                        <li>Never expose API key in front-end code</li>
                      </ol>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="font-semibold text-amber-800 text-xs mb-1">Security:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Server-side only</li>
                        <li>• Environment variables</li>
                        <li>• Rate limiting</li>
                        <li>• CORS protection</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800 text-sm mb-2">Architecture Flow</h4>
                <p className="text-xs text-blue-600 mb-3">
                  User → Claude → MCP Server (with API key) → YouTube Data API → Response
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                  <div className="text-gray-400">// mcp-server.js example</div>
                  <div className="text-blue-400">const</div> <span className="text-yellow-400">YOUTUBE_API_KEY</span> = process.env.<span className="text-yellow-400">YOUTUBE_API_KEY</span>;<br/><br/>
                  <div className="text-blue-400">app</div>.<span className="text-green-400">post</span>(<span className="text-orange-400">'/youtube/search'</span>, <div className="text-blue-400">async</div> (req, res) =&gt; {`{`}<br/>
                  &nbsp;&nbsp;<div className="text-blue-400">const</div> {`{ query }`} = req.body;<br/>
                  &nbsp;&nbsp;<div className="text-blue-400">const</div> <span className="text-yellow-400">response</span> = <div className="text-blue-400">await</div> <span className="text-green-400">fetch</span>(<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-400">`https://googleapis.com/youtube/v3/search?`</span> +<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-400">`key=$</span>{`{YOUTUBE_API_KEY}`}<span className="text-orange-400">&q=$</span>{`{query}`}<span className="text-orange-400">&type=video`</span><br/>
                  &nbsp;&nbsp;);<br/>
                  &nbsp;&nbsp;res.<span className="text-green-400">json</span>(<div className="text-blue-400">await</div> response.<span className="text-green-400">json</span>());<br/>
                  {`}`});
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-5">
                <h4 className="font-bold text-red-800 text-sm mb-3 flex items-center gap-2">
                  ⚠️ Claude Environment Limitations
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs text-red-700">
                  <div>
                    <p className="font-semibold mb-1">Current Restrictions:</p>
                    <ul className="space-y-1">
                      <li>• External API calls blocked by CSP</li>
                      <li>• YouTube iframes blocked</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Real Deployment:</p>
                    <ul className="space-y-1">
                      <li>• Full API functionality</li>
                      <li>• YouTube iframe embeds</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowSettings(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Close Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* First Pane - Collapsible History with Glass Effect */}
      <div className={`bg-white/80 backdrop-blur-xl border-r border-white/30 shadow-xl transition-all duration-300 flex flex-col min-h-0 ${
        isHistoryCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Uniform Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex-shrink-0">
          {!isHistoryCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <History className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Query History</h2>
                <p className="text-xs text-gray-600 mt-1">Past conversations</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
            className="p-2 hover:bg-white/50 rounded-lg transition-all duration-200 group flex-shrink-0"
          >
            {isHistoryCollapsed ? 
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" /> : 
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            }
          </button>
        </div>
        
        {!isHistoryCollapsed && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              {queryHistory.length === 0 ? (
                <div className="text-gray-600 text-sm">
                  <p className="mb-4 font-medium">No queries yet. Try exploring:</p>
                  {sampleTopics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(topic)}
                      className="block w-full text-left p-3 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl text-sm mb-2 transition-all duration-200 hover:shadow-md border border-transparent hover:border-blue-200"
                    >
                      <Sparkles className="w-3 h-3 inline mr-2" />
                      {topic}
                    </button>
                  ))}
                </div>
              ) : (
                queryHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectHistoryItem(item.query)}
                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-blue-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200/50 hover:border-blue-300/50"
                  >
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {item.query}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* MCP Flow Logs with Enhanced Design */}
            {mcpLogs.length > 0 && (
              <div className="border-t border-white/30 p-4 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-amber-700">MCP Flow Active</span>
                </div>
                <div className="space-y-2">
                  {mcpLogs.map((log, index) => (
                    <div key={index} className="text-xs p-3 bg-white/60 rounded-lg border border-amber-200/50 hover:bg-white/80 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
                          {log.step}
                        </span>
                        <span className="font-mono text-gray-700 flex-1">{log.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Second Pane - Chat Interface with Modern Design */}
      <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-sm min-h-0">
        {/* Uniform Header */}
        <div className="p-6 border-b border-white/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Educational Assistant</h2>
              <p className="text-xs text-gray-600 mt-1">Claude + MCP + YouTube Data API</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg border border-gray-300/50 flex-shrink-0"
          >
            <Settings className="w-4 h-4 inline mr-2" />
            MCP Config
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
          {messages.length === 0 ? (
            <div className="text-center text-gray-600 mt-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                Welcome to your Educational Assistant!
              </h2>
              <p className="text-lg text-gray-600 mb-4">Ask me about any topic and I'll use MCP to find relevant educational videos.</p>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-2xl shadow-lg">
                <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Architecture Flow
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-blue-700">
                  <div className="bg-white/60 p-3 rounded-xl border border-blue-200/30">
                    <div className="font-semibold mb-1">1. User Input</div>
                    <div className="text-xs">Query submitted via chat</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-blue-200/30">
                    <div className="font-semibold mb-1">2. Claude Processing</div>
                    <div className="text-xs">AI analysis & tool selection</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-blue-200/30">
                    <div className="font-semibold mb-1">3. MCP Server</div>
                    <div className="text-xs">YouTube API integration</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-blue-200/30">
                    <div className="font-semibold mb-1">4. Data Retrieval</div>
                    <div className="text-xs">Educational content found</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-blue-200/30">
                    <div className="font-semibold mb-1">5. AI Response</div>
                    <div className="text-xs">Contextual explanation</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-blue-200/30">
                    <div className="font-semibold mb-1">6. Video Display</div>
                    <div className="text-xs">Interactive learning content</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}>
                  {message.type === 'user' ? 
                    <User className="w-5 h-5 text-white" /> : 
                    <Bot className="w-5 h-5 text-white" />
                  }
                </div>
                <div className={`max-w-md lg:max-w-lg xl:max-w-xl px-5 py-4 rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400/30' 
                    : 'bg-white/90 backdrop-blur-sm text-gray-800 border-gray-200/50'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-3 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-white/30 bg-gradient-to-r from-gray-50/50 to-blue-50/50 flex-shrink-0">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about any educational topic..."
              className="flex-1 px-5 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 shadow-lg placeholder-gray-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg font-semibold"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Third Pane - YouTube Video Section with Modern Glass Effect */}
      <div className="w-96 bg-white/80 backdrop-blur-xl border-l border-white/30 shadow-xl flex flex-col min-h-0">
        {/* Uniform Header */}
        <div className="p-6 border-b border-white/30 bg-gradient-to-r from-red-500/10 to-pink-500/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Educational Video</h2>
              <p className="text-xs text-gray-600 mt-1">Via MCP → YouTube Data API</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              <p className="text-gray-700 font-semibold">MCP Flow in Progress...</p>
              <p className="text-xs text-gray-500 mt-2">Claude → MCP → YouTube API</p>
            </div>
          ) : currentVideo ? (
            <div className="p-6">
              <div className="aspect-video mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
                <div className="text-center p-6">
                  <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <p className="text-sm text-red-700 font-semibold">YouTube Embed Blocked</p>
                    <p className="text-xs text-red-600 mt-2">Claude environment blocks external iframes</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-blue-800 mb-2">Would display:</p>
                    <p className="text-xs text-blue-600 break-all font-mono bg-white/60 p-2 rounded">{currentVideo.embedUrl}</p>
                    <a 
                      href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">
                  {currentVideo.title}
                </h3>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200/50">
                    <div className="text-blue-800 font-semibold">Channel</div>
                    <div className="text-blue-600 text-xs">{currentVideo.channel}</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-xl border border-green-200/50">
                    <div className="text-green-800 font-semibold">Duration</div>
                    <div className="text-green-600 text-xs">{formatDuration(currentVideo.duration)}</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200/50">
                    <div className="text-purple-800 font-semibold">Views</div>
                    <div className="text-purple-600 text-xs">{parseInt(currentVideo.viewCount).toLocaleString()}</div>
                  </div>
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-3 rounded-xl border border-pink-200/50">
                    <div className="text-pink-800 font-semibold">Likes</div>
                    <div className="text-pink-600 text-xs">{parseInt(currentVideo.likeCount).toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200/50">
                  <h4 className="font-bold text-gray-700 text-sm mb-3">Description</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {currentVideo.description}
                  </p>
                </div>

                {currentVideo.tags && (
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200/50">
                    <h4 className="font-bold text-indigo-700 text-sm mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentVideo.tags.slice(0, 5).map((tag, index) => (
                        <span key={index} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200/50">
                  <h4 className="font-bold text-green-700 text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    MCP Success
                  </h4>
                  <p className="text-xs text-green-600 leading-relaxed">
                    ✓ User Query → Claude → MCP Server → YouTube Data API → Video Retrieved
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 mt-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Play className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">Ready for Learning</p>
              <p className="text-sm text-gray-500">Start a conversation to see the MCP flow in action</p>
              <p className="text-xs text-gray-400 mt-2">Claude will orchestrate the video search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationApp;
              