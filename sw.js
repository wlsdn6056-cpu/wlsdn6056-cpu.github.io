/* PlayBall AI 오프라인 지원: 앱 화면·AI 모델·라이브러리를 처음 한 번 저장해 두고, 이후엔 인터넷 없이도 분석 */
const VERSION = "playball-v1.0.0";
const CORE = [
  "./", "index.html", "manifest.json", "privacy.html",
  "lib/tf-core.min.js", "lib/tf-converter.min.js", "lib/tf-backend-webgl.min.js", "lib/jspdf.umd.min.js",
  "model/model.json", "model/w1.wasm", "model/w2.wasm", "model/w3.wasm",
  "icons/icon-192.png", "icons/icon-512.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  /* 화면(HTML)은 인터넷 우선 → 업데이트가 바로 반영, 안 되면 저장본 */
  if (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/")) {
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
    return;
  }
  /* 모델·라이브러리·글꼴은 저장본 우선 */
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === "opaque") { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); }
    return r;
  })));
});
