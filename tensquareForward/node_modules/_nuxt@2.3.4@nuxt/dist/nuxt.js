/*!
 * nuxt v2.3.4 (c) 2016-2018
 * - Sebastien Chopin (@Atinux)
 * - Alexandre Chopin (@alexchopin)
 * - Pooya Parsa (@pi0)
 * - Clark Du (@clarkdo)
 * - Jonas Galvez (@galvez)
 * - Alexander Lichter (@manniL)
 * - All the amazing contributors
 * Released under the MIT License.
 * Website: https://nuxtjs.org
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@nuxt/core');
const builder = require('@nuxt/builder');
const generator = require('@nuxt/generator');



Object.keys(core).forEach(function (key) { exports[key] = core[key]; });
Object.keys(builder).forEach(function (key) { exports[key] = builder[key]; });
Object.keys(generator).forEach(function (key) { exports[key] = generator[key]; });
