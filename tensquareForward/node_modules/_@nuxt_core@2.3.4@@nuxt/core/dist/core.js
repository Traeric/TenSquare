/*!
 * @nuxt/core v2.3.4 (c) 2016-2018

 * - All the amazing contributors
 * Released under the MIT License.
 * Website: https://nuxtjs.org
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const fs = _interopDefault(require('fs'));
const hash = _interopDefault(require('hash-sum'));
const consola = _interopDefault(require('consola'));
const config = require('@nuxt/config');
const server = require('@nuxt/server');
const Module = _interopDefault(require('module'));
const path = require('path');
const path__default = _interopDefault(path);
const fs$1 = _interopDefault(require('fs-extra'));
const esm = _interopDefault(require('esm'));
const common = require('@nuxt/common');

class ModuleContainer {
  constructor(nuxt) {
    this.nuxt = nuxt;
    this.options = nuxt.options;
    this.requiredModules = {};
  }

  async ready() {
    // Call before hook
    await this.nuxt.callHook('modules:before', this, this.options.modules);

    // Load every module in sequence
    await common.sequence(this.options.modules, this.addModule.bind(this));

    // Call done hook
    await this.nuxt.callHook('modules:done', this);
  }

  addVendor() {
    consola.warn('addVendor has been deprecated due to webpack4 optimization');
  }

  addTemplate(template) {
    /* istanbul ignore if */
    if (!template) {
      throw new Error('Invalid template:' + JSON.stringify(template))
    }

    // Validate & parse source
    const src = template.src || template;
    const srcPath = path__default.parse(src);
    /* istanbul ignore if */
    if (typeof src !== 'string' || !fs.existsSync(src)) {
      throw new Error('Template src not found:' + src)
    }

    // Generate unique and human readable dst filename
    const dst =
      template.fileName ||
      path__default.basename(srcPath.dir) + `.${srcPath.name}.${hash(src)}` + srcPath.ext;

    // Add to templates list
    const templateObj = {
      src,
      dst,
      options: template.options
    };

    this.options.build.templates.push(templateObj);
    return templateObj
  }

  addPlugin(template) {
    const { dst } = this.addTemplate(template);

    // Add to nuxt plugins
    this.options.plugins.unshift({
      src: path__default.join(this.options.buildDir, dst),
      ssr: template.ssr
    });
  }

  addLayout(template, name) {
    const { dst, src } = this.addTemplate(template);

    // Add to nuxt layouts
    this.options.layouts[name || path__default.parse(src).name] = `./${dst}`;

    // If error layout, set ErrorPage
    if (name === 'error') {
      this.addErrorLayout(dst);
    }
  }

  addErrorLayout(dst) {
    const relativeBuildDir = path__default.relative(this.options.rootDir, this.options.buildDir);
    this.options.ErrorPage = `~/${relativeBuildDir}/${dst}`;
  }

  addServerMiddleware(middleware) {
    this.options.serverMiddleware.push(middleware);
  }

  extendBuild(fn) {
    this.options.build.extend = common.chainFn(this.options.build.extend, fn);
  }

  extendRoutes(fn) {
    this.options.router.extendRoutes = common.chainFn(
      this.options.router.extendRoutes,
      fn
    );
  }

  requireModule(moduleOpts) {
    return this.addModule(moduleOpts, true /* require once */)
  }

  addModule(moduleOpts, requireOnce) {
    let src;
    let options;
    let handler;

    // Type 1: String
    if (typeof moduleOpts === 'string') {
      src = moduleOpts;
    } else if (Array.isArray(moduleOpts)) {
      // Type 2: Babel style array
      src = moduleOpts[0];
      options = moduleOpts[1];
    } else if (typeof moduleOpts === 'object') {
      // Type 3: Pure object
      src = moduleOpts.src;
      options = moduleOpts.options;
      handler = moduleOpts.handler;
    }

    // Resolve handler
    if (!handler) {
      handler = this.nuxt.resolver.requireModule(src);
    }

    // Validate handler
    /* istanbul ignore if */
    if (typeof handler !== 'function') {
      throw new Error('Module should export a function: ' + src)
    }

    // Resolve module meta
    const key = (handler.meta && handler.meta.name) || handler.name || src;

    // Update requiredModules
    if (typeof key === 'string') {
      if (requireOnce && this.requiredModules[key]) {
        return
      }
      this.requiredModules[key] = { src, options, handler };
    }

    // Default module options to empty object
    if (options === undefined) {
      options = {};
    }

    return new Promise((resolve) => {
      // Call module with `this` context and pass options
      const result = handler.call(this, options);

      // If module send back a promise
      if (result && result.then) {
        return resolve(result)
      }

      // synchronous
      return resolve()
    })
  }
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol = _root.Symbol;

