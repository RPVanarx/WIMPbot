const pino = require('pino');

const level = process.env.NODE_ENV === 'test' ? 'silent' : 'trace';

module.exports = (name = '', conf = { base: null }) => {
  let ns = name;
  if (ns) {
    ns = name.split('/src');
  }
  const options = Object.assign({}, conf, {
    name: ns[1],
    level,
  });
  const log = pino(options);
  return log;
};
