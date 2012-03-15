Ext.js Templates Bundler
==============================

Bundle your templates to single JavaScript file for Ext JS and Sencha Touch applications.

Who should use it
-----------------

People who tired of writing your complex templates within Controllers/Views/Components (JavaScript files)
and interested keeping templates in separate files and using Template bundle in Ext JS / Sencha Touch Applications as regular class.

Template Bundle is just a regular Ext Class created with `Ext.define` and templates as `statics`
so Sencha SDK Tools may be used in a regular way to package your app including templates...

Install
-------

    npm install git://github.com/fedot/extjs-templates-bundler.git

Bundler Usage
-------------

Use `extjs-templates-bundler` in your Node.js application/script (bundler.js for example):

```javascript
var bundler = require('extjs-templates-bundler');

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

Templates Usage
---------------

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

```javascript
var panel = Ext.create('Ext.Panel', {
  // ...
  tpl: MyApp.Templates.templateName
});
panel.setData({some:'data'});

var list = Ext.create('Ext.List', {
  // ...
  itemTpl: MyApp.Templates['template-name']
});
```

Options
-------

### *string* **`bundle`** (required)
##### Description
Name of the class for templates bundle, bundle file will be named according to Sencha Class Naming convention

### *object* **`bundle`** (required)
##### Description
Specify name of class and filename manually if default naming isn't works for you

```javascript
    bundle: {
      className: 'MyApp.Templates',
      fileName, 'MyApp/Templates.js'
    }
```

### *regex* **`templatesFilesPattern`** */\.html$/* (optional)
##### Description
Regex for matching templates files names

```javascript
   templatesFilesPattern: /\.html$/
```

### *string* **`templatesPath`** *./templates* (optional)
##### Description
Path where the templates files are located

### *string* **`templateNamingScheme`** *camelCase* (optional)
##### Description
Naming scheme for templates, may be one of:

 - `camelCase`
 - `dashed`

### *function* **`templateNamingScheme`** (optional)
##### Description
Function for custom naming of templates in bundle

```javascript
templateNamingScheme: function(templateFileName, templatesFilesPattern){
  // This is the same as default naming scheme `camelCase`
  return templateFile.replace(templatesFilesPattern,'')
         .replace(/([ -]\w)/ig, function(v){
           return v[1].toUpperCase()
         });
}
```

### *boolean* **`bundleOnRun`** *true* (optional)
##### Description
This indicates whenever templates should be bundled on run, which may be usefull if changes to templates was done prior to bundling
