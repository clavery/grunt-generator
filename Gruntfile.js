var path = require('path');

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    watch: {
      files: ['Gruntfile.js', 'tasks/**/*.js', 'spec/**/*.js'],
      tasks: 'default'
    },
    jshint: {
      files: ['grunt.js', 'tasks/**/*.js', 'spec/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true,
        globals: {
          // jasmine globals
          describe: false,
          jasmine: false,
          it: false,
          expect: false,
          beforeEach: false,
          afterEach: false
        }
      },
    },
    exec: {
      jasmine: {
        cmd: 'node_modules' + path.sep + '.bin' + path.sep + 'jasmine-node spec'
      }
    }
  });
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  // Default task.
  grunt.registerTask('default', ['jshint', 'exec:jasmine']);

};
