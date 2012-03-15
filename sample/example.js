var bundler = require('../index.js');

bundler.watch({
  bundle:{
    className:'MyApp.Templates',
    fileName: __dirname+'/Templates.js'
  },
  templatesPath: __dirname+'/templates'
});
