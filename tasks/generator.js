/*
 * grunt-generator
 *
 * Tasks definitions
 *
 * https://github.com/clavery/grunt-generator
 *
 * Copyright (c) 2013 Charles Lavery
 * Licensed under the MIT license.
 */

var Generator = require('./lib/generator');

module.exports = function(grunt) {
  'use strict';


  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('generator', 'Generate a static site.', function() {
    var options = this.options({
      'templateExt': 'html',
      'defaultTemplate': 'index',
      'templates': 'templates',
      'templateEngine': 'handlebars',
      // deprecated; just use helpers
      'handlebarsHelpers': {},
      // deprecated; just use helpers
      'dustHelpers': {},
      'helpers': {},
      'compressWhitespace' : false
    });
    var generator = new Generator(grunt, options, this);
    generator.build();
  });
};
