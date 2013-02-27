/*global xit*/
'use strict';

var grunt = require('grunt');
var Generator = require('../tasks/lib/generator');
var _ = require('lodash');

describe('generator', function() {
  beforeEach(function() {
  });

  afterEach(function() {
  });

  it('should build pages', function() {
    var built = grunt.file.exists(__dirname + '/build/test3.html');

    expect(built).toBe(true);
  });

  it('should build page content', function() {
    var test1 = grunt.file.read(__dirname + '/build/test1.html'),
        test2 = grunt.file.read(__dirname + '/build/testdir/test2.html'),
        test3 = grunt.file.read(__dirname + '/build/test3.html');

    expect(test1).toMatch(/<html>/m);
    expect(test1).toMatch(/<title>test1 title<\/title>/m);
    expect(test1).toMatch(/<p>this is a test<\/p>/m);
    expect(test1).toMatch(/<\/html>/m);

    expect(test3).toMatch(/<title>default title<\/title>/m);
  });

  it('should support partials', function() {
    var test4 = grunt.file.read(__dirname + '/build/test4.html');

    expect(test4).toMatch(/this is a partial \(Partials Test\)/m);
  });

  it('should allow custom handlebars helpers', function() {
    var test5 = grunt.file.read(__dirname + '/build/helper_test.html');

    expect(test5).toMatch(/This is a test of helpers/m);
  });

  it('should render metadata from other pages', function() {
    var test6 = grunt.file.read(__dirname + '/build/metadata_test.html');

    expect(test6).toMatch(/The title is test1 title/m);
  });

  //TODO
  xit('should handle empty/no templates', function() {
    expect(false).toBe(true);
  });

  //TODO
  xit('should allow custom output extensions', function() {
    expect(false).toBe(true);
  });

  //TODO
  xit('should generate a sitemap', function() {
    expect(false).toBe(true);
  });
});
