(function () {
  "use strict";

  var BTCA_BASE = "/btca-10-1/";
  var INSTALL_CACHE = "btca10-web-10.1.164:static-install";
  var MEDIA_CACHE = "btca10-web-10.1.164:static-media";
  var MEDIA_PROBE_RE = /offline-unpacked\/level3\/exercises\/.+\.(jpe?g|png|webp|gif)$/i;
  var MEDIA_STATE_KEY = "btca10-web:static-media-state";
  var APP_READY_KEY = "btca10-web:app-ready";
  var INSTALL_SESSION_KEY = "btca10-web:install-session";
  var OFFLINE_PREP_SESSION_KEY = "btca10-web:offline-prep-active";
  var META_RELOAD_SESSION_KEY = "btca10-web:meta-reload";
  var APPLIED_SHELL_KEY = "btca10-web:applied-shell";
  var CACHE_NAME_PREFIX = "btca10-web-";
  var offlinePreparationActive = false;
  var IOS_TYPO_BASE_PX = 17;
  var IOS_TYPO_PHONE_BODY_PX = 17;
  var IOS_TYPO_IPHONE_MIN = 390;
  // Reference tablet short side (744 CSS px = 1488 design grid @2x).
  var IOS_TYPO_TABLET_REF = 744;
  var IOS_TYPO_TABLET_BODY_PX = 21;
  var IMAGE_RE = /\.(jpe?g|png|gif|webp|bmp|avif)$/i;
  var OFFLINE_PREPARE_URL = "/btca-10-1/";
  var ABOUT_HEADING = "Проект BTCA-mobile v.10.1";
  var ABOUT_MAIN_TEXT =
    "Приложения проекта разработаны для локальной установки на мобильных устройствах, типа смартфон или планшет с операционными системами Android или iOS/iPadOS и рассчитаны для обучения и тренировки учеников по Системе тренировок БТКА с уровнем подготовки «Уровень 3 — Продвинутый» (Комплект 2 комплекса БТКА).";
  var ABOUT_POST_TEXT =
    "*****\n" +
    "БТКА (Бильярдный Тренировочный Комплекс Абриколь) — это учебно-тренировочный программный комплекс, предназначенный для комплексного обучения игре на русском бильярде, выработки и закрепления практических навыков ведения бильярдной игры в Пирамиду, как самостоятельно, так и с тренером, с применением современных методик и технологий.\n" +
    "Тренировочный комплекс БТКА в сочетании с уникальной Методологией обучения составляют общую Систему тренировок БТКА школы русского бильярда «Абриколь» г. Красноярск.\n" +
    "<a href=\"https://cloud.mail.ru/public/sujN/mpE8mr6aW\">Методика обучения</a> (pdf).\n" +
    "\n*****\n" +
    "В состав проекта входят два Приложения — BTCA-Android 10.1 (дистрибутив .apk) и BTCA-iOS 10.1 (пакет оффлайн PWA).\n" +
    "Приложения устанавливаются через web-страницу <a href=\"https://clc.li/btca-10-1\">Загрузчик БТКА 10.1</a> при условии регистрации персонального аккаунта и активации подписки.\n" +
    "Для регистрации аккаунта требуется:\n" +
    "1. Логин.\n" +
    "2. Пароль.\n" +
    "3.  E-mail – по желанию.\n" +
    "Стандартные условия подписки:\n" +
    "•  Срок — от 1 года.\n" +
    "•  Количество устройств — 6.\n" +
    "•  Стоимость — по согласованию.\n" +
    "\n*** Служба поддержки проекта — <a href=\"mailto:interual@gmail.com\">interual@gmail.com</a>.\n" +
    "\nСсылки для загрузки и установки Приложений являются персональными и привязываются к аккаунту и конкретному устройству!\n" +
    "Для работы Приложений требуется сеть Интернет (режим онлайн) ТОЛЬКО при загрузке, установке/переустановке, после перезапуска Приложений. В режиме работы с Интернет происходит верификация: аккаунта, самого устройства и активность подписки. Во всех других случаях, Приложения полностью функциональны в режиме работы оффлайн.\n" +
    "*** Режимы работы онлайн/оффлайн переключаются автоматически.\n" +
    "\nКаждое Приложение:\n" +
    "•  Содержит специфический (соответствующий уровню подготовки) набор упражнений, задач и тестов (в графическом виде), ранжированных по принципу - \"от простого к сложному\", и сгруппированных в тематические разделы по видам тренировок;\n" +
    "•  Включает необходимые инструкции, методическую и справочную информацию;\n" +
    "•  Обеспечивает возможность ввода, хранения и обработки результатов прогресса выполнения учеником практических заданий для последующего статистического анализа с использованием локальной Базы данных;\n" +
    "•  Имеет весь необходимый функционал и автоматизацию, а также интуитивно-понятный интерфейс, что способствует осуществлению полноценного, эффективного тренировочного процесса в комфортных условиях.\n" +
    "\n*** При клике по иконке {{INFO_ICON}} открывается полное описание функционала.\n" +
    "\nОсновные характеристики версии 10.1 «Уровень 3 — Продвинутый»:\n" +
    "*Упражнений* – более 150, *Задач* – более 700, *Полезности* – интеллектуальная поисковая система по Базе знаний школы: 14 основополагающих документов, 114 рисунков и видео и более 370 тематических материалов.\n" +
    "\nCopyright © Юрий Алинт (Андрей Юрьев) 2026";
  var installedHomeSnapshot = "";
  var LEVEL1_MODULE_VERSION = "10.1.125";
  var LEVEL3_MODULE_VERSION = "10.1.125";

  var CORE_REL_PATHS = [
    "",
    "manifest.webmanifest",
    "apple-touch-icon.png",
    "favicon.ico",
    "favicon.png",
    "branding/favicon.png",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "branding/logo3.png",
    "branding/up.png",
    "branding/up_list.png",
    "branding/baza.png",
    "branding/cross.png",
    "branding/clear.png",
    "branding/gal.png",
    "branding/del.png",
    "branding/support.png",
    "branding/info.png",
    "branding/generate.png",
    "branding/splash.gif",
    "offline/app-shell.json",
    "offline/media/manifest.json",
    "vendor/zip.min.js",
    "btca-data-guard.js?v=" + LEVEL1_MODULE_VERSION,
    "btca-baza-diagram.js?v=" + LEVEL1_MODULE_VERSION,
    "btca-baza-dialogs.js?v=" + LEVEL1_MODULE_VERSION,
    "btca-baza-screenshot.js?v=" + LEVEL1_MODULE_VERSION,
    "btca-baza-sqlite.js?v=" + LEVEL1_MODULE_VERSION,
    "vendor/sql-wasm.js",
    "vendor/sql-wasm.wasm",
    "btca-slide-menu.js?v=" + LEVEL1_MODULE_VERSION,
    "level3/level3-db.js?v=" + LEVEL3_MODULE_VERSION,
    "level3/level3-baza.js?v=" + LEVEL3_MODULE_VERSION,
    "level3/level3-app.js?v=" + LEVEL3_MODULE_VERSION,
    "level3/data/forma_exercise_list.json",
    "level3/data/polezCatalog.json",
    "level3/data/polezLinks.json",
    "level3/data/polezDescriptions.json",
    "level3/data/polezNavCatalog.json",
    "level3/data/polezSourceIndex.json",
    "level3/data/sources/1.4_structured.txt",
    "level3/data/sources/2.1.1_structured.txt",
    "level3/data/sources/2.1.2_structured.txt",
    "level3/data/sources/2.2_structured.txt",
    "level3/data/sources/2.4_structured.txt",
  ];

  window.__BTCA_BASE__ = BTCA_BASE;

  function assetPath(relativePath) {
    var rel = String(relativePath || "").replace(/^\//, "");
    if (!rel) return BTCA_BASE.replace(/\/?$/, "/");
    return BTCA_BASE.replace(/\/?$/, "/") + rel;
  }

  function splashDisplayPct(percent) {
    return Math.max(0, Math.min(100, Math.round(percent)));
  }

  function buildSplashIndicatorHtml(percent) {
    var disp = splashDisplayPct(percent);
    var gifSrc = assetPath("branding/splash.gif");
    return '<div class="btca-boot-splash__gif-wrap">' +
      '<img class="btca-boot-splash__gif" src="' + escapeHtml(gifSrc) + '" alt="" decoding="async">' +
      '<div class="btca-boot-splash__pct" aria-live="polite">' +
      '<span class="btca-boot-splash__pct-num" data-btca-splash-pct-num>' + disp + "</span>" +
      '<span class="btca-boot-splash__pct-sym">%</span></div></div>';
  }

  function installedHomeFooterHtml() {
    return (
      '<div class="footer__row">' +
      '<span class="footer__side footer__side--left">BTCA-mobile v.10.1</span>' +
      '<button type="button" class="footer__support-btn" aria-label="Служба поддержки" aria-expanded="false" aria-controls="btca-support-line">' +
      '<img class="footer__support-img" src="' +
      assetPath("branding/support.png") +
      '" alt="" width="28" height="28" decoding="async" />' +
      "</button>" +
      '<span class="footer__side footer__side--right">© 2026 Alint&apos;s R.lab</span>' +
      "</div>" +
      '<p id="btca-support-line" class="footer__support-line" hidden>Служба поддержки: interual@gmail.com</p>'
    );
  }

  function applyInstalledHomeFooter() {
    var footer = document.querySelector(".footer");
    if (!footer) return;
    footer.classList.remove("is-support-open");
    footer.removeAttribute("data-support-wired");
    footer.innerHTML = installedHomeFooterHtml();
    wireSupportFooter();
  }

  /** login — под пирамидой (после hero); menu — под «Аккаунт | Обновление» / «Есть обновление». */
  function placeHomeSplashPanel(context) {
    var panel = getEls().panel;
    if (!panel) return;
    var home = document.querySelector(".home");
    if (!home) return;
    panel.classList.remove("btca-home-splash-panel--under-pyramid", "btca-home-splash-panel--under-menu");
    if (context === "menu") {
      panel.classList.add("btca-home-splash-panel--under-menu");
      var menu = document.querySelector(".platform-menu");
      if (menu && menu.parentNode === home) {
        if (menu.nextSibling !== panel) home.insertBefore(panel, menu.nextSibling);
      } else {
        home.appendChild(panel);
      }
      return;
    }
    panel.classList.add("btca-home-splash-panel--under-pyramid");
    var hero = document.querySelector(".home__hero");
    if (hero && hero.parentNode === home) {
      if (hero.nextSibling !== panel) home.insertBefore(panel, hero.nextSibling);
    } else {
      home.appendChild(panel);
    }
  }

  function renderHomeSplashIndicator(percent) {
    var panel = getEls().panel;
    if (!panel) return;
    var disp = splashDisplayPct(percent);
    if (disp >= 100) {
      hideHomeSplashIndicator();
      return;
    }
    var splashContext =
      document.body.classList.contains("btca-installed-mode") && isLaunchUnlocked()
        ? "menu"
        : "login";
    placeHomeSplashPanel(splashContext);
    var num = panel.querySelector("[data-btca-splash-pct-num]");
    if (num && panel.classList.contains("btca-home-splash-panel")) {
      num.textContent = String(disp);
      var wrap = panel.querySelector(".btca-ios-splash-panel");
      if (wrap) wrap.setAttribute("aria-label", "Прогресс " + disp + "%");
      return;
    }
    panel.removeAttribute("hidden");
    panel.className =
      "ios-panel ios-panel--open btca-home-splash-panel" +
      (splashContext === "menu"
        ? " btca-home-splash-panel--under-menu"
        : " btca-home-splash-panel--under-pyramid");
    panel.innerHTML =
      '<div class="btca-ios-splash-panel" aria-label="Прогресс ' + disp + '%">' +
      buildSplashIndicatorHtml(disp) +
      "</div>";
  }

  var pendingInstalledLoginReveal = false;
  var IDENTITY_CACHE = "btca10-identity";
  var IDENTITY_URL = "/btca-10-1/offline/btca-identity.json";
  var IDENTITY_IDB = "btca10-identity-db";
  // Ключи identity — до любых persist/restore (не ниже по файлу).
  var LICENSE_API_BASE = "https://185-212-129-18.sslip.io";
  var LICENSE_LOGIN_KEY = "btca101.login";
  var LICENSE_AUTH_OTP_KEY = "btca101.authByEmailOtp";
  var LICENSE_DEVICE_KEY = "btca101.deviceId"; // серверный короткий ID (после claim)
  var LICENSE_BROWSER_KEY = "btca101.browserClientId"; // nonce для OTP/сессии на загрузочной
  var LICENSE_SESSION_KEY = "btca101.sessionToken";
  var LICENSE_LAUNCH_KEY = "btca101.launchUnlocked";
  var LICENSE_DOWNLOAD_LINKS_KEY = "btca101.downloadLinks";
  var LICENSE_LOGIN_COOKIE = "btca101_login";
  var LICENSE_DEVICE_COOKIE = "btca101_device";
  var LICENSE_BROWSER_COOKIE = "btca101_browser";
  var LICENSE_PACKAGE_DATE_KEY = "btca101.packageReleaseDate";
  var LICENSE_PACKAGE_DATE_COOKIE = "btca101_pkg_date";
  /** Непрерывная сессия PWA без смахивания (sessionStorage сбрасывается при kill/swipe). */
  var PWA_SESSION_STARTED_KEY = "btca101.pwaSessionStartedAt";
  var PWA_SESSION_EXPIRED_KEY = "btca101.pwaSessionExpired";
  var PWA_SESSION_MAX_MS = 12 * 60 * 60 * 1000;
  var PWA_SESSION_EXPIRED_MSG =
    "Сессия завершена (более 12 часов без перезапуска). Смахните приложение и откройте снова — так проверяются подписка и обновления.";
  var pwaSessionWatchTimer = 0;

  function hideHomeSplashIndicator(options) {
    options = options || {};
    var panel = getEls().panel;
    if (panel) {
      panel.className = "ios-panel";
      panel.innerHTML = "";
      panel.setAttribute("hidden", "hidden");
    }
    // Форму входа открываем только явной командой после полного splash/boot.
    if (options.revealLogin && pendingInstalledLoginReveal) {
      window.setTimeout(revealInstalledLoginGate, 0);
    }
  }

  function finishInstalledSplashForLogin() {
    if (!pendingInstalledLoginReveal) {
      hideHomeSplashIndicator();
      return;
    }
    hideHomeSplashIndicator({ revealLogin: true });
  }

  function hideInstalledAuthGate() {
    var gate = document.getElementById("btca-auth-gate");
    if (!gate) return;
    gate.setAttribute("hidden", "hidden");
    try {
      gate.innerHTML = "";
    } catch (e) { }
  }

  function revealInstalledLoginGate() {
    if (!pendingInstalledLoginReveal) return;
    if (!document.body.classList.contains("btca-installed-mode")) {
      pendingInstalledLoginReveal = false;
      return;
    }
    if (isLaunchUnlocked()) {
      pendingInstalledLoginReveal = false;
      return;
    }
    pendingInstalledLoginReveal = false;
    ensureLicenseIdentityRestored().then(function (login) {
      var prefill = String(login || "").trim();
      if (!prefill) {
        try {
          prefill = String(localStorage.getItem(LICENSE_LOGIN_KEY) || "").trim() || readLoginCookie();
        } catch (e) {
          prefill = readLoginCookie();
        }
      }
      renderAuthGate(
        function () {
          hideHomeSplashIndicator();
          renderInstalledHome({});
        },
        { loginOnly: true, prefillLogin: prefill }
      );
      if (prefill) {
        window.setTimeout(function () {
          var gate = document.getElementById("btca-auth-gate");
          var input = gate && gate.querySelector('input[name="login"]');
          if (input && !String(input.value || "").trim()) {
            input.value = prefill;
            try {
              input.setAttribute("value", prefill);
            } catch (e) { }
          }
        }, 80);
      }
    });
  }

  function readLoginCookie() {
    try {
      var parts = String(document.cookie || "").split(";");
      for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].trim();
        if (pair.indexOf(LICENSE_LOGIN_COOKIE + "=") === 0) {
          return decodeURIComponent(pair.slice(LICENSE_LOGIN_COOKIE.length + 1)).trim();
        }
      }
    } catch (e) { }
    return "";
  }

  function writePathCookie(name, value) {
    try {
      var clean = String(value || "").trim();
      if (!clean) return;
      var maxAge = 60 * 60 * 24 * 400;
      document.cookie =
        name +
        "=" +
        encodeURIComponent(clean) +
        "; path=/btca-10-1/; max-age=" +
        maxAge +
        "; SameSite=Lax";
    } catch (e) { }
  }

  function readPathCookie(name) {
    try {
      var parts = String(document.cookie || "").split(";");
      for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].trim();
        if (pair.indexOf(name + "=") === 0) {
          return decodeURIComponent(pair.slice(name.length + 1)).trim();
        }
      }
    } catch (e) { }
    return "";
  }

  function writeLoginCookie(login) {
    writePathCookie(LICENSE_LOGIN_COOKIE, login);
  }

  function writeDeviceCookie(deviceId) {
    writePathCookie(LICENSE_DEVICE_COOKIE, deviceId);
  }

  function readDeviceCookie() {
    return readPathCookie(LICENSE_DEVICE_COOKIE);
  }

  function persistLicenseDeviceId(deviceId) {
    var clean = String(deviceId || "").trim();
    if (clean.length < 6) return "";
    try {
      localStorage.setItem(LICENSE_DEVICE_KEY, clean);
    } catch (e) { }
    writeDeviceCookie(clean);
    return clean;
  }

  function writeBrowserCookie(browserId) {
    writePathCookie(LICENSE_BROWSER_COOKIE, browserId);
  }

  function readBrowserCookie() {
    return readPathCookie(LICENSE_BROWSER_COOKIE);
  }

  /** Клиентский nonce для входа/OTP на странице загрузки (не ID привязки). */
  function getBrowserClientId() {
    try {
      var fromCookie = readBrowserCookie();
      if (fromCookie && fromCookie.length >= 8) {
        try {
          localStorage.setItem(LICENSE_BROWSER_KEY, fromCookie);
        } catch (e) { }
        return fromCookie;
      }
      var existing = "";
      try {
        existing = String(localStorage.getItem(LICENSE_BROWSER_KEY) || "").trim();
      } catch (e) { }
      if (existing.length >= 8) {
        writeBrowserCookie(existing);
        return existing;
      }
      var id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "b-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
      try {
        localStorage.setItem(LICENSE_BROWSER_KEY, id);
      } catch (e) { }
      writeBrowserCookie(id);
      return id;
    } catch (e) {
      return "b-fallback-" + String(Date.now());
    }
  }

  function writePackageDateCookie(dateRu) {
    try {
      var clean = String(dateRu || "").trim();
      if (!/^\d{2}\.\d{2}\.\d{4}$/.test(clean)) return;
      var maxAge = 60 * 60 * 24 * 400;
      document.cookie =
        LICENSE_PACKAGE_DATE_COOKIE +
        "=" +
        encodeURIComponent(clean) +
        "; path=/btca-10-1/; max-age=" +
        maxAge +
        "; SameSite=Lax";
    } catch (e) { }
  }

  function readPackageDateCookie() {
    try {
      var parts = String(document.cookie || "").split(";");
      for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].trim();
        if (pair.indexOf(LICENSE_PACKAGE_DATE_COOKIE + "=") === 0) {
          return decodeURIComponent(pair.slice(LICENSE_PACKAGE_DATE_COOKIE.length + 1)).trim();
        }
      }
    } catch (e) { }
    return "";
  }

  function persistPackageReleaseDate(dateRu) {
    var clean = String(dateRu || "").trim();
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(clean)) return "";
    try {
      localStorage.setItem(LICENSE_PACKAGE_DATE_KEY, clean);
    } catch (e) { }
    writePackageDateCookie(clean);
    return clean;
  }

  function readStoredPackageReleaseDate() {
    try {
      var fromLs = String(localStorage.getItem(LICENSE_PACKAGE_DATE_KEY) || "").trim();
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(fromLs)) return fromLs;
    } catch (e) { }
    var fromCookie = readPackageDateCookie();
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(fromCookie)) return fromCookie;
    return "";
  }

  function putIdentityInCache(cacheName, body) {
    if (!("caches" in window) || !cacheName) return Promise.resolve();
    return caches
      .open(cacheName)
      .then(function (cache) {
        return cache.put(
          IDENTITY_URL,
          new Response(body, {
            headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
          })
        );
      })
      .catch(function () { });
  }

  function persistLicenseIdentity(login, authOtp) {
    var clean = String(login || "").trim();
    if (!clean) return;
    var deviceId = getLicenseDeviceId();
    var packageDate = readStoredPackageReleaseDate() || readLocalPackageReleaseDate();
    if (packageDate) persistPackageReleaseDate(packageDate);
    var payload = {
      login: clean,
      auth_by_email_otp: Boolean(authOtp),
      device_id: deviceId,
      package_release_date: packageDate || "",
      saved_at: Date.now(),
    };
    try {
      localStorage.setItem(LICENSE_LOGIN_KEY, clean);
      localStorage.setItem(LICENSE_AUTH_OTP_KEY, authOtp ? "1" : "0");
      localStorage.setItem("btca101.identityJson", JSON.stringify(payload));
    } catch (e) { }
    writeLoginCookie(clean);
    var body = JSON.stringify(payload);
    putIdentityInCache(IDENTITY_CACHE, body);
    putIdentityInCache(INSTALL_CACHE, body);
    try {
      if (!window.indexedDB) return;
      var req = indexedDB.open(IDENTITY_IDB, 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains("identity")) db.createObjectStore("identity");
      };
      req.onsuccess = function () {
        try {
          var db = req.result;
          var tx = db.transaction("identity", "readwrite");
          tx.objectStore("identity").put(payload, "current");
        } catch (e) { }
      };
    } catch (e) { }
  }

  function readIdentityFromAnyCache() {
    if (!("caches" in window)) return Promise.resolve(null);
    return caches
      .keys()
      .then(function (names) {
        var preferred = [IDENTITY_CACHE, INSTALL_CACHE].concat(
          names.filter(function (n) {
            return n !== IDENTITY_CACHE && n !== INSTALL_CACHE;
          })
        );
        var seen = {};
        function next(i) {
          if (i >= preferred.length) return Promise.resolve(null);
          var name = preferred[i];
          if (!name || seen[name]) return next(i + 1);
          seen[name] = true;
          return caches
            .open(name)
            .then(function (cache) {
              return cache.match(IDENTITY_URL);
            })
            .then(function (response) {
              if (!response) return next(i + 1);
              return response.json().then(function (data) {
                if (data && data.login) return data;
                return next(i + 1);
              });
            })
            .catch(function () {
              return next(i + 1);
            });
        }
        return next(0);
      })
      .catch(function () {
        return null;
      });
  }

  function readIdentityFromIdb() {
    return new Promise(function (resolve) {
      try {
        if (!window.indexedDB) {
          resolve(null);
          return;
        }
        var req = indexedDB.open(IDENTITY_IDB, 1);
        req.onupgradeneeded = function () {
          var db = req.result;
          if (!db.objectStoreNames.contains("identity")) db.createObjectStore("identity");
        };
        req.onerror = function () {
          resolve(null);
        };
        req.onsuccess = function () {
          try {
            var db = req.result;
            var tx = db.transaction("identity", "readonly");
            var getReq = tx.objectStore("identity").get("current");
            getReq.onsuccess = function () {
              resolve(getReq.result || null);
            };
            getReq.onerror = function () {
              resolve(null);
            };
          } catch (e) {
            resolve(null);
          }
        };
      } catch (e) {
        resolve(null);
      }
    });
  }

  function ensureLicenseIdentityRestored() {
    var existing = "";
    var otpFlag = false;
    try {
      existing = String(localStorage.getItem(LICENSE_LOGIN_KEY) || "").trim();
      otpFlag = localStorage.getItem(LICENSE_AUTH_OTP_KEY) === "1";
    } catch (e) { }
    if (!existing) existing = readLoginCookie();
    if (existing) {
      persistLicenseIdentity(existing, otpFlag);
      return Promise.resolve(existing);
    }

    function applyData(data) {
      var login = data && String(data.login || "").trim();
      if (!login) return "";
      if (data && data.device_id) {
        persistLicenseDeviceId(data.device_id);
      }
      if (data && data.package_release_date) {
        persistPackageReleaseDate(data.package_release_date);
      }
      persistLicenseIdentity(login, Boolean(data && data.auth_by_email_otp));
      return login;
    }

    var fromJson = null;
    try {
      fromJson = JSON.parse(localStorage.getItem("btca101.identityJson") || "null");
    } catch (e) { }
    if (fromJson && fromJson.login) {
      return Promise.resolve(applyData(fromJson));
    }

    var token = "";
    try {
      token = String(localStorage.getItem(LICENSE_SESSION_KEY) || "").trim();
    } catch (e) { }

    var accountPromise = token
      ? licensePost("/v1/account", { session_token: token })
        .then(function (data) {
          return applyData(data);
        })
        .catch(function () {
          return "";
        })
      : Promise.resolve("");

    return accountPromise.then(function (login) {
      if (login) return login;
      return readIdentityFromIdb().then(function (data) {
        var fromIdb = applyData(data);
        if (fromIdb) return fromIdb;
        return readIdentityFromAnyCache().then(function (cached) {
          var fromCache = applyData(cached);
          if (fromCache) return fromCache;
          var deviceId = "";
          try {
            deviceId = String(localStorage.getItem(LICENSE_DEVICE_KEY) || "").trim();
          } catch (e) { }
          if (deviceId.length < 8) return "";
          return licensePost("/v1/auth/device-identity", { device_id: deviceId })
            .then(function (data) {
              return applyData(data);
            })
            .catch(function () {
              return "";
            });
        });
      });
    });
  }

  function mapBootProgress(localPct, startPct, endPct) {
    var span = endPct - startPct;
    if (span <= 0) return splashDisplayPct(endPct);
    return splashDisplayPct(startPct + (localPct / 100) * span);
  }

  function preloadAppModulesForHome(options) {
    options = options || {};
    var startPct = options.startPct != null ? options.startPct : 0;
    var endPct = options.endPct != null ? options.endPct : 100;

    if (!isStandalone()) {
      discardStaleRuntimeModules();
      preloadLevel3ModuleSilently();
      return Promise.resolve();
    }
    discardStaleRuntimeModules();
    if (level3ModuleFresh() && slideMenuReady()) {
      hideHomeSplashIndicator();
      return Promise.resolve();
    }

    var v2 = LEVEL3_MODULE_VERSION;
    var steps = [];

    if (!slideMenuReady()) {
      steps.push({ run: function () { return loadSlideMenuScript(); } });
    }

    if (!level3ModuleReady()) {
      steps.push(
        { run: function () { return loadDataGuardScript(); } },
        { run: function () { return loadBazaDiagramScript(); } },
        { run: function () { return loadBazaDialogsScript(); } },
        { run: function () { return loadBazaScreenshotScript(); } },
        { run: function () { return loadBazaSqliteScript(); } },
        { run: function () { return loadSlideMenuScript(); } },
        { run: function () { return loadLevel3Script(assetPath("level3/level3-db.js?v=" + v2)); } },
        { run: function () { return loadLevel3Script(assetPath("level3/level3-baza.js?v=" + v2)); } },
        { run: function () { return loadLevel3Script(assetPath("level3/level3-app.js?v=" + v2)); } },
        {
          run: function () {
            if (!level3ModuleReady()) throw new Error("Модуль Уровня 3 не инициализирован");
            return window.BTCA_LEVEL3.boot();
          }
        }
      );
    }

    if (!steps.length) {
      hideHomeSplashIndicator();
      return Promise.resolve();
    }

    function report(localPct) {
      var pct = mapBootProgress(localPct, startPct, endPct);
      if (pct >= 100) {
        hideHomeSplashIndicator();
        return;
      }
      renderHomeSplashIndicator(pct);
    }

    report(0);
    var total = steps.length;
    return steps.reduce(function (chain, step, index) {
      return chain.then(function () {
        report((index / total) * 100);
        return withTimeout(
          step.run(),
          45000,
          "Таймаут загрузки модулей БТКА"
        );
      });
    }, Promise.resolve()).then(function () {
      hideHomeSplashIndicator();
    }).catch(function (error) {
      console.warn("BTCA module preload failed", error);
    }).then(function () {
      hideHomeSplashIndicator();
    });
  }

  function resolvePackZipUrl(pack) {
    if (!pack || !pack.zipUrl) return "";
    if (/^https?:\/\//i.test(pack.zipUrl)) return pack.zipUrl;
    return assetPath(pack.zipUrl.replace(/^\//, ""));
  }

  function getEls() {
    return {
      button: document.getElementById("btca-static-ios"),
      panel: document.getElementById("btca-static-ios-panel"),
    };
  }

  function isAppleMobile() {
    var ua = navigator.userAgent || "";
    var iPadDesktopMode = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    return /iPhone|iPad|iPod/.test(ua) || iPadDesktopMode;
  }

  function isDebugAppleMode() {
    return new URLSearchParams(window.location.search).get("debugApple") === "1";
  }

  function isStandalone() {
    try {
      if (window.matchMedia("(display-mode: standalone)").matches) return true;
      if (window.matchMedia("(display-mode: fullscreen)").matches) return true;
      if (window.matchMedia("(display-mode: minimal-ui)").matches) return true;
    } catch (_) { }
    return Boolean(navigator.standalone);
  }

  function hasIosPwaQuery() {
    try {
      return new URLSearchParams(window.location.search).get("ios-pwa") === "1";
    } catch (_) {
      return false;
    }
  }

  /** В Safari-вкладке убираем ?ios-pwa=1 — иначе reload сразу открывает «установленное» PWA. */
  function stripIosPwaQueryInBrowser() {
    if (isStandalone()) return;
    try {
      var url = new URL(window.location.href);
      if (!url.searchParams.has("ios-pwa")) return;
      url.searchParams.delete("ios-pwa");
      var q = url.searchParams.toString();
      window.history.replaceState(null, "", url.pathname + (q ? "?" + q : "") + url.hash);
    } catch (_) { }
  }

  function isPersistedLaunchUnlocked() {
    try {
      if (localStorage.getItem(LICENSE_LAUNCH_KEY) === "1") return true;
    } catch (_) { }
    return isAppPreparedSync();
  }

  // Только настоящий ярлык «На экран Домой» (standalone). Не по кэшу offline и не по ?ios-pwa=.
  function isAppShellMode() {
    return isStandalone();
  }

  function getCacheGeneration() {
    return MEDIA_CACHE.split(":")[0];
  }

  function readMetaCacheVersion() {
    var meta = document.querySelector('meta[name="btca-cache-version"]');
    return meta ? String(meta.getAttribute("content") || "").trim() : "";
  }

  function readAppliedShellVersion() {
    try {
      return String(localStorage.getItem(APPLIED_SHELL_KEY) || "").trim();
    } catch (_) {
      return "";
    }
  }

  function writeAppliedShellVersion(version) {
    try {
      if (version) localStorage.setItem(APPLIED_SHELL_KEY, String(version));
    } catch (_) { }
  }

  function slideMenuReady() {
    return Boolean(window.BTCA_SLIDE_MENU && window.BTCA_SLIDE_MENU.hostHtml);
  }

  function isOfflinePreparationActive() {
    if (offlinePreparationActive) return true;
    try {
      return sessionStorage.getItem(OFFLINE_PREP_SESSION_KEY) === "1";
    } catch (_) {
      return false;
    }
  }

  function setOfflinePreparationActive(active) {
    offlinePreparationActive = Boolean(active);
    try {
      if (active) sessionStorage.setItem(OFFLINE_PREP_SESSION_KEY, "1");
      else sessionStorage.removeItem(OFFLINE_PREP_SESSION_KEY);
    } catch (_) { }
  }

  function shouldRunShellUpdateCheck() {
    if (isOfflinePreparationActive()) return false;
    // Загрузочная в Safari/браузере: не гонять SW/reload — иначе после установки
    // страница «зависает», если cookie пакета истекла.
    if (!isStandalone()) return false;
    return true;
  }

  function probePackageAccess() {
    // На GitHub Pages медиа публичны — cookie ProHoster не нужна.
    return fetch(assetPath("offline/media/manifest.json"), {
      credentials: isGitHubPagesHost() ? "omit" : "include",
      cache: "no-store",
    })
      .then(function (response) {
        return Boolean(response && response.ok);
      })
      .catch(function () {
        return false;
      });
  }

  /** Активирует cookie пакета через /d/{token} без ухода со страницы (один клик iOS). */
  function activatePwaDownloadCookie(pwaLink) {
    // GitHub Pages: пакет уже на Pages — после OTP достаточно доступа к manifest.
    if (isGitHubPagesHost()) {
      return probePackageAccess().then(function (ok) {
        return ok || true;
      });
    }
    if (!pwaLink) return Promise.resolve(false);
    return fetch(pwaLink, {
      credentials: "include",
      cache: "no-store",
      redirect: "follow",
    })
      .then(function () {
        return probePackageAccess();
      })
      .catch(function () {
        return false;
      });
  }

  function ensureIosPrepareButton(iosEl) {
    var ios = replaceWithPlatformButton(iosEl || document.getElementById("btca-static-ios"));
    if (!ios) return null;
    var iosSmall = ios.querySelector("small");
    if (iosSmall) iosSmall.textContent = "Загрузить все данные для offline";
    ios.onclick = function (event) {
      if (event) event.preventDefault();
      startIosOfflinePreparation();
    };
    return ios;
  }

  function startIosOfflinePreparation() {
    var ios = document.getElementById("btca-static-ios");
    // Не на Apple — только сообщение, без claim / ID устройства в админке.
    if (!isAppleMobile() && !isDebugAppleMode()) {
      if (ios) ios.disabled = false;
      renderInfo(
        "iOS/iPadOS",
        "Вы открыли страницу не на устройстве Apple. Для iOS/iPadOS откройте эту ссылку в Safari на iPhone или iPad."
      );
      ensureIosPrepareButton(ios);
      return;
    }
    if (ios) {
      ios.disabled = true;
      var small = ios.querySelector("small");
      if (small) small.textContent = "Подготовка скачивания...";
    }
    clearDownloadLimitWarning();
    var links = readStoredDownloadLinks();
    claimPlatformDownload("pwa", "iOS/PWA")
      .then(function () {
        if (ios) {
          var smallReady = ios.querySelector("small");
          if (smallReady) smallReady.textContent = "Открываю доступ к пакету...";
        }
        return probePackageAccess().then(function (hasAccess) {
          if (hasAccess) return true;
          return activatePwaDownloadCookie(links.pwa);
        });
      })
      .then(function (ready) {
        if (ios) ios.disabled = false;
        if (!ready) {
          renderInfo(
            "iOS/iPadOS",
            "Не удалось открыть доступ к пакету. Обновите страницу, снова введите код и сразу нажмите iOS."
          );
          ensureIosPrepareButton(ios);
          return;
        }
        prepareOffline();
      })
      .catch(function (error) {
        if (ios) ios.disabled = false;
        ensureIosPrepareButton(ios);
        showDownloadLimitWarning(
          localizeUserFacingError(error, "Не удалось начать скачивание. Повторите попытку.")
        );
      });
  }

  function releaseStaleServiceWorkerForLoadingPage() {
    if (!("serviceWorker" in navigator)) return Promise.resolve();
    try {
      if (new URLSearchParams(window.location.search).get("btca-reset") === "1") {
        return unregisterOfflineServiceWorker()
          .then(deleteAllBtcaCaches)
          .then(function () {
            var url = new URL(window.location.href);
            url.searchParams.delete("btca-reset");
            url.searchParams.set("nocache", String(Date.now()));
            window.location.replace(url.pathname + url.search);
          });
      }
    } catch (e) { }
    if (isAppShellMode()) {
      return registerOfflineServiceWorker().catch(function () { });
    }
    // Загрузочная: снять SW со всего /btca-10-1/, иначе старый cacheFirst
    // вешает Safari и страница «не открывается». Offline — только /offline/.
    if (!("serviceWorker" in navigator)) return Promise.resolve();
    return navigator.serviceWorker.getRegistrations().then(function (regs) {
      return Promise.all(
        (regs || []).map(function (reg) {
          var scope = String(reg.scope || "");
          if (scope.indexOf("/offline/") !== -1) return null;
          return reg.unregister();
        })
      );
    }).catch(function () { });
  }

  function readPreparedModuleVersions(state) {
    if (!state) return { level1: "", level3: "" };
    return {
      level1: String(state.level1ModuleVersion || ""),
      level3: String(state.level3ModuleVersion || ""),
    };
  }

  function isPreparedStateCurrent(state) {
    return Boolean(state && state.preparedAt);
  }

  function clearInjectedDataGuardScript() {
    document.querySelectorAll("script[data-btca-data-guard-src]").forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    delete window.BTCA_DATA_GUARD;
  }

  function clearInjectedBazaDiagramScript() {
    document.querySelectorAll("script[data-btca-baza-diagram-src]").forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    delete window.BTCA_BAZA_DIAGRAM;
  }

  function clearInjectedBazaDialogsScript() {
    document.querySelectorAll("script[data-btca-baza-dialogs-src]").forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    delete window.BTCA_BAZA_DIALOGS;
  }

  function clearInjectedSlideMenuScript() {
    document.querySelectorAll("script[data-btca-slide-menu-src]").forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    delete window.BTCA_SLIDE_MENU;
  }

  function clearInjectedBazaSqliteScript() {
    document.querySelectorAll("script[data-btca-baza-sqlite-src]").forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    document.querySelectorAll("script[data-btca-sqlwasm-src]").forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    delete window.BTCA_BAZA_SQLITE;
  }

  function clearInjectedLevel3Scripts() {
    clearInjectedDataGuardScript();
    clearInjectedBazaDiagramScript();
    clearInjectedBazaDialogsScript();
    clearInjectedBazaSqliteScript();
    clearInjectedSlideMenuScript();
    document.querySelectorAll("script[data-btca-level3-src]").forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    delete window.BTCA_LEVEL3;
    delete window.BTCA_LEVEL3_DB;
    delete window.BTCA_LEVEL3_BAZA;
  }

  function discardStaleRuntimeModules() {
    if (level3ModuleReady() && !level3ModuleFresh()) {
      clearInjectedLevel3Scripts();
    }
    if (!slideMenuReady()) {
      clearInjectedSlideMenuScript();
    }
  }

  function migratePreparedClientMarkers() {
    var generation = getCacheGeneration();
    try {
      var readyState = readAppPreparedState();
      if (readyState && readyState.preparedAt) {
        readyState.cacheGeneration = generation;
        readyState.level1ModuleVersion = LEVEL1_MODULE_VERSION;
        readyState.level3ModuleVersion = LEVEL3_MODULE_VERSION;
        localStorage.setItem(APP_READY_KEY, JSON.stringify(readyState));
      }
      var mediaRaw = localStorage.getItem(MEDIA_STATE_KEY);
      if (mediaRaw) {
        var mediaState = JSON.parse(mediaRaw);
        if (mediaState && mediaState.files) {
          mediaState.cacheGeneration = generation;
          localStorage.setItem(MEDIA_STATE_KEY, JSON.stringify(mediaState));
        }
      }
    } catch (_) { }
  }

  function invalidatePreparedClientState() {
    try {
      localStorage.removeItem(APP_READY_KEY);
      localStorage.removeItem(MEDIA_STATE_KEY);
    } catch (_) { }
    window.__BTCA_APP_BOOT_READY__ = false;
  }

  function purgeGenerationRuntimeCache() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.delete(getCacheGeneration() + ":runtime").catch(function () { });
  }

  function readInstallSession() {
    try {
      return String(localStorage.getItem(INSTALL_SESSION_KEY) || "").trim();
    } catch (_) {
      return "";
    }
  }

  function recordInstallSession() {
    if (!isStandalone() || readInstallSession()) return;
    try {
      localStorage.setItem(
        INSTALL_SESSION_KEY,
        String(Date.now()) + "-" + Math.random().toString(36).slice(2, 10)
      );
    } catch (_) { }
  }

  function resolvePwaShortcutName() {
    var meta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (meta) {
      var title = String(meta.getAttribute("content") || "").trim();
      if (title) return title;
    }
    var manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink && manifestLink.href) {
      var manifestName = String(manifestLink.getAttribute("data-short-name") || "").trim();
      if (manifestName) return manifestName;
    }
    return "BTCA-iOS 10.1";
  }

  function clearBrowserPrepMarkers() {
    try {
      localStorage.removeItem(APP_READY_KEY);
      localStorage.removeItem(MEDIA_STATE_KEY);
    } catch (_) { }
  }

  function clearInstallSessionMarker() {
    try {
      localStorage.removeItem(INSTALL_SESSION_KEY);
    } catch (_) { }
  }

  function clearAllInstallMarkers() {
    clearInstallSessionMarker();
    clearBrowserPrepMarkers();
  }

  function wipeTrainingDatabasesInBrowser() {
    if (isStandalone()) {
      return Promise.resolve();
    }
    if (!window.BTCA_DATA_GUARD || !window.BTCA_DATA_GUARD.trainingWipePermitted()) {
      console.warn("BTCA: skipped training DB wipe — Safari prep token missing");
      return Promise.resolve();
    }
    return ensureLevel3Module().then(function () {
      var tasks = [];
      if (window.BTCA_LEVEL3_DB && window.BTCA_LEVEL3_DB.wipeTrainingDatabase) {
        tasks.push(window.BTCA_LEVEL3_DB.wipeTrainingDatabase());
      }
      return Promise.all(tasks);
    }).catch(function (error) {
      console.warn("BTCA Safari training DB wipe failed", error);
    });
  }

  function readAppPreparedState() {
    try {
      var raw = localStorage.getItem(APP_READY_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  function markAppPrepared() {
    try {
      localStorage.setItem(APP_READY_KEY, JSON.stringify({
        cacheGeneration: getCacheGeneration(),
        level1ModuleVersion: LEVEL1_MODULE_VERSION,
        level3ModuleVersion: LEVEL3_MODULE_VERSION,
        preparedAt: new Date().toISOString(),
      }));
    } catch (_) { }
    window.__BTCA_APP_BOOT_READY__ = true;
  }

  function isAppPreparedSync() {
    if (!isPreparedStateCurrent(readAppPreparedState())) return false;
    if (!hasPreparedMediaState()) return false;
    return true;
  }

  function hasPreparedMediaState() {
    try {
      var raw = localStorage.getItem(MEDIA_STATE_KEY);
      if (!raw) return false;
      var state = JSON.parse(raw);
      if (!state || !state.files) return false;
      return Object.keys(state.files).some(function (key) {
        return (state.files[key] || 0) > 0;
      });
    } catch (_) {
      return false;
    }
  }

  function migrateMediaCacheFromPreviousGeneration() {
    if (!("caches" in window)) return Promise.resolve(false);
    return caches.keys().then(function (names) {
      var candidates = names.filter(function (name) {
        return name.indexOf(CACHE_NAME_PREFIX) === 0 && name.endsWith(":static-media") && name !== MEDIA_CACHE;
      });
      if (!candidates.length) return false;
      candidates.sort();
      var sourceName = candidates[candidates.length - 1];
      return caches.open(sourceName).then(function (src) {
        return caches.open(MEDIA_CACHE).then(function (dst) {
          return src.keys().then(function (keys) {
            if (!keys.length) return false;
            return Promise.all(keys.map(function (req) {
              return src.match(req).then(function (res) {
                if (res) return dst.put(req, res);
              });
            })).then(function () { return true; });
          });
        });
      });
    }).catch(function () {
      return false;
    });
  }

  function ensureMediaCacheReady() {
    return verifyMediaCacheReady().then(function (ready) {
      if (ready) return true;
      return migrateMediaCacheFromPreviousGeneration().then(function (migrated) {
        if (!migrated) return false;
        return verifyMediaCacheReady();
      });
    });
  }

  function purgeObsoleteMediaCaches() {
    if (!("caches" in window)) return Promise.resolve();
    var generation = getCacheGeneration();
    return caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        return name.indexOf(CACHE_NAME_PREFIX) === 0 &&
          name.endsWith(":static-media") &&
          name.indexOf(generation) !== 0;
      }).map(function (name) {
        return caches.delete(name);
      }));
    }).catch(function () { });
  }

  function flushClientDataBeforeReload() {
    var tasks = [];
    try {
      if (window.BTCA_LEVEL3_DB && window.BTCA_LEVEL3_DB.flushUiState) {
        tasks.push(window.BTCA_LEVEL3_DB.flushUiState());
      }
    } catch (_) { }
    return Promise.all(tasks).catch(function () { });
  }

  function purgeAllShellCachesExceptMedia() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        if (name.indexOf(CACHE_NAME_PREFIX) !== 0) return false;
        if (name.endsWith(":static-media")) return false;
        if (name.endsWith(":static-install")) return false;
        return true;
      }).map(function (name) {
        return caches.delete(name);
      }));
    }).catch(function () { });
  }

  function purgeAllInstallCaches() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        return name.indexOf(CACHE_NAME_PREFIX) === 0 && name.endsWith(":static-install");
      }).map(function (name) {
        return caches.delete(name);
      }));
    }).catch(function () { });
  }

  function purgeShellServiceWorkerCaches() {
    if (!("caches" in window)) return Promise.resolve();
    var generation = getCacheGeneration();
    return Promise.all([
      caches.delete(generation + ":app").catch(function () { }),
      caches.delete(generation + ":runtime").catch(function () { }),
    ]);
  }

  function shellRefreshAttemptKey(remote) {
    return META_RELOAD_SESSION_KEY + ":" + remote;
  }

  function reloadShellForRemoteVersion(remote) {
    var target = String(remote || "").trim() || readMetaCacheVersion() || "unknown";
    // Установленный PWA: оболочку/CSS/JS с сети НЕ подтягиваем.
    // Новый пакет — только через кнопку загрузки на странице загрузки.
    if (isStandalone()) {
      return Promise.resolve(false);
    }
    var attemptKey = shellRefreshAttemptKey(target);
    try {
      if (sessionStorage.getItem(attemptKey) === "1") {
        var metaNow = readMetaCacheVersion();
        if (metaNow) writeAppliedShellVersion(metaNow);
        return Promise.resolve(false);
      }
      sessionStorage.setItem(attemptKey, "1");
    } catch (_) { }

    discardStaleRuntimeModules();
    return purgeAllShellCachesExceptMedia()
      .then(function () {
        if (!("serviceWorker" in navigator)) return;
        return navigator.serviceWorker.getRegistration(BTCA_BASE).then(function (registration) {
          if (!registration) return;
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
          return registration.update().catch(function () { });
        });
      })
      .then(function () {
        return flushClientDataBeforeReload();
      })
      .then(function () {
        var url = new URL(window.location.href);
        url.searchParams.set("btca-shell", target);
        url.searchParams.set("btca-refresh", String(Date.now()));
        window.location.replace(url.toString());
        return true;
      });
  }

  function refreshShellCacheQuietly() {
    if (!("caches" in window)) return Promise.resolve();
    return cacheCoreAssets(function () { }, 0, 0).catch(function () { });
  }

  function clearStaleClientState() {
    var generation = getCacheGeneration();
    var metaGen = readMetaCacheVersion();
    if (metaGen && metaGen !== generation) {
      // Не abort init: на iPad return false оставляет пустой ярлык.
      if (isStandalone()) writeAppliedShellVersion(generation);
    }

    try {
      var shellParam = new URLSearchParams(window.location.search).get("btca-shell");
      if (shellParam && shellParam === metaGen) {
        sessionStorage.removeItem(shellRefreshAttemptKey(shellParam));
        writeAppliedShellVersion(shellParam);
      }
    } catch (_) { }

    if (metaGen && !readAppliedShellVersion()) {
      writeAppliedShellVersion(metaGen);
    }

    try {
      migratePreparedClientMarkers();
    } catch (_) {
      invalidatePreparedClientState();
    }
    discardStaleRuntimeModules();
    return true;
  }

  function purgeObsoleteInstallCaches() {
    if (!("caches" in window)) return Promise.resolve();
    var generation = getCacheGeneration();
    return caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        if (name.indexOf(CACHE_NAME_PREFIX) !== 0) return false;
        if (name.indexOf(generation) === 0) return false;
        // Offline-пакет после «Загрузить» живёт до повторной загрузки — не сносить при bump cacheVersion.
        if (name.endsWith(":static-media")) return false;
        if (name.endsWith(":static-install")) return false;
        return true;
      }).map(function (name) {
        return caches.delete(name);
      }));
    }).catch(function () { });
  }

  function purgeShellInstallCache() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.delete(INSTALL_CACHE).catch(function () { });
  }

  function unregisterOfflineServiceWorker() {
    if (!("serviceWorker" in navigator)) return Promise.resolve();
    return navigator.serviceWorker.getRegistrations().then(function (regs) {
      return Promise.all((regs || []).map(function (registration) {
        return registration.unregister();
      }));
    }).catch(function () { });
  }

  function deleteAllBtcaCaches() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        return name.indexOf(CACHE_NAME_PREFIX) === 0;
      }).map(function (name) {
        return caches.delete(name);
      }));
    }).catch(function () { });
  }

  function resetSafariInstallEnvironment() {
    if (isStandalone()) return Promise.resolve();
    invalidatePreparedClientState();
    clearAllInstallMarkers();
    window.__BTCA_APP_BOOT_READY__ = false;
    return unregisterOfflineServiceWorker().then(deleteAllBtcaCaches);
  }

  function cachePutAsset(cache, assetUrl) {
    return fetch(assetUrl, { cache: "no-store", credentials: "include" })
      .then(function (response) {
        if (!response || !response.ok) return;
        return cache.put(assetUrl, response.clone()).then(function () {
          // Дублируем оболочку в APP-совместимые URL для SW navigate fallback.
          return response;
        });
      })
      .catch(function () { });
  }

  function ensureFreshShellAfterDeploy() {
    if (!("serviceWorker" in navigator)) return;
    if (!shouldRunShellUpdateCheck()) return;

    navigator.serviceWorker.getRegistration(BTCA_BASE).then(function (registration) {
      if (!registration || !shouldRunShellUpdateCheck()) return;
      registration.update().catch(function () { });
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      // Не reload на controllerchange: на iPad это роняет Safari после ярлыка.
    }).catch(function () { });
  }

  function ensureShellUpToDate() {
    // Splash / после смахивания: только сравнение дат → «Есть обновление». Без обновления кэша.
    if (!shouldRunShellUpdateCheck()) return Promise.resolve(false);
    return ensureUpdateAvailableHint().then(function () {
      return false;
    });
  }

  function fetchRemoteAppShellPayload(attempt) {
    attempt = attempt || 0;
    return fetch(assetPath("offline/app-shell.json?t=" + Date.now()), { cache: "no-store" })
      .then(function (response) {
        if (!response || !response.ok) return null;
        return response.json();
      })
      .then(function (payload) {
        if (payload) return payload;
        if (attempt >= 2) return null;
        return new Promise(function (resolve) {
          window.setTimeout(resolve, 350 * (attempt + 1));
        }).then(function () {
          return fetchRemoteAppShellPayload(attempt + 1);
        });
      })
      .catch(function () {
        if (attempt >= 2) return null;
        return new Promise(function (resolve) {
          window.setTimeout(resolve, 350 * (attempt + 1));
        }).then(function () {
          return fetchRemoteAppShellPayload(attempt + 1);
        });
      });
  }

  function probeRemoteShellVersion() {
    if (!shouldRunShellUpdateCheck()) return Promise.resolve(false);
    var currentMeta = readMetaCacheVersion();
    if (!currentMeta) return Promise.resolve(false);
    return fetchRemoteAppShellPayload().then(function (payload) {
      if (!payload) return false;
      var remote = String(payload.cacheVersion || "").trim();
      var remoteL2 = String(payload.level3ModuleVersion || "").trim();
      var applied = readAppliedShellVersion();
      var shellStale = remote && (remote !== currentMeta || (applied && remote !== applied));
      var remoteModuleStale =
        (remoteL2 && remoteL2 !== LEVEL3_MODULE_VERSION);
      var runtimeModuleStale =
        (level3ModuleReady() && !level3ModuleFresh());
      if (!shellStale && !remoteModuleStale) {
        if (runtimeModuleStale) discardStaleRuntimeModules();
        if (!slideMenuReady()) {
          return loadSlideMenuScript().then(function () {
            return false;
          });
        }
        try {
          if (remote) sessionStorage.removeItem(shellRefreshAttemptKey(remote));
        } catch (_) { }
        if (remote) writeAppliedShellVersion(remote);
        return false;
      }
      var target = remote || currentMeta;
      return reloadShellForRemoteVersion(target);
    }).catch(function () {
      return false;
    });
  }

  function activateRegisteredServiceWorker() {
    if (!("serviceWorker" in navigator)) return Promise.resolve();
    return navigator.serviceWorker.getRegistration(BTCA_BASE).then(function (registration) {
      if (!registration) return;
      var worker = registration.waiting || registration.installing;
      if (!worker) return;
      worker.postMessage({ type: "SKIP_WAITING" });
      return new Promise(function (resolve) {
        if (navigator.serviceWorker.controller) {
          resolve();
          return;
        }
        var timeoutId = window.setTimeout(resolve, 4000);
        function onControllerChange() {
          navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
          window.clearTimeout(timeoutId);
          resolve();
        }
        navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
      });
    }).catch(function () { });
  }

  function cacheHasUnpackedLevel1Media(cache) {
    return cache.keys().then(function (keys) {
      for (var i = 0; i < keys.length; i += 1) {
        if (MEDIA_PROBE_RE.test(keys[i].url || "")) return true;
      }
      return false;
    });
  }

  function verifyMediaCacheReady() {
    if (!("caches" in window)) return Promise.resolve(false);
    return caches.open(MEDIA_CACHE).then(cacheHasUnpackedLevel1Media).catch(function () {
      return false;
    });
  }

  function isDesktopBrowser() {
    return !isStandalone() && !isAppleMobile();
  }

  function shouldForcePortraitLayout() {
    return isStandalone() || isAppleMobile();
  }

  function applyBrowserLayoutMode() {
    document.body.classList.toggle("btca-desktop-browser", isDesktopBrowser());
  }

  function clearLandscapeWindowLayout() {
    document.body.classList.remove("btca-landscape-mode", "btca-force-portrait");
    var root = document.getElementById("root");
    if (!root) return;
    root.style.top = "";
    root.style.left = "";
    root.style.transform = "";
  }

  function updateLandscapeWindowLayout() {
    if (!shouldForcePortraitLayout()) {
      clearLandscapeWindowLayout();
      return;
    }

    var viewport = window.visualViewport;
    var width = Math.round((viewport && viewport.width) || window.innerWidth || document.documentElement.clientWidth || 0);
    var height = Math.round((viewport && viewport.height) || window.innerHeight || document.documentElement.clientHeight || 0);
    if (!width || !height) return;

    document.documentElement.style.setProperty("--btca-viewport-width", width + "px");
    document.documentElement.style.setProperty("--btca-viewport-height", height + "px");
    document.body.classList.toggle("btca-landscape-mode", width > height);
    document.body.classList.remove("btca-force-portrait");

    var root = document.getElementById("root");
    if (!root) return;
    root.style.top = "";
    root.style.left = "";
    root.style.transform = "";
  }

  function getTypographyLayoutWidth() {
    var viewport = window.visualViewport;
    var width = Math.round((viewport && viewport.width) || window.innerWidth || document.documentElement.clientWidth || 0);
    var height = Math.round((viewport && viewport.height) || window.innerHeight || document.documentElement.clientHeight || 0);
    if (!width || !height) return IOS_TYPO_IPHONE_MIN;
    return Math.min(width, height);
  }

  function getEffectiveTypographyWidth() {
    return getTypographyLayoutWidth();
  }

  function isBrowserLoadingHomePage() {
    return !document.body.classList.contains("btca-installed-mode") &&
      !document.body.classList.contains("btca-level1-mode") &&
      !document.body.classList.contains("btca-level3-mode") &&
      !document.body.classList.contains("btca-screen-mode");
  }

  function layoutScaleForWidth(layoutWidth) {
    if (!layoutWidth || layoutWidth >= IOS_TYPO_TABLET_REF) return 1;
    return layoutWidth / IOS_TYPO_TABLET_REF;
  }

  function comfortBodyFont(layoutWidth) {
    var proportional = IOS_TYPO_TABLET_BODY_PX * layoutScaleForWidth(layoutWidth);
    return Math.max(IOS_TYPO_PHONE_BODY_PX, proportional);
  }

  function resetHomePhraseInlineLayout() {
    document.querySelectorAll(".home__phrase--one, .home__phrase--two").forEach(function (el) {
      el.style.top = "";
      el.style.left = "";
      el.style.right = "";
      el.style.transform = "";
      el.style.width = "";
    });
  }

  function resetLoadingHomePhraseLayout() {
    if (!isBrowserLoadingHomePage()) return;
    resetHomePhraseInlineLayout();
  }

  function updateHomePhrasesTabletClass() {
    if (!document.body.classList.contains("btca-installed-mode")) {
      document.body.classList.remove("btca-home-phrases-tablet");
      return;
    }
    var layoutWidth = getTypographyLayoutWidth();
    var useTabletPhrases = layoutWidth >= IOS_TYPO_TABLET_REF;
    document.body.classList.toggle("btca-home-phrases-tablet", useTabletPhrases);
  }

  function syncHomeTaglineLayout() {
    if (!document.body.classList.contains("btca-installed-mode")) {
      resetLoadingHomePhraseLayout();
      return;
    }
    resetHomePhraseInlineLayout();
  }

  function clearComfortTypography() {
    document.body.classList.remove("btca-apple-comfort");
    document.body.classList.remove("btca-home-phrases-tablet");
    document.documentElement.style.fontSize = "";
    document.documentElement.style.removeProperty("--btca-comfort-scale");
    document.documentElement.style.removeProperty("--btca-layout-scale");
    document.documentElement.style.removeProperty("--btca-layout-min");
    document.documentElement.style.removeProperty("--btca-layout-actual");
    document.documentElement.style.removeProperty("--btca-body-font");
    resetLoadingHomePhraseLayout();
  }

  function updateComfortTypography() {
    if (!shouldForcePortraitLayout()) {
      clearComfortTypography();
      return;
    }
    var layoutWidth = getEffectiveTypographyWidth();
    var actualWidth = getTypographyLayoutWidth();
    if (isBrowserLoadingHomePage()) {
      document.body.classList.add("btca-apple-comfort");
      document.documentElement.style.fontSize = "";
      document.documentElement.style.setProperty("--btca-comfort-scale", "1");
      document.documentElement.style.setProperty("--btca-layout-scale", "1");
      document.documentElement.style.setProperty("--btca-layout-min", layoutWidth + "px");
      document.documentElement.style.setProperty("--btca-layout-actual", actualWidth + "px");
      document.documentElement.style.setProperty("--btca-body-font", IOS_TYPO_BASE_PX + "px");
      resetLoadingHomePhraseLayout();
      updateHomePhrasesTabletClass();
      return;
    }
    var layoutScale = layoutScaleForWidth(layoutWidth);
    var bodyFont = Math.round(comfortBodyFont(layoutWidth) * 10) / 10;
    var scale = bodyFont / IOS_TYPO_BASE_PX;
    document.body.classList.add("btca-apple-comfort");
    document.documentElement.style.fontSize = bodyFont + "px";
    document.documentElement.style.setProperty("--btca-comfort-scale", String(scale));
    document.documentElement.style.setProperty("--btca-layout-scale", String(Math.round(layoutScale * 1000) / 1000));
    document.documentElement.style.setProperty("--btca-layout-min", layoutWidth + "px");
    document.documentElement.style.setProperty("--btca-layout-actual", actualWidth + "px");
    document.documentElement.style.setProperty("--btca-body-font", bodyFont + "px");
    updateHomePhrasesTabletClass();
    window.requestAnimationFrame(syncHomeTaglineLayout);
  }

  function syncPortraitModeImmediate() {
    applyBrowserLayoutMode();
    updateComfortTypography();
    updateLandscapeWindowLayout();
    if (!isBrowserLoadingHomePage()) {
      syncHomeTaglineLayout();
    }
  }

  function syncPortraitMode() {
    syncPortraitModeImmediate();
    if (isBrowserLoadingHomePage()) return;
    window.setTimeout(function () {
      syncPortraitModeImmediate();
    }, 80);
    window.setTimeout(function () {
      syncPortraitModeImmediate();
    }, 260);
  }

  function setPanel(html) {
    var panel = getEls().panel;
    if (!panel) return;
    panel.className = "ios-panel ios-panel--open";
    panel.innerHTML = html;
    if (panel.scrollIntoView) {
      panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var DATE_PICKER_MONTHS = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
  ];
  var DATE_PICKER_WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  function dateIsoParts(iso) {
    var match = String(iso || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
  }

  function dateIsoFromParts(y, m, d) {
    return String(y) + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }

  function openCenteredDatePicker(currentIso, onPick, title) {
    var existing = document.getElementById("btca-date-picker-layer");
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var today = new Date();
    var todayIso = dateIsoFromParts(today.getFullYear(), today.getMonth() + 1, today.getDate());
    var selected = dateIsoParts(currentIso) || dateIsoParts(todayIso);
    var viewYear = selected.y;
    var viewMonth = selected.m;
    var selectedIso = dateIsoFromParts(selected.y, selected.m, selected.d);

    var layer = document.createElement("div");
    layer.id = "btca-date-picker-layer";
    layer.className = "btca-date-picker-layer";
    layer.setAttribute("role", "dialog");
    layer.setAttribute("aria-modal", "true");
    layer.setAttribute("aria-label", title || "Выбор даты");
    layer.innerHTML =
      '<button type="button" class="btca-date-picker-layer__backdrop" data-btca-date-close aria-label="Закрыть"></button>' +
      '<div class="btca-date-picker-panel">' +
      '<div class="btca-date-picker-panel__title">' + escapeHtml(title || "Дата") + "</div>" +
      '<div class="btca-date-picker-panel__nav">' +
      '<button type="button" class="btca-date-picker-panel__nav-btn" data-btca-date-prev aria-label="Предыдущий месяц">‹</button>' +
      '<div class="btca-date-picker-panel__month" data-btca-date-month></div>' +
      '<button type="button" class="btca-date-picker-panel__nav-btn" data-btca-date-next aria-label="Следующий месяц">›</button>' +
      "</div>" +
      '<div class="btca-date-picker-panel__week" aria-hidden="true">' +
      DATE_PICKER_WEEKDAYS.map(function (day) { return "<span>" + day + "</span>"; }).join("") +
      "</div>" +
      '<div class="btca-date-picker-panel__grid" data-btca-date-grid></div>' +
      '<button type="button" class="btca-l1-picker-done btca-date-picker-panel__done" data-btca-date-done>Готово</button>' +
      "</div>";
    document.body.appendChild(layer);

    var monthEl = layer.querySelector("[data-btca-date-month]");
    var gridEl = layer.querySelector("[data-btca-date-grid]");
    var closed = false;

    function close() {
      if (closed) return;
      closed = true;
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }

    function confirm() {
      close();
      if (selectedIso) onPick(selectedIso);
    }

    function renderMonth() {
      monthEl.textContent = DATE_PICKER_MONTHS[viewMonth - 1] + " " + viewYear;
      var first = new Date(viewYear, viewMonth - 1, 1);
      var offset = (first.getDay() + 6) % 7;
      var daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
      var cells = [];
      var i;
      for (i = 0; i < offset; i += 1) {
        cells.push('<span class="btca-date-picker-day btca-date-picker-day--empty"></span>');
      }
      for (i = 1; i <= daysInMonth; i += 1) {
        var iso = dateIsoFromParts(viewYear, viewMonth, i);
        var cls = "btca-date-picker-day";
        if (iso === selectedIso) cls += " btca-date-picker-day--selected";
        if (iso === todayIso) cls += " btca-date-picker-day--today";
        cells.push('<button type="button" class="' + cls + '" data-btca-date-day="' + iso + '">' + i + "</button>");
      }
      gridEl.innerHTML = cells.join("");
      gridEl.querySelectorAll("[data-btca-date-day]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          selectedIso = btn.getAttribute("data-btca-date-day");
          renderMonth();
        });
      });
    }

    layer.querySelector("[data-btca-date-prev]").addEventListener("click", function () {
      viewMonth -= 1;
      if (viewMonth < 1) {
        viewMonth = 12;
        viewYear -= 1;
      }
      renderMonth();
    });
    layer.querySelector("[data-btca-date-next]").addEventListener("click", function () {
      viewMonth += 1;
      if (viewMonth > 12) {
        viewMonth = 1;
        viewYear += 1;
      }
      renderMonth();
    });
    layer.querySelector("[data-btca-date-close]").addEventListener("click", close);
    layer.querySelector("[data-btca-date-done]").addEventListener("click", confirm);
    renderMonth();
  }

  function aboutInfoIconHtml() {
    return (
      '<img class="btca-about-info-icon" src="' +
      escapeHtml(assetPath("branding/info.png")) +
      '" alt="" decoding="async" draggable="false">'
    );
  }

  function renderRichText(value) {
    var html = escapeHtml(value)
      .replace(
        /&lt;a href=&quot;([^&]+)&quot;&gt;([\s\S]*?)&lt;\/a&gt;/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>'
      )
      .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>")
      .replace(/\{\{INFO_ICON\}\}/g, aboutInfoIconHtml());
    // Голые https/http (email намеренно не делаем ссылкой)
    html = html.replace(
      /(^|[^">])(https?:\/\/[^\s<]+)/g,
      function (_m, prefix, url) {
        var clean = url.replace(/[.,;:!?)]+$/, "");
        var trail = url.slice(clean.length);
        return (
          prefix +
          '<a href="' +
          clean +
          '" target="_blank" rel="noopener noreferrer">' +
          clean +
          "</a>" +
          trail
        );
      }
    );
    return html;
  }

  function iosInstallGuidanceHtml() {
    var name = resolvePwaShortcutName();
    return (
      '<p class="hint">Offline-пакет подготовлен, далее нужно установить ярлык приложения ' +
      escapeHtml(name) +
      ' - Поделиться → Добавить на экран &quot;Домой&quot;.</p>' +
      '<p class="prepare-status prepare-status--warning">ВНИМАНИЕ. Если ярлык уже установлен, то для корректной работы следует удалить ярлык, а затем перезагрузить страницу и повторить загрузку.</p>'
    );
  }

  function renderProgress(title, percent, message) {
    var pct = Math.max(0, Math.min(100, Math.round(percent)));
    if (isStandalone()) {
      renderHomeSplashIndicator(pct);
      return;
    }
    // Подсказки про ярлык — только при 100% (и в renderReady), не во время загрузки.
    setPanel(
      '<div class="ios-panel__header"><span>' + escapeHtml(title) + "</span><span>" + pct + "%</span></div>" +
      '<div class="progress" aria-label="Прогресс offline-подготовки"><div class="progress__bar" style="width:' + pct + '%"></div></div>' +
      '<p class="prepare-status prepare-status--running">' + escapeHtml(message) + "</p>" +
      (pct >= 100 ? iosInstallGuidanceHtml() : "")
    );
  }

  function renderInfo(title, message) {
    setPanel(
      '<div class="ios-panel__header"><span>' + escapeHtml(title) + "</span></div>" +
      '<p class="hint">' + escapeHtml(message) + "</p>"
    );
  }

  function renderReady() {
    markAppPrepared();
    if (isStandalone()) {
      renderInstalledHome();
      return;
    }
    setPanel(
      '<div class="ios-panel__header"><span>iOS/iPadOS</span><span>100%</span></div>' +
      '<div class="progress" aria-label="Прогресс offline-подготовки"><div class="progress__bar" style="width:100%"></div></div>' +
      '<p class="prepare-status prepare-status--ready">Готово для offline.</p>' +
      iosInstallGuidanceHtml()
    );
  }

  var ABOUT_SWIPE_DISTANCE_PX = 56;
  var ABOUT_SWIPE_HORIZONTAL_DOMINANCE = 1.6;

  function bindAboutBackGestures(el, onBack) {
    if (!el || typeof onBack !== "function") return;
    var startX = 0;
    var startY = 0;
    var tracking = false;
    var lastTap = 0;
    el.addEventListener(
      "touchstart",
      function (event) {
        if (!event.touches || event.touches.length !== 1) return;
        var t = event.target;
        if (t && t.closest && (t.closest("a") || t.closest("button"))) {
          tracking = false;
          return;
        }
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        tracking = true;
      },
      { passive: true }
    );
    el.addEventListener(
      "touchend",
      function (event) {
        var touch = event.changedTouches && event.changedTouches[0];
        if (tracking && touch) {
          tracking = false;
          var dx = touch.clientX - startX;
          var dy = touch.clientY - startY;
          if (
            Math.abs(dx) >= 12 &&
            Math.abs(dx) > Math.abs(dy) * ABOUT_SWIPE_HORIZONTAL_DOMINANCE &&
            dx <= -ABOUT_SWIPE_DISTANCE_PX
          ) {
            onBack();
            return;
          }
        } else {
          tracking = false;
        }
        var t = event.target;
        if (t && t.closest && (t.closest("a") || t.closest("button"))) return;
        if (!event.changedTouches || event.changedTouches.length !== 1) return;
        var now = Date.now();
        if (now - lastTap < 320) {
          lastTap = 0;
          onBack();
          return;
        }
        lastTap = now;
      },
      { passive: true }
    );
    el.addEventListener("dblclick", function (e) {
      if (e.target && e.target.closest && (e.target.closest("a") || e.target.closest("button"))) return;
      e.preventDefault();
      onBack();
    });
  }

  function renderAboutScreen() {
    var root = document.getElementById("root");
    if (!root) return;
    installedHomeSnapshot = installedHomeSnapshot || root.innerHTML;
    document.body.classList.add("btca-screen-mode");
    document.body.classList.remove("btca-installed-mode");
    root.innerHTML =
      '<main class="btca-about-screen">' +
      '<header class="btca-screen-header">' +
      '<button class="btca-back-button" type="button" data-btca-back aria-label="Назад">←</button>' +
      '<strong>О проекте</strong>' +
      '<span aria-hidden="true"></span>' +
      "</header>" +
      '<section class="btca-about-content">' +
      '<h1>' + escapeHtml(ABOUT_HEADING) + "</h1>" +
      '<p>' + renderRichText(ABOUT_MAIN_TEXT.trim()) + "</p>" +
      '<div class="btca-about-spacer"></div>' +
      '<p>' + renderRichText(ABOUT_POST_TEXT.trim()) + "</p>" +
      "</section>" +
      "</main>";
    function goBackAbout() {
      root.innerHTML = installedHomeSnapshot;
      installedHomeSnapshot = "";
      renderInstalledHome();
    }
    var back = document.querySelector("[data-btca-back]");
    if (back) {
      back.addEventListener("click", goBackAbout);
    }
    var aboutMain = root.querySelector(".btca-about-screen");
    bindAboutBackGestures(aboutMain || root, goBackAbout);
    // Загрузчик БТКА — во внешний Safari, не внутрь установленного PWA.
    root.querySelectorAll('a[href*="clc.li/btca-10-1"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        openUrlInExternalSafari(a.getAttribute("href") || "https://clc.li/btca-10-1");
      });
    });
  }

  function removeInjectedScript(attr, src) {
    var old = document.querySelector('script[' + attr + '="' + src + '"]');
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }

  /** Проверка, что fetch вернул JS-модуль, а не HTML-страницу (404 и т.п.). */
  function isInjectableModuleSource(code) {
    var text = String(code || "").trim();
    if (!text) return false;
    if (/^<!DOCTYPE/i.test(text) || /^<html/i.test(text)) return false;
    return /\(function\s*\(/.test(text);
  }

  function loadDataGuardScript() {
    return new Promise(function (resolve, reject) {
      var src = assetPath("btca-data-guard.js?v=" + LEVEL1_MODULE_VERSION);
      if (window.BTCA_DATA_GUARD && document.querySelector('script[data-btca-data-guard-src="' + src + '"]')) {
        resolve();
        return;
      }
      delete window.BTCA_DATA_GUARD;
      fetch(src, { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) throw new Error("Не удалось загрузить " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("Неверный ответ для " + src);
          }
          removeInjectedScript("data-btca-data-guard-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-data-guard-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_DATA_GUARD) {
            throw new Error("btca-data-guard.js выполнен, но BTCA_DATA_GUARD не найден");
          }
          resolve();
        })
        .catch(reject);
    });
  }

  function loadBazaDiagramScript() {
    return new Promise(function (resolve, reject) {
      var src = assetPath("btca-baza-diagram.js?v=" + LEVEL1_MODULE_VERSION);
      if (window.BTCA_BAZA_DIAGRAM && document.querySelector('script[data-btca-baza-diagram-src="' + src + '"]')) {
        resolve();
        return;
      }
      delete window.BTCA_BAZA_DIAGRAM;
      fetch(src, { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) throw new Error("Не удалось загрузить " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("Неверный ответ для " + src);
          }
          removeInjectedScript("data-btca-baza-diagram-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-baza-diagram-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_BAZA_DIAGRAM) {
            throw new Error("btca-baza-diagram.js выполнен, но BTCA_BAZA_DIAGRAM не найден");
          }
          resolve();
        })
        .catch(reject);
    });
  }

  function loadBazaDialogsScript() {
    return new Promise(function (resolve, reject) {
      var src = assetPath("btca-baza-dialogs.js?v=" + LEVEL1_MODULE_VERSION);
      if (window.BTCA_BAZA_DIALOGS && document.querySelector('script[data-btca-baza-dialogs-src="' + src + '"]')) {
        resolve();
        return;
      }
      delete window.BTCA_BAZA_DIALOGS;
      fetch(src, { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) throw new Error("Не удалось загрузить " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("Неверный ответ для " + src);
          }
          removeInjectedScript("data-btca-baza-dialogs-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-baza-dialogs-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_BAZA_DIALOGS) {
            throw new Error("btca-baza-dialogs.js выполнен, но BTCA_BAZA_DIALOGS не найден");
          }
          resolve();
        })
        .catch(reject);
    });
  }

  function loadBazaScreenshotScript() {
    return new Promise(function (resolve, reject) {
      var src = assetPath("btca-baza-screenshot.js?v=" + LEVEL1_MODULE_VERSION);
      if (window.BTCA_BAZA_SCREENSHOT && document.querySelector('script[data-btca-baza-screenshot-src="' + src + '"]')) {
        resolve();
        return;
      }
      delete window.BTCA_BAZA_SCREENSHOT;
      fetch(src, { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) throw new Error("Не удалось загрузить " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("Неверный ответ для " + src);
          }
          removeInjectedScript("data-btca-baza-screenshot-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-baza-screenshot-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_BAZA_SCREENSHOT) {
            throw new Error("btca-baza-screenshot.js выполнен, но BTCA_BAZA_SCREENSHOT не найден");
          }
          resolve();
        })
        .catch(reject);
    });
  }

  function loadBazaSqliteScript() {
    return new Promise(function (resolve, reject) {
      var src = assetPath("btca-baza-sqlite.js?v=" + LEVEL1_MODULE_VERSION);
      if (window.BTCA_BAZA_SQLITE && document.querySelector('script[data-btca-baza-sqlite-src="' + src + '"]')) {
        var preload = window.BTCA_BAZA_SQLITE.ensureSqlJs;
        if (typeof preload === "function") preload().then(resolve).catch(reject);
        else resolve();
        return;
      }
      delete window.BTCA_BAZA_SQLITE;
      fetch(src, { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) throw new Error("Не удалось загрузить " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("Неверный ответ для " + src);
          }
          removeInjectedScript("data-btca-baza-sqlite-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-baza-sqlite-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_BAZA_SQLITE) {
            throw new Error("btca-baza-sqlite.js выполнен, но BTCA_BAZA_SQLITE не найден");
          }
          return window.BTCA_BAZA_SQLITE.ensureSqlJs();
        })
        .then(resolve)
        .catch(reject);
    });
  }

  function loadSlideMenuScript() {
    if (slideMenuReady()) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var src = assetPath("btca-slide-menu.js?v=" + LEVEL1_MODULE_VERSION);
      if (window.BTCA_SLIDE_MENU && document.querySelector('script[data-btca-slide-menu-src="' + src + '"]')) {
        resolve();
        return;
      }
      delete window.BTCA_SLIDE_MENU;
      fetch(src, { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) throw new Error("Не удалось загрузить " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("Неверный ответ для " + src);
          }
          removeInjectedScript("data-btca-slide-menu-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-slide-menu-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_SLIDE_MENU) {
            throw new Error("btca-slide-menu.js выполнен, но BTCA_SLIDE_MENU не найден");
          }
          resolve();
        })
        .catch(reject);
    });
  }

  function level3ModuleReady() {
    return Boolean(
      window.BTCA_LEVEL3_DB &&
      window.BTCA_LEVEL3_BAZA &&
      window.BTCA_LEVEL3 &&
      window.BTCA_LEVEL3.boot
    );
  }

  function level3ModuleFresh() {
    return level3ModuleReady() && window.BTCA_LEVEL3.VERSION === LEVEL3_MODULE_VERSION;
  }

  function loadLevel3Script(src) {
    return new Promise(function (resolve, reject) {
      var isDb = src.indexOf("level3-db") >= 0;
      var isBaza = src.indexOf("level3-baza") >= 0;
      var isApp = src.indexOf("level3-app") >= 0;

      if (isDb && window.BTCA_LEVEL3_DB && document.querySelector('script[data-btca-level3-src="' + src + '"]')) {
        resolve();
        return;
      }
      if (isBaza && window.BTCA_LEVEL3_BAZA && document.querySelector('script[data-btca-level3-src="' + src + '"]')) {
        resolve();
        return;
      }
      if (isApp && level3ModuleFresh() &&
        document.querySelector('script[data-btca-level3-src="' + src + '"]')) {
        resolve();
        return;
      }

      if (isDb) delete window.BTCA_LEVEL3_DB;
      if (isBaza) delete window.BTCA_LEVEL3_BAZA;
      if (isApp) delete window.BTCA_LEVEL3;

      fetch(src, { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) throw new Error("Не удалось загрузить " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("Неверный ответ для " + src);
          }
          removeInjectedScript("data-btca-level3-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-level3-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (isDb && !window.BTCA_LEVEL3_DB) {
            throw new Error("level2-db.js выполнен, но BTCA_LEVEL3_DB не найден");
          }
          if (isBaza && !window.BTCA_LEVEL3_BAZA) {
            throw new Error("level2-baza.js выполнен, но BTCA_LEVEL3_BAZA не найден");
          }
          if (isApp && (!window.BTCA_LEVEL3 || !window.BTCA_LEVEL3.boot)) {
            throw new Error("level2-app.js выполнен, но BTCA_LEVEL3.boot не найден");
          }
          resolve();
        })
        .catch(reject);
    });
  }

  function ensureLevel3Module() {
    if (level3ModuleFresh() && slideMenuReady()) return Promise.resolve();
    if (level3ModuleFresh() && !slideMenuReady()) {
      return loadSlideMenuScript();
    }
    if (level3ModuleReady() && !level3ModuleFresh()) {
      clearInjectedLevel3Scripts();
    }
    var v = LEVEL3_MODULE_VERSION;
    return loadDataGuardScript().then(function () {
      return loadBazaDiagramScript();
    }).then(function () {
      return loadBazaDialogsScript();
    }).then(function () {
      return loadBazaScreenshotScript();
    }).then(function () {
      return loadBazaSqliteScript();
    }).then(function () {
      return loadSlideMenuScript();
    }).then(function () {
      return loadLevel3Script(assetPath("level3/level3-db.js?v=" + v));
    }).then(function () {
      return loadLevel3Script(assetPath("level3/level3-baza.js?v=" + v));
    }).then(function () {
      return loadLevel3Script(assetPath("level3/level3-app.js?v=" + v));
    }).then(function () {
      if (!level3ModuleReady()) {
        throw new Error("Модуль Уровня 3 не инициализирован");
      }
    });
  }

  function bootLevel3Module() {
    return ensureLevel3Module().then(function () {
      return window.BTCA_LEVEL3.boot();
    });
  }

  function preloadLevel3ModuleSilently() {
    return ensureLevel3Module().then(function () {
      return window.BTCA_LEVEL3.boot();
    }).catch(function (error) {
      console.warn("BTCA Level 2 preload failed", error);
    });
  }

  function renderLevel2Screen() {
    var root = document.getElementById("root");
    if (!root) return;

    function openLevel3Screen() {
      installedHomeSnapshot = installedHomeSnapshot || root.innerHTML;
      document.body.classList.add("btca-level1-mode", "btca-level3-mode");
      document.body.classList.remove("btca-installed-mode", "btca-screen-mode");
      root.innerHTML =
        '<main class="btca-level1-screen">' +
        '<header class="btca-level1-nav">' +
        '<button class="btca-back-button" type="button" data-btca-level3-back aria-label="Назад">←</button>' +
        '<strong class="btca-level1-nav__title">Уровень 3 — Продвинутый</strong>' +
        '<button class="btca-level1-menu-button" type="button" data-btca-level3-menu aria-label="Меню листов"><span></span><span></span><span></span></button>' +
        "</header>" +
        '<section class="btca-level1-titlebar" data-btca-level3-titlebar></section>' +
        '<section class="btca-level1-content" data-btca-level3-content></section>' +
        '<div class="btca-level1-menu-layer" data-btca-level3-menu-layer hidden></div>' +
        '<div class="btca-level1-menu-layer" data-btca-level3-picker hidden></div>' +
        '<div class="btca-level1-menu-layer" data-btca-level3-baza-menu-layer hidden></div>' +
        '<div class="btca-level1-menu-layer" data-btca-level3-baza-id-layer hidden></div>' +
        '<div class="btca-level1-menu-layer" data-btca-level3-baza-delete-layer hidden></div>' +
        '<div class="btca-l2-baza-toast-host" data-btca-level3-baza-toast hidden></div>' +
        "</main>";

      var back = document.querySelector("[data-btca-level3-back]");
      if (back) {
        back.addEventListener("click", function () {
          if (window.BTCA_LEVEL3 && window.BTCA_LEVEL3.unmount) window.BTCA_LEVEL3.unmount();
          root.innerHTML = installedHomeSnapshot;
          installedHomeSnapshot = "";
          document.body.classList.remove("btca-level1-mode", "btca-level3-mode", "btca-allow-landscape");
          renderInstalledHome();
        });
      }

      var main = root.querySelector(".btca-level1-screen");
      if (!main) return;

      var content = root.querySelector("[data-btca-level3-content]");
      if (content) {
        content.innerHTML = '<p class="prepare-status prepare-status--running">Загрузка Уровня 2…</p>';
      }

      bootLevel3Module().then(function () {
        return window.BTCA_LEVEL3.mount(main);
      }).catch(function (error) {
        if (content) {
          content.innerHTML = '<p class="btca-l1-error">' + escapeHtml(error && (error.message || error)) + "</p>";
        }
      }).then(function () {
        syncPortraitMode();
      });
    }

    if (isAppPreparedSync()) {
      openLevel3Screen();
      return;
    }

    verifyMediaCacheReady().then(function (ready) {
      if (ready && isPreparedStateCurrent(readAppPreparedState())) markAppPrepared();
      openLevel3Screen();
    }).catch(function () {
      openLevel3Screen();
    });
  }

  function handleAppNavigation(event) {
    var target = event.target && event.target.closest ? event.target.closest("[data-btca-route]") : null;
    if (!target || !document.body.classList.contains("btca-installed-mode")) return;
    event.preventDefault();
    var route = target.getAttribute("data-btca-route");
    if (route === "level3") {
      try {
        renderLevel2Screen();
      } catch (error) {
        console.error("BTCA Level 2 open failed", error);
      }
      return;
    }
    if (route === "about") {
      renderAboutScreen();
      return;
    }
    if (route === "account-update") {
      openDownloadsFromAccountLink();
    }
  }

  var PHRASE_ONE_DEFAULT_TEXT = " Бильярдный\nТренировочный";
  var PHRASE_ONE_TABLET_HTML =
    '<span class="home__phrase1-line1">  Бильярдный</span>' +
    '<span class="home__phrase1-line2"> Тренировочный</span>';
  var PHRASE_TWO_LINE2_BASE = "            Абриколь";
  var PHRASE_TWO_LINE2_TABLET = "              Абриколь";
  var PHRASE_TWO_TABLET_HTML =
    '<span class="home__phrase2-line1">Комплекс</span>' +
    '<span class="home__phrase2-line2">' + PHRASE_TWO_LINE2_TABLET + '</span>';

  function normalizeHomePhraseOneDefault() {
    var slot = document.querySelector(".home__tagline-slot");
    if (!slot) return;
    var phraseOne =
      slot.querySelector(".home__phrase--one-default") ||
      slot.querySelector(".home__phrase--one:not(.home__phrase--one-tablet)");
    if (!phraseOne) return;
    phraseOne.classList.add("home__phrase--one-default");
    if (phraseOne.textContent !== PHRASE_ONE_DEFAULT_TEXT) {
      phraseOne.textContent = PHRASE_ONE_DEFAULT_TEXT;
    }
  }

  function cleanupOrphanHomePhraseMarkup() {
    if (document.body.classList.contains("btca-installed-mode")) return;
    var slot = document.querySelector(".home__tagline-slot");
    if (!slot) return;

    normalizeHomePhraseOneDefault();

    var phraseTwoAll = slot.querySelectorAll(".home__phrase--two");
    if (phraseTwoAll.length > 1) {
      var keeper = slot.querySelector(".home__phrase--two:not(.home__phrase--two-tablet)") || phraseTwoAll[0];
      phraseTwoAll.forEach(function (el) {
        if (el !== keeper && el.parentNode) el.parentNode.removeChild(el);
      });
    }

    var phraseTwo = slot.querySelector(".home__phrase--two:not(.home__phrase--two-tablet)");
    if (phraseTwo) {
      phraseTwo.classList.remove("home__phrase--two-default", "home__phrase--two-tablet");
      if (!document.body.classList.contains("btca-installed-mode")) {
        var line2 = phraseTwo.querySelector(".home__phrase2-line2");
        if (line2) line2.textContent = PHRASE_TWO_LINE2_BASE;
      }
    }

    slot.querySelectorAll(".home__phrase--two-tablet").forEach(function (el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
  }

  function ensurePhraseTwoTabletMarkup() {
    if (!document.body.classList.contains("btca-installed-mode")) return;
    var slot = document.querySelector(".home__tagline-slot");
    if (!slot) return;
    var defaultPhrase = slot.querySelector(".home__phrase--two:not(.home__phrase--two-tablet)");
    var tablet = slot.querySelector(".home__phrase--two-tablet");
    if (!tablet) {
      tablet = document.createElement("div");
      tablet.className = "home__phrase home__phrase--two home__phrase--two-tablet";
      tablet.innerHTML = PHRASE_TWO_TABLET_HTML;
      if (defaultPhrase && defaultPhrase.parentNode) {
        defaultPhrase.parentNode.insertBefore(tablet, defaultPhrase.nextSibling);
      } else {
        slot.appendChild(tablet);
      }
      return;
    }
    var line2 = tablet.querySelector(".home__phrase2-line2");
    if (!line2 || line2.textContent !== PHRASE_TWO_LINE2_TABLET) {
      tablet.innerHTML = PHRASE_TWO_TABLET_HTML;
    }
  }

  function ensurePhraseOneTabletMarkup() {
    var slot = document.querySelector(".home__tagline-slot");
    if (!slot) return;
    normalizeHomePhraseOneDefault();
    var defaultPhrase = slot.querySelector(".home__phrase--one-default");
    if (!defaultPhrase) {
      var legacy = slot.querySelector(".home__phrase--one:not(.home__phrase--one-tablet)");
      if (legacy) {
        legacy.classList.add("home__phrase--one-default");
        defaultPhrase = legacy;
      }
    }
    var tablet = slot.querySelector(".home__phrase--one-tablet");
    if (!tablet) {
      tablet = document.createElement("p");
      tablet.className = "home__phrase home__phrase--one home__phrase--one-tablet";
      tablet.innerHTML = PHRASE_ONE_TABLET_HTML;
      if (defaultPhrase && defaultPhrase.parentNode) {
        defaultPhrase.parentNode.insertBefore(tablet, defaultPhrase.nextSibling);
      } else {
        slot.appendChild(tablet);
      }
      return;
    }
    var line1 = tablet.querySelector(".home__phrase1-line1");
    var line2 = tablet.querySelector(".home__phrase1-line2");
    if (
      !line1 ||
      !line2 ||
      line1.textContent !== "  Бильярдный" ||
      line2.textContent !== " Тренировочный"
    ) {
      tablet.innerHTML = PHRASE_ONE_TABLET_HTML;
    }
  }

  function markStandaloneShellReady() {
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.classList.add("btca-shell-ready");
    }
  }

  // Загрузочная на GitHub Pages; OTP/подписка — License API на ProHoster.
  // LICENSE_* ключи объявлены выше (рядом с identity persist).

  function isGitHubPagesHost() {
    try {
      return window.location.hostname.indexOf("github.io") >= 0;
    } catch (e) {
      return false;
    }
  }

  function generateClientPassword() {
    var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    var out = "";
    try {
      var arr = new Uint32Array(12);
      if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        crypto.getRandomValues(arr);
        for (var i = 0; i < 12; i++) out += alphabet[arr[i] % alphabet.length];
        return out;
      }
    } catch (e) { }
    for (var j = 0; j < 12; j++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
    return out;
  }

  function passwordFieldHtml(name, label, required, withGenerator) {
    var auto =
      name === "new_password" || name === "password" ? "new-password" : "current-password";
    var genHtml = withGenerator
      ? '<button type="button" class="auth-gate__pw-gen" data-pw-gen="' +
      name +
      '" title="Сгенерировать пароль" aria-label="Сгенерировать пароль">' +
      '<img class="auth-gate__pw-gen-img" src="' +
      assetPath("branding/generate.png") +
      '" alt="" width="40" height="20" decoding="async" />' +
      "</button>"
      : "";
    return (
      '<label class="auth-gate__field"><span>' +
      escapeHtml(label) +
      "</span>" +
      '<div class="auth-gate__password-row' +
      (withGenerator ? " auth-gate__password-row--gen" : "") +
      '">' +
      '<input name="' +
      name +
      '" type="text" autocomplete="' +
      auto +
      '" ' +
      (required ? "required " : "") +
      'minlength="6" maxlength="128" placeholder=""/>' +
      genHtml +
      "</div></label>"
    );
  }

  function emailOtpCheckboxHtml(checked, disabled) {
    return (
      '<label class="auth-gate__check' +
      (disabled ? " auth-gate__check--disabled" : "") +
      '">' +
      '<input name="auth_by_email_otp" type="checkbox"' +
      (checked ? " checked" : "") +
      (disabled ? " disabled" : "") +
      "/>" +
      "<span>Вход по коду на e-mail (вместо пароля)</span></label>"
    );
  }

  function syncEmailOtpCheckbox(scope) {
    if (!scope) return;
    var emailInput = scope.querySelector('input[name="email"]');
    var otpBox = scope.querySelector('input[name="auth_by_email_otp"]');
    var label = otpBox
      ? otpBox.closest(".auth-gate__check, .account-modal__check")
      : null;
    if (!emailInput || !otpBox || !label) return;
    var hasEmail = Boolean(String(emailInput.value || "").trim());
    otpBox.disabled = !hasEmail;
    if (!hasEmail) otpBox.checked = false;
    label.classList.toggle("auth-gate__check--disabled", !hasEmail);
    label.classList.toggle("account-modal__check--disabled", !hasEmail);
  }

  function wireEmailOtpCheckbox(scope) {
    if (!scope || scope.getAttribute("data-otp-email-wired") === "1") return;
    var emailInput = scope.querySelector('input[name="email"]');
    if (!emailInput) return;
    scope.setAttribute("data-otp-email-wired", "1");
    emailInput.addEventListener("input", function () {
      syncEmailOtpCheckbox(scope);
    });
    emailInput.addEventListener("change", function () {
      syncEmailOtpCheckbox(scope);
    });
    syncEmailOtpCheckbox(scope);
  }

  function isSafariBrowser() {
    var ua = navigator.userAgent || "";
    // Чистый Safari (не Chrome/Edge/Firefox/Opera на iOS/desktop).
    return /Safari/i.test(ua) && !/Chrome|CriOS|Chromium|Edg|EdgiOS|OPR|Firefox|FxiOS|Android/i.test(ua);
  }

  function readPwaSessionStartedAt() {
    try {
      var n = Number(sessionStorage.getItem(PWA_SESSION_STARTED_KEY) || 0);
      return n > 0 ? n : 0;
    } catch (e) {
      return 0;
    }
  }

  function isPwaSessionExpiredFlag() {
    try {
      return sessionStorage.getItem(PWA_SESSION_EXPIRED_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function isPwaSessionTimedOut() {
    if (!isStandalone()) return false;
    if (isPwaSessionExpiredFlag()) return true;
    var started = readPwaSessionStartedAt();
    if (!started) return false;
    return Date.now() - started >= PWA_SESSION_MAX_MS;
  }

  /** Старт часов сессии после успешного splash (online или offline-unlock). */
  function markPwaSessionStarted() {
    if (!isStandalone()) return;
    try {
      sessionStorage.removeItem(PWA_SESSION_EXPIRED_KEY);
      if (!readPwaSessionStartedAt()) {
        sessionStorage.setItem(PWA_SESSION_STARTED_KEY, String(Date.now()));
      }
    } catch (e) { }
  }

  function renderSessionExpiredGate() {
    pendingInstalledLoginReveal = false;
    hideHomeSplashIndicator();
    try {
      if (window.BTCA_LEVEL3 && window.BTCA_LEVEL3.unmount) window.BTCA_LEVEL3.unmount();
    } catch (e) { }
    document.body.classList.remove("btca-level1-mode", "btca-level3-mode", "btca-allow-landscape");
    document.body.classList.add("btca-installed-mode");
    var root = document.getElementById("root");
    if (root) {
      root.innerHTML =
        '<main class="app btca-session-expired" aria-live="assertive">' +
        '<section class="auth-gate" style="display:block;padding:2rem 1.25rem;max-width:28rem;margin:20vh auto 0;text-align:center">' +
        '<p class="auth-gate__title">Сессия завершена</p>' +
        '<p class="auth-gate__hint auth-gate__hint--danger">' +
        escapeHtml(PWA_SESSION_EXPIRED_MSG) +
        "</p></section></main>";
    }
    try {
      window.close();
    } catch (e) { }
  }

  function lockPwaSessionExpired() {
    if (!isStandalone()) return;
    try {
      sessionStorage.setItem(PWA_SESSION_EXPIRED_KEY, "1");
    } catch (e) { }
    clearLaunchUnlock();
    renderSessionExpiredGate();
  }

  function enforcePwaSessionLimit() {
    if (!isStandalone()) return false;
    if (!isPwaSessionTimedOut()) return false;
    lockPwaSessionExpired();
    return true;
  }

  function startPwaSessionWatch() {
    if (!isStandalone()) return;
    if (pwaSessionWatchTimer) return;
    enforcePwaSessionLimit();
    pwaSessionWatchTimer = window.setInterval(function () {
      enforcePwaSessionLimit();
    }, 60000);
    document.addEventListener(
      "visibilitychange",
      function () {
        if (document.visibilityState === "visible") enforcePwaSessionLimit();
      },
      false
    );
    window.addEventListener(
      "pageshow",
      function () {
        enforcePwaSessionLimit();
      },
      false
    );
  }

  function isLaunchUnlocked() {
    try {
      // Лимит 12 ч без смахивания: дальше только ручной перезапуск.
      if (isStandalone() && isPwaSessionTimedOut()) return false;
      // Вкладка после успешного входа (sessionStorage сбрасывается при закрытии вкладки / перезагрузке в Safari).
      if (sessionStorage.getItem(LICENSE_LAUNCH_KEY) === "1") return true;
      // Только установленный PWA: можно восстановить по session token без повторного входа.
      if (isStandalone()) {
        var token = localStorage.getItem(LICENSE_SESSION_KEY);
        return Boolean(token && token.length >= 16);
      }
      // Safari и прочие браузеры на загрузочной: после перезагрузки — снова «Вход в систему».
      return false;
    } catch (e) {
      return false;
    }
  }

  function readSessionToken() {
    try {
      return String(localStorage.getItem(LICENSE_SESSION_KEY) || "").trim();
    } catch (e) {
      return "";
    }
  }

  function clearLaunchUnlock() {
    try {
      sessionStorage.removeItem(LICENSE_LAUNCH_KEY);
      localStorage.removeItem(LICENSE_LAUNCH_KEY);
    } catch (e) { }
  }

  function markLaunchUnlocked(token) {
    try {
      if (token) localStorage.setItem(LICENSE_SESSION_KEY, token);
      sessionStorage.setItem(LICENSE_LAUNCH_KEY, "1");
      var login = String(localStorage.getItem(LICENSE_LOGIN_KEY) || "").trim();
      if (login) {
        persistLicenseIdentity(login, localStorage.getItem(LICENSE_AUTH_OTP_KEY) === "1");
      }
    } catch (e) { }
  }

  function wantsOpenDownloads() {
    try {
      return new URLSearchParams(window.location.search).get("open") === "downloads";
    } catch (e) {
      return false;
    }
  }

  function stripOpenDownloadsQuery() {
    try {
      var url = new URL(window.location.href);
      if (!url.searchParams.has("open")) return;
      url.searchParams.delete("open");
      var q = url.searchParams.toString();
      window.history.replaceState(null, "", url.pathname + (q ? "?" + q : "") + url.hash);
    } catch (_) { }
  }

  function mintDownloadLinksForSession() {
    var token = readSessionToken();
    if (!token) return Promise.reject(new Error("Сессия не найдена"));
    return licensePost("/v1/downloads/links", { session_token: token }).then(function (data) {
      var links = (data && data.download_links) || {};
      try {
        sessionStorage.setItem(LICENSE_DOWNLOAD_LINKS_KEY, JSON.stringify(links));
      } catch (e) { }
      if (data && data.paid_until) storePaidUntil(data.paid_until);
      return links;
    });
  }

  /** Открыть URL во внешнем Safari (из standalone PWA), не подменяя экран приложения. */
  function openUrlInExternalSafari(url) {
    var target = String(url || "").trim();
    if (!target) return;
    if (isStandalone()) {
      try {
        var safariScheme = target
          .replace(/^https:\/\//i, "x-safari-https://")
          .replace(/^http:\/\//i, "x-safari-http://");
        var probe = document.createElement("a");
        probe.href = safariScheme;
        probe.target = "_blank";
        probe.rel = "noopener noreferrer";
        probe.style.display = "none";
        document.body.appendChild(probe);
        probe.click();
        probe.remove();
        return;
      } catch (e) { }
      try {
        var opened = window.open(target, "_blank", "noopener,noreferrer");
        if (opened) return;
      } catch (e2) { }
    }
    try {
      window.open(target, "_blank", "noopener,noreferrer");
    } catch (e3) {
      window.location.href = target;
    }
  }

  function openDownloadsFromAccountLink() {
    var url =
      LOADING_PAGE_URL + (LOADING_PAGE_URL.indexOf("?") >= 0 ? "&" : "?") + "open=downloads";
    openUrlInExternalSafari(url);
  }

  function enterDownloadsViewFromSession() {
    document.body.classList.remove("btca-installed-mode", "btca-screen-mode", "btca-level1-mode", "btca-level3-mode");
    stripOpenDownloadsQuery();
    var gate = document.getElementById("btca-auth-gate");
    if (gate) gate.setAttribute("hidden", "hidden");
    hideHomeSplashIndicator();
    return mintDownloadLinksForSession()
      .then(function () {
        markLaunchUnlocked();
        showPlatformMenuUnlocked();
      })
      .catch(function () {
        clearLaunchUnlock();
        gateLoadingHome();
      });
  }

  function storePaidUntil(value) {
    try {
      if (value) localStorage.setItem(PAID_UNTIL_KEY, String(value));
    } catch (e) { }
  }

  /** Серверный короткий ID после claim. Пусто — устройство ещё не привязано. */
  function getLicenseDeviceId() {
    try {
      var fromCookie = readDeviceCookie();
      if (fromCookie && fromCookie.length >= 6) {
        try {
          localStorage.setItem(LICENSE_DEVICE_KEY, fromCookie);
        } catch (e) { }
        return fromCookie;
      }
      var existing = localStorage.getItem(LICENSE_DEVICE_KEY);
      if (existing && String(existing).trim().length >= 6) {
        writeDeviceCookie(String(existing).trim());
        return String(existing).trim();
      }
      try {
        var fromJson = JSON.parse(localStorage.getItem("btca101.identityJson") || "null");
        if (fromJson && fromJson.device_id && String(fromJson.device_id).trim().length >= 6) {
          return persistLicenseDeviceId(String(fromJson.device_id).trim());
        }
      } catch (e) { }
      return "";
    } catch (e) {
      return "";
    }
  }

  /** До splash: подтянуть серверный device_id из cookie / IDB / cache (без генерации). */
  function ensureLicenseDeviceIdReady() {
    var fromCookie = readDeviceCookie();
    if (fromCookie.length >= 6) {
      persistLicenseDeviceId(fromCookie);
      return Promise.resolve(fromCookie);
    }
    var current = "";
    try {
      current = String(localStorage.getItem(LICENSE_DEVICE_KEY) || "").trim();
    } catch (e) { }
    if (current.length >= 6) {
      writeDeviceCookie(current);
      return Promise.resolve(current);
    }
    return readIdentityFromIdb()
      .then(function (data) {
        var fromIdb = data && String(data.device_id || "").trim();
        if (fromIdb.length >= 6) {
          persistLicenseDeviceId(fromIdb);
          return fromIdb;
        }
        return readIdentityFromAnyCache().then(function (cached) {
          var fromCache = cached && String(cached.device_id || "").trim();
          if (fromCache.length >= 6) {
            persistLicenseDeviceId(fromCache);
            return fromCache;
          }
          return "";
        });
      })
      .catch(function () {
        return "";
      });
  }

  function licensePost(path, body) {
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = window.setTimeout(function () {
      try {
        if (ctrl) ctrl.abort();
      } catch (e) { }
    }, 20000);
    // Cross-origin с github.io: без cookies (иначе Safari режет CORS * + credentials).
    return fetch(LICENSE_API_BASE + path, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: ctrl ? ctrl.signal : undefined,
    })
      .then(function (response) {
        return response.text().then(function (raw) {
          var data = null;
          try {
            data = raw ? JSON.parse(raw) : null;
          } catch (e) {
            data = null;
          }
          if (!response.ok) {
            var detail = data && data.detail;
            var message = formatLicenseApiDetail(detail, response.status);
            throw new Error(message);
          }
          if (!data || typeof data !== "object") {
            throw new Error("Сервер лицензий недоступен (" + response.status + ")");
          }
          return data;
        });
      })
      .catch(function (err) {
        if (err && err.name === "AbortError") {
          throw new Error("Сервер не ответил. Проверьте сеть и нажмите ещё раз.");
        }
        var raw = err && err.message ? String(err.message) : String(err || "");
        // Safari/WebKit часто отдаёт английский «Load failed» / «Failed to fetch».
        if (
          /load failed/i.test(raw) ||
          /failed to fetch/i.test(raw) ||
          /networkerror/i.test(raw) ||
          /network request failed/i.test(raw) ||
          /the internet connection appears to be offline/i.test(raw)
        ) {
          throw new Error("Не удалось связаться с сервером. Проверьте сеть и повторите.");
        }
        if (err instanceof Error) throw err;
        throw new Error(raw || "Ошибка запроса");
      })
      .then(
        function (data) {
          window.clearTimeout(timer);
          return data;
        },
        function (err) {
          window.clearTimeout(timer);
          throw err;
        }
      );
  }

  function formatLicenseApiDetail(detail, status) {
    if (typeof detail === "string" && detail.trim()) return detail.trim();
    if (Array.isArray(detail) && detail.length) {
      var parts = [];
      for (var i = 0; i < detail.length; i++) {
        var item = detail[i];
        if (!item) continue;
        if (typeof item === "string") {
          parts.push(item);
          continue;
        }
        var locParts = Array.isArray(item.loc) ? item.loc : [];
        var field = "";
        for (var j = locParts.length - 1; j >= 0; j--) {
          if (locParts[j] !== "body" && locParts[j] !== "__root__") {
            field = String(locParts[j] || "");
            break;
          }
        }
        if (field === "code") {
          parts.push("Введите код из 6 цифр");
          continue;
        }
        if (field === "login") {
          parts.push("Укажите логин");
          continue;
        }
        if (field === "password") {
          parts.push("Укажите пароль");
          continue;
        }
        if (item.msg) parts.push(String(item.msg));
      }
      if (parts.length) return parts.join(". ");
    }
    if (detail && typeof detail === "object" && detail.msg) return String(detail.msg);
    return "Ошибка " + (status || "запроса");
  }

  function localizeUserFacingError(error, fallback) {
    var raw = error && error.message ? String(error.message) : String(error || "");
    if (!raw) return fallback || "Ошибка запроса";
    if (/load failed/i.test(raw) || /failed to fetch/i.test(raw) || /networkerror/i.test(raw)) {
      return "Не удалось связаться с сервером. Проверьте сеть и повторите.";
    }
    if (/internal server error/i.test(raw) || /error 500/i.test(raw) || raw === "Ошибка 500") {
      return "Ошибка сервера. Повторите попытку через минуту.";
    }
    if (/unique constraint/i.test(raw) || /integrityerror/i.test(raw)) {
      return "Повторное скачивание разрешено. Обновите страницу и нажмите ещё раз.";
    }
    if (/не\s*правильный код|неверный код|код введён неправильно/i.test(raw)) {
      return "Не правильный Код.";
    }
    if (/не\s*правильный логин|неверный логин/i.test(raw)) {
      return "Не правильный Логин или Пароль.";
    }
    if (/код истёк/i.test(raw)) {
      return "Код истёк. Запросите новый.";
    }
    if (/central directory|invalid zip|corrupted zip|not a zip|zip file/i.test(raw)) {
      return "Архив медиа повреждён при загрузке. Обновите страницу и нажмите загрузку ещё раз.";
    }
    // Не показываем сырой английский текст браузера.
    if (/^[A-Za-z][A-Za-z0-9 _.,:;'"()%/+-]{0,120}$/.test(raw) && !/[А-Яа-яЁё]/.test(raw)) {
      return fallback || "Ошибка запроса. Повторите попытку.";
    }
    return raw;
  }

  function ensureAuthGateMount() {
    var home = document.querySelector(".home");
    if (!home) return null;
    var gate = document.getElementById("btca-auth-gate");
    if (gate) return gate;
    gate = document.createElement("section");
    gate.id = "btca-auth-gate";
    gate.className = "auth-gate";
    gate.setAttribute("aria-label", "Вход в БТКА");
    var intro = document.querySelector(".home__intro");
    if (intro && intro.parentNode === home) {
      home.insertBefore(gate, intro.nextSibling);
    } else {
      home.appendChild(gate);
    }
    return gate;
  }

  function setLoadingIntroLocked(locked) {
    var title = document.getElementById("app-title");
    var intro = document.querySelector(".home__intro");
    if (title) {
      title.textContent = locked ? "Вход в систему" : "Выберите вариант загрузки";
    }
    if (!intro) return;
    var paragraphs = intro.querySelectorAll("p:not(.eyebrow)");
    if (paragraphs.length) {
      paragraphs[paragraphs.length - 1].textContent = locked
        ? "Войдите или зарегистрируйтесь. После проверки данных станут доступны варианты загрузки."
        : "Для Android и Windows будет скачан дистрибутив. Для iPhone и iPad приложение подготовит данные на устройстве, чтобы дальше работать без сети.";
    }
  }

  function readStoredDownloadLinks() {
    try {
      var raw = sessionStorage.getItem(LICENSE_DOWNLOAD_LINKS_KEY);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch (e) {
      return {};
    }
  }

  var PLATFORM_LINKS_HINT =
    "Ссылки для загрузки действительны в течение 1 часа";
  var LOADING_PAGE_URL = "https://alintual.github.io/btca-10-1/";
  var PACKAGE_APP_VERSION = "10.1";
  var DOWNLOAD_MENU_SHOWN_KEY = "btca101.downloadMenuShownAt";
  var PAID_UNTIL_KEY = "btca101.paidUntil";
  var downloadMenuExpireTimer = null;

  function formatDateRu(value) {
    if (!value) return "";
    var raw = String(value).trim();
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(raw)) return raw;
    var d = new Date(raw);
    if (isNaN(d.getTime())) return raw.slice(0, 10);
    try {
      return new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Asia/Krasnoyarsk",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(d);
    } catch (e) {
      var dd = String(d.getDate()).padStart(2, "0");
      var mm = String(d.getMonth() + 1).padStart(2, "0");
      return dd + "." + mm + "." + d.getFullYear();
    }
  }

  function readPaidUntilLabel() {
    try {
      var paid = localStorage.getItem(PAID_UNTIL_KEY) || "";
      var date = formatDateRu(paid);
      return date ? "Подписка активна по " + date : "";
    } catch (e) {
      return "";
    }
  }

  function ensurePlatformDownloadHint(show) {
    var menu = document.querySelector(".platform-menu");
    if (!menu) return;
    var hint = document.getElementById("btca-download-links-hint");
    if (!hint) {
      hint = document.createElement("p");
      hint.id = "btca-download-links-hint";
      hint.className = "platform-menu__links-hint";
      hint.textContent = PLATFORM_LINKS_HINT;
      menu.insertAdjacentElement("afterend", hint);
    }
    var accountBtn = document.getElementById("btca-account-btn");
    if (!accountBtn) {
      accountBtn = document.createElement("button");
      accountBtn.type = "button";
      accountBtn.id = "btca-account-btn";
      accountBtn.className = "platform-button platform-button--account";
      accountBtn.innerHTML = "<span>Аккаунт</span>";
      accountBtn.onclick = function (event) {
        if (event) event.preventDefault();
        openAccountModal();
      };
      hint.insertAdjacentElement("afterend", accountBtn);
    }
    var subLine = document.getElementById("btca-subscription-line");
    if (!subLine) {
      subLine = document.createElement("p");
      subLine.id = "btca-subscription-line";
      subLine.className = "platform-menu__account-sub";
      accountBtn.insertAdjacentElement("afterend", subLine);
    }
    var subText = readPaidUntilLabel();
    subLine.textContent = subText;
    if (show) {
      hint.removeAttribute("hidden");
      accountBtn.removeAttribute("hidden");
      if (subText) subLine.removeAttribute("hidden");
      else subLine.setAttribute("hidden", "hidden");
    } else {
      hint.setAttribute("hidden", "hidden");
      accountBtn.setAttribute("hidden", "hidden");
      subLine.setAttribute("hidden", "hidden");
    }
  }

  function expireDownloadMenuToLogin() {
    try {
      sessionStorage.removeItem(DOWNLOAD_MENU_SHOWN_KEY);
      sessionStorage.removeItem(LICENSE_DOWNLOAD_LINKS_KEY);
      sessionStorage.removeItem(LICENSE_LAUNCH_KEY);
      localStorage.removeItem(LICENSE_SESSION_KEY);
    } catch (e) { }
    clearLaunchUnlock();
    ensurePlatformDownloadHint(false);
    clearDownloadLimitWarning();
    var menu = document.querySelector(".platform-menu");
    var panel = getEls().panel;
    if (menu) menu.setAttribute("hidden", "hidden");
    if (panel) panel.setAttribute("hidden", "hidden");
    setLoadingIntroLocked(true);
    renderAuthGate(function () {
      showPlatformMenuUnlocked();
    });
  }

  function scheduleDownloadMenuExpiry() {
    if (downloadMenuExpireTimer) {
      window.clearTimeout(downloadMenuExpireTimer);
      downloadMenuExpireTimer = null;
    }
    var shownAt = 0;
    try {
      shownAt = Number(sessionStorage.getItem(DOWNLOAD_MENU_SHOWN_KEY) || 0);
    } catch (e) { }
    if (!shownAt) return;
    var left = shownAt + 3600000 - Date.now();
    if (left <= 0) {
      expireDownloadMenuToLogin();
      return;
    }
    downloadMenuExpireTimer = window.setTimeout(function () {
      expireDownloadMenuToLogin();
    }, left);
  }

  function claimPlatformDownload(platform, label) {
    var token = readSessionToken();
    if (!token) {
      return Promise.reject(new Error("Сессия не найдена. Войдите ещё раз."));
    }
    var versionDate = readLatestPackageReleaseDate();
    return licensePost("/v1/downloads/claim", {
      session_token: token,
      device_id: getLicenseDeviceId() || "",
      platform: platform,
      app_version: PACKAGE_APP_VERSION,
      device_label: label || platform,
      version_date: versionDate || "",
    }).then(function (data) {
      var assigned = data && String(data.device_id || "").trim();
      if (assigned.length >= 6) {
        persistLicenseDeviceId(assigned);
      }
      if (versionDate) persistPackageReleaseDate(versionDate);
      try {
        var login = String(localStorage.getItem(LICENSE_LOGIN_KEY) || "").trim() || readLoginCookie();
        if (login) {
          persistLicenseIdentity(login, localStorage.getItem(LICENSE_AUTH_OTP_KEY) === "1");
        }
      } catch (e) { }
      return data;
    });
  }

  function showDownloadLimitWarning(message) {
    var existing = document.getElementById("btca-download-limit-warn");
    if (!existing) {
      existing = document.createElement("p");
      existing.id = "btca-download-limit-warn";
      existing.className = "platform-menu__limit-warn";
      var hint = document.getElementById("btca-download-links-hint");
      if (hint && hint.parentNode) hint.parentNode.insertBefore(existing, hint.nextSibling);
      else {
        var menu = document.querySelector(".platform-menu");
        if (menu) menu.insertAdjacentElement("afterend", existing);
      }
    }
    existing.textContent = message || "Превышен лимит скачиваний.";
    existing.removeAttribute("hidden");
  }

  function clearDownloadLimitWarning() {
    var existing = document.getElementById("btca-download-limit-warn");
    if (existing) existing.setAttribute("hidden", "hidden");
  }

  function ensureAccountModalMount() {
    var modal = document.getElementById("btca-account-modal");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "btca-account-modal";
    modal.className = "account-modal";
    modal.setAttribute("hidden", "hidden");
    modal.innerHTML =
      '<div class="account-modal__card" role="dialog" aria-labelledby="btca-account-title">' +
      '<button type="button" class="account-modal__close" data-account-close aria-label="Закрыть">×</button>' +
      '<h2 id="btca-account-title" class="account-modal__title">Аккаунт</h2>' +
      '<form class="account-modal__form" novalidate>' +
      '<label class="account-modal__field"><span>Логин</span><input name="login" readonly tabindex="-1"/></label>' +
      '<label class="account-modal__field"><span>Активный пароль</span><input name="current_password" type="text" autocomplete="current-password" minlength="6" maxlength="128" placeholder="Введите текущий для смены"/></label>' +
      passwordFieldHtml("new_password", "Новый пароль", false, true).replace(/auth-gate__/g, "account-modal__") +
      '<label class="account-modal__field"><span>E-mail</span><input name="email" type="email" autocomplete="email" maxlength="255"/></label>' +
      emailOtpCheckboxHtml(false, true).replace(/auth-gate__/g, "account-modal__") +
      '<label class="account-modal__field"><span>Подписка</span><input name="subscription" readonly tabindex="-1"/></label>' +
      '<p class="account-modal__error" data-account-error hidden></p>' +
      '<button class="platform-button account-modal__save" type="submit"><span>Сохранить</span></button>' +
      "</form></div>";
    document.body.appendChild(modal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal || (event.target && event.target.getAttribute("data-account-close") != null)) {
        modal.setAttribute("hidden", "hidden");
      }
      var gen = event.target && event.target.closest ? event.target.closest("[data-pw-gen]") : null;
      if (gen) {
        event.preventDefault();
        var field = modal.querySelector('input[name="' + gen.getAttribute("data-pw-gen") + '"]');
        if (field) field.value = generateClientPassword();
      }
    });
    var form = modal.querySelector("form");
    if (form) {
      wireEmailOtpCheckbox(form);
      form.onsubmit = function (event) {
        event.preventDefault();
        var err = modal.querySelector("[data-account-error]");
        if (err) {
          err.setAttribute("hidden", "hidden");
          err.textContent = "";
        }
        var token = readSessionToken();
        var emailInput = form.querySelector('input[name="email"]');
        var otpInput = form.querySelector('input[name="auth_by_email_otp"]');
        var currentPw = form.querySelector('input[name="current_password"]');
        var newPw = form.querySelector('input[name="new_password"]');
        var email = emailInput ? emailInput.value.trim() : "";
        var wantOtp = Boolean(otpInput && otpInput.checked);
        if (wantOtp && !email) {
          if (err) {
            err.removeAttribute("hidden");
            err.textContent = "Для авторизации по коду укажите E-mail.";
          }
          return false;
        }
        var payload = {
          session_token: token,
          email: email,
          auth_by_email_otp: wantOtp,
        };
        var newPassword = newPw ? String(newPw.value || "") : "";
        if (newPassword) {
          payload.current_password = currentPw ? String(currentPw.value || "") : "";
          payload.new_password = newPassword;
        }
        licensePost("/v1/account/update", payload)
          .then(function (data) {
            try {
              if (data.login) persistLicenseIdentity(data.login, data.auth_by_email_otp);
              else {
                try {
                  localStorage.setItem(LICENSE_AUTH_OTP_KEY, data.auth_by_email_otp ? "1" : "0");
                } catch (e) { }
              }
            } catch (e) { }
            if (data.subscription && data.subscription.paid_until) {
              storePaidUntil(data.subscription.paid_until);
            }
            var menuVisible = document.querySelector(".platform-menu");
            if (menuVisible && !menuVisible.hasAttribute("hidden")) {
              ensurePlatformDownloadHint(true);
            }
            modal.setAttribute("hidden", "hidden");
          })
          .catch(function (error) {
            if (err) {
              err.removeAttribute("hidden");
              err.textContent = localizeUserFacingError(error, "Не удалось сохранить");
            }
          });
        return false;
      };
    }
    return modal;
  }

  function openAccountModal() {
    var modal = ensureAccountModalMount();
    var err = modal.querySelector("[data-account-error]");
    if (err) {
      err.setAttribute("hidden", "hidden");
      err.textContent = "";
    }
    var token = readSessionToken();
    if (!token) {
      if (err) {
        err.removeAttribute("hidden");
        err.textContent = "Сначала войдите на загрузочной.";
      }
      modal.removeAttribute("hidden");
      return;
    }
    licensePost("/v1/account", { session_token: token })
      .then(function (data) {
        var form = modal.querySelector("form");
        if (!form) return;
        form.login.value = data.login || "";
        form.email.value = data.email || "";
        form.current_password.value = "";
        if (form.new_password) form.new_password.value = "";
        var otpBox = form.querySelector('input[name="auth_by_email_otp"]');
        if (otpBox) otpBox.checked = Boolean(data.auth_by_email_otp);
        syncEmailOtpCheckbox(form);
        if (data.subscription && data.subscription.paid_until) {
          storePaidUntil(data.subscription.paid_until);
        }
        form.subscription.value =
          (data.subscription && data.subscription.label) ||
          (data.subscription && data.subscription.status) ||
          "";
        var menuVisible = document.querySelector(".platform-menu");
        if (menuVisible && !menuVisible.hasAttribute("hidden")) {
          ensurePlatformDownloadHint(true);
        }
        modal.removeAttribute("hidden");
      })
      .catch(function (error) {
        if (err) {
          err.removeAttribute("hidden");
          err.textContent = localizeUserFacingError(error, "Не удалось загрузить аккаунт");
        }
        modal.removeAttribute("hidden");
      });
  }

  function replaceWithPlatformAnchor(el, href) {
    if (!el || !href) return el;
    if (el.tagName === "A") {
      el.href = href;
      el.removeAttribute("aria-disabled");
      return el;
    }
    var anchor = document.createElement("a");
    anchor.id = el.id;
    anchor.className = el.className;
    anchor.href = href;
    anchor.innerHTML = el.innerHTML;
    el.parentNode.replaceChild(anchor, el);
    return anchor;
  }

  function replaceWithPlatformButton(el) {
    if (!el || el.tagName === "BUTTON") return el;
    var button = document.createElement("button");
    button.type = "button";
    button.id = el.id;
    button.className = el.className;
    button.innerHTML = el.innerHTML;
    el.parentNode.replaceChild(button, el);
    return button;
  }

  function wirePlatformMenuWithDownloadLinks(links) {
    links = links || readStoredDownloadLinks();
    var hasAny = Boolean(links.pwa || links.android || links.windows);
    if (!hasAny) {
      ensurePlatformDownloadHint(false);
      return;
    }
    ensurePlatformDownloadHint(true);
    clearDownloadLimitWarning();

    var menu = document.querySelector(".platform-menu");
    if (!menu) return;

    var android = menu.querySelector(".platform-button--android");
    var windows = menu.querySelector(".platform-button--windows");

    function bindClaimThenOpen(el, platform, href, label) {
      if (!el || !href) return;
      var btn = replaceWithPlatformButton(el);
      if (!btn) return;
      var small = btn.querySelector("small");
      if (small && label) small.textContent = label;
      btn.onclick = function (event) {
        if (event) event.preventDefault();
        clearDownloadLimitWarning();
        btn.disabled = true;
        claimPlatformDownload(platform, platform.toUpperCase())
          .then(function () {
            window.location.href = href;
          })
          .catch(function (error) {
            btn.disabled = false;
            showDownloadLimitWarning(
              localizeUserFacingError(error, "Не удалось начать скачивание. Повторите попытку.")
            );
          });
      };
    }

    if (android && links.android) {
      bindClaimThenOpen(android, "android", links.android, "Скачать дистрибутив APK");
    }
    if (windows && links.windows) {
      bindClaimThenOpen(windows, "windows", links.windows, "Скачать дистрибутив EXE");
    }

    // iOS: слот устройства при нажатии, без авто-claim при показе меню.
    ensureIosPrepareButton(document.getElementById("btca-static-ios"));
  }

  function showPlatformMenuUnlocked() {
    var menu = document.querySelector(".platform-menu");
    var panel = getEls().panel;
    var gate = document.getElementById("btca-auth-gate");
    if (gate) gate.setAttribute("hidden", "hidden");
    setLoadingIntroLocked(false);
    if (menu) {
      menu.removeAttribute("hidden");
      menu.className = "platform-menu";
      menu.setAttribute("aria-label", "Выбор платформы");
    }
    if (panel) panel.removeAttribute("hidden");
    try {
      if (!sessionStorage.getItem(DOWNLOAD_MENU_SHOWN_KEY)) {
        sessionStorage.setItem(DOWNLOAD_MENU_SHOWN_KEY, String(Date.now()));
      }
    } catch (e) { }
    wirePlatformMenuWithDownloadLinks();
    scheduleDownloadMenuExpiry();
  }

  var SUBSCRIPTION_INACTIVE_MSG =
    "Подписка не активна, обратитесь в Службу поддержки";
  var DEVICE_NOT_BOUND_MSG =
    "Запуск Приложения не возможен. Устройство не авторизовано!";
  var DEVICE_LIMIT_MSG =
    "Превышен лимит устройств. На платформу — не более 2, всего — по лимиту в админке.";
  var MSG_WRONG_LOGIN_PASSWORD = "Не правильный Логин или Пароль.";
  var MSG_WRONG_CODE = "Не правильный Код.";

  function isSubscriptionInactiveError(message) {
    return /подписка не активна/i.test(String(message || ""));
  }

  function isDeviceNotAllowedError(message) {
    var text = String(message || "");
    return (
      /устройство не авторизовано/i.test(text) ||
      /лимит устройств/i.test(text) ||
      /запуск приложения не возможен/i.test(text)
    );
  }

  function renderAuthGate(onUnlocked, options) {
    options = options || {};
    var loginOnly = Boolean(options.loginOnly);
    var gate = ensureAuthGateMount();
    if (!gate) {
      onUnlocked();
      return;
    }
    gate.removeAttribute("hidden");
    var savedLogin = "";
    var preferOtp = false;
    try {
      savedLogin = String(options.prefillLogin || localStorage.getItem(LICENSE_LOGIN_KEY) || "").trim();
      preferOtp = localStorage.getItem(LICENSE_AUTH_OTP_KEY) === "1";
    } catch (e) {
      savedLogin = String(options.prefillLogin || "").trim();
    }
    if (savedLogin) {
      try {
        localStorage.setItem(LICENSE_LOGIN_KEY, savedLogin);
      } catch (e) { }
    }
    var mode = loginOnly ? "login" : savedLogin ? "login" : "register";
    var otpSentHint = "";
    var subscriptionBlocked = false;
    var authModeReqSeq = 0;
    var authModeTimer = null;
    var lastAuthModeLogin = "";

    function storeLoginPrefs(loginValue, otpFlagValue) {
      savedLogin = String(loginValue || "").trim();
      preferOtp = Boolean(otpFlagValue);
      persistLicenseIdentity(savedLogin, preferOtp);
    }

    function readLoginFieldValue() {
      var loginEl = gate.querySelector('input[name="login"]');
      if (loginEl) return String(loginEl.value || "").trim();
      return String(savedLogin || "").trim();
    }

    function finishWithSession(data) {
      markLaunchUnlocked(data.session_token);
      var loginPersist = savedLogin || readLoginFieldValue();
      if (loginPersist) persistLicenseIdentity(loginPersist, preferOtp);
      storePaidUntil(data && data.paid_until);
      try {
        sessionStorage.removeItem(DOWNLOAD_MENU_SHOWN_KEY);
        sessionStorage.setItem(DOWNLOAD_MENU_SHOWN_KEY, String(Date.now()));
      } catch (e) { }
      var links = (data && data.download_links) || {};
      try {
        sessionStorage.setItem(LICENSE_DOWNLOAD_LINKS_KEY, JSON.stringify(links));
      } catch (e) { }
      return activatePwaDownloadCookie(links.pwa).then(function () {
        gate.setAttribute("hidden", "hidden");
        onUnlocked();
      });
    }

    function paint() {
      if (loginOnly && mode === "register") mode = "login";
      try {
        var active = document.activeElement;
        if (active && active.blur) active.blur();
      } catch (e) { }
      var title =
        mode === "register" ? "Регистрация" : mode === "otp" ? "Код подтверждения" : "Вход";
      var showSubmit = !(mode === "login" && subscriptionBlocked);
      var submitLabel =
        mode === "register"
          ? "Зарегистрироваться"
          : mode === "otp"
            ? "Подтвердить код"
            : preferOtp
              ? "Получить код"
              : "Войти";
      var tabsHtml = loginOnly
        ? ""
        : '<div class="auth-gate__tabs" role="tablist">' +
        '<button type="button" class="auth-gate__tab' +
        (mode !== "register" ? " auth-gate__tab--active" : "") +
        '" data-auth-mode="login">Вход</button>' +
        '<button type="button" class="auth-gate__tab' +
        (mode === "register" ? " auth-gate__tab--active" : "") +
        '" data-auth-mode="register">Регистрация</button>' +
        "</div>";
      var bodyHtml = "";
      if (mode === "register") {
        bodyHtml =
          '<label class="auth-gate__field"><span>Логин*</span><input name="login" autocomplete="username" required minlength="3" maxlength="64" value="' +
          escapeHtml(savedLogin) +
          '"/></label>' +
          passwordFieldHtml("password", "Пароль*", true, true) +
          '<label class="auth-gate__field"><span>E-mail</span><input name="email" type="email" autocomplete="email" maxlength="255" value=""/></label>' +
          emailOtpCheckboxHtml(false, true) +
          '<p class="auth-gate__hint">После регистрации обратитесь в Службу поддержки для активации подписки.</p>';
      } else if (mode === "login") {
        bodyHtml =
          '<label class="auth-gate__field"><span>Логин</span><input name="login" autocomplete="username" required minlength="3" maxlength="64" value="' +
          escapeHtml(savedLogin) +
          '"/></label>' +
          (preferOtp ? "" : passwordFieldHtml("password", "Пароль", true, false));
      } else {
        bodyHtml =
          (otpSentHint
            ? '<p class="auth-gate__hint auth-gate__hint--ok">' + escapeHtml(otpSentHint) + "</p>"
            : "") +
          '<label class="auth-gate__field"><span>Код (6 цифр)</span><input name="otp" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required value=""/></label>';
      }
      gate.innerHTML =
        tabsHtml +
        '<p class="auth-gate__title">' +
        escapeHtml(title) +
        "</p>" +
        '<form class="auth-gate__form" action="#" method="post" novalidate>' +
        bodyHtml +
        '<p class="auth-gate__error" data-auth-error' +
        (subscriptionBlocked ? ">" + escapeHtml(SUBSCRIPTION_INACTIVE_MSG) : " hidden>") +
        "</p>" +
        (showSubmit
          ? '<button class="platform-button auth-gate__submit" type="submit"><span>' +
          submitLabel +
          "</span></button>"
          : "") +
        "</form>";
      var formEl = gate.querySelector(".auth-gate__form");
      if (formEl) {
        formEl.removeAttribute("data-otp-email-wired");
        wireEmailOtpCheckbox(formEl);
      }
      if (mode === "login") {
        // Safari Autofill иногда сбрасывает HTML value="" — фиксируем явно.
        var loginForce = gate.querySelector('input[name="login"]');
        if (loginForce && savedLogin) {
          loginForce.value = savedLogin;
          try {
            loginForce.setAttribute("value", savedLogin);
          } catch (e) { }
        }
        scheduleAuthModeSync(0);
      }
    }

    function paintSafe() {
      window.setTimeout(function () {
        try {
          paint();
        } catch (err) {
          console.warn("BTCA auth paint failed", err);
        }
      }, 30);
    }

    /** По логину (кэш / автозаполнение) сразу узнать: пароль или «Получить код». */
    function syncAuthModeFromServer(loginRaw, force) {
      if (mode !== "login" || subscriptionBlocked) return;
      var login = String(loginRaw || "").trim();
      if (login.length < 3) {
        lastAuthModeLogin = "";
        return;
      }
      if (!force && login === lastAuthModeLogin) return;
      var seq = ++authModeReqSeq;
      licensePost("/v1/auth/mode", { login: login })
        .then(function (modeData) {
          if (seq !== authModeReqSeq || mode !== "login") return;
          var nextLogin = String((modeData && modeData.login) || login).trim();
          var useOtp = Boolean(modeData && modeData.auth_by_email_otp);
          lastAuthModeLogin = nextLogin;
          if (nextLogin === savedLogin && useOtp === preferOtp) return;
          storeLoginPrefs(nextLogin, useOtp);
          paintSafe();
        })
        .catch(function () {
          /* логин ещё не зарегистрирован / сеть — оставляем текущий UI */
        });
    }

    function scheduleAuthModeSync(delayMs) {
      if (authModeTimer) {
        window.clearTimeout(authModeTimer);
        authModeTimer = null;
      }
      authModeTimer = window.setTimeout(function () {
        authModeTimer = null;
        syncAuthModeFromServer(readLoginFieldValue(), false);
      }, delayMs == null ? 180 : delayMs);
    }

    function setError(message) {
      var el = gate.querySelector("[data-auth-error]");
      if (!el) return;
      if (!message) {
        el.setAttribute("hidden", "hidden");
        el.textContent = "";
        return;
      }
      el.removeAttribute("hidden");
      el.textContent = message;
    }

    function markInactive() {
      subscriptionBlocked = true;
      mode = "login";
      otpSentHint = "";
      paintSafe();
      window.setTimeout(function () {
        setError(SUBSCRIPTION_INACTIVE_MSG);
      }, 40);
    }

    paint();
    // Кэш логина + автозаполнение браузера: несколько попыток после загрузки.
    if (mode === "login") {
      scheduleAuthModeSync(0);
      window.setTimeout(function () {
        syncAuthModeFromServer(readLoginFieldValue(), true);
      }, 250);
      window.setTimeout(function () {
        syncAuthModeFromServer(readLoginFieldValue(), true);
      }, 800);
    }
    gate.onclick = function (event) {
      var gen = event.target && event.target.closest ? event.target.closest("[data-pw-gen]") : null;
      if (gen) {
        event.preventDefault();
        var field = gate.querySelector('input[name="' + gen.getAttribute("data-pw-gen") + '"]');
        if (field) field.value = generateClientPassword();
        return;
      }
      if (loginOnly) return;
      var tab = event.target && event.target.closest ? event.target.closest("[data-auth-mode]") : null;
      if (!tab) return;
      mode = tab.getAttribute("data-auth-mode") === "register" ? "register" : "login";
      otpSentHint = "";
      subscriptionBlocked = false;
      lastAuthModeLogin = "";
      paintSafe();
    };
    gate.oninput = function (event) {
      if (event.target && event.target.name === "otp") {
        setError("");
        return;
      }
      if (event.target && event.target.name === "login") {
        savedLogin = String(event.target.value || "").trim();
        if (subscriptionBlocked) {
          subscriptionBlocked = false;
          setError("");
          paintSafe();
          window.setTimeout(function () {
            var loginEl = gate.querySelector('input[name="login"]');
            if (loginEl) {
              loginEl.focus();
              try {
                var len = loginEl.value.length;
                loginEl.setSelectionRange(len, len);
              } catch (e) { }
            }
          }, 40);
          return;
        }
        if (mode === "login") {
          lastAuthModeLogin = "";
          scheduleAuthModeSync(220);
        }
      }
    };
    gate.onchange = function (event) {
      if (event.target && event.target.name === "login" && mode === "login") {
        lastAuthModeLogin = "";
        scheduleAuthModeSync(0);
      }
    };
    gate.onsubmit = function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (mode === "login" && subscriptionBlocked) return false;
      setError("");
      var form = event.target;
      if (!form || form.tagName !== "FORM") return false;
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      try {
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      } catch (e) { }
      var loginInput = form.querySelector('input[name="login"]');
      var passwordInput = form.querySelector('input[name="password"]');
      var emailInput = form.querySelector('input[name="email"]');
      var otpFlag = form.querySelector('input[name="auth_by_email_otp"]');
      var otpInput = form.querySelector('input[name="otp"]');
      var login = loginInput ? String(loginInput.value || "").trim() : savedLogin;
      var password = passwordInput ? String(passwordInput.value || "") : "";
      var email = emailInput ? String(emailInput.value || "").trim() : "";
      var wantOtp = Boolean(otpFlag && otpFlag.checked);
      var deviceId = getBrowserClientId();
      var requestMode = mode;

      var chain = Promise.resolve();
      if (requestMode === "register") {
        if (!login || login.length < 3) {
          setError("Укажите логин");
          if (submitBtn) submitBtn.disabled = false;
          return false;
        }
        if (!password || password.length < 6) {
          setError("Укажите пароль (минимум 6 символов)");
          if (submitBtn) submitBtn.disabled = false;
          return false;
        }
        if (wantOtp && !email) {
          setError("Для авторизации по коду укажите E-mail");
          if (submitBtn) submitBtn.disabled = false;
          return false;
        }
        chain = licensePost("/v1/register", {
          login: login,
          password: password,
          email: email,
          auth_by_email_otp: wantOtp,
          device_id: deviceId,
          platform: "pwa",
          device_label: "Устройство регистрации",
        }).then(function (data) {
          storeLoginPrefs(data.login || login, data.auth_by_email_otp);
          if (data.auth_by_email_otp) {
            return licensePost("/v1/otp/request", {
              login: savedLogin,
              device_id: deviceId,
              platform: "pwa",
              app_version: "10.1",
              device_label: "PWA",
            }).then(function (otpData) {
              return { __otp: true, data: otpData };
            });
          }
          return licensePost("/v1/login", {
            login: savedLogin,
            password: password,
            device_id: deviceId,
          }).then(function (loginData) {
            return { __session: true, data: loginData };
          });
        });
      } else if (requestMode === "login") {
        if (!login) {
          setError("Укажите логин");
          if (submitBtn) submitBtn.disabled = false;
          return false;
        }
        chain = licensePost("/v1/auth/mode", { login: login }).then(function (modeData) {
          var useOtp = Boolean(modeData && modeData.auth_by_email_otp);
          storeLoginPrefs(modeData.login || login, useOtp);
          if (useOtp) {
            return licensePost("/v1/otp/request", {
              login: savedLogin,
              device_id: deviceId,
              platform: "pwa",
              app_version: "10.1",
              device_label: "PWA",
            }).then(function (otpData) {
              return { __otp: true, data: otpData };
            });
          }
          if (!password) {
            throw new Error("Введите пароль");
          }
          return licensePost("/v1/login", {
            login: savedLogin,
            password: password,
            device_id: deviceId,
          }).then(function (loginData) {
            return { __session: true, data: loginData };
          });
        });
      } else {
        var otpCode = otpInput ? String(otpInput.value || "").trim() : "";
        if (!/^\d{6}$/.test(otpCode)) {
          setError("Введите код из 6 цифр");
          if (submitBtn) submitBtn.disabled = false;
          return false;
        }
        chain = licensePost("/v1/otp/verify", {
          login: savedLogin,
          device_id: deviceId,
          code: otpCode,
        }).then(function (data) {
          return { __session: true, data: data };
        });
      }

      chain
        .then(function (result) {
          if (!result) return;
          if (result.__session) return finishWithSession(result.data);
          if (result.__otp) {
            subscriptionBlocked = false;
            otpSentHint = "Код отправлен на Ваш e-mail.";
            mode = "otp";
            paintSafe();
          }
        })
        .catch(function (err) {
          var message = localizeUserFacingError(err, "Ошибка запроса");
          if (requestMode !== "otp" && isSubscriptionInactiveError(message)) {
            markInactive();
            return;
          }
          if (isDeviceNotAllowedError(message) && isStandalone()) {
            renderDeviceBlockedGate(message || DEVICE_NOT_BOUND_MSG);
            return;
          }
          if (/лимит устройств/i.test(message)) {
            setError(message || DEVICE_LIMIT_MSG);
            return;
          }
          if (message === "Введите пароль") {
            setError(message);
            return;
          }
          if (requestMode === "register") {
            mode = "login";
            paintSafe();
            window.setTimeout(function () {
              setError(message);
            }, 40);
            return;
          }
          if (/вход по коду на e-mail|вход по паролю|Получить код|Введите логин и пароль/i.test(message)) {
            preferOtp = /вход по коду на e-mail|Получить код/i.test(message);
            try {
              localStorage.setItem(LICENSE_AUTH_OTP_KEY, preferOtp ? "1" : "0");
            } catch (e) { }
            paintSafe();
            window.setTimeout(function () {
              setError(message);
            }, 40);
            return;
          }
          if (requestMode === "otp") {
            setError(
              /код истёк/i.test(message) ? message : MSG_WRONG_CODE
            );
            if (otpInput) {
              try {
                otpInput.value = "";
                otpInput.focus();
              } catch (e) { }
            }
            return;
          }
          if (requestMode === "login" && /логин|пароль/i.test(message)) {
            setError(MSG_WRONG_LOGIN_PASSWORD);
            return;
          }
          setError(message);
        })
        .then(function () {
          window.setTimeout(function () {
            var btn = gate.querySelector('button[type="submit"]');
            if (btn) btn.disabled = false;
          }, 40);
        });
      return false;
    };
  }

  function gateLoadingHome() {
    if (isAppShellMode()) return;
    var pendingAccess = false;
    try {
      pendingAccess = sessionStorage.getItem("btca101.pendingPwaAccess") === "1";
      if (pendingAccess) sessionStorage.removeItem("btca101.pendingPwaAccess");
    } catch (e) { }

    function showAuthGateFresh() {
      try {
        sessionStorage.removeItem(LICENSE_DOWNLOAD_LINKS_KEY);
        sessionStorage.removeItem(DOWNLOAD_MENU_SHOWN_KEY);
      } catch (e) { }
      if (downloadMenuExpireTimer) {
        window.clearTimeout(downloadMenuExpireTimer);
        downloadMenuExpireTimer = null;
      }
      ensurePlatformDownloadHint(false);
      clearLaunchUnlock();
      var menu = document.querySelector(".platform-menu");
      var panel = getEls().panel;
      setLoadingIntroLocked(true);
      if (menu) {
        menu.setAttribute("hidden", "hidden");
      }
      if (panel) panel.setAttribute("hidden", "hidden");
      function showLoginForm() {
        renderAuthGate(function () {
          showPlatformMenuUnlocked();
        });
        try {
          window.scrollTo(0, 0);
        } catch (e) { }
      }
      // Загрузочная (в т.ч. Safari): перезагрузка всегда → «Вход в систему».
      showLoginForm();
    }

    // Персональная /d/… → /recover: cookie уже есть, OTP на этом устройстве мог быть сброшен.
    if (pendingAccess) {
      probePackageAccess()
        .then(function (ok) {
          if (!ok) {
            showAuthGateFresh();
            return;
          }
          markLaunchUnlocked();
          showPlatformMenuUnlocked();
        })
        .catch(function () {
          showAuthGateFresh();
        });
      return;
    }

    showAuthGateFresh();
  }

  function renderInstalledHome(options) {
    options = options || {};
    var preserveSplash = Boolean(options.preserveSplash);
    var intro = document.querySelector(".home__intro");
    var menu = document.querySelector(".platform-menu");
    var panel = getEls().panel;
    var gate = document.getElementById("btca-auth-gate");

    document.body.classList.add("btca-installed-mode");
    document.body.classList.remove("btca-screen-mode", "btca-level1-mode", "btca-level3-mode");

    // Стартовый экран PWA: заголовок + дата версии над логотипом.
    if (intro) {
      intro.removeAttribute("hidden");
      var titleEl = intro.querySelector(".eyebrow:not(.eyebrow--release):not(.eyebrow--levels)");
      if (titleEl) {
        titleEl.textContent = "СИСТЕМА ТРЕНИРОВОК БТКА 10.1";
        titleEl.removeAttribute("hidden");
      }
      var releaseEl = intro.querySelector(".eyebrow--release");
      if (releaseEl) {
        applyInstalledReleaseDateToEyebrow(releaseEl);
        releaseEl.removeAttribute("hidden");
      }
      var levelsEl = intro.querySelector(".eyebrow--levels");
      if (levelsEl) levelsEl.setAttribute("hidden", "hidden");
      var appTitle = intro.querySelector("#app-title");
      if (appTitle) appTitle.setAttribute("hidden", "hidden");
      Array.prototype.forEach.call(intro.querySelectorAll("p:not(.eyebrow)"), function (p) {
        p.setAttribute("hidden", "hidden");
      });
    }
    if (panel && !preserveSplash) {
      panel.className = "ios-panel";
      panel.innerHTML = "";
      panel.setAttribute("hidden", "hidden");
    }

    applyInstalledHomeFooter();

    if (!isLaunchUnlocked()) {
      if (menu) {
        menu.className = "platform-menu";
        menu.innerHTML = "";
        menu.setAttribute("hidden", "hidden");
      }
      // Форма входа только после полного splash/boot (finishInstalledSplashForLogin).
      pendingInstalledLoginReveal = true;
      hideInstalledAuthGate();
      if (panel) {
        panel.removeAttribute("hidden");
        if (!panel.classList.contains("btca-home-splash-panel")) {
          renderHomeSplashIndicator(0);
        } else {
          placeHomeSplashPanel("login");
        }
      }
      ensurePhraseOneTabletMarkup();
      ensurePhraseTwoTabletMarkup();
      cleanupOrphanHomePhraseMarkup();
      installedHomeSnapshot = "";
      syncPortraitMode();
      markStandaloneShellReady();
      // Страховка: если boot завис — всё равно показать вход.
      window.setTimeout(function () {
        if (pendingInstalledLoginReveal) finishInstalledSplashForLogin();
      }, 45000);
      return;
    }

    pendingInstalledLoginReveal = false;

    if (gate) gate.setAttribute("hidden", "hidden");
    if (!preserveSplash) hideHomeSplashIndicator();
    if (menu) {
      menu.removeAttribute("hidden");
      menu.className = "platform-menu btca-work-menu";
      menu.setAttribute("aria-label", "Главное меню БТКА");
      menu.innerHTML =
        '<button class="platform-button btca-work-menu__item btca-work-menu__item--level3" type="button" data-btca-route="level3"><span>Уровень 3 — Продвинутый</span></button>' +
        '<button class="platform-button btca-work-menu__item btca-work-menu__item--about" type="button" data-btca-route="about"><span>О проекте</span></button>' +
        '<a class="btca-work-menu__account-link" href="' +
        escapeHtml(LOADING_PAGE_URL + (LOADING_PAGE_URL.indexOf("?") >= 0 ? "&" : "?") + "open=downloads") +
        '" target="_blank" rel="noopener noreferrer" data-btca-route="account-update">Аккаунт | Обновление</a>';
    }
    if (preserveSplash && panel && panel.classList.contains("btca-home-splash-panel")) {
      placeHomeSplashPanel("menu");
    }
    ensurePhraseOneTabletMarkup();
    ensurePhraseTwoTabletMarkup();
    cleanupOrphanHomePhraseMarkup();
    installedHomeSnapshot = "";
    syncPortraitMode();
    markStandaloneShellReady();
    ensureUpdateAvailableHint();
    // Если zip ещё не распакован в Cache — докачать в фоне (иначе картинки пустые).
    verifyMediaCacheReady()
      .then(function (ready) {
        if (ready) return;
        return repairStandaloneShell({ deferHome: true });
      })
      .catch(function () { });
  }

  function parseDateRuValue(value) {
    var m = String(value || "").match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (!m) return 0;
    return Number(m[3]) * 10000 + Number(m[2]) * 100 + Number(m[1]);
  }

  function readDomPackageReleaseDate() {
    var el = document.querySelector(".eyebrow--release");
    var text = el ? String(el.textContent || "") : "";
    var m = text.match(/(\d{2}\.\d{2}\.\d{4})/);
    return m ? m[1] : "";
  }

  /**
   * Дата установленной версии: в PWA — из хранилища (синхрон с админкой / claim).
   * DOM с деплоя не источник истины для установленного приложения.
   * На загрузочной — дата с экрана (текущий деплой).
   */
  function readLocalPackageReleaseDate() {
    if (isStandalone()) {
      return readStoredPackageReleaseDate();
    }
    return readDomPackageReleaseDate() || readStoredPackageReleaseDate();
  }

  /** На стартовой PWA показываем только зафиксированную дату установки (как в админке). */
  function applyInstalledReleaseDateToEyebrow(releaseEl) {
    if (!releaseEl) return "";
    var installedDate = readStoredPackageReleaseDate();
    if (installedDate) {
      releaseEl.textContent = "версия от " + installedDate;
    }
    return installedDate;
  }

  /** После splash: дата с сервера (админка) перезаписывает локальную «установленную». */
  function syncInstalledVersionDateFromServer(versionDate) {
    var clean = String(versionDate || "").trim();
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(clean)) return "";
    persistPackageReleaseDate(clean);
    var releaseEl = document.querySelector(".eyebrow--release");
    if (releaseEl) applyInstalledReleaseDateToEyebrow(releaseEl);
    return clean;
  }

  /** Самая новая дата среди платформ (PWA / Android / Windows) из shell или локальной. */
  function pickNewestReleaseDate() {
    var dates = [];
    for (var i = 0; i < arguments.length; i++) {
      var raw = String(arguments[i] || "").trim();
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(raw)) dates.push(raw);
    }
    if (!dates.length) return "";
    dates.sort(function (a, b) {
      return parseDateRuValue(b) - parseDateRuValue(a);
    });
    return dates[0];
  }

  function readLatestPackageReleaseDate() {
    var local = readLocalPackageReleaseDate();
    return pickNewestReleaseDate(local) || local || "";
  }

  function remoteLatestVersionDate(payload) {
    if (!payload) return "";
    return pickNewestReleaseDate(
      payload.packageReleaseDate,
      payload.androidReleaseDate,
      payload.windowsReleaseDate,
      payload.lastVersionDate
    );
  }

  function applyUpdateAvailableHint(remoteDate, localDate) {
    var menu = document.querySelector(".btca-work-menu");
    var existing = document.getElementById("btca-update-available");
    var local = String(localDate || readLocalPackageReleaseDate() || "").trim();
    var remote = String(remoteDate || "").trim();
    if (!remote || !local || remote === local) {
      if (existing) existing.remove();
      return false;
    }
    if (!menu) return true;
    if (!existing) {
      existing = document.createElement("p");
      existing.id = "btca-update-available";
      existing.className = "btca-work-menu__update-hint";
      var link = menu.querySelector(".btca-work-menu__account-link");
      if (link) link.insertAdjacentElement("afterend", existing);
      else menu.appendChild(existing);
    }
    existing.textContent = "Есть обновление.";
    var splashPanel = getEls().panel;
    if (splashPanel && splashPanel.classList.contains("btca-home-splash-panel")) {
      placeHomeSplashPanel("menu");
    }
    return true;
  }

  function ensureUpdateAvailableHint() {
    if (!isStandalone()) return Promise.resolve(false);
    var localDate = readLocalPackageReleaseDate();
    if (!localDate) return Promise.resolve(false);
    return fetchRemoteAppShellPayload()
      .then(function (payload) {
        if (!payload) return false;
        var remoteDate = remoteLatestVersionDate(payload);
        return applyUpdateAvailableHint(remoteDate, localDate);
      })
      .catch(function () {
        return false;
      });
  }

  function renderDeviceBlockedGate(message) {
    pendingInstalledLoginReveal = false;
    hideHomeSplashIndicator();
    var gate = ensureAuthGateMount();
    if (!gate) return;
    gate.removeAttribute("hidden");
    gate.onsubmit = null;
    gate.oninput = null;
    gate.onchange = null;
    gate.onclick = null;
    var text = message || DEVICE_NOT_BOUND_MSG;
    var title = /подписка не активна/i.test(text)
      ? "Подписка не активна"
      : "Устройство не авторизовано";
    gate.innerHTML =
      '<p class="auth-gate__title">' +
      escapeHtml(title) +
      "</p>" +
      '<p class="auth-gate__hint auth-gate__hint--danger">' +
      escapeHtml(text) +
      "</p>";
  }

  /**
   * Splash PWA: (а) подписка → (б) ID устройства → (в) обновление на фоне домашнего экрана.
   * Вход/регистрация только на странице загрузки.
   */
  function runSplashBootChecks() {
    if (!isStandalone()) return Promise.resolve({ ok: true, skipped: true });
    try {
      renderHomeSplashIndicator(8);
    } catch (e) { }
    var updateCheck = fetchRemoteAppShellPayload()
      .then(function (payload) {
        var remoteDate = remoteLatestVersionDate(payload);
        // Подсказку обновления покажем после открытия дома (п.9в).
        return remoteDate;
      })
      .catch(function () {
        return "";
      });

    try {
      renderHomeSplashIndicator(18);
    } catch (e) { }

    return licensePost("/v1/auth/device-session", {
      device_id: getLicenseDeviceId() || "",
      platform: "pwa",
      app_version: PACKAGE_APP_VERSION,
      device_label: "iOS/PWA",
      version_date: "",
    })
      .then(function (data) {
        try {
          renderHomeSplashIndicator(40);
        } catch (e) { }
        // Дата на стартовой = дата пакета на устройстве (claim), не глобальный деплой.
        // Не перетираем локальную дату датой деплоя — иначе пропадёт «Есть обновление».
        if (data && data.version_date && !readStoredPackageReleaseDate()) {
          syncInstalledVersionDateFromServer(data.version_date);
        }
        // Сначала подписка (если аккаунт уже известен по ID), затем привязка.
        if (data && data.bound && (!data.subscription_active || !data.session_token)) {
          clearLaunchUnlock();
          try {
            localStorage.removeItem(LICENSE_SESSION_KEY);
          } catch (e) { }
          return {
            ok: false,
            reason: "inactive",
            message: (data && data.message) || SUBSCRIPTION_INACTIVE_MSG,
            login: data.login || "",
          };
        }
        if (!data || !data.bound) {
          clearLaunchUnlock();
          try {
            localStorage.removeItem(LICENSE_SESSION_KEY);
          } catch (e) { }
          return {
            ok: false,
            reason: "unbound",
            message: (data && data.message) || DEVICE_NOT_BOUND_MSG,
          };
        }
        if (data.login) {
          persistLicenseIdentity(data.login, data.auth_by_email_otp);
        }
        if (data.paid_until) storePaidUntil(data.paid_until);
        markLaunchUnlocked(data.session_token);
        return { ok: true, bound: true, login: data.login || "" };
      })
      .catch(function (err) {
        var msg = String((err && err.message) || err || "");
        // Сеть недоступна: если локально уже разблокированы — не выкидываем offline.
        if (isLaunchUnlocked() && readSessionToken()) {
          return { ok: true, offline: true };
        }
        clearLaunchUnlock();
        return {
          ok: false,
          reason: "network",
          message: msg || "Нет связи с сервером лицензий. Проверьте интернет и откройте приложение снова.",
        };
      })
      .then(function (result) {
        return updateCheck.then(function () {
          return result;
        });
      });
  }

  function renderError(error) {
    var msg = localizeUserFacingError(
      error,
      "Не удалось подготовить offline. Обновите страницу и повторите."
    );
    setPanel(
      '<div class="ios-panel__header"><span>Ошибка iOS/iPadOS</span></div>' +
      '<p class="prepare-status prepare-status--error">' + escapeHtml(msg) + "</p>"
    );
  }

  function setButtonState(isRunning, label) {
    var button = getEls().button;
    if (!button) return;
    button.disabled = isRunning;
    button.className = isRunning
      ? "platform-button platform-button--ios platform-button--pending"
      : "platform-button platform-button--ios";

    var small = button.querySelector("small");
    if (small) small.textContent = label;
  }

  function withTimeout(promise, ms, message) {
    var timeoutId;
    var timeout = new Promise(function (_, reject) {
      timeoutId = window.setTimeout(function () {
        reject(new Error(message));
      }, ms);
    });

    return Promise.race([promise, timeout]).then(function (result) {
      window.clearTimeout(timeoutId);
      return result;
    }, function (error) {
      window.clearTimeout(timeoutId);
      throw error;
    });
  }

  function loadZipLibrary() {
    if (window.zip && window.zip.ZipReader) return Promise.resolve();

    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = assetPath("vendor/zip.min.js");
      script.onload = function () {
        if (window.zip && window.zip.ZipReader) {
          if (window.zip.configure) window.zip.configure({ useWebWorkers: false });
          resolve();
        }
        else reject(new Error("zip.js загрузился, но API недоступен"));
      };
      script.onerror = function () {
        reject(new Error("Не удалось загрузить zip.js"));
      };
      document.head.appendChild(script);
    });
  }

  function resolveProgressCallback(onProgress) {
    if (typeof onProgress === "function") return onProgress;
    return function (percent, message) {
      renderProgress("Подготовка iOS/iPadOS", percent, message);
    };
  }

  function registerOfflineServiceWorker() {
    // Scope должен покрывать и /offline/, и /offline-unpacked/ (картинки после распаковки zip).
    // Узкий scope ".../offline/" оставлял offline-unpacked без SW → пустые картинки в PWA.
    return withTimeout(
      navigator.serviceWorker.getRegistrations()
        .then(function (regs) {
          return Promise.all(
            (regs || []).map(function (reg) {
              var scope = String((reg && reg.scope) || "");
              if (/\/offline\/?$/.test(scope.replace(/\/+$/, "/"))) {
                return reg.unregister().catch(function () { });
              }
              return null;
            })
          );
        })
        .then(function () {
          return navigator.serviceWorker.register(assetPath("sw.js"), { scope: BTCA_BASE });
        }),
      12000,
      "Safari не завершил регистрацию offline-службы. Обновите страницу и попробуйте ещё раз."
    );
  }

  function cacheCoreAssets(onProgress, pctStart, pctEnd) {
    var start = pctStart == null ? 3 : pctStart;
    var end = pctEnd == null ? 15 : pctEnd;
    var emitProgress = typeof onProgress === "function"
      ? onProgress
      : (start !== end ? resolveProgressCallback(onProgress) : function () { });
    return caches.open(INSTALL_CACHE).then(function (cache) {
      var documentAssets = Array.prototype.slice
        .call(document.querySelectorAll("script[src], link[rel='stylesheet'][href], link[rel='modulepreload'][href]"))
        .map(function (element) {
          return element.src || element.href;
        })
        .filter(Boolean)
        .map(function (assetUrl) {
          var url = new URL(assetUrl, window.location.origin);
          return url.origin === window.location.origin ? url.pathname + url.search : null;
        })
        .filter(Boolean);
      var coreAssets = CORE_REL_PATHS.map(assetPath);
      var allAssets = Array.from(new Set(coreAssets.concat(documentAssets)));

      return allAssets.reduce(function (promise, asset, index) {
        return promise.then(function () {
          var pct = start + ((index + 1) / allAssets.length) * (end - start);
          emitProgress(pct, "Загрузка оболочки: " + asset);
          return cachePutAsset(cache, asset);
        });
      }, Promise.resolve());
    });
  }

  function contentTypeFor(path) {
    var lower = path.toLowerCase();
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".gif")) return "image/gif";
    if (lower.endsWith(".webp")) return "image/webp";
    if (lower.endsWith(".avif")) return "image/avif";
    if (lower.endsWith(".mp4")) return "video/mp4";
    if (lower.endsWith(".json")) return "application/json; charset=utf-8";
    return "application/octet-stream";
  }

  function safeEntryPath(filename) {
    var entryPath = String(filename || "").replace(/\\/g, "/");
    if (!entryPath || entryPath.indexOf("..") >= 0 || entryPath.charAt(0) === "/") return null;
    return entryPath.split("/").filter(Boolean).join("/");
  }

  function unpackZipToCache(blob, pack, password, cache, progressBase, progressShare, onProgress) {
    var emitProgress = resolveProgressCallback(onProgress);
    var reader = new window.zip.ZipReader(new window.zip.BlobReader(blob), password ? { password: password } : {});
    return reader.getEntries().then(function (entries) {
      var files = entries.filter(function (entry) { return !entry.directory; });
      var images = files.filter(function (entry) { return IMAGE_RE.test(safeEntryPath(entry.filename) || ""); });
      var imageCount = 0;

      return files.reduce(function (promise, entry) {
        return promise.then(function () {
          var entryPath = safeEntryPath(entry.filename);
          if (!entryPath) return;

          return entry.getData(new window.zip.BlobWriter(contentTypeFor(entryPath)), password ? { password: password } : {}).then(function (output) {
            return cache.put(
              assetPath("offline-unpacked/" + pack.id + "/" + entryPath),
              new Response(output, { headers: { "Content-Type": contentTypeFor(entryPath) } })
            ).then(function () {
              if (IMAGE_RE.test(entryPath)) {
                imageCount += 1;
                emitProgress(
                  progressBase + Math.min(0.95, imageCount / Math.max(1, images.length)) * progressShare,
                  "Распаковка " + pack.id + ": " + imageCount + "/" + images.length
                );
              }
            });
          });
        });
      }, Promise.resolve()).then(function () {
        return reader.close().then(function () {
          return { files: files.length, images: imageCount };
        });
      });
    }).catch(function (error) {
      return reader.close().catch(function () { }).then(function () {
        throw error;
      });
    });
  }

  function prepareMediaArchives(onProgress, pctStart, pctEnd) {
    var start = pctStart == null ? 15 : pctStart;
    var end = pctEnd == null ? 92 : pctEnd;
    var emitProgress = resolveProgressCallback(onProgress);
    return fetch(assetPath("offline/media/manifest.json"), {
      cache: "no-store",
      credentials: "include",
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Не найден media manifest: " + response.status);
        return response.json();
      })
      .then(function (manifest) {
        if (!manifest.packs || !manifest.packs.length) return;

        return loadZipLibrary().then(function () {
          return caches.open(MEDIA_CACHE).then(function (cache) {
            var preparedFiles = {};
            var packShare = (end - start) / manifest.packs.length;

            return manifest.packs.reduce(function (promise, pack, index) {
              return promise.then(function () {
                var zipUrl = resolvePackZipUrl(pack);
                var base = start + index * packShare;
                emitProgress(base, "Загрузка " + pack.id + "/media.btca.zip");
                return fetch(zipUrl, { cache: "no-store", credentials: "include" }).then(function (response) {
                  if (!response.ok) throw new Error("Не удалось загрузить " + zipUrl + ": " + response.status);
                  return response.blob();
                }).then(function (blob) {
                  var expected = Number(pack.bytes) || 0;
                  if (expected > 0 && blob && blob.size > 0 && Math.abs(blob.size - expected) > 2048) {
                    throw new Error(
                      "Архив " + pack.id + " повреждён при загрузке (размер " +
                      blob.size + ", ожидалось " + expected + "). Обновите страницу и повторите."
                    );
                  }
                  return blob.slice(0, 4).arrayBuffer().then(function (headBuf) {
                    var head = new Uint8Array(headBuf || []);
                    if (head.length < 2 || head[0] !== 0x50 || head[1] !== 0x4b) {
                      throw new Error(
                        "Архив " + pack.id + " повреждён при загрузке. Обновите страницу и повторите."
                      );
                    }
                    return blob;
                  });
                }).then(function (blob) {
                  return cache.put(zipUrl, new Response(blob.slice(0, blob.size), {
                    headers: { "Content-Type": "application/zip" },
                  })).then(function () {
                    return unpackZipToCache(blob, pack, manifest.password, cache, base, packShare, emitProgress);
                  });
                }).then(function (result) {
                  preparedFiles[pack.id] = result.images;
                });
              });
            }, Promise.resolve()).then(function () {
              localStorage.setItem(MEDIA_STATE_KEY, JSON.stringify({
                version: manifest.version,
                cacheGeneration: getCacheGeneration(),
                preparedAt: new Date().toISOString(),
                files: preparedFiles,
              }));
            });
          });
        });
      });
  }

  function prepareOffline() {
    if (!isLaunchUnlocked()) {
      gateLoadingHome();
      return;
    }
    if (!isAppleMobile() && !isDebugAppleMode()) {
      renderInfo("iOS/iPadOS", "Вы открыли страницу не на устройстве Apple. Для iOS/iPadOS откройте эту ссылку в Safari на iPhone или iPad.");
      return;
    }

    if (!window.isSecureContext) {
      renderInfo("iOS/iPadOS", "Для подготовки offline-пакета откройте страницу через HTTPS.");
      return;
    }

    if (!("serviceWorker" in navigator) || !("caches" in window)) {
      renderInfo("iOS/iPadOS", "Этот браузер не поддерживает PWA offline-кэш.");
      return;
    }

    if (isStandalone()) {
      repairStandaloneShell();
      return;
    }

    setButtonState(true, "Подготовка offline...");
    beginOfflinePreparation();
  }

  function repairStandaloneShell(options) {
    options = options || {};
    if (!isStandalone()) return Promise.resolve();
    if (!("serviceWorker" in navigator) || !("caches" in window)) {
      return Promise.resolve();
    }

    setOfflinePreparationActive(true);
    var report = function (pct, msg) {
      renderProgress("Обновление offline", pct, msg);
    };

    report(0, "Проверка offline-кэша...");
    return migrateMediaCacheFromPreviousGeneration()
      .then(function () {
        report(6, "Регистрация offline-службы...");
        return registerOfflineServiceWorker();
      })
      .then(function () {
        report(10, "Обновление оболочки...");
        return cacheCoreAssets(report, 10, 22);
      })
      .then(function () {
        return verifyMediaCacheReady();
      })
      .then(function (ready) {
        if (ready) {
          report(100, "Готово");
          markAppPrepared();
          migratePreparedClientMarkers();
          return activateRegisteredServiceWorker();
        }
        report(22, "Восстановление медиа...");
        return prepareMediaArchives(report, 22, 95).then(function () {
          return activateRegisteredServiceWorker();
        }).then(function () {
          markAppPrepared();
          migratePreparedClientMarkers();
        });
      })
      .catch(function (error) {
        console.warn("BTCA standalone repair failed", error);
        migratePreparedClientMarkers();
      })
      .then(function () {
        setOfflinePreparationActive(false);
        if (options.deferHome || !isLaunchUnlocked()) {
          // Холодный старт: форму входа откроет finishInstalledSplashForLogin после всей цепочки.
          hideHomeSplashIndicator();
          if (isLaunchUnlocked()) {
            pendingInstalledLoginReveal = false;
            renderInstalledHome();
          }
          return;
        }
        hideHomeSplashIndicator();
        renderInstalledHome();
      });
  }

  function beginOfflinePreparation() {
    if (isStandalone()) {
      repairStandaloneShell();
      return;
    }

    setOfflinePreparationActive(true);
    setButtonState(true, "Подготовка offline...");

    var report = function (pct, msg) {
      renderProgress("Подготовка iOS/iPadOS", pct, msg);
    };

    function revokePrepToken() {
      var prepGuard = window.BTCA_DATA_GUARD;
      if (prepGuard && prepGuard.revokeSafariPrepWipeToken) prepGuard.revokeSafariPrepWipeToken();
    }

    loadDataGuardScript().then(function () {
      var prepGuard = window.BTCA_DATA_GUARD;
      if (prepGuard && prepGuard.grantSafariPrepWipeToken) prepGuard.grantSafariPrepWipeToken();

      report(0, "Очистка данных предыдущей установки в Safari...");
      return resetSafariInstallEnvironment()
        .then(function () {
          report(3, "Очистка баз тренировок...");
          return wipeTrainingDatabasesInBrowser();
        })
        .then(function () {
          report(6, "Регистрация offline-службы...");
          return registerOfflineServiceWorker();
        })
        .then(function () {
          report(8, "Очистка устаревшей оболочки...");
          // Сносим все поколения :static-install — новый пакет целиком с сети.
          return purgeAllInstallCaches().then(function () {
            return purgeGenerationRuntimeCache();
          });
        })
        .then(function () {
          report(10, "Загрузка оболочки приложения...");
          return cacheCoreAssets(report, 10, 22);
        })
        .then(function () {
          report(22, "Загрузка и распаковка ZIP-архивов...");
          return prepareMediaArchives(report, 22, 95);
        })
        .then(function () {
          return activateRegisteredServiceWorker();
        })
        .then(function () {
          report(100, "Готово");
          // Сохранить логин в identity/install-cache после wipe кэшей — для первого запуска PWA.
          try {
            var prepLogin =
              String(localStorage.getItem(LICENSE_LOGIN_KEY) || "").trim() || readLoginCookie();
            if (prepLogin) {
              persistLicenseIdentity(
                prepLogin,
                localStorage.getItem(LICENSE_AUTH_OTP_KEY) === "1"
              );
            }
          } catch (e) { }
          renderReady();
          preloadLevel3ModuleSilently();
        });
    })
      .catch(renderError)
      .then(function () {
        setOfflinePreparationActive(false);
        setButtonState(false, "Загрузить все данные для offline");
        revokePrepToken();
      });
  }

  function bootstrapStandaloneShell(mediaReady) {
    // Холодный старт / после смахивания: splash + device_id / подписка / дата версии.
    renderInstalledHome({ preserveSplash: true });
    // Не открываем форму входа по таймауту — решение примет device-session.
    pendingInstalledLoginReveal = false;
    // Сначала общий device_id (cookie/IDB), иначе Safari и PWA получат разные UUID.
    var deviceWarm = ensureLicenseDeviceIdReady();
    var identityWarm = ensureLicenseIdentityRestored();
    var chain = Promise.resolve();
    if (!mediaReady) {
      chain = repairStandaloneShell({ deferHome: true });
    }

    return chain
      .then(function () {
        return deviceWarm.catch(function () {
          return getLicenseDeviceId();
        });
      })
      .then(function () {
        return runSplashBootChecks();
      })
      .then(function (check) {
        return identityWarm.catch(function () {
          return "";
        }).then(function () {
          return check;
        });
      })
      .then(function (check) {
        if (check && check.ok) {
          markPwaSessionStarted();
          startPwaSessionWatch();
          if (enforcePwaSessionLimit()) return;
          if (!readAppPreparedState()) markAppPrepared();
          discardStaleRuntimeModules();
          renderInstalledHome({ preserveSplash: true });
          return preloadAppModulesForHome().then(function () {
            ensureUpdateAvailableHint();
          });
        }
        return preloadAppModulesForHome({ keepSplashUntilUnlock: true }).then(function () {
          hideHomeSplashIndicator();
          if (check && check.reason === "inactive") {
            renderDeviceBlockedGate(check.message || SUBSCRIPTION_INACTIVE_MSG);
            return;
          }
          renderDeviceBlockedGate(
            (check && check.message) || DEVICE_NOT_BOUND_MSG
          );
        });
      })
      .catch(function (error) {
        console.warn("BTCA cold boot failed", error);
        hideHomeSplashIndicator();
        renderDeviceBlockedGate(DEVICE_NOT_BOUND_MSG);
      });
  }

  function bindShellUi() {
    var els = getEls();
    window.addEventListener("orientationchange", syncPortraitMode);
    window.addEventListener("resize", syncPortraitMode);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", syncPortraitMode);
    }
    document.addEventListener("click", handleAppNavigation, true);
    if (els.button) {
      els.button.onclick = function (event) {
        if (event) event.preventDefault();
        startIosOfflinePreparation();
      };
    }
    // visibilitychange: без сетевых проверок лицензии — только лимит сессии 12 ч.
    if (isStandalone()) startPwaSessionWatch();
  }

  var bootOpenDownloadsOnly = false;

  function paintBootUi() {
    cleanupOrphanHomePhraseMarkup();
    stripIosPwaQueryInBrowser();
    if (wantsOpenDownloads()) {
      // «Аккаунт | Обновление» → загрузочная сразу к кнопкам скачивания.
      bootOpenDownloadsOnly = true;
      if (readSessionToken()) {
        enterDownloadsViewFromSession();
      } else {
        document.body.classList.remove("btca-installed-mode");
        gateLoadingHome();
      }
      syncPortraitModeImmediate();
      return;
    }
    if (isAppShellMode()) {
      renderInstalledHome({ preserveSplash: !isLaunchUnlocked() });
      syncPortraitMode();
      return;
    }
    // Загрузочная в браузере: всегда OTP/проверки, потом варианты загрузки.
    gateLoadingHome();
    syncPortraitModeImmediate();
  }

  function wireSupportFooter() {
    var footer = document.querySelector(".footer");
    if (!footer) return;
    if (footer.getAttribute("data-support-wired") === "1") return;
    footer.setAttribute("data-support-wired", "1");
    var btn = footer.querySelector(".footer__support-btn");
    var line = footer.querySelector(".footer__support-line");
    var img = footer.querySelector(".footer__support-img");
    if (img) img.src = assetPath("branding/support.png");
    if (!btn || !line) return;

    function setPinned(open) {
      if (open) {
        footer.classList.add("is-support-open");
        line.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
      } else {
        footer.classList.remove("is-support-open");
        line.setAttribute("hidden", "hidden");
        btn.setAttribute("aria-expanded", "false");
      }
    }

    // Наведение — через CSS :has(...:hover) на загрузочной. Клик — закрепить строку.
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setPinned(btn.getAttribute("aria-expanded") !== "true");
    });
    line.addEventListener("click", function (event) {
      event.stopPropagation();
    });
    document.addEventListener("click", function (event) {
      if (!footer.contains(event.target)) setPinned(false);
    });
  }

  function init() {
    window.__BTCA_IOS_INSTALLER_READY__ = true;
    window.__BTCA_OPEN_DATE_INPUT__ = openCenteredDatePicker;
    stripIosPwaQueryInBrowser();
    clearStaleClientState();
    // Browser nonce для входа/OTP; серверный device_id появится только после claim.
    try {
      getBrowserClientId();
    } catch (e) { }
    // iPad: Cache/SW могут не resolve — UI сразу, иначе «зависает».
    paintBootUi();
    bindShellUi();
    wireSupportFooter();

    var boot = withTimeout(
      releaseStaleServiceWorkerForLoadingPage()
        .then(function () {
          return ensureMediaCacheReady();
        })
        .then(function (mediaReady) {
          return purgeObsoleteInstallCaches().then(function () {
            if (!mediaReady) return false;
            return purgeObsoleteMediaCaches().then(function () {
              return true;
            });
          });
        })
        .then(function (mediaReady) {
          return ensureShellUpToDate().then(function (reloading) {
            return { mediaReady: mediaReady, reloading: reloading };
          });
        }),
      2000,
      "boot-timeout"
    );

    boot
      .then(function (ctx) {
        if (!ctx || ctx.reloading) return;
        if (bootOpenDownloadsOnly) return;
        if (isAppShellMode()) {
          ensureFreshShellAfterDeploy();
          recordInstallSession();
          return bootstrapStandaloneShell(ctx.mediaReady);
        }
        if (isOfflinePreparationActive() && !isAppPreparedSync() && isLaunchUnlocked()) {
          window.setTimeout(function () {
            startIosOfflinePreparation();
          }, 0);
        }
      })
      .catch(function (error) {
        console.warn("BTCA bootstrap failed", error);
        if (bootOpenDownloadsOnly) return;
        if (isAppShellMode()) {
          recordInstallSession();
          if (!isLaunchUnlocked()) {
            renderInstalledHome({ preserveSplash: true });
            return repairStandaloneShell({ deferHome: true })
              .then(function () {
                return preloadAppModulesForHome({ keepSplashUntilUnlock: true });
              })
              .then(function () {
                finishInstalledSplashForLogin();
              })
              .catch(function () {
                finishInstalledSplashForLogin();
              });
          }
          return repairStandaloneShell().then(function () {
            return preloadAppModulesForHome();
          });
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
// @btca-slide-menu-embed
(function (global) {
  var TRANSITION_MS = 260;

  function hostHtml(modifierClass, panelClass, panelAttrs, innerHtml) {
    var mod = modifierClass ? " " + modifierClass : "";
    return (
      '<div class="btca-level1-slide-menu-host' + mod + '">' +
      '<div class="btca-level1-slide-menu-panel ' + panelClass + '"' + (panelAttrs || "") + ">" +
      innerHtml +
      "</div></div>"
    );
  }

  function openHost(layer) {
    var host = layer && layer.querySelector(".btca-level1-slide-menu-host");
    if (!host) return;
    var panel = host.querySelector(".btca-level1-slide-menu-panel");
    host.classList.remove("btca-level1-slide-menu-host--open");
    if (panel) {
      panel.style.transform = "translate3d(100%, 0, 0)";
    }
    void host.offsetWidth;
    global.setTimeout(function () {
      if (panel) panel.style.transform = "";
      host.classList.add("btca-level1-slide-menu-host--open");
    }, 20);
  }

  function closeLayer(layer, done) {
    if (!layer) {
      if (done) done();
      return;
    }
    var host = layer.querySelector(".btca-level1-slide-menu-host");
    if (!host || !host.classList.contains("btca-level1-slide-menu-host--open")) {
      layer.setAttribute("hidden", "hidden");
      layer.innerHTML = "";
      if (done) done();
      return;
    }
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      layer.setAttribute("hidden", "hidden");
      layer.innerHTML = "";
      if (done) done();
    }
    host.classList.remove("btca-level1-slide-menu-host--open");
    var panel = host.querySelector(".btca-level1-slide-menu-panel");
    if (panel) {
      panel.addEventListener("transitionend", function onEnd(e) {
        if (e.propertyName !== "transform") return;
        panel.removeEventListener("transitionend", onEnd);
        finish();
      });
    }
    global.setTimeout(finish, TRANSITION_MS + 50);
  }

  function positionHostBelow(root, triggerSelector, layer) {
    var btn = root && root.querySelector(triggerSelector);
    var host = layer && layer.querySelector(".btca-level1-slide-menu-host");
    if (!btn || !host) return;
    var gap = 6;
    host.style.top = Math.round(btn.getBoundingClientRect().bottom + gap) + "px";
  }

  global.BTCA_SLIDE_MENU = {
    hostHtml: hostHtml,
    openLayer: function (layer) {
      openHost(layer);
    },
    closeLayer: closeLayer,
    positionHostBelow: positionHostBelow,
  };
})(typeof window !== "undefined" ? window : globalThis);
