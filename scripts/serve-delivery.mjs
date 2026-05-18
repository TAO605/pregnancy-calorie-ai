import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.join(repoRoot, "delivery");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function resolveRequestPath(requestUrl) {
  let pathname = decodeURIComponent(new URL(requestUrl, "http://127.0.0.1").pathname);
  if (pathname === "/") pathname = "/index.html";
  let candidate = path.normalize(path.join(root, pathname));
  if (!candidate.startsWith(root)) return null;

  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    candidate = path.join(candidate, "index.html");
  }

  if (!fs.existsSync(candidate) && !path.extname(candidate)) {
    const htmlCandidate = path.join(root, `${pathname}.html`);
    if (htmlCandidate.startsWith(root)) candidate = htmlCandidate;
  }

  return candidate;
}

const server = http.createServer((req, res) => {
  const file = resolveRequestPath(req.url || "/");
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(error.message);
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`delivery static server ready at http://127.0.0.1:${port}`);
});
