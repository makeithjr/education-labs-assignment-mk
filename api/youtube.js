// api/youtube.js  (Vercel function)
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const { term, ids } = req.body;

    let url;

    if (ids) {
        // details request
        const params = new URLSearchParams({
            key: process.env.YOUTUBE_API_KEY,
            id: ids,
            part: 'snippet,contentDetails,statistics',
        });
        url = `https://www.googleapis.com/youtube/v3/videos?${params}`;
    } else if (term) {
        // search request - Enhanced with Khan Academy focus
        const params = new URLSearchParams({
            key: process.env.YOUTUBE_API_KEY,
            q: `${term} tutorial education Khan Academy`, // Added "Khan Academy" to improve relevance
            type: 'video',
            part: 'snippet',
            maxResults: '5', // Increased from 3 to have better options
            order: 'relevance',
            videoDuration: 'medium',
            videoDefinition: 'high',
            safeSearch: 'strict',
            channelId: 'UC4a-Gbdw7vOaccHmFo40b9g', // Khan Academy
        });
        url = `https://www.googleapis.com/youtube/v3/search?${params}`;
    } else {
        return res.status(400).json({ error: 'term or ids is required' });
    }

    try {
        const ytRes = await fetch(url);
        const data = await ytRes.json();
        
        // Add error logging for debugging
        if (!ytRes.ok) {
            console.error('YouTube API Error:', data);
        }
        
        res.status(ytRes.status).json(data);
    } catch (error) {
        console.error('YouTube API Handler Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
