/*!
 * @nuxt/server v2.3.4 (c) 2016-2018

 * - All the amazing contributors
 * Released under the MIT License.
 * Website: https://nuxtjs.org
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const launchMiddleware = _interopDefault(require('launch-editor-middleware'));
const serveStatic = _interopDefault(require('serve-static'));
const servePlaceholder = _interopDefault(require('serve-placeholder'));
const connect = _interopDefault(require('connect'));
const generateETag = _interopDefault(require('etag'));
const fresh = _interopDefault(require('fresh'));
const path = _interopDefault(require('path'));
const fs = _interopDefault(require('fs-extra'));
const Youch = _interopDefault(require('@nuxtjs/youch'));
const http = _interopDefault(require('http'));
const https = _interopDefault(require('https'));
const enableDestroy = _interopDefault(require('server-destroy'));
const ip = _interopDefault(require('ip'));
const consola = _interopDefault(require('consola'));
const pify = _interopDefault(require('pify'));
const common = require('@nuxt/common');
const browserslistUseragent = require('browserslist-useragent');

class ServerContext {
  constructor(server) {
    this.nuxt = server.nuxt;
    this.globals = server.globals;
    this.options = server.options;
    this.resources = server.resources;
  }
}

async function renderAndGetWindow(
  url = 'http://localhost:3000',
  jsdomOpts = {},
  {
    loadedCallback,
    loadingTimeout = 2000,
    ssr,
    globals
  } = {}
) {
  const jsdom = await Promise.resolve(require('jsdom'))
    .then(m => m.default || m)
    .catch((e) => {
      consola.error(`
         jsdom is not installed. Please install jsdom with:
          $ yarn add --dev jsdom
          OR
          $ npm install --dev jsdom
        `);
      throw e
    });

  const options = Object.assign({
    // Load subresources (https://github.com/tmpvar/jsdom#loading-subresources)
    resources: 'usable',
    runScripts: 'dangerously',
    virtualConsole: true,
    beforeParse(window) {
      // Mock window.scrollTo
      window.scrollTo = () => {};
    }
  }, jsdomOpts);

  const jsdomErrHandler = (err) => {
    throw err
  };

  if (options.virtualConsole) {
    if (options.virtualConsole === true) {
      options.virtualConsole = new jsdom.VirtualConsole().sendTo(consola);
    }
    // Throw error when window creation failed
    options.virtualConsole.on('jsdomError', jsdomErrHandler);
  }

  const { window } = await jsdom.JSDOM.fromURL(url, options);

  // If Nuxt could not be loaded (error from the server-side)
  const nuxtExists = window.document.body.innerHTML.includes(
    ssr ? `window.${globals.context}` : `<div id="${globals.id}">`
  );

  /* istanbul ignore if */
  if (!nuxtExists) {
    const error = new Error('Could not load the nuxt app');
    error.body = window.document.body.innerHTML;
    throw error
  }

  // Used by Nuxt.js to say when the components are loaded and the app ready
  await common.timeout(new Promise((resolve) => {
    window[loadedCallback] = () => resolve(window);
  }), loadingTimeout, `Components loading in renderAndGetWindow was not completed in ${loadingTimeout / 1000}s`);

  if (options.virtualConsole) {
    // After window initialized successfully
    options.virtualConsole.removeListener('jsdomError', jsdomErrHandler);
  }

  // Send back window object
  return window
}

