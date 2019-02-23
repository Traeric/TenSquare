'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var browserslist = require('browserslist');
var semver = require('semver');
var useragent = require('useragent');

// @see https://github.com/ai/browserslist#browsers

// map of equivalent browsers,
// see https://github.com/ai/browserslist/issues/156

var browserNameMap = {
  bb: 'BlackBerry',
  and_chr: 'Chrome',
  ChromeAndroid: 'Chrome',
  FirefoxAndroid: 'Firefox',
  ff: 'Firefox',
  ie: 'Explorer',
  ie_mob: 'ExplorerMobile',
  and_ff: 'Firefox',
  ios_saf: 'iOS',
  op_mini: 'OperaMini',
  op_mob: 'OperaMobile',
  and_qq: 'QQAndroid',
  and_uc: 'UCAndroid'
};

function resolveUserAgent(uaString) {
  // Chrome and Opera on iOS uses a UIWebView of the underlying platform to render
  // content, by stripping the CriOS or OPiOS strings the useragent parser will alias the
  // user agent to ios_saf for the UIWebView, which is closer to the actual
  // renderer
  // @see https://github.com/Financial-Times/polyfill-service/pull/416

  var strippedUA = uaString.replace(/((CriOS|OPiOS)\/(\d+)\.(\d+)\.(\d+)\.(\d+))/, '');

  // Yandex Browser uses Chromium as the udnerlying engine
  strippedUA = uaString.replace(/YaBrowser\/(\d+\.?)+/g, '');

  var parsedUA = useragent.parse(strippedUA);

  // Case A: For Safari, Chrome and others browsers
  // that report as Safari after stripping tags
  if (parsedUA.family.includes('Safari')) {
    return {
      family: 'iOS',
      version: [parsedUA.major, parsedUA.minor, parsedUA.patch].join('.')
    };
  }

  // Case B: The browser on iOS didn't report as safari,
  // so we use the iOS version as a proxy to the browser
  // version. This is based on the assumption that the
  // underlying Safari Engine used will be *atleast* equal
  // to the iOS version it's running on.
  if (parsedUA.os.family === 'iOS') {
    return {
      family: 'iOS',
      version: [parsedUA.os.major, parsedUA.os.minor, parsedUA.os.patch].join('.')
    };
  }

  // Case C: The caniuse database does not contain
  // historical browser versions for so called `minor`
  // browsers like Chrome for Android, Firefox for Android etc
  // In this case, we proxy to the desktop version
  // @see https://github.com/Fyrd/caniuse/issues/3518

  if (parsedUA.family.includes('Chrome Mobile') || parsedUA.family.includes('Chromium') || parsedUA.family.includes('HeadlessChrome')) {
    return {
      family: 'Chrome',
      version: [parsedUA.major, parsedUA.minor, parsedUA.patch].join('.')
    };
  }

  if (parsedUA.family === 'Firefox Mobile') {
    return {
      family: 'Firefox',
      version: [parsedUA.major, parsedUA.minor, parsedUA.patch].join('.')
    };
  }

  if (parsedUA.family === 'IE') {
    return {
      family: 'Explorer',
      version: [parsedUA.major, parsedUA.minor, parsedUA.patch].join('.')
    };
  }

  if (parsedUA.family === 'IE Mobile') {
    return {
      family: 'ExplorerMobile',
      version: [parsedUA.major, parsedUA.minor, parsedUA.patch].join('.')
    };
  }

  return {
    family: parsedUA.family,
    version: [parsedUA.major, parsedUA.minor, parsedUA.patch].join('.')
  };
}

// Convert version to a semver value.
// 2.5 -> 2.5.0; 1 -> 1.0.0;
var semverify = function semverify(version) {
  if (typeof version === 'string' && semver.valid(version)) {
    return version;
  }

  var split = version.toString().split('.');

  while (split.length < 3) {
    split.push('0');
  }

  return split.join('.');
};

function normalizeQuery(query) {
  var normalizedQuery = query;
  var regex = '(' + Object.keys(browserNameMap).join('|') + ')';
  var match = query.match(new RegExp(regex));

  if (match) {
    normalizedQuery = query.replace(match[0], browserNameMap[match[0]]);
  }

  return normalizedQuery;
}

var parseBrowsersList = function parseBrowsersList(browsersList) {
  return browsersList.map(function (browser) {
    var _browser$split = browser.split(' '),
        _browser$split2 = _slicedToArray(_browser$split, 2),
        browserName = _browser$split2[0],
        browserVersion = _browser$split2[1];

    var normalizedName = browserName;
    var normalizedVersion = browserVersion;

    if (browserName in browserNameMap) {
      normalizedName = browserNameMap[browserName];
    }

    try {
      // Browser version can return as "10.0-10.2"
      var splitVersion = browserVersion.split('-')[0];
      normalizedVersion = semverify(splitVersion);
    } catch (e) {}

    return {
      family: normalizedName,
      version: normalizedVersion
    };
  });
};

var compareBrowserSemvers = function compareBrowserSemvers(versionA, versionB, options) {
  var referenceVersion = versionB;

  if (options.ignorePatch) {
    referenceVersion = '~' + versionB;
  }

  if (options.ignoreMinor) {
    referenceVersion = '^' + versionB;
  }

  if (options.allowHigherVersions || options.all) {
    return semver.gte(versionA, versionB);
  } else {
    return semver.satisfies(versionA, referenceVersion);
  }
};

var matchesUA = function matchesUA(uaString, opts) {
  var normalizedQuery = void 0;
  if (opts && opts.browsers) {
    normalizedQuery = opts.browsers.map(normalizeQuery);
  }
  var browsers = browserslist(normalizedQuery, {
    env: opts.env,
    path: process.cwd()
  });
  var parsedBrowsers = parseBrowsersList(browsers);
  var resolvedUserAgent = resolveUserAgent(uaString);

  if (opts._allowHigherVersions) {
    console.warn('browserslist-useragent: The `_allowHigherVersions` option has been deprecated. Please use `allowHigherVersions` instead.');
  }

  var options = _extends({
    ignoreMinor: false,
    ignorePatch: true
  }, opts, {
    allowHigherVersions: opts._allowHigherVersions || opts.allowHigherVersions
  });

  return parsedBrowsers.some(function (browser) {
    return browser.family.toLowerCase() === resolvedUserAgent.family.toLocaleLowerCase() && compareBrowserSemvers(resolvedUserAgent.version, browser.version, options);
  });
};

module.exports = {
  matchesUA: matchesUA,
  resolveUserAgent: resolveUserAgent,
  normalizeQuery: normalizeQuery
};
