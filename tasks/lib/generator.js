/*
 * grunt-generator
 *
 * https://github.com/chuck/grunt-generator
 *
 * Copyright (c) 2012 Charles Lavery
 * Licensed under the MIT license.
 */

'use strict';

var showdown = require('showdown');
var handlebars = require('handlebars');
var _ = require('underscore');

/**
 * @class Generator
 */
var Generator = function(grunt, _options) {
  this.grunt = grunt;
  this.options = _.extend({
    'src': 'pages',
    'dest': 'build/dev',
    'settings': ''
  }, _options);

  this.pages = [];
};

Generator.prototype.testMe = function() {
  return typeof _.pick === "function";
};

Generator.prototype.build = function() {
};

exports.Generator = Generator;
