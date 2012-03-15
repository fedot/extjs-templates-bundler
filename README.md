Sencha Touch templates bundler
==============================

Bundle your templates for using within Sencha Touch application with ease.

Who should use it
-----------------

People who tired of writing your complex templates withing Controllers/Views/Components (JavaScript files).  
Those interested in using sencha-sdk-tools for application packaging and combining Templates with application code for deployment.

Install
-------

    npm install git://github.com/fedot/sencha-touch-templates-bundler.git

Bundler Usage
-------------

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
