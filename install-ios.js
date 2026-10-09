(function () {
  "use strict";

  var BTCA_BASE = "/btca-10-1/";
  var INSTALL_CACHE = "btca10-web-10.1.16:static-install";
  var MEDIA_CACHE = "btca10-web-10.1.16:static-media";
  var MEDIA_PROBE_RE = /offline-unpacked\/level3\/exercises\/[^/]+\.(jpe?g|png|webp|gif)$/i;
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
  var ABOUT_HEADING = "РџР РћР•РљРў BTCA 10.1";
  var ABOUT_MAIN_TEXT = "РќР°СЃС‚РѕСЏС‰РµРµ РџСЂРёР»РѕР¶РµРЅРёРµ СЂР°Р·СЂР°Р±РѕС‚Р°РЅРѕ РґР»СЏ Р»РѕРєР°Р»СЊРЅРѕР№ СѓСЃС‚Р°РЅРѕРІРєРё (СЂР°Р·РІС‘СЂС‚С‹РІР°РЅРёСЏ) РЅР° СЃРјР°СЂС‚С„РѕРЅРµ РёР»Рё РїР»Р°РЅС€РµС‚Рµ СЃ РѕРїРµСЂР°С†РёРѕРЅРЅС‹РјРё СЃРёСЃС‚РµРјР°РјРё Android РёР»Рё iOS Рё СЂР°СЃСЃС‡РёС‚Р°РЅРѕ РґР»СЏ РѕР±СѓС‡РµРЅРёСЏ Рё С‚СЂРµРЅРёСЂРѕРІРєРё СѓС‡РµРЅРёРєРѕРІ СЃ СѓСЂРѕРІРЅРµРј РїРѕРґРіРѕС‚РѕРІРєРё В«РЈСЂРѕРІРµРЅСЊ 3 вЂ” РџСЂРѕРґРІРёРЅСѓС‚С‹Р№В».";
  var ABOUT_POST_TEXT = "*****\nР‘РўРљРђ, СЌС‚Рѕ вЂ” СѓС‡РµР±РЅРѕ-С‚СЂРµРЅРёСЂРѕРІРѕС‡РЅС‹Р№ РїСЂРѕРіСЂР°РјРјРЅС‹Р№ РєРѕРјРїР»РµРєСЃ, РїСЂРµРґРЅР°Р·РЅР°С‡РµРЅРЅС‹Р№ РґР»СЏ РєРѕРјРїР»РµРєСЃРЅРѕРіРѕ РѕР±СѓС‡РµРЅРёСЏ РёРіСЂРµ РЅР° СЂСѓСЃСЃРєРѕРј Р±РёР»СЊСЏСЂРґРµ, РІС‹СЂР°Р±РѕС‚РєРё Рё Р·Р°РєСЂРµРїР»РµРЅРёСЏ РїСЂР°РєС‚РёС‡РµСЃРєРёС… РЅР°РІС‹РєРѕРІ РІРµРґРµРЅРёСЏ Р±РёР»СЊСЏСЂРґРЅРѕР№ РёРіСЂС‹ РІ РџРёСЂР°РјРёРґСѓ, РєР°Рє СЃР°РјРѕСЃС‚РѕСЏС‚РµР»СЊРЅРѕ, С‚Р°Рє Рё СЃ С‚СЂРµРЅРµСЂРѕРј, СЃ РїСЂРёРјРµРЅРµРЅРёРµРј СЃРѕРІСЂРµРјРµРЅРЅС‹С… РјРµС‚РѕРґРёРє Рё С‚РµС…РЅРѕР»РѕРіРёР№.\nРўСЂРµРЅРёСЂРѕРІРѕС‡РЅС‹Р№ РєРѕРјРїР»РµРєСЃ Р‘РўРљРђ РІ СЃРѕС‡РµС‚Р°РЅРёРё СЃ СѓРЅРёРєР°Р»СЊРЅРѕР№ РњРµС‚РѕРґРѕР»РѕРіРёРµР№ РѕР±СѓС‡РµРЅРёСЏ СЃРѕСЃС‚Р°РІР»СЏСЋС‚ РѕР±С‰СѓСЋ РЎРёСЃС‚РµРјСѓ С‚СЂРµРЅРёСЂРѕРІРѕРє Р‘РўРљРђ С€РєРѕР»С‹ СЂСѓСЃСЃРєРѕРіРѕ Р±РёР»СЊСЏСЂРґР° В«РђР±СЂРёРєРѕР»СЊВ» Рі. РљСЂР°СЃРЅРѕСЏСЂСЃРє.\n<a href=\"https://cloud.mail.ru/public/sujN/mpE8mr6aW\">РњРµС‚РѕРґРёРєР° РѕР±СѓС‡РµРЅРёСЏ</a>\n\nР’ С‚РµРєСѓС‰РµР№ РІРµСЂСЃРёРё РџСЂРёР»РѕР¶РµРЅРёСЏ Р‘РўРљРђ 10.1 РґРѕСЃС‚СѓРїРµРЅ СЂР°Р·РґРµР»:\nвЂў  *РЈСЂРѕРІРµРЅСЊ 3 вЂ” РџСЂРѕРґРІРёРЅСѓС‚С‹Р№* РЈРїСЂР°Р¶РЅРµРЅРёР№ вЂ“ 40, Р—Р°РґР°С‡ вЂ“ 263, РџРѕР»РµР·РЅРѕСЃС‚РµР№ вЂ“ 15.\n\nР’СЃРµ РџСЂРёР»РѕР¶РµРЅРёСЏ С„СѓРЅРєС†РёРѕРЅРёСЂСѓСЋС‚ Р±РµР· РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ СЃРµС‚Рё РРЅС‚РµСЂРЅРµС‚.\nРљР°Р¶РґРѕРµ РџСЂРёР»РѕР¶РµРЅРёРµ:\nвЂў  РЎРѕРґРµСЂР¶РёС‚ СЃРїРµС†РёС„РёС‡РµСЃРєРёР№ (СЃРѕРѕС‚РІРµС‚СЃС‚РІСѓСЋС‰РёР№ СѓСЂРѕРІРЅСЋ РїРѕРґРіРѕС‚РѕРІРєРё) РЅР°Р±РѕСЂ СѓРїСЂР°Р¶РЅРµРЅРёР№, Р·Р°РґР°С‡ Рё С‚РµСЃС‚РѕРІ (РІ РіСЂР°С„РёС‡РµСЃРєРѕРј РІРёРґРµ), СЂР°РЅР¶РёСЂРѕРІР°РЅРЅС‹С… РїРѕ РїСЂРёРЅС†РёРїСѓ - \"РѕС‚ РїСЂРѕСЃС‚РѕРіРѕ Рє СЃР»РѕР¶РЅРѕРјСѓ\", Рё СЃРіСЂСѓРїРїРёСЂРѕРІР°РЅРЅС‹С… РІ С‚РµРјР°С‚РёС‡РµСЃРєРёРµ СЂР°Р·РґРµР»С‹ РїРѕ РІРёРґР°Рј С‚СЂРµРЅРёСЂРѕРІРѕРє;\nвЂў  Р’РєР»СЋС‡Р°РµС‚ РЅРµРѕР±С…РѕРґРёРјС‹Рµ РёРЅСЃС‚СЂСѓРєС†РёРё, РјРµС‚РѕРґРёС‡РµСЃРєСѓСЋ Рё СЃРїСЂР°РІРѕС‡РЅСѓСЋ РёРЅС„РѕСЂРјР°С†РёСЋ;\nвЂў  РћР±РµСЃРїРµС‡РёРІР°РµС‚ РІРѕР·РјРѕР¶РЅРѕСЃС‚СЊ РІРІРѕРґР°, С…СЂР°РЅРµРЅРёСЏ Рё РѕР±СЂР°Р±РѕС‚РєРё СЂРµР·СѓР»СЊС‚Р°С‚РѕРІ РїСЂРѕРіСЂРµСЃСЃР° РІС‹РїРѕР»РЅРµРЅРёСЏ СѓС‡РµРЅРёРєРѕРј РїСЂР°РєС‚РёС‡РµСЃРєРёС… Р·Р°РґР°РЅРёР№ РґР»СЏ РїРѕСЃР»РµРґСѓСЋС‰РµРіРѕ СЃС‚Р°С‚РёСЃС‚РёС‡РµСЃРєРѕРіРѕ Р°РЅР°Р»РёР·Р° СЃ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёРµРј Р»РѕРєР°Р»СЊРЅРѕР№ Р‘Р°Р·С‹ РґР°РЅРЅС‹С… (Р‘Р”);\nвЂў  РРјРµРµС‚ РІРµСЃСЊ РЅРµРѕР±С…РѕРґРёРјС‹Р№ С„СѓРЅРєС†РёРѕРЅР°Р» Рё Р°РІС‚РѕРјР°С‚РёР·Р°С†РёСЋ, Р° С‚Р°РєР¶Рµ РёРЅС‚СѓРёС‚РёРІРЅРѕ-РїРѕРЅСЏС‚РЅС‹Р№ РёРЅС‚РµСЂС„РµР№СЃ, С‡С‚Рѕ СЃРїРѕСЃРѕР±СЃС‚РІСѓРµС‚ РѕСЃСѓС‰РµСЃС‚РІР»РµРЅРёСЋ РїРѕР»РЅРѕС†РµРЅРЅРѕРіРѕ, СЌС„С„РµРєС‚РёРІРЅРѕРіРѕ С‚СЂРµРЅРёСЂРѕРІРѕС‡РЅРѕРіРѕ РїСЂРѕС†РµСЃСЃР° РІ РєРѕРјС„РѕСЂС‚РЅС‹С… СѓСЃР»РѕРІРёСЏС….\n\nРћРў РђР’РўРћР Рђ. РЎРёСЃС‚РµРјР° С‚СЂРµРЅРёСЂРѕРІРѕРє Р‘РўРљРђ СЂР°Р·СЂР°Р±РѕС‚Р°РЅР° РїРѕ СЂРµР·СѓР»СЊС‚Р°С‚Р°Рј СЃРёСЃС‚РµРјР°С‚РёР·Р°С†РёРё РјРµС‚РѕРґРёРє РѕР±СѓС‡РµРЅРёСЏ СЂСѓСЃСЃРєРѕРјСѓ Р±РёР»СЊСЏСЂРґСѓ РЅР° РѕСЃРЅРѕРІРµ: СЃРµРєСЂРµС‚РѕРІ РІРµРґСѓС‰РёС… С‚СЂРµРЅРµСЂРѕРІ Рё РёРіСЂРѕРєРѕРІ (РІ С‚.С‡. Р’. РЎРёРјРѕРЅРёС‡Р°, Р’. Р›Р°Р·Р°СЂРµРІР°, РЎ. Р‘Р°СѓСЂРѕРІР°, Р•. РЎС‚Р°Р»РµРІР° Рё РґСЂ.), РѕРїС‹С‚Р° В«СЃС‚Р°СЂРѕР№ С€РєРѕР»С‹В», Р° С‚Р°РєР¶Рµ СЃРѕРІСЂРµРјРµРЅРЅС‹С… РЅР°СѓС‡РЅС‹С… Рё СЌРєСЃРїРµСЂРёРјРµРЅС‚Р°Р»СЊРЅС‹С… РёСЃСЃР»РµРґРѕРІР°РЅРёР№ Рё IT-С‚РµС…РЅРѕР»РѕРіРёР№.\n<a href=\"https://cloud.mail.ru/public/Ye3r/ZYwpjB9uz\">РџРѕРґСЂРѕР±РЅРѕРµ РѕРїРёСЃР°РЅРёРµ РєРѕРјРїР»РµРєСЃР° Р‘РўРљРђ</a>\n\nCopyright В© Р®СЂРёР№ РђР»РёРЅС‚ (РђРЅРґСЂРµР№ Р®СЂСЊРµРІ) 2026";
  var installedHomeSnapshot = "";
  var LEVEL1_MODULE_VERSION = "10.1.12";
  var LEVEL3_MODULE_VERSION = "10.1.12";

  var CORE_REL_PATHS = [
    "",
    "favicon-10-1-16.ico",
    "icons/favicon-10-1-16.png",
    "icons/btca-apple-touch-icon.png",
    "icons/touch-10-1-16.png",
    "icons/tab-10-1-16.png",
    "icons/tab-10-1-16-32.png",
    "icons/btca-icon-192.png",
    "icons/btca-icon-512.png",
    "branding/logo3.png",
    "branding/up.png",
    "branding/baza.png",
    "branding/cross.png",
    "branding/gal.png",
    "branding/del.png",
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
    "level1/level1-db.js?v=" + LEVEL1_MODULE_VERSION,
    "level1/level1-app.js?v=" + LEVEL1_MODULE_VERSION,
    "level1/data/forma_exercise_list.json",
    "level1/data/polezCatalog.json",
    "level1/data/polezLinks.json",
    "level1/data/polezDescriptions.json",
    "level3/level3-db.js?v=" + LEVEL3_MODULE_VERSION,
    "level3/level3-baza.js?v=" + LEVEL3_MODULE_VERSION,
    "level3/level3-app.js?v=" + LEVEL3_MODULE_VERSION,
    "level3/data/forma_exercise_list.json",
    "level3/data/polezCatalog.json",
    "level3/data/polezLinks.json",
    "level3/data/polezDescriptions.json",
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

  function renderHomeSplashIndicator(percent) {
    var panel = getEls().panel;
    if (!panel) return;
    var disp = splashDisplayPct(percent);
    var num = panel.querySelector("[data-btca-splash-pct-num]");
    if (num && panel.classList.contains("btca-home-splash-panel")) {
      num.textContent = String(disp);
      var wrap = panel.querySelector(".btca-ios-splash-panel");
      if (wrap) wrap.setAttribute("aria-label", "РџСЂРѕРіСЂРµСЃСЃ " + disp + "%");
      return;
    }
    panel.className = "ios-panel ios-panel--open btca-home-splash-panel";
    panel.innerHTML =
      '<div class="btca-ios-splash-panel" aria-label="РџСЂРѕРіСЂРµСЃСЃ ' + disp + '%">' +
      buildSplashIndicatorHtml(disp) +
      "</div>";
  }

  function hideHomeSplashIndicator() {
    var panel = getEls().panel;
    if (!panel) return;
    panel.className = "ios-panel";
    panel.innerHTML = "";
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
      preloadLevel1ModuleSilently();
      preloadLevel3ModuleSilently();
      return Promise.resolve();
    }
    discardStaleRuntimeModules();
    if (level1ModuleFresh() && level3ModuleFresh() && slideMenuReady()) {
      hideHomeSplashIndicator();
      return Promise.resolve();
    }

    var v1 = LEVEL1_MODULE_VERSION;
    var v2 = LEVEL3_MODULE_VERSION;
    var steps = [];

    if (!slideMenuReady()) {
      steps.push({ run: function () { return loadSlideMenuScript(); } });
    }

    if (!level1ModuleReady()) {
      steps.push(
        { run: function () { return loadDataGuardScript(); } },
        { run: function () { return loadBazaDiagramScript(); } },
        { run: function () { return loadBazaDialogsScript(); } },
        { run: function () { return loadBazaScreenshotScript(); } },
        { run: function () { return loadSlideMenuScript(); } },
        { run: function () { return loadLevel1Script(assetPath("level1/level1-db.js?v=" + v1)); } },
        { run: function () { return loadLevel1Script(assetPath("level1/level1-app.js?v=" + v1)); } },
        { run: function () {
          if (!level1ModuleReady()) throw new Error("РњРѕРґСѓР»СЊ РЈСЂРѕРІРЅСЏ 1 РЅРµ РёРЅРёС†РёР°Р»РёР·РёСЂРѕРІР°РЅ");
          return window.BTCA_LEVEL1.boot();
        } }
      );
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
        { run: function () {
          if (!level3ModuleReady()) throw new Error("РњРѕРґСѓР»СЊ РЈСЂРѕРІРЅСЏ 3 РЅРµ РёРЅРёС†РёР°Р»РёР·РёСЂРѕРІР°РЅ");
          return window.BTCA_LEVEL3.boot();
        } }
      );
    }

    if (!steps.length) {
      hideHomeSplashIndicator();
      return Promise.resolve();
    }

    function report(localPct) {
      renderHomeSplashIndicator(mapBootProgress(localPct, startPct, endPct));
    }

    report(0);
    var total = steps.length;
    return steps.reduce(function (chain, step, index) {
      return chain.then(function () {
        report((index / total) * 100);
        return withTimeout(
          step.run(),
          45000,
          "РўР°Р№РјР°СѓС‚ Р·Р°РіСЂСѓР·РєРё РјРѕРґСѓР»РµР№ Р‘РўРљРђ"
        );
      });
    }, Promise.resolve()).then(function () {
      report(100);
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
    return window.matchMedia("(display-mode: standalone)").matches || Boolean(navigator.standalone);
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
    } catch (_) {}
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
    } catch (_) {}
  }

  function shouldRunShellUpdateCheck() {
    if (isOfflinePreparationActive()) return false;
    if (isStandalone()) return true;
    return isAppPreparedSync();
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

  function clearInjectedLevel1Scripts() {
    clearInjectedDataGuardScript();
    clearInjectedBazaDiagramScript();
    clearInjectedBazaDialogsScript();
    clearInjectedSlideMenuScript();
    document.querySelectorAll("script[data-btca-level1-src]").forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    delete window.BTCA_LEVEL1;
    delete window.BTCA_LEVEL1_DB;
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
    if (level1ModuleReady() && !level1ModuleFresh()) {
      clearInjectedLevel1Scripts();
    }
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
    } catch (_) {}
  }

  function invalidatePreparedClientState() {
    try {
      localStorage.removeItem(APP_READY_KEY);
      localStorage.removeItem(MEDIA_STATE_KEY);
    } catch (_) {}
    window.__BTCA_APP_BOOT_READY__ = false;
  }

  function purgeGenerationRuntimeCache() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.delete(getCacheGeneration() + ":runtime").catch(function () {});
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
    } catch (_) {}
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
    return "BTCA 10.1";
  }

  function clearBrowserPrepMarkers() {
    try {
      localStorage.removeItem(APP_READY_KEY);
      localStorage.removeItem(MEDIA_STATE_KEY);
    } catch (_) {}
  }

  function clearInstallSessionMarker() {
    try {
      localStorage.removeItem(INSTALL_SESSION_KEY);
    } catch (_) {}
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
      console.warn("BTCA: skipped training DB wipe вЂ” Safari prep token missing");
      return Promise.resolve();
    }
    return ensureLevel1Module().then(function () {
      var tasks = [];
      if (window.BTCA_LEVEL1_DB && window.BTCA_LEVEL1_DB.wipeTrainingDatabase) {
        tasks.push(window.BTCA_LEVEL1_DB.wipeTrainingDatabase());
      }
      return ensureLevel3Module().then(function () {
        if (window.BTCA_LEVEL3_DB && window.BTCA_LEVEL3_DB.wipeTrainingDatabase) {
          tasks.push(window.BTCA_LEVEL3_DB.wipeTrainingDatabase());
        }
        return Promise.all(tasks);
      });
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
    } catch (_) {}
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
    }).catch(function () {});
  }

  function flushClientDataBeforeReload() {
    var tasks = [];
    try {
      if (window.BTCA_LEVEL1_DB && window.BTCA_LEVEL1_DB.flushUiState) {
        tasks.push(window.BTCA_LEVEL1_DB.flushUiState());
      }
      if (window.BTCA_LEVEL3_DB && window.BTCA_LEVEL3_DB.flushUiState) {
        tasks.push(window.BTCA_LEVEL3_DB.flushUiState());
      }
    } catch (_) {}
    return Promise.all(tasks).catch(function () {});
  }

  function purgeAllShellCachesExceptMedia() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        return name.indexOf(CACHE_NAME_PREFIX) === 0 && !name.endsWith(":static-media");
      }).map(function (name) {
        return caches.delete(name);
      }));
    }).catch(function () {});
  }

  function purgeAllInstallCaches() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        return name.indexOf(CACHE_NAME_PREFIX) === 0 && name.endsWith(":static-install");
      }).map(function (name) {
        return caches.delete(name);
      }));
    }).catch(function () {});
  }

  function purgeShellServiceWorkerCaches() {
    if (!("caches" in window)) return Promise.resolve();
    var generation = getCacheGeneration();
    return Promise.all([
      caches.delete(generation + ":app").catch(function () {}),
      caches.delete(generation + ":runtime").catch(function () {}),
    ]);
  }

  function shellRefreshAttemptKey(remote) {
    return META_RELOAD_SESSION_KEY + ":" + remote;
  }

  function reloadShellForRemoteVersion(remote) {
    var target = String(remote || "").trim() || readMetaCacheVersion() || "unknown";
    var attemptKey = shellRefreshAttemptKey(target);
    try {
      if (sessionStorage.getItem(attemptKey) === "1") {
        // One reload already attempted for this remote вЂ” stop Safari/iPad loops
        // when app-shell.json lags behind the HTML/SW meta version.
        var metaNow = readMetaCacheVersion();
        if (metaNow) writeAppliedShellVersion(metaNow);
        return Promise.resolve(false);
      }
      sessionStorage.setItem(attemptKey, "1");
    } catch (_) {}

    discardStaleRuntimeModules();
    return purgeAllShellCachesExceptMedia()
      .then(function () {
        if (!("serviceWorker" in navigator)) return;
        return navigator.serviceWorker.getRegistration(BTCA_BASE).then(function (registration) {
          if (!registration) return;
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
          return registration.update().catch(function () {});
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
    return cacheCoreAssets(function () {}, 0, 0).catch(function () {});
  }

  function clearStaleClientState() {
    var generation = getCacheGeneration();
    var metaGen = readMetaCacheVersion();
    if (metaGen && metaGen !== generation) {
      reloadShellForRemoteVersion(generation);
      return false;
    }

    try {
      var shellParam = new URLSearchParams(window.location.search).get("btca-shell");
      if (shellParam && shellParam === metaGen) {
        sessionStorage.removeItem(shellRefreshAttemptKey(shellParam));
        writeAppliedShellVersion(shellParam);
      }
    } catch (_) {}

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
        if (name.endsWith(":static-media")) return false;
        return true;
      }).map(function (name) {
        return caches.delete(name);
      }));
    }).catch(function () {});
  }

  function purgeShellInstallCache() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.delete(INSTALL_CACHE).catch(function () {});
  }

  function unregisterOfflineServiceWorker() {
    if (!("serviceWorker" in navigator)) return Promise.resolve();
    return navigator.serviceWorker.getRegistration(BTCA_BASE).then(function (registration) {
      if (!registration) return;
      return registration.unregister();
    }).catch(function () {});
  }

  function deleteAllBtcaCaches() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        return name.indexOf(CACHE_NAME_PREFIX) === 0;
      }).map(function (name) {
        return caches.delete(name);
      }));
    }).catch(function () {});
  }

  function resetSafariInstallEnvironment() {
    if (isStandalone()) return Promise.resolve();
    invalidatePreparedClientState();
    clearAllInstallMarkers();
    window.__BTCA_APP_BOOT_READY__ = false;
    return unregisterOfflineServiceWorker().then(deleteAllBtcaCaches);
  }

  function cachePutAsset(cache, assetUrl) {
    return fetch(assetUrl, { cache: "no-store" })
      .then(function (response) {
        if (!response || !response.ok) return;
        return cache.put(assetUrl, response);
      })
      .catch(function () {});
  }

  function ensureFreshShellAfterDeploy() {
    if (!("serviceWorker" in navigator)) return;
    if (!shouldRunShellUpdateCheck()) return;

    navigator.serviceWorker.getRegistration(BTCA_BASE).then(function (registration) {
      if (!registration || !shouldRunShellUpdateCheck()) return;
      registration.update().catch(function () {});
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (window.__BTCA_SHELL_RELOADED__) return;
        if (isOfflinePreparationActive()) return;
        window.__BTCA_SHELL_RELOADED__ = true;
        flushClientDataBeforeReload().then(function () {
          window.location.reload();
        });
      });
    }).catch(function () {});
  }

  function ensureShellUpToDate() {
    if (!shouldRunShellUpdateCheck()) return Promise.resolve(false);
    var swPromise = Promise.resolve();
    if ("serviceWorker" in navigator) {
      swPromise = navigator.serviceWorker.getRegistration(BTCA_BASE).then(function (registration) {
        if (!registration) return;
        return registration.update().catch(function () {}).then(function () {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    }
    return swPromise.then(function () {
      return probeRemoteShellVersion();
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
      var remoteL1 = String(payload.level1ModuleVersion || "").trim();
      var remoteL2 = String(payload.level3ModuleVersion || "").trim();
      var applied = readAppliedShellVersion();
      var shellStale = remote && (remote !== currentMeta || (applied && remote !== applied));
      var remoteModuleStale =
        (remoteL1 && remoteL1 !== LEVEL1_MODULE_VERSION) ||
        (remoteL2 && remoteL2 !== LEVEL3_MODULE_VERSION);
      var runtimeModuleStale =
        (level1ModuleReady() && !level1ModuleFresh()) ||
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
        } catch (_) {}
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
    }).catch(function () {});
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
    "РЇРЅРІР°СЂСЊ", "Р¤РµРІСЂР°Р»СЊ", "РњР°СЂС‚", "РђРїСЂРµР»СЊ", "РњР°Р№", "РСЋРЅСЊ",
    "РСЋР»СЊ", "РђРІРіСѓСЃС‚", "РЎРµРЅС‚СЏР±СЂСЊ", "РћРєС‚СЏР±СЂСЊ", "РќРѕСЏР±СЂСЊ", "Р”РµРєР°Р±СЂСЊ",
  ];
  var DATE_PICKER_WEEKDAYS = ["РџРЅ", "Р’С‚", "РЎСЂ", "Р§С‚", "РџС‚", "РЎР±", "Р’СЃ"];

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
    layer.setAttribute("aria-label", title || "Р’С‹Р±РѕСЂ РґР°С‚С‹");
    layer.innerHTML =
      '<button type="button" class="btca-date-picker-layer__backdrop" data-btca-date-close aria-label="Р—Р°РєСЂС‹С‚СЊ"></button>' +
      '<div class="btca-date-picker-panel">' +
      '<div class="btca-date-picker-panel__title">' + escapeHtml(title || "Р”Р°С‚Р°") + "</div>" +
      '<div class="btca-date-picker-panel__nav">' +
      '<button type="button" class="btca-date-picker-panel__nav-btn" data-btca-date-prev aria-label="РџСЂРµРґС‹РґСѓС‰РёР№ РјРµСЃСЏС†">вЂ№</button>' +
      '<div class="btca-date-picker-panel__month" data-btca-date-month></div>' +
      '<button type="button" class="btca-date-picker-panel__nav-btn" data-btca-date-next aria-label="РЎР»РµРґСѓСЋС‰РёР№ РјРµСЃСЏС†">вЂє</button>' +
      "</div>" +
      '<div class="btca-date-picker-panel__week" aria-hidden="true">' +
      DATE_PICKER_WEEKDAYS.map(function (day) { return "<span>" + day + "</span>"; }).join("") +
      "</div>" +
      '<div class="btca-date-picker-panel__grid" data-btca-date-grid></div>' +
      '<button type="button" class="btca-l1-picker-done btca-date-picker-panel__done" data-btca-date-done>Р“РѕС‚РѕРІРѕ</button>' +
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

  function renderRichText(value) {
    return escapeHtml(value)
      .replace(/&lt;a href=&quot;([^&]+)&quot;&gt;([\s\S]*?)&lt;\/a&gt;/g, '<a href="$1" target="_blank" rel="noopener">$2</a>')
      .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  function iosInstallGuidanceHtml() {
    var name = resolvePwaShortcutName();
    return (
      '<p class="hint">Offline-РїР°РєРµС‚ РїРѕРґРіРѕС‚РѕРІР»РµРЅ, РґР°Р»РµРµ РЅСѓР¶РЅРѕ СѓСЃС‚Р°РЅРѕРІРёС‚СЊ СЏСЂР»С‹Рє РїСЂРёР»РѕР¶РµРЅРёСЏ ' +
      escapeHtml(name) +
      ' - РџРѕРґРµР»РёС‚СЊСЃСЏ в†’ Р”РѕР±Р°РІРёС‚СЊ РЅР° СЌРєСЂР°РЅ &quot;Р”РѕРјРѕР№&quot;.</p>' +
      '<p class="prepare-status prepare-status--warning">Р’РќРРњРђРќРР•. Р•СЃР»Рё СЏСЂР»С‹Рє СѓР¶Рµ СѓСЃС‚Р°РЅРѕРІР»РµРЅ, С‚Рѕ РґР»СЏ РєРѕСЂСЂРµРєС‚РЅРѕР№ СЂР°Р±РѕС‚С‹ СЃР»РµРґСѓРµС‚ СѓРґР°Р»РёС‚СЊ СЏСЂР»С‹Рє, Р° Р·Р°С‚РµРј РїРµСЂРµР·Р°РіСЂСѓР·РёС‚СЊ СЃС‚СЂР°РЅРёС†Сѓ Рё РїРѕРІС‚РѕСЂРёС‚СЊ Р·Р°РіСЂСѓР·РєСѓ.</p>'
    );
  }

  function renderProgress(title, percent, message) {
    var pct = Math.max(0, Math.min(100, Math.round(percent)));
    if (isStandalone()) {
      renderHomeSplashIndicator(pct);
      return;
    }
    setPanel(
      '<div class="ios-panel__header"><span>' + escapeHtml(title) + "</span><span>" + pct + "%</span></div>" +
      '<div class="progress" aria-label="РџСЂРѕРіСЂРµСЃСЃ offline-РїРѕРґРіРѕС‚РѕРІРєРё"><div class="progress__bar" style="width:' + pct + '%"></div></div>' +
      '<p class="prepare-status prepare-status--running">' + escapeHtml(message) + "</p>" +
      iosInstallGuidanceHtml()
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
      '<div class="progress" aria-label="РџСЂРѕРіСЂРµСЃСЃ offline-РїРѕРґРіРѕС‚РѕРІРєРё"><div class="progress__bar" style="width:100%"></div></div>' +
      '<p class="prepare-status prepare-status--ready">Р“РѕС‚РѕРІРѕ РґР»СЏ offline.</p>' +
      iosInstallGuidanceHtml()
    );
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
      '<button class="btca-back-button" type="button" data-btca-back aria-label="РќР°Р·Р°Рґ">в†ђ</button>' +
      '<strong>Рћ РїСЂРѕРµРєС‚Рµ</strong>' +
      '<span aria-hidden="true"></span>' +
      "</header>" +
      '<section class="btca-about-content">' +
      '<h1>' + escapeHtml(ABOUT_HEADING) + "</h1>" +
      '<p>' + renderRichText(ABOUT_MAIN_TEXT.trim()) + "</p>" +
      '<div class="btca-about-spacer"></div>' +
      '<p>' + renderRichText(ABOUT_POST_TEXT.trim()) + "</p>" +
      "</section>" +
      "</main>";
    var back = document.querySelector("[data-btca-back]");
    if (back) {
      back.addEventListener("click", function () {
        root.innerHTML = installedHomeSnapshot;
        installedHomeSnapshot = "";
        renderInstalledHome();
      });
    }
  }

  function level1ModuleReady() {
    return Boolean(
      window.BTCA_LEVEL1_DB &&
      window.BTCA_LEVEL1 &&
      window.BTCA_LEVEL1.boot
    );
  }

  function level1ModuleFresh() {
    return level1ModuleReady() && window.BTCA_LEVEL1.VERSION === LEVEL1_MODULE_VERSION;
  }

  function removeInjectedScript(attr, src) {
    var old = document.querySelector('script[' + attr + '="' + src + '"]');
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }

  /** РџСЂРѕРІРµСЂРєР°, С‡С‚Рѕ fetch РІРµСЂРЅСѓР» JS-РјРѕРґСѓР»СЊ, Р° РЅРµ HTML-СЃС‚СЂР°РЅРёС†Сѓ (404 Рё С‚.Рї.). */
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
          if (!response.ok) throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("РќРµРІРµСЂРЅС‹Р№ РѕС‚РІРµС‚ РґР»СЏ " + src);
          }
          removeInjectedScript("data-btca-data-guard-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-data-guard-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_DATA_GUARD) {
            throw new Error("btca-data-guard.js РІС‹РїРѕР»РЅРµРЅ, РЅРѕ BTCA_DATA_GUARD РЅРµ РЅР°Р№РґРµРЅ");
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
          if (!response.ok) throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("РќРµРІРµСЂРЅС‹Р№ РѕС‚РІРµС‚ РґР»СЏ " + src);
          }
          removeInjectedScript("data-btca-baza-diagram-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-baza-diagram-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_BAZA_DIAGRAM) {
            throw new Error("btca-baza-diagram.js РІС‹РїРѕР»РЅРµРЅ, РЅРѕ BTCA_BAZA_DIAGRAM РЅРµ РЅР°Р№РґРµРЅ");
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
          if (!response.ok) throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("РќРµРІРµСЂРЅС‹Р№ РѕС‚РІРµС‚ РґР»СЏ " + src);
          }
          removeInjectedScript("data-btca-baza-dialogs-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-baza-dialogs-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_BAZA_DIALOGS) {
            throw new Error("btca-baza-dialogs.js РІС‹РїРѕР»РЅРµРЅ, РЅРѕ BTCA_BAZA_DIALOGS РЅРµ РЅР°Р№РґРµРЅ");
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
          if (!response.ok) throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("РќРµРІРµСЂРЅС‹Р№ РѕС‚РІРµС‚ РґР»СЏ " + src);
          }
          removeInjectedScript("data-btca-baza-screenshot-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-baza-screenshot-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_BAZA_SCREENSHOT) {
            throw new Error("btca-baza-screenshot.js РІС‹РїРѕР»РЅРµРЅ, РЅРѕ BTCA_BAZA_SCREENSHOT РЅРµ РЅР°Р№РґРµРЅ");
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
          if (!response.ok) throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("РќРµРІРµСЂРЅС‹Р№ РѕС‚РІРµС‚ РґР»СЏ " + src);
          }
          removeInjectedScript("data-btca-baza-sqlite-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-baza-sqlite-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_BAZA_SQLITE) {
            throw new Error("btca-baza-sqlite.js РІС‹РїРѕР»РЅРµРЅ, РЅРѕ BTCA_BAZA_SQLITE РЅРµ РЅР°Р№РґРµРЅ");
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
          if (!response.ok) throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("РќРµРІРµСЂРЅС‹Р№ РѕС‚РІРµС‚ РґР»СЏ " + src);
          }
          removeInjectedScript("data-btca-slide-menu-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-slide-menu-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (!window.BTCA_SLIDE_MENU) {
            throw new Error("btca-slide-menu.js РІС‹РїРѕР»РЅРµРЅ, РЅРѕ BTCA_SLIDE_MENU РЅРµ РЅР°Р№РґРµРЅ");
          }
          resolve();
        })
        .catch(reject);
    });
  }

  function loadLevel1Script(src) {
    return new Promise(function (resolve, reject) {
      var isDb = src.indexOf("level1-db") >= 0;
      var isApp = src.indexOf("level1-app") >= 0;

      if (isDb && window.BTCA_LEVEL1_DB && document.querySelector('script[data-btca-level1-src="' + src + '"]')) {
        resolve();
        return;
      }
      if (isApp && level1ModuleFresh() &&
          document.querySelector('script[data-btca-level1-src="' + src + '"]')) {
        resolve();
        return;
      }

      if (isDb) delete window.BTCA_LEVEL1_DB;
      if (isApp) delete window.BTCA_LEVEL1;

      fetch(src, { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("РќРµРІРµСЂРЅС‹Р№ РѕС‚РІРµС‚ РґР»СЏ " + src);
          }
          removeInjectedScript("data-btca-level1-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-level1-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (isDb && !window.BTCA_LEVEL1_DB) {
            throw new Error("level1-db.js РІС‹РїРѕР»РЅРµРЅ, РЅРѕ BTCA_LEVEL1_DB РЅРµ РЅР°Р№РґРµРЅ");
          }
          if (isApp && (!window.BTCA_LEVEL1 || !window.BTCA_LEVEL1.boot)) {
            throw new Error("level1-app.js РІС‹РїРѕР»РЅРµРЅ, РЅРѕ BTCA_LEVEL1.boot РЅРµ РЅР°Р№РґРµРЅ");
          }
          resolve();
        })
        .catch(reject);
    });
  }

  function ensureLevel1Module() {
    if (level1ModuleFresh() && slideMenuReady()) return Promise.resolve();
    if (level1ModuleFresh() && !slideMenuReady()) {
      return loadSlideMenuScript();
    }
    if (level1ModuleReady() && !level1ModuleFresh()) {
      clearInjectedLevel1Scripts();
    }
    var v = LEVEL1_MODULE_VERSION;
    return loadDataGuardScript().then(function () {
      return loadBazaDiagramScript();
    }).then(function () {
      return loadBazaDialogsScript();
    }).then(function () {
      return loadBazaScreenshotScript();
    }).then(function () {
      return loadSlideMenuScript();
    }).then(function () {
      return loadLevel1Script(assetPath("level1/level1-db.js?v=" + v));
    }).then(function () {
      return loadLevel1Script(assetPath("level1/level1-app.js?v=" + v));
    }).then(function () {
      if (!level1ModuleReady()) {
        throw new Error("РњРѕРґСѓР»СЊ РЈСЂРѕРІРЅСЏ 1 РЅРµ РёРЅРёС†РёР°Р»РёР·РёСЂРѕРІР°РЅ");
      }
    });
  }

  function bootLevel1Module() {
    return ensureLevel1Module().then(function () {
      return window.BTCA_LEVEL1.boot();
    });
  }

  function preloadLevel1ModuleSilently() {
    return ensureLevel1Module().then(function () {
      return window.BTCA_LEVEL1.boot();
    }).catch(function (error) {
      console.warn("BTCA Level 1 preload failed", error);
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
          if (!response.ok) throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ " + src + ": " + response.status);
          return response.text();
        })
        .then(function (code) {
          if (!isInjectableModuleSource(code)) {
            throw new Error("РќРµРІРµСЂРЅС‹Р№ РѕС‚РІРµС‚ РґР»СЏ " + src);
          }
          removeInjectedScript("data-btca-level3-src", src);
          var script = document.createElement("script");
          script.setAttribute("data-btca-level3-src", src);
          script.textContent = code;
          document.head.appendChild(script);
          if (isDb && !window.BTCA_LEVEL3_DB) {
            throw new Error("level2-db.js РІС‹РїРѕР»РЅРµРЅ, РЅРѕ BTCA_LEVEL3_DB РЅРµ РЅР°Р№РґРµРЅ");
          }
          if (isBaza && !window.BTCA_LEVEL3_BAZA) {
            throw new Error("level2-baza.js РІС‹РїРѕР»РЅРµРЅ, РЅРѕ BTCA_LEVEL3_BAZA РЅРµ РЅР°Р№РґРµРЅ");
          }
          if (isApp && (!window.BTCA_LEVEL3 || !window.BTCA_LEVEL3.boot)) {
            throw new Error("level2-app.js РІС‹РїРѕР»РЅРµРЅ, РЅРѕ BTCA_LEVEL3.boot РЅРµ РЅР°Р№РґРµРЅ");
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
        throw new Error("РњРѕРґСѓР»СЊ РЈСЂРѕРІРЅСЏ 3 РЅРµ РёРЅРёС†РёР°Р»РёР·РёСЂРѕРІР°РЅ");
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

  function renderLevel1Screen() {
    var root = document.getElementById("root");
    if (!root) return;

    function openLevel1Screen() {
      installedHomeSnapshot = installedHomeSnapshot || root.innerHTML;
      document.body.classList.add("btca-level1-mode");
      document.body.classList.remove("btca-installed-mode", "btca-screen-mode", "btca-level3-mode");
      root.innerHTML =
        '<main class="btca-level1-screen">' +
        '<header class="btca-level1-nav">' +
        '<button class="btca-back-button" type="button" data-btca-level1-back aria-label="РќР°Р·Р°Рґ">в†ђ</button>' +
        '<strong class="btca-level1-nav__title">РЈСЂРѕРІРµРЅСЊ 1 вЂ” РќР°С‡Р°Р»СЊРЅС‹Р№</strong>' +
        '<button class="btca-level1-menu-button" type="button" data-btca-level1-menu aria-label="РњРµРЅСЋ Р»РёСЃС‚РѕРІ"><span></span><span></span><span></span></button>' +
        "</header>" +
        '<section class="btca-level1-titlebar" data-btca-level1-titlebar></section>' +
        '<section class="btca-level1-content" data-btca-level1-content></section>' +
        '<div class="btca-level1-menu-layer" data-btca-level1-menu-layer hidden></div>' +
        '<div class="btca-level1-menu-layer" data-btca-level1-picker hidden></div>' +
        '<div class="btca-level1-menu-layer" data-btca-level1-baza-menu-layer hidden></div>' +
        '<div class="btca-level1-menu-layer" data-btca-level1-baza-id-layer hidden></div>' +
        '<div class="btca-level1-menu-layer" data-btca-level1-baza-delete-layer hidden></div>' +
        '<div class="btca-l2-baza-toast-host" data-btca-level1-baza-toast hidden></div>' +
        "</main>";

      var back = document.querySelector("[data-btca-level1-back]");
      if (back) {
        back.addEventListener("click", function () {
          if (window.BTCA_LEVEL1 && window.BTCA_LEVEL1.unmount) window.BTCA_LEVEL1.unmount();
          root.innerHTML = installedHomeSnapshot;
          installedHomeSnapshot = "";
          document.body.classList.remove("btca-level1-mode", "btca-level3-mode", "btca-allow-landscape");
          renderInstalledHome();
        });
      }

      var main = root.querySelector(".btca-level1-screen");
      if (!main) return;

      var content = root.querySelector("[data-btca-level1-content]");
      if (content) {
        content.innerHTML = '<p class="prepare-status prepare-status--running">Р—Р°РіСЂСѓР·РєР° РЈСЂРѕРІРЅСЏ 1вЂ¦</p>';
      }

      bootLevel1Module().then(function () {
        return window.BTCA_LEVEL1.mount(main);
      }).catch(function (error) {
        if (content) {
          content.innerHTML = '<p class="btca-l1-error">' + escapeHtml(error && (error.message || error)) + "</p>";
        }
      }).then(function () {
        syncPortraitMode();
      });
    }

    if (isAppPreparedSync()) {
      openLevel1Screen();
      return;
    }

    verifyMediaCacheReady().then(function (ready) {
      if (ready && isPreparedStateCurrent(readAppPreparedState())) markAppPrepared();
      openLevel1Screen();
    }).catch(function () {
      openLevel1Screen();
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
        '<button class="btca-back-button" type="button" data-btca-level3-back aria-label="РќР°Р·Р°Рґ">в†ђ</button>' +
        '<strong class="btca-level1-nav__title">РЈСЂРѕРІРµРЅСЊ 3 вЂ” РџСЂРѕРґРІРёРЅСѓС‚С‹Р№</strong>' +
        '<button class="btca-level1-menu-button" type="button" data-btca-level3-menu aria-label="РњРµРЅСЋ Р»РёСЃС‚РѕРІ"><span></span><span></span><span></span></button>' +
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
        content.innerHTML = '<p class="prepare-status prepare-status--running">Р—Р°РіСЂСѓР·РєР° РЈСЂРѕРІРЅСЏ 2вЂ¦</p>';
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
    if (route === "level1") {
      try {
        renderLevel1Screen();
      } catch (error) {
        console.error("BTCA Level 1 open failed", error);
      }
      return;
    }
    if (route === "level3") {
      try {
        renderLevel2Screen();
      } catch (error) {
        console.error("BTCA Level 2 open failed", error);
      }
      return;
    }
    if (route === "about") renderAboutScreen();
  }

  var PHRASE_ONE_TABLET_HTML =
    '<span class="home__phrase1-line1">  Р‘РёР»СЊСЏСЂРґРЅС‹Р№</span>' +
    '<span class="home__phrase1-line2"> РўСЂРµРЅРёСЂРѕРІРѕС‡РЅС‹Р№</span>';
  var PHRASE_TWO_LINE2_BASE = "            РђР±СЂРёРєРѕР»СЊ";
  var PHRASE_TWO_LINE2_TABLET = "              РђР±СЂРёРєРѕР»СЊ";
  var PHRASE_TWO_TABLET_HTML =
    '<span class="home__phrase2-line1">РљРѕРјРїР»РµРєСЃ</span>' +
    '<span class="home__phrase2-line2">' + PHRASE_TWO_LINE2_TABLET + '</span>';

  function cleanupOrphanHomePhraseMarkup() {
    if (document.body.classList.contains("btca-installed-mode")) return;
    var slot = document.querySelector(".home__tagline-slot");
    if (!slot) return;

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
    if (!tablet.querySelector(".home__phrase1-line1")) {
      tablet.innerHTML = PHRASE_ONE_TABLET_HTML;
    }
  }

  function markStandaloneShellReady() {
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.classList.add("btca-shell-ready");
    }
  }

  var LICENSE_API_BASE = "https://185-212-129-18.sslip.io";
  var LICENSE_PHONE_KEY = "btca101.phone";
  var LICENSE_NAME_KEY = "btca101.name";
  var LICENSE_DEVICE_KEY = "btca101.deviceId";
  var LICENSE_SESSION_KEY = "btca101.sessionToken";
  var LICENSE_LAUNCH_KEY = "btca101.launchUnlocked";

  function isLaunchUnlocked() {
    try {
      return sessionStorage.getItem(LICENSE_LAUNCH_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function clearLaunchUnlock() {
    try {
      sessionStorage.removeItem(LICENSE_LAUNCH_KEY);
    } catch (e) {}
  }

  function markLaunchUnlocked(token) {
    try {
      if (token) localStorage.setItem(LICENSE_SESSION_KEY, token);
      sessionStorage.setItem(LICENSE_LAUNCH_KEY, "1");
    } catch (e) {}
  }

  function getLicenseDeviceId() {
    try {
      var existing = localStorage.getItem(LICENSE_DEVICE_KEY);
      if (existing && existing.length >= 8) return existing;
      var id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "d-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(LICENSE_DEVICE_KEY, id);
      return id;
    } catch (e) {
      return "d-fallback-" + String(Date.now());
    }
  }

  function licensePost(path, body) {
    return fetch(LICENSE_API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    }).then(function (response) {
      return response.json().then(
        function (data) {
          if (!response.ok) {
            var detail = data && data.detail;
            var message = typeof detail === "string" ? detail : "РћС€РёР±РєР° " + response.status;
            throw new Error(message);
          }
          return data;
        },
        function () {
          throw new Error("РЎРµСЂРІРµСЂ Р»РёС†РµРЅР·РёР№ РЅРµРґРѕСЃС‚СѓРїРµРЅ (" + response.status + ")");
        }
      );
    });
  }

  function ensureAuthGateMount() {
    var home = document.querySelector(".home");
    if (!home) return null;
    var gate = document.getElementById("btca-auth-gate");
    if (gate) return gate;
    gate = document.createElement("section");
    gate.id = "btca-auth-gate";
    gate.className = "auth-gate";
    gate.setAttribute("aria-label", "Р’С…РѕРґ РІ Р‘РўРљРђ");
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
      title.textContent = locked ? "Р’С…РѕРґ РІ СЃРёСЃС‚РµРјСѓ" : "Р’С‹Р±РµСЂРёС‚Рµ РІР°СЂРёР°РЅС‚ Р·Р°РіСЂСѓР·РєРё";
    }
    if (!intro) return;
    var paragraphs = intro.querySelectorAll("p:not(.eyebrow)");
    if (paragraphs.length) {
      paragraphs[paragraphs.length - 1].textContent = locked
        ? "Р’РѕР№РґРёС‚Рµ РёР»Рё Р·Р°СЂРµРіРёСЃС‚СЂРёСЂСѓР№С‚РµСЃСЊ. РџРѕСЃР»Рµ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ РєРѕРґР° СЃС‚Р°РЅСѓС‚ РґРѕСЃС‚СѓРїРЅС‹ РІР°СЂРёР°РЅС‚С‹ Р·Р°РіСЂСѓР·РєРё."
        : "Р”Р»СЏ Android Рё Windows Р±СѓРґРµС‚ СЃРєР°С‡Р°РЅ РґРёСЃС‚СЂРёР±СѓС‚РёРІ. Р”Р»СЏ iPhone Рё iPad РїСЂРёР»РѕР¶РµРЅРёРµ РїРѕРґРіРѕС‚РѕРІРёС‚ РґР°РЅРЅС‹Рµ РЅР° СѓСЃС‚СЂРѕР№СЃС‚РІРµ, С‡С‚РѕР±С‹ РґР°Р»СЊС€Рµ СЂР°Р±РѕС‚Р°С‚СЊ Р±РµР· СЃРµС‚Рё.";
    }
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
      menu.setAttribute("aria-label", "Р’С‹Р±РѕСЂ РїР»Р°С‚С„РѕСЂРјС‹");
    }
    if (panel) panel.removeAttribute("hidden");
  }

  var SUBSCRIPTION_INACTIVE_MSG =
    "РџРѕРґРїРёСЃРєР° РЅРµ Р°РєС‚РёРІРЅР°. Р”Р»СЏ РѕС„РѕСЂРјР»РµРЅРёСЏ РёР»Рё РїСЂРѕРґР»РµРЅРёСЏ РґРѕСЃС‚СѓРїР° РѕР±СЂР°С‚РёС‚РµСЃСЊ Рє Р°РІС‚РѕСЂСѓ РїРѕ С‚РµР»РµС„РѕРЅСѓ +7 983 205 2230";

  function isSubscriptionInactiveError(message) {
    return /РїРѕРґРїРёСЃРєР° РЅРµ Р°РєС‚РёРІРЅР°/i.test(String(message || ""));
  }

  function renderAuthGate(onUnlocked) {
    var gate = ensureAuthGateMount();
    if (!gate) {
      onUnlocked();
      return;
    }
    gate.removeAttribute("hidden");
    var savedPhone = "";
    var savedName = "";
    try {
      savedPhone = localStorage.getItem(LICENSE_PHONE_KEY) || "";
      savedName = localStorage.getItem(LICENSE_NAME_KEY) || "";
    } catch (e) {}
    var mode = savedPhone ? "login" : "register";
    var debugCode = "";
    var subscriptionBlocked = false;

    function paint() {
      var title =
        mode === "register" ? "Р РµРіРёСЃС‚СЂР°С†РёСЏ" : mode === "otp" ? "РљРѕРґ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ" : "Р’С…РѕРґ";
      var showSubmit = !(mode === "login" && subscriptionBlocked);
      gate.innerHTML =
        '<div class="auth-gate__tabs" role="tablist">' +
        '<button type="button" class="auth-gate__tab' +
        (mode !== "register" ? " auth-gate__tab--active" : "") +
        '" data-auth-mode="login">Р’С…РѕРґ</button>' +
        '<button type="button" class="auth-gate__tab' +
        (mode === "register" ? " auth-gate__tab--active" : "") +
        '" data-auth-mode="register">Р РµРіРёСЃС‚СЂР°С†РёСЏ</button>' +
        "</div>" +
        '<p class="auth-gate__title">' +
        escapeHtml(title) +
        "</p>" +
        '<form class="auth-gate__form">' +
        (mode === "register"
          ? '<label class="auth-gate__field"><span>РРјСЏ</span><input name="name" required minlength="2" maxlength="120" value="' +
            escapeHtml(savedName) +
            '"/></label>'
          : "") +
        (mode !== "otp"
          ? '<label class="auth-gate__field"><span>РўРµР»РµС„РѕРЅ</span><input name="phone" required minlength="10" maxlength="20" value="' +
            escapeHtml(savedPhone) +
            '" placeholder="+7..."/></label>'
          : "") +
        (mode === "otp"
          ? '<label class="auth-gate__field"><span>РљРѕРґ (6 С†РёС„СЂ)</span><input name="otp" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" required value="' +
            escapeHtml(debugCode) +
            '"/></label>'
          : "") +
        (debugCode && mode === "otp"
          ? '<p class="auth-gate__debug">РўРµСЃС‚РѕРІС‹Р№ РєРѕРґ: ' + escapeHtml(debugCode) + "</p>"
          : "") +
        '<p class="auth-gate__error" data-auth-error' +
        (subscriptionBlocked ? ">" + escapeHtml(SUBSCRIPTION_INACTIVE_MSG) : " hidden>") +
        "</p>" +
        (showSubmit
          ? '<button class="platform-button auth-gate__submit" type="submit"><span>' +
            (mode === "register" ? "Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ" : mode === "otp" ? "РџРѕРґС‚РІРµСЂРґРёС‚СЊ РєРѕРґ" : "РџРѕР»СѓС‡РёС‚СЊ РєРѕРґ") +
            "</span></button>"
          : "") +
        "</form>";
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
      debugCode = "";
      paint();
      setError(SUBSCRIPTION_INACTIVE_MSG);
    }

    paint();
    gate.onclick = function (event) {
      var tab = event.target && event.target.closest ? event.target.closest("[data-auth-mode]") : null;
      if (!tab) return;
      mode = tab.getAttribute("data-auth-mode") === "register" ? "register" : "login";
      debugCode = "";
      subscriptionBlocked = false;
      paint();
    };
    gate.oninput = function (event) {
      if (!subscriptionBlocked) return;
      if (event.target && event.target.name === "phone") {
        subscriptionBlocked = false;
        setError("");
        savedPhone = String(event.target.value || "");
        paint();
        var phoneEl = gate.querySelector('input[name="phone"]');
        if (phoneEl) {
          phoneEl.focus();
          try {
            var len = phoneEl.value.length;
            phoneEl.setSelectionRange(len, len);
          } catch (e) {}
        }
      }
    };
    gate.onsubmit = function (event) {
      event.preventDefault();
      if (mode === "login" && subscriptionBlocked) return;
      setError("");
      var form = event.target;
      if (!form || form.tagName !== "FORM") return;
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      var phoneInput = form.querySelector('input[name="phone"]');
      var nameInput = form.querySelector('input[name="name"]');
      var otpInput = form.querySelector('input[name="otp"]');
      var phone = phoneInput ? String(phoneInput.value || "").trim() : savedPhone;
      var name = nameInput ? String(nameInput.value || "").trim() : savedName;
      var deviceId = getLicenseDeviceId();

      var chain = Promise.resolve();
      if (mode === "register") {
        chain = licensePost("/v1/register", { name: name, phone: phone }).then(function (data) {
          savedName = name;
          savedPhone = data.phone || phone;
          try {
            localStorage.setItem(LICENSE_NAME_KEY, savedName);
            localStorage.setItem(LICENSE_PHONE_KEY, savedPhone);
          } catch (e) {}
          return licensePost("/v1/otp/request", {
            phone: savedPhone,
            device_id: deviceId,
            platform: "pwa",
            app_version: "10.1",
            device_label: "PWA",
          });
        });
      } else if (mode === "login") {
        savedPhone = phone;
        try {
          localStorage.setItem(LICENSE_PHONE_KEY, savedPhone);
        } catch (e) {}
        chain = licensePost("/v1/otp/request", {
          phone: savedPhone,
          device_id: deviceId,
          platform: "pwa",
          app_version: "10.1",
          device_label: "PWA",
        });
      } else {
        chain = licensePost("/v1/otp/verify", {
          phone: savedPhone,
          device_id: deviceId,
          code: otpInput ? String(otpInput.value || "").trim() : "",
        }).then(function (data) {
          markLaunchUnlocked(data.session_token);
          gate.setAttribute("hidden", "hidden");
          onUnlocked();
        });
      }

      chain
        .then(function (data) {
          if (mode === "otp") return;
          subscriptionBlocked = false;
          debugCode = (data && data.debug_code) || "";
          mode = "otp";
          paint();
        })
        .catch(function (err) {
          var message = (err && err.message) || "РћС€РёР±РєР° Р·Р°РїСЂРѕСЃР°";
          if (mode !== "otp" && isSubscriptionInactiveError(message)) {
            markInactive();
            return;
          }
          setError(message);
          if (mode === "register") {
            mode = "login";
            paint();
            setError(message);
          }
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    };
  }

  function gateLoadingHome() {
    if (isStandalone()) return;
    // РџРµСЂРµР·Р°РіСЂСѓР·РєР° Р·Р°РіСЂСѓР·РѕС‡РЅРѕР№ = РЅРѕРІС‹Р№ С†РёРєР» OTP (СЃС‚Р°СЂС‹Р№ unlock/РєРѕРґ РЅРµ РґРµР№СЃС‚РІСѓСЋС‚).
    clearLaunchUnlock();
    var menu = document.querySelector(".platform-menu");
    var panel = getEls().panel;
    setLoadingIntroLocked(true);
    if (menu) {
      menu.setAttribute("hidden", "hidden");
    }
    if (panel) panel.setAttribute("hidden", "hidden");
    renderAuthGate(function () {
      showPlatformMenuUnlocked();
    });
  }

  function renderInstalledHome(options) {
    options = options || {};
    var preserveSplash = Boolean(options.preserveSplash);
    var intro = document.querySelector(".home__intro");
    var menu = document.querySelector(".platform-menu");
    var panel = getEls().panel;
    var footer = document.querySelector(".footer");
    var gate = document.getElementById("btca-auth-gate");

    document.body.classList.add("btca-installed-mode");
    document.body.classList.remove("btca-screen-mode", "btca-level1-mode", "btca-level3-mode");

    if (intro) intro.setAttribute("hidden", "hidden");
    if (panel && !preserveSplash) {
      panel.className = "ios-panel";
      panel.innerHTML = "";
    }

    if (!isLaunchUnlocked()) {
      if (menu) {
        menu.className = "platform-menu";
        menu.innerHTML = "";
        menu.setAttribute("hidden", "hidden");
      }
      if (gate) gate.removeAttribute("hidden");
      renderAuthGate(function () {
        renderInstalledHome(options);
      });
      ensurePhraseOneTabletMarkup();
      ensurePhraseTwoTabletMarkup();
      cleanupOrphanHomePhraseMarkup();
      installedHomeSnapshot = "";
      syncPortraitMode();
      markStandaloneShellReady();
      return;
    }

    if (gate) gate.setAttribute("hidden", "hidden");
    if (menu) {
      menu.removeAttribute("hidden");
      menu.className = "platform-menu btca-work-menu";
      menu.setAttribute("aria-label", "Р“Р»Р°РІРЅРѕРµ РјРµРЅСЋ Р‘РўРљРђ");
      menu.innerHTML =
        '<button class="platform-button btca-work-menu__item btca-work-menu__item--level3" type="button" data-btca-route="level3"><span>РЈСЂРѕРІРµРЅСЊ 3 вЂ” РџСЂРѕРґРІРёРЅСѓС‚С‹Р№</span></button>' +
        '<button class="platform-button btca-work-menu__item btca-work-menu__item--about" type="button" data-btca-route="about"><span>Рћ РїСЂРѕРµРєС‚Рµ</span></button>';
    }
    if (footer) {
      footer.innerHTML = "<span>BTCA 10.1 В© 2026 Alint&apos;s R.lab</span>";
    }
    ensurePhraseOneTabletMarkup();
    ensurePhraseTwoTabletMarkup();
    cleanupOrphanHomePhraseMarkup();
    installedHomeSnapshot = "";
    syncPortraitMode();
    markStandaloneShellReady();
  }

  function renderError(error) {
    setPanel(
      '<div class="ios-panel__header"><span>РћС€РёР±РєР° iOS/iPadOS</span></div>' +
      '<p class="prepare-status prepare-status--error">' + escapeHtml(error && (error.message || error)) + "</p>"
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
        else reject(new Error("zip.js Р·Р°РіСЂСѓР·РёР»СЃСЏ, РЅРѕ API РЅРµРґРѕСЃС‚СѓРїРµРЅ"));
      };
      script.onerror = function () {
        reject(new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ zip.js"));
      };
      document.head.appendChild(script);
    });
  }

  function resolveProgressCallback(onProgress) {
    if (typeof onProgress === "function") return onProgress;
    return function (percent, message) {
      renderProgress("РџРѕРґРіРѕС‚РѕРІРєР° iOS/iPadOS", percent, message);
    };
  }

  function registerOfflineServiceWorker() {
    return withTimeout(
      navigator.serviceWorker.register(assetPath("sw.js"), { scope: BTCA_BASE }),
      12000,
      "Safari РЅРµ Р·Р°РІРµСЂС€РёР» СЂРµРіРёСЃС‚СЂР°С†РёСЋ offline-СЃР»СѓР¶Р±С‹. РћР±РЅРѕРІРёС‚Рµ СЃС‚СЂР°РЅРёС†Сѓ Рё РїРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰С‘ СЂР°Р·."
    );
  }

  function cacheCoreAssets(onProgress, pctStart, pctEnd) {
    var start = pctStart == null ? 3 : pctStart;
    var end = pctEnd == null ? 15 : pctEnd;
    var emitProgress = typeof onProgress === "function"
      ? onProgress
      : (start !== end ? resolveProgressCallback(onProgress) : function () {});
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
          emitProgress(pct, "Р—Р°РіСЂСѓР·РєР° РѕР±РѕР»РѕС‡РєРё: " + asset);
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
                  "Р Р°СЃРїР°РєРѕРІРєР° " + pack.id + ": " + imageCount + "/" + images.length
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
      return reader.close().catch(function () {}).then(function () {
        throw error;
      });
    });
  }

  function prepareMediaArchives(onProgress, pctStart, pctEnd) {
    var start = pctStart == null ? 15 : pctStart;
    var end = pctEnd == null ? 92 : pctEnd;
    var emitProgress = resolveProgressCallback(onProgress);
    return fetch(assetPath("offline/media/manifest.json"), { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("РќРµ РЅР°Р№РґРµРЅ media manifest: " + response.status);
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
                emitProgress(base, "Р—Р°РіСЂСѓР·РєР° " + pack.id + "/media.btca.zip");
                return fetch(zipUrl, { cache: "no-store" }).then(function (response) {
                  if (!response.ok) throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ " + zipUrl + ": " + response.status);
                  return response.blob();
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
      renderInfo("iOS/iPadOS", "Р’С‹ РѕС‚РєСЂС‹Р»Рё СЃС‚СЂР°РЅРёС†Сѓ РЅРµ РЅР° СѓСЃС‚СЂРѕР№СЃС‚РІРµ Apple. Р”Р»СЏ iOS/iPadOS РѕС‚РєСЂРѕР№С‚Рµ СЌС‚Сѓ СЃСЃС‹Р»РєСѓ РІ Safari РЅР° iPhone РёР»Рё iPad.");
      return;
    }

    if (!window.isSecureContext) {
      renderInfo("iOS/iPadOS", "Р”Р»СЏ РїРѕРґРіРѕС‚РѕРІРєРё offline-РїР°РєРµС‚Р° РѕС‚РєСЂРѕР№С‚Рµ СЃС‚СЂР°РЅРёС†Сѓ С‡РµСЂРµР· HTTPS.");
      return;
    }

    if (!("serviceWorker" in navigator) || !("caches" in window)) {
      renderInfo("iOS/iPadOS", "Р­С‚РѕС‚ Р±СЂР°СѓР·РµСЂ РЅРµ РїРѕРґРґРµСЂР¶РёРІР°РµС‚ PWA offline-РєСЌС€.");
      return;
    }

    if (isStandalone()) {
      repairStandaloneShell();
      return;
    }

    setButtonState(true, "РџРѕРґРіРѕС‚РѕРІРєР° offline...");
    beginOfflinePreparation();
  }

  function repairStandaloneShell() {
    if (!isStandalone()) return Promise.resolve();
    if (!("serviceWorker" in navigator) || !("caches" in window)) {
      return Promise.resolve();
    }

    setOfflinePreparationActive(true);
    var report = function (pct, msg) {
      renderProgress("РћР±РЅРѕРІР»РµРЅРёРµ offline", pct, msg);
    };

    report(0, "РџСЂРѕРІРµСЂРєР° offline-РєСЌС€Р°...");
    return migrateMediaCacheFromPreviousGeneration()
      .then(function () {
        report(6, "Р РµРіРёСЃС‚СЂР°С†РёСЏ offline-СЃР»СѓР¶Р±С‹...");
        return registerOfflineServiceWorker();
      })
      .then(function () {
        report(10, "РћР±РЅРѕРІР»РµРЅРёРµ РѕР±РѕР»РѕС‡РєРё...");
        return cacheCoreAssets(report, 10, 22);
      })
      .then(function () {
        return verifyMediaCacheReady();
      })
      .then(function (ready) {
        if (ready) {
          report(100, "Р“РѕС‚РѕРІРѕ");
          markAppPrepared();
          migratePreparedClientMarkers();
          return activateRegisteredServiceWorker();
        }
        report(22, "Р’РѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёРµ РјРµРґРёР°...");
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
    setButtonState(true, "РџРѕРґРіРѕС‚РѕРІРєР° offline...");

    var report = function (pct, msg) {
      renderProgress("РџРѕРґРіРѕС‚РѕРІРєР° iOS/iPadOS", pct, msg);
    };

    function revokePrepToken() {
      var prepGuard = window.BTCA_DATA_GUARD;
      if (prepGuard && prepGuard.revokeSafariPrepWipeToken) prepGuard.revokeSafariPrepWipeToken();
    }

    loadDataGuardScript().then(function () {
      var prepGuard = window.BTCA_DATA_GUARD;
      if (prepGuard && prepGuard.grantSafariPrepWipeToken) prepGuard.grantSafariPrepWipeToken();

      report(0, "РћС‡РёСЃС‚РєР° РґР°РЅРЅС‹С… РїСЂРµРґС‹РґСѓС‰РµР№ СѓСЃС‚Р°РЅРѕРІРєРё РІ Safari...");
      return resetSafariInstallEnvironment()
        .then(function () {
          report(3, "РћС‡РёСЃС‚РєР° Р±Р°Р· С‚СЂРµРЅРёСЂРѕРІРѕРє...");
          return wipeTrainingDatabasesInBrowser();
        })
        .then(function () {
          report(6, "Р РµРіРёСЃС‚СЂР°С†РёСЏ offline-СЃР»СѓР¶Р±С‹...");
          return registerOfflineServiceWorker();
        })
        .then(function () {
          report(8, "РћС‡РёСЃС‚РєР° СѓСЃС‚Р°СЂРµРІС€РµР№ РѕР±РѕР»РѕС‡РєРё...");
          return purgeShellInstallCache().then(function () {
            return purgeGenerationRuntimeCache();
          });
        })
        .then(function () {
          report(10, "Р—Р°РіСЂСѓР·РєР° РѕР±РѕР»РѕС‡РєРё РїСЂРёР»РѕР¶РµРЅРёСЏ...");
          return cacheCoreAssets(report, 10, 22);
        })
        .then(function () {
          report(22, "Р—Р°РіСЂСѓР·РєР° Рё СЂР°СЃРїР°РєРѕРІРєР° ZIP-Р°СЂС…РёРІРѕРІ...");
          return prepareMediaArchives(report, 22, 95);
        })
        .then(function () {
          return activateRegisteredServiceWorker();
        })
        .then(function () {
          report(100, "Р“РѕС‚РѕРІРѕ");
          renderReady();
          preloadLevel1ModuleSilently();
          preloadLevel3ModuleSilently();
        });
    })
      .catch(renderError)
      .then(function () {
        setOfflinePreparationActive(false);
        setButtonState(false, "Р—Р°РіСЂСѓР·РёС‚СЊ РІСЃРµ РґР°РЅРЅС‹Рµ РґР»СЏ offline");
        revokePrepToken();
      });
  }

  function bootstrapStandaloneShell(mediaReady) {
    function showHome() {
      discardStaleRuntimeModules();
      renderInstalledHome();
      return preloadAppModulesForHome();
    }

    if (!mediaReady) {
      renderInstalledHome();
      return repairStandaloneShell().then(function () {
        return preloadAppModulesForHome();
      });
    }

    if (!readAppPreparedState()) {
      markAppPrepared();
    }

    showHome().then(function () {
      refreshShellCacheQuietly();
    });
  }

  function init() {
    var els = getEls();
    window.__BTCA_IOS_INSTALLER_READY__ = true;
    window.__BTCA_OPEN_DATE_INPUT__ = openCenteredDatePicker;
    if (!clearStaleClientState()) return;

    cleanupOrphanHomePhraseMarkup();
    syncPortraitModeImmediate();

    ensureMediaCacheReady()
      .then(function (mediaReady) {
        return purgeObsoleteInstallCaches().then(function () {
          if (!mediaReady) return false;
          return purgeObsoleteMediaCaches().then(function () { return true; });
        });
      })
      .then(function (mediaReady) {
        return ensureShellUpToDate().then(function (reloading) {
          return { mediaReady: mediaReady, reloading: reloading };
        });
      })
      .then(function (ctx) {
        if (ctx.reloading) return;
        if (isStandalone()) {
          renderInstalledHome();
        } else {
          gateLoadingHome();
        }
        ensureFreshShellAfterDeploy();
        if (!isStandalone()) {
          cleanupOrphanHomePhraseMarkup();
          syncPortraitModeImmediate();
        } else {
          syncPortraitMode();
        }
        window.addEventListener("orientationchange", syncPortraitMode);
        window.addEventListener("resize", syncPortraitMode);
        window.addEventListener("pageshow", function (event) {
          if (event.persisted) window.location.reload();
        });
        if (window.visualViewport) {
          window.visualViewport.addEventListener("resize", syncPortraitMode);
        }
        document.addEventListener("click", handleAppNavigation, true);
        if (els.button) {
          els.button.addEventListener("click", prepareOffline);
        }
        if (isStandalone()) {
          document.addEventListener("visibilitychange", function () {
            if (document.visibilityState !== "visible") return;
            ensureShellUpToDate();
          });
        }
        if (isStandalone()) {
          recordInstallSession();
          return bootstrapStandaloneShell(ctx.mediaReady);
        }
        if (isOfflinePreparationActive() && !isAppPreparedSync() && isLaunchUnlocked()) {
          window.setTimeout(function () {
            prepareOffline();
          }, 0);
        }
      })
      .catch(function (error) {
        console.warn("BTCA bootstrap failed", error);
        ensureFreshShellAfterDeploy();
        if (!isStandalone()) {
          cleanupOrphanHomePhraseMarkup();
          syncPortraitModeImmediate();
          gateLoadingHome();
        } else {
          cleanupOrphanHomePhraseMarkup();
          syncPortraitMode();
        }
        document.addEventListener("click", handleAppNavigation, true);
        if (els.button) {
          els.button.addEventListener("click", prepareOffline);
        }
        if (isStandalone()) {
          recordInstallSession();
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
