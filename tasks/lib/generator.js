/*
 * grunt-generator
 *
 * https://github.com/chuck/grunt-generator
 *
 * Copyright (c) 2012 Charles Lavery
 * Licensed under the MIT license.
 */

'use strict';

var Showdown = require('showdown');
var Handlebars = require('handlebars');
var _ = require('underscore');
var grunt = require('grunt');
var path = require('path');

/*
 * run it through showdown
 */
var converter = new Showdown.converter();
function processMarkdown(input) {
  return converter.makeHtml(input);
}

/*
 * nothing to process
 */
function processHtml(input) {
  return input; 
}

/**
 * @class Generator
 */
var Generator = function(grunt, _options) {
  this.grunt = grunt;
  this.pages = null;
  this.options = _.extend({
    'pagesDir': 'pages',
    'dest': 'build',
    'settings': '',
    'templateExt': 'html',
    'defaultTemplate': 'index',
    'buildExt': 'html',
    'templatesDir': 'templates'
  }, _options);

  this.options.processors = _.extend({
    'md': processMarkdown,
    'html': processHtml
  }, _options ? _options.processors : {});

  this.options.pagesDir = this.options.pagesDir.replace(/\/*$/, '');
};

Generator.prototype.build = function() {
};

Generator.prototype.readPages = function() {
  var files = grunt.file.expandFiles(this.options.pagesDir + '/**/*'); 
  var validExtensions = _.keys(this.options.processors);
  var pages = {};
  var me = this;

  files.forEach(function(v, i) {
    var ext = path.extname(v);
    if(validExtensions.indexOf(ext.substr(1)) === -1) {
      grunt.log.warn(v + ': not a valid extension, skipping');
      return;
    }

    var contents = grunt.file.read(v);
    var parsed = contents.split(/^---$/m, 2);
    var frontMatter = null;
    var prefixLen = me.options.pagesDir.length;
    var filename = v.substr(prefixLen + 1, v.length - prefixLen - ext.length - 1);

    try {
      if(parsed.length === 2) {
        frontMatter = JSON.parse(parsed.shift());
      }
    } catch(e) {
      grunt.log.error(v + ': bad frontmatter');
      return;
    }

    var body = parsed.shift();

    var d = {};
    d.body = body;
    d.name = filename;
    d.ext = ext.substr(1);
    d.settings = {};

    if(frontMatter) {
      d.settings = frontMatter;
    }

    pages[filename] = d;
  });

  this.pages = pages;
};

Generator.prototype.buildPage = function(page) {
  var data = {
    'pages': this.pages,
    'name': page.name,
    'page': page.settings
  };

  var template = Handlebars.compile(page.body);
  var result = template(data);

  data.body = this.options.processors[page.ext](result);

  var defaultTemplate = grunt.file.read([this.options.templateDir,this.options.defaultTemplate].join(path.sep) + '.' + this.options.templateExt);
  var tmpl = Handlebars.compile(defaultTemplate);

  return tmpl(data);
};

Generator.prototype.build = function() {
  this.readPages();

  var options = this.options;
  var pages = this.pages;
  var me = this;

  _.keys(pages).forEach(function(pageName) {
    var page = pages[pageName];
    var destFilename = options.dest + path.sep + page.name + '.' + options.buildExt;
    grunt.file.write(destFilename, me.buildPage(page));
  });
};

exports.Generator = Generator;
