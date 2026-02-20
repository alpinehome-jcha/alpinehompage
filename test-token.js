
const https = require('https');

const token = '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';
const updatedToken = token.trim();

const options = {
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    headers: {
        'Authorization': `token ${updatedToken}`,
        'User-Agent': 'Node.js Check'
    }
};

console.log(`Testing Token: ${updatedToken.substring(0, 5)}...`);

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode === 200) {
            const user = JSON.parse(data);
            console.log(`SUCCESS: Authenticated as ${user.login}`);
        } else {
            console.log(`FAILURE: ${data}`);
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
