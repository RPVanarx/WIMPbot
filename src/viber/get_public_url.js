const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 4040,
  path: '/api/tunnels',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

module.exports.getPublicUrl = () => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      res.setEncoding('utf8');
      res.on('data', conf => {
        const config = JSON.parse(conf);
        const httpsTunnel = config.tunnels.filter(t => t.proto === 'https').pop();
        resolve(httpsTunnel.public_url);
      });
    });

    req.on('error', e => {
      reject(e.message);
    });

    req.end();
  });
};
