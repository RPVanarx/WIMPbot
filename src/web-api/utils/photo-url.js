const path = require('path');

function urlToId(href) {
  const url = new URL(href);
  return path.basename(url.pathname);
}

function idToUrl(id, endpointHref) {
  const url = new URL(endpointHref);
  url.pathname = path.join(url.pathname, id.toString());
  return url.href;
}

module.exports = {
  urlToId,
  idToUrl,
};
