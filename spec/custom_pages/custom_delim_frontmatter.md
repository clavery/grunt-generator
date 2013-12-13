###
title: custom delim and frontmatter title
test:
    first_name: test first name
###

this is a test

{{# if page.test }}
{{ page.test.first_name }}
{{/if}} 