const nuxtMiddleware = ({ options, nuxt, renderRoute, resources }) => async function nuxtMiddleware(req, res, next) {
  // Get context
  const context = common.getContext(req, res);
  const url = req.url;

  res.statusCode = 200;
  try {
    const result = await renderRoute(url, context);
    await nuxt.callHook('render:route', url, result, context);
    const {
      html,
      cspScriptSrcHashSet,
      error,
      redirected,
      getPreloadFiles
    } = result;

    if (redirected) {
      nuxt.callHook('render:routeDone', url, result, context);
      return html
    }
    if (error) {
      res.statusCode = context.nuxt.error.statusCode || 500;
    }

    // Add ETag header
    if (!error && options.render.etag) {
      const etag = generateETag(html, options.render.etag);
      if (fresh(req.headers, { etag })) {
        res.statusCode = 304;
        res.end();
        nuxt.callHook('render:routeDone', url, result, context);
        return
      }
      res.setHeader('ETag', etag);
    }

    // HTTP2 push headers for preload assets
    if (!error && options.render.http2.push) {
      // Parse resourceHints to extract HTTP.2 prefetch/push headers
      // https://w3c.github.io/preload/#server-push-http-2
      const preloadFiles = getPreloadFiles();

      const { shouldPush, pushAssets } = options.render.http2;
      const { publicPath } = resources.clientManifest;

      const links = pushAssets
        ? pushAssets(req, res, publicPath, preloadFiles)
        : defaultPushAssets(preloadFiles, shouldPush, publicPath, options.dev);

      // Pass with single Link header
      // https://blog.cloudflare.com/http-2-server-push-with-multiple-assets-per-link-header
      // https://www.w3.org/Protocols/9707-link-header.html
      if (links.length > 0) {
        res.setHeader('Link', links.join(', '));
      }
    }

    if (options.render.csp) {
      const { allowedSources, policies } = options.render.csp;
      const cspHeader = options.render.csp.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';

      res.setHeader(cspHeader, getCspString({ cspScriptSrcHashSet, allowedSources, policies, isDev: options.dev }));
    }

    // Send response
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Accept-Ranges', 'none'); // #3870
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html, 'utf8');
    nuxt.callHook('render:routeDone', url, result, context);
    return html
  } catch (err) {
    /* istanbul ignore if */
    if (context && context.redirected) {
      consola.error(err);
      return err
    }

    next(err);
  }
};

const defaultPushAssets = (preloadFiles, shouldPush, publicPath, isDev) => {
  if (shouldPush && isDev) {
    consola.warn('http2.shouldPush is deprecated. Use http2.pushAssets function');
  }

  const links = [];
  preloadFiles.forEach(({ file, asType, fileWithoutQuery }) => {
    // By default, we only preload scripts or css
    /* istanbul ignore if */
    if (!shouldPush && asType !== 'script' && asType !== 'style') {
      return
    }

    // User wants to explicitly control what to preload
    if (shouldPush && !shouldPush(fileWithoutQuery, asType)) {
      return
    }

    links.push(`<${publicPath}${file}>; rel=preload; as=${asType}`);
  });
  return links
};

const getCspString = ({ cspScriptSrcHashSet, allowedSources, policies, isDev }) => {
  const joinedHashSet = Array.from(cspScriptSrcHashSet).join(' ');
  const baseCspStr = `script-src 'self'${isDev ? ` 'unsafe-eval'` : ''} ${joinedHashSet}`;

  if (Array.isArray(allowedSources)) {
    return `${baseCspStr} ${allowedSources.join(' ')}`
  }

  const policyObjectAvailable = typeof policies === 'object' && policies !== null && !Array.isArray(policies);

  if (policyObjectAvailable) {
    const transformedPolicyObject = transformPolicyObject(policies, cspScriptSrcHashSet);

    return Object.entries(transformedPolicyObject).map(([k, v]) => `${k} ${v.join(' ')}`).join('; ')
  }

  return baseCspStr
};

const transformPolicyObject = (policies, cspScriptSrcHashSet) => {
  const userHasDefinedScriptSrc = policies['script-src'] && Array.isArray(policies['script-src']);

  // Self is always needed for inline-scripts, so add it, no matter if the user specified script-src himself.

  const hashAndPolicySet = cspScriptSrcHashSet;
  hashAndPolicySet.add(`'self'`);

  if (!userHasDefinedScriptSrc) {
    policies['script-src'] = Array.from(hashAndPolicySet);
    return policies
  }

  new Set(policies['script-src']).forEach(src => hashAndPolicySet.add(src));

  policies['script-src'] = Array.from(hashAndPolicySet);

  return policies
};

