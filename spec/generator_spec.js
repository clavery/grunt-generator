/*global xit*/
'use strict';

var grunt = require('grunt');
var Generator = require('../tasks/lib/generator');
var _ = require('lodash');
var marked = require('marked');

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

  it('should allow access to the grunt configuration', function() {
    var test7 = grunt.file.read(__dirname + '/build/gruntconfig_test.html');

    expect(test7).toMatch(/gruntconfigvalue/m);
  });

  it('should allow pages to specify a non-default template', function() {
    var test = grunt.file.read(__dirname + '/build/custom_template_test.html');

    expect(test).toMatch(/ALTERNATE TEMPLATE/m);
  });

  it('should support dustjs templates', function() {
    var test = grunt.file.read(__dirname + '/dust_build/dust_test.html');
    expect(test).toMatch(/DustJS Test Page One/m);
    expect(test).toMatch(/This is DustJS: dust_test/m);
  });

  it('should allow custom dustjs helpers', function() {
    var test = grunt.file.read(__dirname + '/dust_build/dust_helpers.html');
    expect(test).toMatch(/Helper Output: test helper/m);
  });

  it('should allow dustjs partials syntax', function() {
    var test = grunt.file.read(__dirname + '/dust_build/dust_partials.html');
    expect(test).toMatch(/This is a header partial: dust_partials/m);
  });

  it('should allow custom markdown engines', function() {
    var test1 = grunt.file.read(__dirname + '/build_marked/test1.html'),
        test2 = grunt.file.read(__dirname + '/build_marked/testdir/test2.html'),
        test3 = grunt.file.read(__dirname + '/build_marked/test3.html');

    expect(test1).toMatch(/<html>/m);
    expect(test1).toMatch(/<title>test1 title<\/title>/m);
    expect(test1).toMatch(/<p>this is a test<\/p>/m);
    expect(test1).toMatch(/<\/html>/m);

    expect(test3).toMatch(/<title>default title<\/title>/m);
  });

  it('should allow a start delimeter for frontmatter', function() {
    var test1 = grunt.file.read(__dirname + '/build/start_delim.html');

    expect(test1).toMatch(/<html>/m);
    expect(test1).toMatch(/<title>test1 title<\/title>/m);
    expect(test1).toMatch(/<p>this is a test<\/p>/m);
    expect(test1).toMatch(/<\/html>/m);
  });

  it('should allow a custom frontmatter delimeter and type', function() {
    var test1 = grunt.file.read(__dirname + '/build_custom/custom_delim_frontmatter.html');

    expect(test1).toMatch(/<html>/m);
    expect(test1).toMatch(/<title>custom delim and frontmatter title<\/title>/m);
    expect(test1).toMatch(/<p>this is a test<\/p>/m);
    expect(test1).toMatch(/<p>test first name<\/p>/m);
    expect(test1).toMatch(/<\/html>/m);
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
