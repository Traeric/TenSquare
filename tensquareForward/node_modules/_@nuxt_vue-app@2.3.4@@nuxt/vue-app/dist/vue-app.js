/*!
 * @nuxt/vue-app v2.3.4 (c) 2016-2018

 * - All the amazing contributors
 * Released under the MIT License.
 * Website: https://nuxtjs.org
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const path = _interopDefault(require('path'));

var name = "@nuxt/vue-app";
var version = "2.3.4";
var repository = "nuxt/nuxt.js";
var license = "MIT";
var files = [
	"dist",
	"template"
];
var main = "dist/vue-app.js";
var publishConfig = {
	access: "public"
};
const pkg = {
	name: name,
	version: version,
	repository: repository,
	license: license,
	files: files,
	main: main,
	publishConfig: publishConfig
};

const meta = pkg;

const templatesDir = path.join(__dirname, '..', 'template');

const templatesFiles = [
  'App.js',
  'client.js',
  'index.js',
  'middleware.js',
  'router.js',
  'server.js',
  'utils.js',
  'empty.js',
  'components/nuxt-error.vue',
  'components/nuxt-loading.vue',
  'components/nuxt-child.js',
  'components/nuxt-link.js',
  'components/nuxt.js',
  'components/no-ssr.js',
  'views/app.template.html',
  'views/error.html'
];

exports.meta = meta;
exports.templatesDir = templatesDir;
exports.templatesFiles = templatesFiles;
