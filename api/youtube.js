// api/youtube.js  (Vercel function)
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const { term, ids } = req.body;   // accept either field

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
        // search request
        const params = new URLSearchParams({
            key: process.env.YOUTUBE_API_KEY,
            q: `${term} tutorial education`,
            type: 'video',
            part: 'snippet',
            maxResults: '3',
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

    const ytRes = await fetch(url);
    const data = await ytRes.json();
    res.status(ytRes.status).json(data);
}
