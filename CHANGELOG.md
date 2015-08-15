# Changelog

## 0.4.1

- use proper version of showdown

## 0.4.0

- allows custom delimiters for frontmatter
- allows optional start delimiter for frontmatter, instead of just ending one (note: must be at start of file
- allows YAML frontmatter parsing (at the task level right now, can't be specified per file)

## 0.3.2

- added test for custom markdown engine (marked in the example)
	
## 0.3.1

  - Dustjs partials support (master templates are still used like handlebars, although the functionality could be replaced by partials).

## 0.3.0

  - support [Linkedin DustJS][dustjs] templates in addition to handlebars (use templateEngine option)

## 0.2.8

  - less spammy output

## 0.2.7

  - update grunt version

## 0.2.6

  - added support for overriding template name in pages

## 0.2.5

  - added grunt and gruntConfig objects to options to allow access to grunt configuration in templates/pages

## 0.2.2

  - fix bug with partials

## 0.2.1

  - changed how page metadata is accessed

## 0.2.0

  - grunt 0.4.0 fixes and consistencies; better tests

## 0.1.0

  - Initial Release

[dustjs]: [https://github.com/linkedin/dustjs/]
