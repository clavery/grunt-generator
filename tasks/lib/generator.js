/*
 * grunt-generator
 *
 * https://github.com/clavery/grunt-generator
 *
 * Copyright (c) 2013 Charles Lavery
 * Licensed under the MIT license.
 */


'use strict';

var Showdown = require('showdown');
var Handlebars = require('handlebars');
var grunt = require('grunt');
var path = require('path');
var _ = require('lodash');
var dust = require('dustjs-linkedin');
var q = require('q');

/*
 * Markdown Processor
 */
var converter = new Showdown.converter();
function processMarkdown(input) {
  return converter.makeHtml(input);
}

/*
 * HTML Processor (ie. noop)
 */
function processHtml(input) {
  return input; 
}

function promiseWrap(x) {
  if(x.then && typeof x.then === "function") {
    return x;    
  }
  var deferred = q.defer();
  deferred.resolve(x);
  return deferred.promise;
}

var templateEngines = {
  'handlebars': function(content, context) {
    var tmpl = Handlebars.compile(content);
    return tmpl(context);
  },
  'dust': function(content, context) {
    var stream = dust.renderSource(content, context);

  }
};

/**
 * @class Generator
 */
var Generator = function(grunt, options, task) {
  var me = this;
  this.grunt = grunt;
  this.pages = [];
  this.options = options;
  this.files = task.files;
  this.task = task;

  this.options.processors = _.extend({
    'md': processMarkdown,
    'html': processHtml
  }, this.options.processors);

  if(typeof this.options.templateEngine === "function") {
    templateEngines.custom = this.options.templateEngine;
    this.options.templateEngine = "custom";  
  }

  if(this.options.handlebarsHelpers) {
    _.forEach(this.options.handlebarsHelpers, function(helper, helperName) {
      Handlebars.registerHelper(helperName, helper);  
    });
  }

  this.options.grunt = grunt;
  this.options.gruntConfig = grunt.config.data;
  return this;
};

Generator.prototype.buildPartials = function() {
  if(this.options.partialsGlob &&
     this.options.partialsGlob !== '' && 
     this.options.templateEngine === 'handlebars') {

    var partials = grunt.file.expand(this.options.partialsGlob);
    var me = this;
    
    partials.forEach(function(v, i) {
       var contents = grunt.file.read(v);
       var name = path.basename(v, path.extname(v));

       Handlebars.registerPartial(name, contents);
    });
  }
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

      var pageName = filepath.substr(0, filepath.length - extension.length);

      try {
        if(parsed.length === 2) {
          frontMatter = JSON.parse(parsed.shift());
        }
      } catch(e) {
        grunt.log.error(filepath + ': bad frontmatter');
        return;
      }

      var body = parsed.shift();

      var metadata = {};
      metadata.body = body;
      metadata.name = pageName.replace(/\/index$/, '');
      metadata.ext = path.extname(fullpath).substr(1);
      metadata.dest = filespec.dest;
      metadata.destName = pageName;
      metadata.buildExt = filespec.ext ? filespec.ext : ".html";

      metadata.metadata = {};
      if(frontMatter) {
        metadata.metadata = frontMatter;
      }

      pages[pageName] = metadata;
    });
     
  });

  this.pages.push(pages);

  this.buildPartials();
};

Generator.prototype.buildPage = function(page, pages) {
  var generator = this;

  var viewPages = _.reduce(pages, function(viewPages, v, k) {
    viewPages[k] = _.extend(v.metadata, {
      'name': v.name
    });
    return viewPages; 
  }, {});

  var data = {
    'pages': viewPages,
    'name': page.name,
    'page': page.metadata,
    'options': this.options
  };

  var r = promiseWrap(templateEngines[this.options.templateEngine](page.body, data));

  return r.then(function(result) {
    data.body = generator.options.processors[page.ext](result);

    var templateName = page.metadata.template ? page.metadata.template : generator.options.defaultTemplate;

    var masterTemplate = grunt.file.read(
      path.join(generator.options.templates, templateName + '.' + generator.options.templateExt)
    );
    
    return promiseWrap(templateEngines[generator.options.templateEngine](masterTemplate, data));
  });
};

Generator.prototype.build = function() {
  this.readPages();

  var options = this.options;
  var pages = this.pages;
  var me = this;
  
  // some template engines (dust) might be asyncronous
  var done = this.task.async();
  var promises = [];

  pages.forEach(function(pageSet) {
    _.forEach(pageSet, function(page) {
      var filename = page.destName + page.buildExt;
      var destFilename = path.join(page.dest, filename);

      var result = me.buildPage(page, pageSet);

      result.then(function(builtPage) {
        if(grunt.file.exists(destFilename)) {
          var old = grunt.file.read(destFilename);
          if(old === builtPage) {
            grunt.verbose.warn('unchanged: ' + filename);
          } else {
            grunt.log.ok('changed: ' + filename);
            grunt.file.write(destFilename, builtPage);
          }
        } else {
          grunt.log.ok('new: ' + filename);
          grunt.file.write(destFilename, builtPage);
        }
      });

      promises.push(result);
    });
  });

  q.all(promises).then(function() {
    done(true);
  });
};

module.exports = Generator;
