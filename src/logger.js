const pino = require('pino');

module.exports = (name = '', conf = { base: null }) => {
  let ns = name;
  if (ns) {
    ns = name.split('/src');
  }
  const options = Object.assign({}, conf, {
    name: ns[1],
    level: 'trace',
  });
  const log = pino(options);
  return log;
};
