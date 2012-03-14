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

Use `sencha-touch-templates-bundler` in your Node application/script (bundler.js for example):

    var bundler = require('sencha-touch-templates-bundler');
    
    var bundlerOptions = {
      bundle:{
        className:'MyApp.Templates',
        fileName: __dirname+'/public/app/Templates.js'
      },
      templatesPath: __dirname+'/public/app/templates'
    };
    
    bundler.watch(bundlerOptions);

Run it:

    $ node bundler.js

In your app.js, add `MyApp.Templates` to requirements:

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
    
Refer to templates like this:

`MyApp.Templates.templateName` or `MyApp.Templates['template-name']` (according to naming scheme).
