const https = require('https');

const LASTFM_API_KEY = process.env.LASTFM_API_KEY || 'c655566b274847327add0461c30c215f';
const LASTFM_USER = process.env.LASTFM_USER || 'moonvgc';

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            let body = '';
            resp.on('data', chunk => body += chunk);
            resp.on('end', () => resolve(JSON.parse(body)));
        }).on('error', reject);
    });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const base = 'https://ws.audioscrobbler.com/2.0/?format=json&user=' + LASTFM_USER + '&api_key=' + LASTFM_API_KEY;

        const [userData, artistData, trackData] = await Promise.all([
            fetchUrl(base + '&method=user.getinfo'),
            fetchUrl(base + '&method=user.gettopartists&limit=5'),
            fetchUrl(base + '&method=user.gettoptracks&limit=5'),
        ]);

        res.status(200).json({
            playcount: userData?.user?.playcount || null,
            topArtists: (artistData?.topartists?.artist || []).map(a => ({
                name: a.name,
                playcount: a.playcount,
                url: a.url,
            })),
            topTracks: (trackData?.toptracks?.track || []).map(t => ({
                name: t.name,
                artist: t.artist?.name || '',
                playcount: t.playcount,
                url: t.url,
            })),
        });
    } catch {
        res.status(200).json({ playcount: null, topArtists: [], topTracks: [] });
    }
};
