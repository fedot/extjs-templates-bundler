var bundler = require('sencha-touch-templates-bundler');

bundler.watch({
  bundle:{
    className:'MyApp.Templates',
    fileName: __dirname+'/Templates.js'
  },
  templatesPath: __dirname+'/templates'
});