var _Symbol = Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$1.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

var version = "2.3.4";

class Resolver {
  constructor(nuxt) {
    this.nuxt = nuxt;
    this.options = this.nuxt.options;

    // Binds
    this.resolvePath = this.resolvePath.bind(this);
    this.resolveAlias = this.resolveAlias.bind(this);
    this.resolveModule = this.resolveModule.bind(this);
    this.requireModule = this.requireModule.bind(this);

    // ESM Loader
    this.esm = esm(module, {});
  }

  resolveModule(path$$1) {
    try {
      const resolvedPath = Module._resolveFilename(path$$1, {
        paths: this.options.modulesDir
      });
      return resolvedPath
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        return undefined
      } else {
        throw error
      }
    }
  }

  resolveAlias(path$$1) {
    if (common.startsWithRootAlias(path$$1)) {
      return path.join(this.options.rootDir, path$$1.substr(2))
    }

    if (common.startsWithSrcAlias(path$$1)) {
      return path.join(this.options.srcDir, path$$1.substr(1))
    }

    return path.resolve(this.options.srcDir, path$$1)
  }

  resolvePath(path$$1, { alias, module } = {}) {
    // Fast return in case of path exists
    if (fs$1.existsSync(path$$1)) {
      return path$$1
    }

    let resolvedPath;

    // Try to resolve it as a regular module
    if (module !== false) {
      resolvedPath = this.resolveModule(path$$1);
    }

    // Try to resolve alias
    if (!resolvedPath && alias !== false) {
      resolvedPath = this.resolveAlias(path$$1);
    }

    // Use path for resolvedPath
    if (!resolvedPath) {
      resolvedPath = path$$1;
    }

    // Check if resolvedPath exits
    if (fs$1.existsSync(resolvedPath)) {
      return resolvedPath
    }

    // Check if any resolvedPath.[ext] exists
    for (const ext of this.options.extensions) {
      if (fs$1.existsSync(resolvedPath + '.' + ext)) {
        return resolvedPath + '.' + ext
      }
    }

    // Give up
    throw new Error(`Cannot resolve "${path$$1}" from "${resolvedPath}"`)
  }

  requireModule(path$$1, { esm: esm$$1, alias, intropDefault } = {}) {
    let resolvedPath = path$$1;
    let requiredModule;

    const errors = [];

    // Try to resolve path
    try {
      resolvedPath = this.resolvePath(path$$1, { alias });
    } catch (e) {
      errors.push(e);
    }

    // Try to require
    try {
      if (esm$$1 === false) {
        requiredModule = require(resolvedPath);
      } else {
        requiredModule = this.esm(resolvedPath);
      }
    } catch (e) {
      errors.push(e);
    }

    // Introp default
    if (intropDefault !== false && requiredModule && requiredModule.default) {
      requiredModule = requiredModule.default;
    }

    // Throw error if failed to require
    if (requiredModule === undefined && errors.length) {
      throw errors
    }

    return requiredModule
  }
}

class Nuxt extends common.Hookable {
  constructor(options = {}) {
    super();

    // Assign options and apply defaults
    this.options = config.getNuxtConfig(options);

    // Create instance of core components
    this.resolver = new Resolver(this);
    this.moduleContainer = new ModuleContainer(this);
    this.server = new server.Server(this);

    // Deprecated hooks
    this._deprecatedHooks = {
      'render:context': 'render:routeContext', // #3773
      'showReady': 'webpack:done' // Workaround to deprecate showReady
    };

    // Add Legacy aliases
    common.defineAlias(this, this.server, ['renderRoute', 'renderAndGetWindow', 'listen']);
    common.defineAlias(this, this.resolver, ['resolveAlias', 'resolvePath']);
    this.renderer = this.server;
    this.render = this.server.app;
    this.showReady = () => { this.callHook('webpack:done'); };

    // Wait for Nuxt to be ready
    this.initialized = false;
    this._ready = this.ready().catch((err) => {
      consola.fatal(err);
    });
  }

  static get version() {
    return version
  }

  async ready() {
    if (this._ready) {
      return this._ready
    }

    // Add hooks
    if (isPlainObject_1(this.options.hooks)) {
      this.addHooks(this.options.hooks);
    } else if (typeof this.options.hooks === 'function') {
      this.options.hooks(this.hook);
    }

    // Await for modules
    await this.moduleContainer.ready();

    // Await for server to be ready
    await this.server.ready();

    this.initialized = true;

    // Call ready hook
    await this.callHook('ready', this);

    return this
  }

  async close(callback) {
    await this.callHook('close', this);

    /* istanbul ignore if */
    if (typeof callback === 'function') {
      await callback();
    }
  }
}

exports.Module = ModuleContainer;
exports.Nuxt = Nuxt;
exports.Resolver = Resolver;
