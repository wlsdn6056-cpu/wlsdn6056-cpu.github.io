// 야구 기록지는 https://dragons-baseball.github.io/ 로 옮겼어요. 예전 저장본을 지우고 스스로 해제합니다.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('scorebook-')).map(k => caches.delete(k))))
    .then(() => self.registration.unregister()));
});