const errorMiddleware = ({ resources, options }) => function errorMiddleware(err, req, res, next) {
  // ensure statusCode, message and name fields

  const error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Nuxt Server Error',
    name: !err.name || err.name === 'Error' ? 'NuxtServerError' : err.name
  };
  const errorFull = err instanceof Error ? err : typeof err === 'string'
    ? new Error(err) : new Error(err.message || JSON.stringify(err));
  errorFull.name = error.name;
  errorFull.statusCode = error.statusCode;

  const sendResponse = (content, type = 'text/html') => {
    // Set Headers
    res.statusCode = error.statusCode;
    res.statusMessage = error.name;
    res.setHeader('Content-Type', type + '; charset=utf-8');
    res.setHeader('Content-Length', Buffer.byteLength(content));
    res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');

    // Send Response
    res.end(content, 'utf-8');
  };

  // Check if request accepts JSON
  const hasReqHeader = (header, includes) =>
    req.headers[header] && req.headers[header].toLowerCase().includes(includes);
  const isJson =
    hasReqHeader('accept', 'application/json') ||
    hasReqHeader('user-agent', 'curl/');

  // Use basic errors when debug mode is disabled
  if (!options.debug) {
    // We hide actual errors from end users, so show them on server logs
    if (err.statusCode !== 404) {
      consola.error(err);
    }
    // Json format is compatible with Youch json responses
    const json = {
      status: error.statusCode,
      message: error.message,
      name: error.name
    };
    if (isJson) {
      sendResponse(JSON.stringify(json, undefined, 2), 'text/json');
      return
    }
    const html = resources.errorTemplate(json);
    sendResponse(html);
    return
  }

  // Show stack trace
  const youch = new Youch(
    errorFull,
    req,
    readSourceFactory({
      srcDir: options.srcDir,
      rootDir: options.rootDir,
      buildDir: options.buildDir,
      resources
    }),
    options.router.base,
    true
  );
  if (isJson) {
    youch.toJSON().then((json) => {
      sendResponse(JSON.stringify(json, undefined, 2), 'text/json');
    });
  } else {
    youch.toHTML().then(html => sendResponse(html));
  }
};

const readSourceFactory = ({ srcDir, rootDir, buildDir, resources }) => async function readSource(frame) {
  // Remove webpack:/// & query string from the end
  const sanitizeName = name =>
    name ? name.replace('webpack:///', '').split('?')[0] : null;
  frame.fileName = sanitizeName(frame.fileName);

  // Return if fileName is unknown
  /* istanbul ignore if */
  if (!frame.fileName) {
    return
  }

  // Possible paths for file
  const searchPath = [
    srcDir,
    rootDir,
    path.join(buildDir, 'dist', 'server'),
    buildDir,
    process.cwd()
  ];

  // Scan filesystem for real source
  for (const pathDir of searchPath) {
    const fullPath = path.resolve(pathDir, frame.fileName);
    const source = await fs.readFile(fullPath, 'utf-8').catch(() => null);
    if (source) {
      frame.contents = source;
      frame.fullPath = fullPath;
      if (path.isAbsolute(frame.fileName)) {
        frame.fileName = path.relative(rootDir, fullPath);
      }
      return
    }
  }

  // Fallback: use server bundle
  // TODO: restore to if after https://github.com/istanbuljs/nyc/issues/595 fixed
  /* istanbul ignore next */
  if (!frame.contents) {
    frame.contents = resources.serverBundle.files[frame.fileName];
  }
};

class Listener {
  constructor({ port, host, socket, https: https$$1, app }) {
    // Options
    this.port = port;
    this.host = host;
    this.socket = socket;
    this.https = https$$1;
    this.app = app;

    // After listen
    this.listening = false;
    this._server = null;
    this.server = null;
    this.address = null;
    this.url = null;
  }

