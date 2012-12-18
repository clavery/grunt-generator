module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    test: {
      files: ['spec/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'spec/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
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
        es5: true
      },
      globals: {
        // jasmine globals
        describe: false,
        jasmine: false,
        it: false,
        expect: false
      }
    },
    exec: {
      jasmine: {
        command: 'jasmine-node spec/',
        stdout: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  // Default task.
  grunt.registerTask('default', 'lint exec:jasmine');
};
