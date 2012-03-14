Sencha Touch templates bundler
==============================

Bundle your templates for using within Sencha Touch application with ease.

Who should use it
-----------------

People who tired of writing your complex templates withing Controllers/Views/Components (JavaScript files)

Install
-------

    npm install git://github.com/fedot/sencha-touch-templates-bundler.git

Usage
-----

    var bundler = require('sencha-touch-templates-bundler');

    bundler.watch({
      bundle:{
        className:'MyApp.Templates',
        fileName: __dirname+'/Templates.js'
      },
      templatesPath: __dirname+'/templates'
    });

