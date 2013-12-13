var path = require('path');
var marked = require('marked');

var handlebarsHelpers = {
  'test': function(s) {
    return "test " + s;
  },
  
  'pageTitle': function(pageName) {
    return (this.pages[pageName] ? this.pages[pageName].title : "");
  }
};

var dustHelpers = {
  'test': function(chunk, context, bodies, params) {
    return chunk.write('test helper');
  }
};

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    meta: {
      gruntconfigkey: "gruntconfigvalue"
    },
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
          helpers: handlebarsHelpers
        }
      },
      dustjs: {
        files: [
          { cwd: 'spec/dust_pages', src: ['**/*'], dest: 'spec/dust_build', ext: '.html' }
        ],
        options: {
          templates: 'spec/dust_templates',
          templateEngine: 'dust',
          partialsGlob: 'spec/dust_pages/partials/*.{md,html}',
          helpers: dustHelpers
        }
      },
      customTemplateEngine: {
        files: [
          { cwd: 'spec/pages', src: ['**/*'], dest: 'spec/build_custom', ext: '.html' }
        ],
        options: {
          templates: 'spec/templates_custom',
          templateEngine: function(content, context) {
            return "Hello, " + context.name; 
          }
        }
      },
      customMarkdownEngine: {
        files: [
          { cwd: 'spec/pages', src: ['**/*'], dest: 'spec/build_marked', ext: '.html' }
        ],
        options: {
          templates: 'spec/templates',
          helpers: handlebarsHelpers,
          partialsGlob: 'spec/pages/partials/*.html',
          processors: {
            'md' : marked
          }
        }
      },
      customFrontmatter: {
        files: [
          { cwd: 'spec/custom_pages', src: ['**/*'], dest: 'spec/build_custom', ext: '.html' }
        ],
        options: {
          templates: 'spec/templates',
          helpers: handlebarsHelpers,
          partialsGlob: 'spec/pages/partials/*.html',
          frontmatterDelimiter: '###',
          frontmatterType: 'yaml'
        }
      }
    },
    clean: {
      test: ['spec/build', 'spec/dust_build', 'spec/build_custom', 'spec/build_marked']
    }
  });
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-exec');

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean:test', 'generator:test', 'generator:dustjs', 'generator:customMarkdownEngine', 'generator:customFrontmatter', 'exec:jasmine']);

};
