// Local dev server: serves public/ statically and /view through api/view.js,
// mirroring the rewrites in vercel.json.
const http = require('http');
const fs = require('fs');
const path = require('path');
const view = require('./api/view');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
};

function staticFile(pathname) {
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.join(PUBLIC_DIR, path.normalize(decodeURIComponent(pathname)));
  if (!file.startsWith(PUBLIC_DIR + path.sep)) return null;
  return fs.statSync(file, { throwIfNoEntry: false })?.isFile() ? file : null;
}

http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (pathname === '/view') return view(req, res);
  const file = staticFile(pathname);
  if (!file) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  res.setHeader('Content-Type', CONTENT_TYPES[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
