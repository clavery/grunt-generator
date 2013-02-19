/*
 * grunt-generator
 *
 * Tasks definitions
 *
 * https://github.com/clavery/grunt-generator
 *
 * Copyright (c) 2012 Charles Lavery
 * Licensed under the MIT license.
 */

var Generator = require('./lib/generator').Generator;

module.exports = function(grunt) {
  'use strict';


  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('generator', 'Generate a static site.', function() {
    var generator = new Generator(grunt, this.data.options);
    generator.build();
  });
};
