export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const upstream = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(req.body),
        });

        const data = await upstream.json();
        
        // Add some basic error logging
        if (!upstream.ok) {
            console.error('Claude API Error:', data);
        }
        
        res.status(upstream.status).json(data);
    } catch (error) {
        console.error('Claude API Handler Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
