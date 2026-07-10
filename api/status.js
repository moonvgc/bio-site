const https = require('https');

const USER_ID = '1494187385058099210';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const data = await new Promise((resolve, reject) => {
            https.get('https://api.lanyard.rest/v1/users/' + USER_ID, (resp) => {
                let body = '';
                resp.on('data', chunk => body += chunk);
                resp.on('end', () => resolve(JSON.parse(body)));
            }).on('error', reject);
        });

        if (data.success && data.data) {
            res.status(200).json(data.data);
        } else {
            res.status(200).json({ discord_status: 'offline', activities: [] });
        }
    } catch {
        res.status(200).json({ discord_status: 'offline', activities: [] });
    }
};
