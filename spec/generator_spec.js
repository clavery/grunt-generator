/*global xit*/
'use strict';

var grunt = require('grunt');
var Generator = require('../tasks/lib/generator').Generator;

describe('generator', function() {

  var options = {
    'pagesDir': __dirname + '/pages',
    'dest': __dirname + '/build',
    'templateDir': __dirname + '/templates',
  };
  var generator;

  beforeEach(function() {
    grunt.file.mkdir(__dirname + '/build');
    generator = new Generator(grunt, options);  
  });

  afterEach(function() {
    grunt.file.delete(__dirname + '/build');
  });

  it('should initialize', function() {
    expect(generator).toBeDefined();
    expect(generator.build).toBeDefined();
  });

  it('should have default options', function() {
    expect(generator.options.defaultTemplate).toBe('index');
    expect(generator.options.templateExt).toBe('html');
    expect(generator.options.processors.md).toBeDefined();
    expect(generator.options.processors.html).toBeDefined();
    expect(generator.options.buildExt).toBe('html');
    expect(generator.pages).toBeNull();
  });

  it('should parse pages for optional front matter', function() {
    generator.readPages();

    expect(generator.pages).not.toBeNull();

    expect(generator.pages['test1']).toBeDefined();
    expect(generator.pages['testdir/test2']).toBeDefined();

    expect(generator.pages['test1'].settings['title']).toBe('test1 title');
    expect(generator.pages['testdir/test2'].settings['title']).toBe('test2 title');

    expect(generator.pages['test3']).toBeDefined();
    expect(generator.pages['test3'].settings).toEqual({});
  });

  it('should build an individual page', function() {
    generator.readPages();

    var page = generator.pages['test1'];
    var result = generator.buildPage(page); 

    expect(result).toMatch(/<html>/m);
    expect(result).toMatch(/<title>test1 title<\/title>/m);
    expect(result).toMatch(/<p>this is a test<\/p>/m);
    expect(result).toMatch(/<\/html>/m);

    page = generator.pages['test3'];
    result = generator.buildPage(page); 
    expect(result).toMatch(/<title>default title<\/title>/m);
  });

  it('should build all pages', function() {
    generator.build();
  });

  it('should build new pages', function() {
    expect(false).toBe(true);
  });

  it('should build changed pages', function() {
    expect(false).toBe(true);
  });

  it('should remove deleted pages from the build directory', function() {
    expect(false).toBe(true);
  });

  it('should render metadata from other pages', function() {
    expect(false).toBe(true);
  });

  it('should generate a sitemap', function() {
    expect(false).toBe(true);
  });
});