  async close() {
    // Destroy server by forcing every connection to be closed
    if (this.server.listening) {
      await this.server.destroy();
      consola.debug('server closed');
    }
  }

  computeURL() {
    const address = this.server.address();
    if (!this.socket) {
      switch (address.address) {
        case '127.0.0.1': this.host = 'localhost'; break
        case '0.0.0.0': this.host = ip.address(); break
      }
      this.url = `http${this.https ? 's' : ''}://${this.host}:${this.port}`;
      return
    }
    this.url = `unix+http://${address}`;
  }

  async listen() {
    // Prevent multi calls
    if (this.listening) {
      return
    }

    // Initialize underlying http(s) server
    const protocol = this.https ? https : http;
    const protocolOpts = typeof this.https === 'object' ? [ this.https ] : [];
    this._server = protocol.createServer.apply(protocol, protocolOpts.concat(this.app));

    // Prepare listenArgs
    const listenArgs = this.socket ? { path: this.socket } : { host: this.host, port: this.port };
    listenArgs.exclusive = false;

    // Call server.listen
    this.server = await new Promise((resolve, reject) => {
      const s = this._server.listen(listenArgs, error => error ? reject(error) : resolve(s));
    });

    // Enable destroy support
    enableDestroy(this.server);
    pify(this.server.destroy);

    this.computeURL();

    // Set this.listening to true
    this.listening = true;
  }
}

const modernBrowsers = Object.keys(common.ModernBrowsers)
  .map(browser => `${browser} >= ${common.ModernBrowsers[browser]}`);

const isModernBrowser = (ua) => {
  return Boolean(ua) && browserslistUseragent.matchesUA(ua, {
    allowHigherVersions: true,
    browsers: modernBrowsers
  })
};

function modernMiddleware (req, res, next) {
  const { socket = {}, headers } = req;
  if (socket.modernMode === undefined) {
    const ua = headers && headers['user-agent'];
    socket.modernMode = isModernBrowser(ua);
  }
  req.modernMode = socket.modernMode;
  next();
}

class Server {
  constructor(nuxt) {
    this.nuxt = nuxt;
    this.options = nuxt.options;

    this.globals = common.determineGlobals(nuxt.options.globalName, nuxt.options.globals);

    this.publicPath = common.isUrl(this.options.build.publicPath)
      ? this.options.build._publicPath
      : this.options.build.publicPath;

    // Runtime shared resources
    this.resources = {};

    // Will be available on dev
    this.devMiddleware = null;
    this.hotMiddleware = null;

    // Will be set after listen
    this.listeners = [];

    // Create new connect instance
    this.app = connect();
  }

  async ready() {
    await this.nuxt.callHook('render:before', this, this.options.render);

    // Initialize vue-renderer
    const { VueRenderer } = await Promise.resolve(require('@nuxt/vue-renderer'));

    const context = new ServerContext(this);
    this.renderer = new VueRenderer(context);
    await this.renderer.ready();

    // Setup nuxt middleware
    await this.setupMiddleware();

    // Call done hook
    await this.nuxt.callHook('render:done', this);

    // Close all listeners after nuxt close
    this.nuxt.hook('close', async () => {
      for (const listener of this.listeners) {
        await listener.close();
      }
      this.listeners = [];
    });
  }

