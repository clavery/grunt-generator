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
        options: {
          command: './node_modules/.bin/jasmine-node',
          args: [ 'spec' ]
        }
      }
    }
  });
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'exec:jasmine']);

  grunt.registerMultiTask('exec', 'execute external script', function() {
    var options = this.options();
    var cb = this.async(); 

    grunt.verbose.writeflags(options, 'Options');

    var child = grunt.util.spawn({
      cmd: options.command,
      args: options.args
    }, function(err, result, code) {
      if (code === 127) {
        return grunt.warn('command not found');
      }
      cb();
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
};
