import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 7070;
const DIR = '.';

const server = http.createServer((req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');

  let filePath = path.join(DIR, req.url === '/' ? 'index.html' : req.url);
  
  if (req.url.endsWith('.wasm')) {
    res.setHeader('Content-Type', 'application/wasm');
  } else if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'text/javascript');
  } else if (req.url.endsWith('.html')) {
    res.setHeader('Content-Type', 'text/html');
  } else if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Serving ${DIR} on http://localhost:${PORT}`);
});