  async setupMiddleware() {
    // Apply setupMiddleware from modules first
    await this.nuxt.callHook('render:setupMiddleware', this.app);

    // Compression middleware for production
    if (!this.options.dev) {
      const compressor = this.options.render.compressor;
      if (typeof compressor === 'object') {
        // If only setting for `compression` are provided, require the module and insert
        const compression = this.nuxt.resolver.requireModule('compression');
        this.useMiddleware(compression(compressor));
      } else {
        // Else, require own compression middleware
        this.useMiddleware(compressor);
      }
    }

    if (this.options.modern === 'server') {
      this.useMiddleware(modernMiddleware);
    }

    // Add webpack middleware support only for development
    if (this.options.dev) {
      this.useMiddleware(async (req, res, next) => {
        const name = req.modernMode ? 'modern' : 'client';
        if (this.devMiddleware[name]) {
          await this.devMiddleware[name](req, res);
        }
        if (this.hotMiddleware[name]) {
          await this.hotMiddleware[name](req, res);
        }
        next();
      });
    }

    // open in editor for debug mode only
    if (this.options.debug && this.options.dev) {
      this.useMiddleware({
        path: '__open-in-editor',
        handler: launchMiddleware(this.options.editor)
      });
    }

    // For serving static/ files to /
    const staticMiddleware = serveStatic(
      path.resolve(this.options.srcDir, this.options.dir.static),
      this.options.render.static
    );
    staticMiddleware.prefix = this.options.render.static.prefix;
    this.useMiddleware(staticMiddleware);

    // Serve .nuxt/dist/client files only for production
    // For dev they will be served with devMiddleware
    if (!this.options.dev) {
      const distDir = path.resolve(this.options.buildDir, 'dist', 'client');
      this.useMiddleware({
        path: this.publicPath,
        handler: serveStatic(
          distDir,
          this.options.render.dist
        )
      });
    }

    // Add user provided middleware
    this.options.serverMiddleware.forEach((m) => {
      this.useMiddleware(m);
    });

    const { fallback } = this.options.render;
    if (fallback) {
      // Graceful 404 errors for dist files
      if (fallback.dist) {
        this.useMiddleware({
          path: this.publicPath,
          handler: servePlaceholder(fallback.dist)
        });
      }

      // Graceful 404 errors for other paths
      if (fallback.static) {
        this.useMiddleware({
          path: '/',
          handler: servePlaceholder(fallback.static)
        });
      }
    }

    // Finally use nuxtMiddleware
    this.useMiddleware(nuxtMiddleware({
      options: this.options,
      nuxt: this.nuxt,
      renderRoute: this.renderRoute.bind(this),
      resources: this.resources
    }));

    // Error middleware for errors that occurred in middleware that declared above
    // Middleware should exactly take 4 arguments
    // https://github.com/senchalabs/connect#error-middleware

    // Apply errorMiddleware from modules first
    await this.nuxt.callHook('render:errorMiddleware', this.app);

    // Apply errorMiddleware from Nuxt
    this.useMiddleware(errorMiddleware({
      resources: this.resources,
      options: this.options
    }));
  }

  useMiddleware(middleware) {
    // Resolve middleware
    if (typeof middleware === 'string') {
      middleware = this.nuxt.resolver.requireModule(middleware);
    }

    // Resolve handler
    if (typeof middleware.handler === 'string') {
      middleware.handler = this.nuxt.resolver.requireModule(middleware.handler);
    }
    const handler = middleware.handler || middleware;

    // Resolve path
    const path$$1 = (
      (middleware.prefix !== false ? this.options.router.base : '') +
      (typeof middleware.path === 'string' ? middleware.path : '')
    ).replace(/\/\//g, '/');

    // Use middleware
    this.app.use(path$$1, handler);
  }

  renderRoute() {
    return this.renderer.renderRoute.apply(this.renderer, arguments)
  }

  loadResources() {
    return this.renderer.loadResources.apply(this.renderer, arguments)
  }

  renderAndGetWindow(url, opts = {}) {
    return renderAndGetWindow(url, opts, {
      loadedCallback: this.globals.loadedCallback,
      ssr: this.options.render.ssr,
      globals: this.globals
    })
  }

  async listen(port, host, socket) {
    // Create a new listener
    const listener = new Listener({
      port: port || this.options.server.port,
      host: host || this.options.server.host,
      socket: socket || this.options.server.socket,
      https: this.options.server.https,
      app: this.app
    });

    // Listen
    await listener.listen();

    // Push listener to this.listeners
    this.listeners.push(listener);

    await this.nuxt.callHook('listen', listener.server, listener);
  }
}

exports.Server = Server;
