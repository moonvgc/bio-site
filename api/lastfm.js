const https = require('https');

const LASTFM_API_KEY = process.env.LASTFM_API_KEY || 'c655566b274847327add0461c30c215f';
const LASTFM_USER = process.env.LASTFM_USER || 'moonvgc';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const url = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + LASTFM_USER + '&api_key=' + LASTFM_API_KEY + '&format=json&limit=15';
        const data = await new Promise((resolve, reject) => {
            https.get(url, (resp) => {
                let body = '';
                resp.on('data', chunk => body += chunk);
                resp.on('end', () => resolve(JSON.parse(body)));
            }).on('error', reject);
        });
        res.status(200).json(data);
    } catch {
        res.status(200).json({ error: 'Failed to fetch Last.fm' });
    }
};
