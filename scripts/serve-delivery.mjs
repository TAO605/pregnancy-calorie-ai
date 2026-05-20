import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.join(repoRoot, "delivery");
const port = Number(process.env.PORT || 4173);

const envFile = path.join(repoRoot, ".env.production");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equals = trimmed.indexOf("=");
    if (equals < 0) continue;
    const key = trimmed.slice(0, equals).trim();
    const value = trimmed.slice(equals + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

const allFeaturesFree = process.env.NEXT_PUBLIC_ALL_FEATURES_FREE === "true";

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
  const pathname = new URL(req.url || "/", "http://127.0.0.1").pathname;
  const paidRoute = pathname.match(/^\/(?:(es|fr|de|pt|it|ru|ar|ja|ko)\/)?(?:pricing|premium)(?:\/|\.html)?$/i);
  if (allFeaturesFree && paidRoute) {
    res.writeHead(301, { Location: paidRoute[1] ? `/${paidRoute[1]}/` : "/" });
    res.end();
    return;
  }

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

server.on("error", (error) => {
  if (error && error.code === "EADDRINUSE") {
    console.log(`delivery static server already available at http://127.0.0.1:${port}`);
    setInterval(() => {}, 60_000);
    return;
  }
  throw error;
});

server.listen(port, "127.0.0.1", () => {
  console.log(`delivery static server ready at http://127.0.0.1:${port}`);
});
