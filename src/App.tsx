import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, History, Play, User, Bot, Clock, Sparkles } from 'lucide-react';

interface Message {
    id: number;
    type: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface QueryHistoryItem {
    id: number;
    query: string;
    timestamp: string;
}

interface VideoData {
    id: string;
    title: string;
    description: string;
    channel: string;
    duration: string;
    viewCount: string;
    likeCount: string;
    tags: string[];
    embedUrl: string;
}

// Add TypeScript interfaces for API responses
interface YouTubeSearchItem {
    id: {
        videoId: string;
    };
    snippet: {
        title: string;
        description: string;
        channelTitle: string;
        tags?: string[];
    };
}

interface YouTubeVideoDetails {
    id: string;
    snippet: {
        title: string;
        description: string;
        channelTitle: string;
        tags?: string[];
    };
    contentDetails: {
        duration: string;
    };
    statistics: {
        viewCount?: string;
        likeCount?: string;
    };
}

interface YouTubeSearchResponse {
    items: YouTubeSearchItem[];
}

interface YouTubeDetailsResponse {
    items: YouTubeVideoDetails[];
}

const EducationApp = () => {
    const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
    const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rightPaneWidth, setRightPaneWidth] = useState(384);
    const [isResizing, setIsResizing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const sampleTopics = [
        "linear algebra basics",
        "photosynthesis process",
        "calculus derivatives",
        "python programming fundamentals",
        "quantum physics introduction"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            const containerWidth = window.innerWidth - (isHistoryCollapsed ? 64 : 320);
            const newWidth = containerWidth - e.clientX + (isHistoryCollapsed ? 64 : 320);
            const constrainedWidth = Math.max(300, Math.min(600, newWidth));
            setRightPaneWidth(constrainedWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, isHistoryCollapsed]);

    // Anthropic API / Claude Integration with enhanced video search terms
    const callClaudeAPI = async (userMessage: string): Promise<{ response: string; isEducational: boolean }> => {
        const response = await fetch('/api/claude', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1500,
                messages: [{
                    role: 'user',
                    content: `First, determine if this query is educational in nature (related to learning, academics, science, math, history, etc.): "${userMessage}"
                
                If it IS educational:
                - Provide a helpful explanation
                - Suggest 3-4 VERY SPECIFIC search terms that would find videos directly related to this exact topic
                - Make search terms precise and detailed, not generic
                - Focus on the specific concept, process, or subject matter asked about
                - Format as: EDUCATIONAL: YES
                             EXPLANATION: [your explanation]
                             SEARCH_TERMS: [specific term1, detailed term2, precise term3, exact topic term4]
                
                Examples of good search terms:
                - For "What are diseases?": ["what are diseases", "disease definition types", "how diseases develop", "infectious vs chronic diseases"]
                - For "How does photosynthesis work?": ["photosynthesis process steps", "light dependent reactions", "calvin cycle photosynthesis", "chloroplast photosynthesis"]
                - For "What is calculus?": ["calculus introduction basics", "derivatives and integrals", "what is calculus used for", "calculus concepts explained"]
                
                If it is NOT educational (like shopping, entertainment, personal questions, etc.):
                - Politely redirect to educational topics
                - Format as: EDUCATIONAL: NO
                             EXPLANATION: I'm designed to help with educational topics like math, science, history, and academic subjects. Could you ask me about something you'd like to learn? For example, you could ask about algebra, physics, world history, or any other educational topic.`
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.content[0].text;

        // Check if the query was determined to be educational
        const isEducational = responseText.includes('EDUCATIONAL: YES');

        return {
            response: responseText,
            isEducational
        };
    };

    // Enhanced YouTube integration with relevance validation
    const searchYouTubeVideos = async (searchTerms: string[], originalQuery: string): Promise<VideoData | null> => {
        console.log('Searching for videos with terms:', searchTerms);

        for (const term of searchTerms) {
            try {
                const response = await fetch('/api/youtube', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ term })
                });

                if (!response.ok) {
                    throw new Error(`YouTube API error: ${response.status}`);
                }

                const data: YouTubeSearchResponse = await response.json();

                if (data.items && data.items.length > 0) {
                    // Get video details for all results to validate relevance
                    const videoIds = data.items.map((item: YouTubeSearchItem) => item.id.videoId).join(',');

                    const detailsResponse = await fetch('/api/youtube', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ids: videoIds })
                    });

                    if (!detailsResponse.ok) {
                        continue; // Try next search term
                    }

                    const detailsData: YouTubeDetailsResponse = await detailsResponse.json();

                    if (detailsData.items && detailsData.items.length > 0) {
                        // Validate video relevance before returning
                        const relevantVideo = validateVideoRelevance(detailsData.items, originalQuery, term);

                        if (relevantVideo) {
                            console.log('Found relevant video:', relevantVideo.snippet.title);
                            return {
                                id: relevantVideo.id,
                                title: relevantVideo.snippet.title,
                                description: relevantVideo.snippet.description || 'No description available',
                                channel: relevantVideo.snippet.channelTitle,
                                duration: relevantVideo.contentDetails.duration,
                                viewCount: relevantVideo.statistics.viewCount || '0',
                                likeCount: relevantVideo.statistics.likeCount || '0',
                                tags: relevantVideo.snippet.tags || [],
                                embedUrl: `https://www.youtube.com/embed/${relevantVideo.id}`
                            };
                        } else {
                            console.log('No relevant videos found for term:', term);
                        }
                    }
                }
            } catch (error) {
                console.warn(`Failed to search for "${term}":`, error);
                continue;
            }
        }
        return null;
    };

    // Video relevance validation function
    const validateVideoRelevance = (videos: YouTubeVideoDetails[], originalQuery: string, searchTerm: string): YouTubeVideoDetails | null => {
        const queryKeywords = extractKeywords(originalQuery.toLowerCase());
        const searchKeywords = extractKeywords(searchTerm.toLowerCase());

        let bestMatch: { video: YouTubeVideoDetails; score: number } | null = null;

        for (const video of videos) {
            const title = video.snippet.title.toLowerCase();
            const description = (video.snippet.description || '').toLowerCase();
            const tags = (video.snippet.tags || []).join(' ').toLowerCase();

            // Calculate relevance score
            let score = 0;

            // Check for query keywords in video content
            queryKeywords.forEach(keyword => {
                if (title.includes(keyword)) score += 10; // Title matches are most important
                if (description.includes(keyword)) score += 5;
                if (tags.includes(keyword)) score += 3;
            });

            // Check for search term keywords
            searchKeywords.forEach(keyword => {
                if (title.includes(keyword)) score += 7;
                if (description.includes(keyword)) score += 3;
                if (tags.includes(keyword)) score += 2;
            });

            // Bonus for Khan Academy educational indicators
            const educationalIndicators = ['basics', 'introduction', 'explained', 'what is', 'how to', 'tutorial', 'lesson'];
            educationalIndicators.forEach(indicator => {
                if (title.includes(indicator)) score += 2;
            });

            // Penalty for irrelevant content
            const irrelevantTerms = ['advanced', 'graduate level', 'research', 'case study'];
            irrelevantTerms.forEach(term => {
                if (title.includes(term)) score -= 3;
            });

            console.log(`Video: "${video.snippet.title}" - Score: ${score}`);

            if (score > 5 && (!bestMatch || score > bestMatch.score)) {
                bestMatch = { video, score };
            }
        }

        // Return best match if it meets minimum threshold
        return bestMatch && bestMatch.score >= 8 ? bestMatch.video : null;
    };

    // Extract meaningful keywords from text
    const extractKeywords = (text: string): string[] => {
        const stopWords = ['what', 'is', 'are', 'how', 'does', 'do', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
        return text
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.includes(word))
            .slice(0, 8); // Limit to most relevant keywords
    };

    // message handler
    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue.trim();
        const timestamp = new Date().toLocaleTimeString();

        const newUserMessage: Message = {
            id: Date.now(),
            type: 'user',
            content: userMessage,
            timestamp
        };

        setMessages(prev => [...prev, newUserMessage]);
        setQueryHistory(prev => [
            { query: userMessage, timestamp, id: Date.now() },
            ...prev.slice(0, 9)
        ]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Call Claude API with education filtering
            const { response: claudeResponse, isEducational } = await callClaudeAPI(userMessage);

            let videoData: VideoData | null = null;
            let finalMessage = '';

            if (isEducational) {
                // Extract search terms and search for videos
                const searchTermsMatch = claudeResponse.match(/SEARCH_TERMS:\s*\[(.*?)\]/);
                const searchTerms = searchTermsMatch
                    ? searchTermsMatch[1].split(',').map((term: string) => term.trim().replace(/['"]/g, ''))
                    : [userMessage.toLowerCase()];

                console.log('Original query:', userMessage);
                console.log('Search terms:', searchTerms);

                // Search YouTube for educational videos with relevance validation
                videoData = await searchYouTubeVideos(searchTerms, userMessage);

                // Clean up the explanation
                const explanation = claudeResponse
                    .split('SEARCH_TERMS:')[0]
                    .replace('EDUCATIONAL: YES', '')
                    .replace('EXPLANATION:', '')
                    .trim();

                if (videoData) {
                    finalMessage = explanation + '\n\n🎥 I found a relevant Khan Academy video that matches your question!';
                    setCurrentVideo(videoData);
                } else {
                    finalMessage = explanation + '\n\n📚 I couldn\'t find a Khan Academy video that specifically matches your question, but the explanation above should help! You might try rephrasing your question or asking about a more specific aspect of the topic.';
                    setCurrentVideo(null);
                }
            } else {
                // Non-educational query - show redirect message
                const explanation = claudeResponse
                    .split('EDUCATIONAL: NO')[1]
                    .replace('EXPLANATION:', '')
                    .trim();

                finalMessage = explanation;
                setCurrentVideo(null);
            }

            const newClaudeMessage: Message = {
                id: Date.now() + 1,
                type: 'assistant',
                content: finalMessage,
                timestamp: new Date().toLocaleTimeString()
            };

            setMessages(prev => [...prev, newClaudeMessage]);
        } catch (error) {
            console.error('API Error:', error);

            const errorMessage: Message = {
                id: Date.now() + 1,
                type: 'assistant',
                content: `Unfortunately, I'm unable to process your request: "${userMessage}". Please try again, or inquire about a different educational subject.`,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, errorMessage]);
            setCurrentVideo(null);
        } finally {
            setIsLoading(false);
        }
    };

    // key response handler
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatDuration = (duration: string): string => {
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
            {/* History Pane */}
            <div className={`bg-white/80 backdrop-blur-xl border-r border-white/30 shadow-xl transition-all duration-300 flex flex-col min-h-0 ${isHistoryCollapsed ? 'w-16' : 'w-80'}`}>
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
                                    onClick={() => setInputValue(item.query)}
                                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-blue-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
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
                )}
            </div>

            {/* Chat Pane */}
            <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-sm min-h-0" style={{ marginRight: `${rightPaneWidth}px` }}>
                <div className="p-6 border-b border-white/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800">Educational Assistant</h2>
                            <p className="text-xs text-gray-600 mt-1">Model: claude-3-haiku-20240307</p>
                        </div>
                    </div>
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
                            <p className="text-lg text-gray-600 mb-8">Ask me about any school-age academic topic, and I'll try to find relevant educational videos from <b>Khan Academy's</b> YouTube channel.</p>

                            {/* Usage Guide and Sample Prompts */}
                            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-5 shadow-lg max-w-4xl mx-auto">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-bold text-blue-800 text-sm">How to Use This Educational Assistant</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-semibold text-blue-700 mb-2">✨ What I Do:</h4>
                                            <ul className="space-y-1 text-blue-600 text-xs">
                                                <li>• Provide educational explanations</li>
                                                <li>• Find Khan Academy videos</li>
                                                <li>• Focus on academic learning</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-blue-700 mb-2">💡 Best Practices:</h4>
                                            <ul className="space-y-1 text-blue-600 text-xs">
                                                <li>• Ask specific learning questions</li>
                                                <li>• Use educational keywords</li>
                                                <li>• Mention subjects or topics</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-blue-700 mb-2">🎯 Try These Sample Prompts:</h4>
                                        <div className="space-y-2">
                                            {[
                                                "Explain how photosynthesis works",
                                                "What is the Pythagorean theorem?",
                                                "How do derivatives work in calculus?",
                                                "What is machine learning?"
                                            ].map((prompt, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setInputValue(prompt)}
                                                    className="block w-full text-left px-3 py-2 bg-white/60 hover:bg-white/90 border border-blue-200/50 hover:border-blue-300 rounded-lg text-xs text-blue-700 hover:text-blue-800 transition-all duration-200 hover:shadow-md"
                                                >
                                                    "{prompt}"
                                                </button>
                                            ))}
                                        </div>
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
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${message.type === 'user'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                                    }`}>
                                    {message.type === 'user' ?
                                        <User className="w-5 h-5 text-white" /> :
                                        <Bot className="w-5 h-5 text-white" />
                                    }
                                </div>
                                <div className={`max-w-md lg:max-w-lg xl:max-w-xl px-5 py-4 rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl ${message.type === 'user'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400/30'
                                    : 'bg-white/90 backdrop-blur-sm text-gray-800 border-gray-200/50'
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                    <p className={`text-xs mt-3 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
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
                            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
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

            {/* Vertical Resizer */}
            <div
                className={`w-1 bg-gradient-to-b from-gray-300 to-gray-400 hover:bg-gradient-to-b hover:from-blue-400 hover:to-purple-500 cursor-col-resize transition-all duration-200 relative group ${isResizing ? 'bg-gradient-to-b from-blue-500 to-purple-600' : ''}`}
                onMouseDown={handleMouseDown}
                style={{
                    position: 'fixed',
                    right: `${rightPaneWidth}px`,
                    top: 0,
                    bottom: 0,
                    zIndex: 30
                }}
            >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex flex-col gap-0.5">
                        <div className="w-0.5 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-0.5 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Video Pane */}
            <div
                className="bg-white/80 backdrop-blur-xl border-l border-white/30 shadow-xl flex flex-col min-h-0 fixed top-0 bottom-0 right-0"
                style={{ width: `${rightPaneWidth}px` }}
            >
                <div className="p-6 border-b border-white/30 bg-gradient-to-r from-red-500/10 to-pink-500/10 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800">Educational Video</h2>
                            <p className="text-xs text-gray-600 mt-1">via YouTube Data API v3</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0">
                    {isLoading ? (
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                            <p className="text-gray-700 font-semibold">Finding educational video from Khan Academy's YouTube channel...</p>
                        </div>
                    ) : currentVideo ? (
                        <div className="p-6">
                            <div className="aspect-video mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={currentVideo.embedUrl}
                                    title={currentVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="rounded-2xl"
                                ></iframe>
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

                                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200/50">
                                    <h4 className="font-bold text-indigo-700 text-sm mb-3">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {currentVideo.tags.slice(0, 4).map((tag, index) => (
                                            <span key={index} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <a
                                    href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-center"
                                >
                                    Watch on YouTube
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500 mt-12">
                            <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Play className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-lg font-semibold text-gray-700 mb-2">Ready for Educational Content</p>
                            <p className="text-sm text-gray-500 mb-4">Ask me about academic topics to see Khan Academy videos</p>

                            {/* Show helpful suggestions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                                <h4 className="font-semibold text-blue-800 mb-2">Try asking about:</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-blue-600">• Mathematics</div>
                                    <div className="text-blue-600">• Science</div>
                                    <div className="text-blue-600">• History</div>
                                    <div className="text-blue-600">• Economics</div>
                                    <div className="text-blue-600">• Computer Science</div>
                                    <div className="text-blue-600">• Test Prep</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EducationApp;