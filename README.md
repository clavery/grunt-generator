# grunt-generator

Static site generator with handlebars and showdown.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-generator`

Then add this line to your project's `Gruntfile.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-generator');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Documentation

Assuming the following your `Gruntfile.js`:

```javascript

var helpers = require('helpers');

grunt.initConfig({
  generator: {
    dev: {
      files: [
        { cwd: 'pages', src: ['**/*'], dest: 'build', ext: '.html' }
      ],
      options: {
        partialsGlob: 'pages/partials/*.html',
        templates: 'templates',
        handlebarsHelpers: helpers,
        environment: 'dev'
      }
    }
  }
...

```

and the following in `helpers.js`:

```javascript
module.exports = {
  'test': function(s) {
    return "test " + s;
  }
};
```
grunt-generator will build HTML and markdown pages in the `pages/` directory. Outputting generated pages to `build/`. Each 'page' is run through handlebars.js and has access to the helpers specified above (in the example: helpers.js). Each page also has access to the optional metadata that can be specified at the top of every page as a JSON fragment:

```javascript
{
  "title" : "Test Title"
}
---

<div class="content">
...
```

A pages own metadata is available as the `page` variable. In addition all other pages can be accessed using the `pages` collection available to all pages. Using the above example: if the page is located at `dir1/test1.html` then it's title can be accessed using a handlebars helper like so:

```javascript
...

// example: {{ pageTitle 'dir1/test1' }}
'pageTitle': function(pageName) {
    return (this.pages[pageName] ? this.pages[pageName].title : "");
}

...
```

Since all metadata is available to all pages (and their templates) at build time complex processing can be done using handlebars helpers such as navigation hierarchies, tagging/categories, etc.

The templates in `templates/` will be used to render the final output and are also passed through handlebars.js. The templates are given a special variable `body` which is the rendered output of the current 'page'.

Handlebars partials can be specified using the `partialsGlob` option. These will be available to all pages using their filename minus extension. Partials can be placed in the same directory as pages and will not be processed as unique pages.

See the `spec/pages` and `spec/templates` directory for a complete example.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History
0.2.0 - grunt 0.4.0 fixes and consistencies; better tests
0.1.0 - Initial Release

## License
Copyright (c) 2012 Charles Lavery  
Licensed under the MIT license.
