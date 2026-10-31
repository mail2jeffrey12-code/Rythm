// RHYTHM service worker: makes the app work offline once it has loaded once
const CACHE = "rhythm-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./"])).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const hit = await cache.match(e.request);
      const net = fetch(e.request).then(r => { if (r && (r.ok || r.type === "opaque")) cache.put(e.request, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })
  );
});
