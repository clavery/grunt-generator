/*
 * grunt-generator
 *
 * https://github.com/clavery/grunt-generator
 *
 * Copyright (c) 2012 Charles Lavery
 * Licensed under the MIT license.
 */

'use strict';

var Showdown = require('showdown');
var Handlebars = require('handlebars');
var grunt = require('grunt');
var path = require('path');
var _ = require('lodash');

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
var Generator = function(grunt, _options, files) {
  var me = this;
  this.grunt = grunt;
  this.pages = null;
  this.options = _.extend({
    'pagesDir': 'pages',
    'dest': 'build',
    'settings': '',
    'templateExt': 'html',
    'defaultTemplate': 'index',
    'buildExt': 'html',
    'templates': 'templates',
  }, _options);
  this.files = files;

  this.options.processors = _.extend({
    'md': processMarkdown,
    'html': processHtml
  }, _options.processors ? _options.processors : {});

  this.options.pagesDir = this.options.pagesDir.replace(/\/*$/, '');

  if(this.options.handlebarsHelpers) {
    _.keys(this.options.handlebarsHelpers).forEach(function(name) {
      Handlebars.registerHelper(name, me.options.handlebarsHelpers[name]);  
    });
  }

  return this;
};

Generator.prototype.buildPartials = function() {
  var partials = grunt.file.expand(this.options.partialsGlob);
  var me = this;
  
  partials.forEach(function(v, i) {
     var contents = grunt.file.read(v);
     var name = path.basename(v, path.extname(v));

     Handlebars.registerPartial(name, contents);
  });
};

Generator.prototype.readPages = function() {
  var validExtensions = _.keys(this.options.processors);
  var files = this.files;
  var pages = {};
  var me = this;

  files.forEach(function(filespec, i) {
    var contents = filespec.src.filter(function(filepath) {
      var fullpath = path.join(filespec.cwd, filepath);

      if (!grunt.file.exists(fullpath) ||
          grunt.file.isDir(fullpath) ||
          grunt.file.isMatch(me.options.partialsGlob, fullpath)) {
        grunt.verbose.writeln(fullpath + " not a valid page");
        return false;
      } else if(validExtensions.indexOf(path.extname(fullpath).substr(1)) === -1) {
        grunt.verbose.writeln(fullpath + ': not a valid extension, skipping');
        return false;  
      } else {
        return true;
      }
    }).map(function(filepath) {
      var fullpath = path.join(filespec.cwd, filepath);
      var fileContents = grunt.file.read(fullpath);
      var parsed = fileContents.split(/^---$/m, 2);
      var frontMatter = null;
      var extension = path.extname(filepath);

      var filename = filepath.substr(0, filepath.length - extension.length);

      try {
        if(parsed.length === 2) {
          frontMatter = JSON.parse(parsed.shift());
        }
      } catch(e) {
        grunt.log.error(v + ': bad frontmatter');
        return;
      }

      var body = parsed.shift();

      var metadata = {};
      metadata.body = body;
      metadata.name = filename;
      metadata.ext = path.extname(fullpath).substr(1);
      metadata.settings = {};

      if(frontMatter) {
        metadata.settings = frontMatter;
      }

      pages[filename] = metadata;
    });
     
  });

  this.pages = pages;

  this.buildPartials();
};

Generator.prototype.buildPage = function(page) {
  var data = {
    'pages': this.pages,
    'name': page.name,
    'page': page.settings,
    'options': this.options
  };

  var template = Handlebars.compile(page.body);
  var result = template(data);

  data.body = this.options.processors[page.ext](result);

  var defaultTemplate = grunt.file.read([this.options.templates,this.options.defaultTemplate].join(path.sep) + '.' + this.options.templateExt);
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
    var filename = page.name + '.' + options.buildExt;
    var destFilename = options.dest + path.sep + filename;
    var builtPage = me.buildPage(page);

    if(grunt.file.exists(destFilename)) {
      var old = grunt.file.read(destFilename);
      if(old === builtPage) {
        grunt.log.warn('unchanged: ' + filename);
      } else {
        grunt.log.ok('changed: ' + filename);
        grunt.file.write(destFilename, builtPage);
      }
    } else {
      grunt.log.ok('new: ' + filename);
      grunt.file.write(destFilename, builtPage);
    }
  });
};

module.exports = Generator;
