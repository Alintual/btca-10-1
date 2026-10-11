const CACHE_VERSION = "btca10-web-10.1.40";
const APP_CACHE = `${CACHE_VERSION}:app`;
const RUNTIME_CACHE = `${CACHE_VERSION}:runtime`;
const BASE_PATH = "/btca-10-1";
const SW_PATH = BASE_PATH + "/sw.js";
const SHELL_PATHS = new Set([
  BASE_PATH + "/install-ios.js",
  BASE_PATH + "/manifest.webmanifest",
  SW_PATH,
]);

const CORE_ASSETS = [
  "/btca-10-1/",
  "/btca-10-1/index.html",
  "/btca-10-1/manifest.webmanifest",
  "/btca-10-1/apple-touch-icon.png",
  "/btca-10-1/favicon.ico",
  "/btca-10-1/favicon.png",
  "/btca-10-1/branding/favicon.png",
  "/btca-10-1/icons/apple-touch-icon.png",
  "/btca-10-1/icons/icon-192.png",
  "/btca-10-1/icons/icon-512.png",
  "/btca-10-1/offline/app-shell.json",
  "/btca-10-1/install-ios.js"
];

function matchShell(request) {
  const url = typeof request === "string" ? request : request.url;
  return caches.match(request).then(function (hit) {
    if (hit) return hit;
    return caches.match(BASE_PATH + "/").then(function (shell) {
      if (shell) return shell;
      return caches.match(BASE_PATH + "/index.html");
    });
  });
}

function offlineFallback(request) {
  const accept = (request.headers && request.headers.get("accept")) || "";
  if (request.mode === "navigate" || accept.indexOf("text/html") !== -1) {
    return matchShell(request).then(function (page) {
      if (page) return page;
      return new Response(
        "<!doctype html><meta charset=utf-8><title>BTCA-iOS 10.1</title>" +
          "<body style='font-family:system-ui;background:#1a4854;color:#fff;padding:2rem'>" +
          "<h1>BTCA-iOS 10.1</h1><p>Нет сети и offline-кэш ещё не готов. Откройте загрузочную в Safari, войдите и загрузите пакет.</p></body>",
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    });
  }
  return Promise.resolve(
    new Response("", {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  );
}

function safeFetch(request) {
  try {
    return fetch(new Request(request, { cache: "no-store", credentials: "same-origin" }));
  } catch (_err) {
    return fetch(request, { credentials: "same-origin" });
  }
}

function putInCache(cacheName, request, response) {
  try {
    if (!response || response.status !== 200 || response.type === "opaque") return;
    const copy = response.clone();
    caches
      .open(cacheName)
      .then((cache) => cache.put(request, copy).catch(function () {}))
      .catch(function () {});
  } catch (_err) {}
}

function networkFirst(request, cacheName) {
  // Safari: fetch через SW может «зависнуть» навсегда → страница не перезагружается.
  // Всегда ограничиваем ожидание сети и гарантируем resolve.
  return new Promise(function (resolve) {
    var settled = false;
    function finish(response) {
      if (settled) return;
      settled = true;
      resolve(response);
    }
    var timer = setTimeout(function () {
      matchShell(request).then(function (cached) {
        if (cached) finish(cached);
        else offlineFallback(request).then(finish);
      });
    }, 2800);
    var isHtmlNav =
      request.mode === "navigate" ||
      ((request.headers && request.headers.get("accept")) || "").indexOf("text/html") !== -1;
    safeFetch(request)
      .then(function (response) {
        if (response && response.ok) {
          clearTimeout(timer);
          putInCache(cacheName, request, response);
          finish(response);
          return;
        }
        return matchShell(request).then(function (cached) {
          clearTimeout(timer);
          if (cached) {
            finish(cached);
            return;
          }
          // Никогда не отдаём 404/401 HTML в лицо пользователю после сброса кэша.
          if (isHtmlNav) {
            offlineFallback(request).then(finish);
            return;
          }
          finish(response || new Response("", { status: 503 }));
        });
      })
      .catch(function () {
        matchShell(request).then(function (cached) {
          clearTimeout(timer);
          if (cached) finish(cached);
          else offlineFallback(request).then(finish);
        });
      });
  });
}

function shouldKeepCache(key) {
  if (key.startsWith(CACHE_VERSION)) return true;
  // Offline media/shell из прошлой сборки нельзя сносить — иначе ярлык PWA умирает.
  if (/:static-media$/.test(key)) return true;
  if (/:static-install$/.test(key)) return true;
  return false;
}

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    event.waitUntil(self.skipWaiting());
  }
});

self.addEventListener("install", function () {
  // Без precache: на iPad waitUntil(addAll/fetch) вешает установку SW и загрузочную.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Не вызываем clients.claim() здесь: иначе Safari-вкладка загрузочной
  // внезапно перехватывается SW и «перестаёт перезагружаться».
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => !shouldKeepCache(key))
          .map((key) => caches.delete(key))
      ))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.headers && event.request.headers.get("range")) return;
  var requestUrl;
  try {
    requestUrl = new URL(event.request.url);
  } catch (_err) {
    return;
  }
  if (requestUrl.origin !== self.location.origin) return;
  if (!requestUrl.pathname.startsWith(BASE_PATH + "/") && requestUrl.pathname !== BASE_PATH) return;

  var path = requestUrl.pathname;
  var isNavigate = event.request.mode === "navigate";
  var accept = (event.request.headers && event.request.headers.get("accept")) || "";
  var isHtml = accept.indexOf("text/html") !== -1;
  var isDocument =
    isNavigate ||
    isHtml ||
    path === BASE_PATH ||
    path === BASE_PATH + "/" ||
    path.endsWith("/index.html");

  // Документ/HTML никогда не через SW — иначе Safari на iPad «роняет» загрузочную.
  if (isDocument) return;

  // iPad: cacheFirst без таймаута вешает вкладку. Перехватываем только offline-медиа.
  if (path.indexOf(BASE_PATH + "/offline/") !== 0) return;

  event.respondWith(networkFirst(event.request, RUNTIME_CACHE));
});
