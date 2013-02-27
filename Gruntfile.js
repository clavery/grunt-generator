var path = require('path');

var helpers = {
  'test': function(s) {
    return "test " + s;
  },
  
  'pageTitle': function(pageName) {
    return (this.pages[pageName] ? this.pages[pageName].settings.title : "");
  }
};

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
          xit: false,
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
    },
    generator: {
      test: {
        files: [
          { cwd: 'spec/pages', src: ['**/*'], dest: 'spec/build', ext: '.html' }
        ],
        options: {
          partialsGlob: 'spec/pages/partials/*.html',
          templates: 'spec/templates',
          handlebarsHelpers: helpers
        }
      }
    },
    clean: {
      test: ['spec/build']
    }
  });
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-exec');

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean:test', 'generator:test', 'exec:jasmine']);

};
