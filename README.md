Sencha Touch templates bundler
==============================

Bundle your templates for using within Sencha Touch application with ease.

Who should use it
-----------------

People who tired of writing your complex templates withing Controllers/Views/Components (JavaScript files).  
Those interested in using sencha-sdk-tools for application packaging and combining Templates within 

Install
-------

    npm install git://github.com/fedot/sencha-touch-templates-bundler.git

Usage
-----

Use `sencha-touch-templates-bundler` in your Node.js application/script (bundler.js for example):

```javascript
var bundler = require('sencha-touch-templates-bundler');

var bundlerOptions = {
  bundle:{
    className:'MyApp.Templates',
    fileName: __dirname+'/public/app/Templates.js'
  },
  templatesPath: __dirname+'/public/app/templates'
};

bundler.watch(bundlerOptions);
```

Run it:

    $ node bundler.js

In your app.js, add `MyApp.Templates` to requirements:

```javascript
Ext.Loader.setConfig({
  enabled:true,
  paths: {'MyApp':'app'}
});

Ext.application({
  name: 'MyApp',
  requires: ['MyApp.Templates'],
  launch: function() {
    // ...
  }
});
```

Refer to templates like this:

`MyApp.Templates.templateName` or `MyApp.Templates['template-name']` (according to naming scheme).

Options
-------

```javascript
{
  // Name of the class for templates bundle
  // If the bundle is string, templates bundle file will be named according to Sencha Naming convention
  'bundle': 'MyApp.Templates',

  // You may also specify name of class and filename manually if default naming isn't works for you
  'bundle': {className: 'MyApp.Templates', 'fileName', __dirname + '/MyApp/Templates.js'},

  // Regex for matching templates files names (`/\.html$/` - default)
  'templatesFilesPattern': /\.html$/,

  // Path where the templates files are located,
  // files matched `templatesFilesPattern` will be considered templates to be bundled
  'templatesPath': __dirname+'/templates',

  // naming scheme for templates, may be one of:
  //   "camelCase" (default)
  //   "dashed"
  //   function(templateFileName, templatesFilesPattern){ return templateName; }
  'templateNamingScheme': function(templateFileName, templatesFilesPattern){
  // This is the same as default naming scheme `camelCase`
   return templateFile.replace(templatesFilesPattern,'')
          .replace(/([ -]\w)/ig, function(v){
              return v[1].toUpperCase()
          });
 }
```