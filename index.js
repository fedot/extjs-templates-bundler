var fs = require('fs');

/**
 * @params Object options - configuration options for template bundler
 * @example {
 *   // Name of the class for templates bundle, filename will be named according to Sencha Naming convention
 *   'bundle': 'MyApp.Templates',
 *
 *   // You may specify name of class and filename manually if default naming isn't works for you
 *   'bundle': {className: 'MyApp.Templates', 'fileName', __dirname + '/MyApp/Templates.js'},
 *
 *   // Regex for matching templates files names (`/\.html$/` - default)
 *   'templatesFilesPattern': /\.html$/,
 *
 *   // Path where the templates files are located, all `html` files in that path will be considered templates to be bundled (default to `__dirname + ''`
 *   'templatesPath': __dirname+'/templates',
 *
 *   // naming scheme for templates, may be one of: `camelCase` (default), `dashed`, function(templateFileName){return templateName}
 *   'templateNamingScheme': function(templateFileName, templatesFilesPattern){
 *     // This is the same as default naming scheme `camelCase`
 *     return templateFile.replace(templatesFilesPattern,'').replace(/([ -]\w)/ig,function(v){ return v[1].toUpperCase() });
 *   }
 * }
 */

var camelCaseNamingScheme = function(templateFile, templatesFilesPattern){
  return templateFile.replace(templatesFilesPattern,'').replace(/([\s-]+\w)/ig,function(v){
    return v[1].toUpperCase()
  });
}

var dashedNamingScheme = function(templateFile, templatesFilesPattern){
  return templateFile.replace(templatesFilesPattern,'').replace(/([\s]+\w)/ig, '-');
}

exports.watch = function(options){
  var bundleBuilder = new senchaTouchTemplatesBundler(options);

  // Initial bundling
  bundleBuilder.directoryWatchHandle();
  // Bundling on templates change
  fs.watch(bundleBuilder.settings.templatesPath, bundleBuilder.directoryWatchHandle.bind(bundleBuilder));
}

var senchaTouchTemplatesBundler = function(options){
  this.settings = this.bundleSettings(options || {});
}

senchaTouchTemplatesBundler.prototype.bundleSettings = function(options){
  var settings = {
    templatesPath: options.templatesPath || process.cwd() + '/templates',
    templatesFilesPattern: options.templatesFilesPattern || /\.html$/,
    bundle: {}
  }

  options.templatesNamingScheme = options.templatesNamingScheme || 'camelCase';

  if (options.templatesNamingScheme && typeof options.temlatesNamingSchems == 'function'){
    settings.templatesNamingScheme = options.templatesNamingScheme;
  } else {
    switch (options.templatesNamingScheme){
      case 'dashed':
        settings.templatesNamingScheme = dashedNamingScheme;
        break;
      case 'camelCase':
      default:
        settings.templatesNamingScheme = camelCaseNamingScheme;
        break;
    }
  }

  if (options.bundle) {
    settings.bundle.className = typeof options.bundle == 'object' ? options.bundle.className : options.bundle;
    settings.bundle.fileName = typeof options.bundle == 'object' ? options.bundle.fileName : settings.bundle.className.replace(/\./, '/') + '.js';
  } else {
    throw new Error('`options.bundle` should be provided.');
  }
  return settings;
}

senchaTouchTemplatesBundler.prototype.templateReader = function(templateFile, idx, templatesList){
  var tpl = {},
      templateName = this.settings.templatesNamingScheme(templateFile, this.settings.templatesFilesPattern);

  var templateContent = fs.readFileSync(this.settings.templatesPath+'/'+templateFile, 'utf8').replace(/^\s+/gm,'').replace(/\n/g,'');
  tpl[templateName] = templateContent;
  return tpl;
}

senchaTouchTemplatesBundler.prototype.templatesBundler = function(templates){
  var templatesBundleTemplate = '\
/**\n\
 * THIS IS GENERATED FILE, DO NOT EDIT!!! \n\
 * Instead edit template files directly.\n\
 */\n\
Ext.define("'+this.settings.bundle.className+'", {statics:'
    +JSON.stringify(templates, null, 2)+
    '});';
  fs.writeFileSync(this.settings.bundle.fileName, templatesBundleTemplate);
  console.log('Updated templates bundle', new Date().toISOString());
  this.updateTimer = 0;
}

senchaTouchTemplatesBundler.prototype.directoryListener = function(){
  var files = fs.readdirSync(this.settings.templatesPath);
  var templatesNamesList = files.filter(this.settings.templatesFilesPattern.test, this.settings.templatesFilesPattern);
  var templatesList = templatesNamesList.map(this.templateReader.bind(this));
  var templates = {};
  templatesList.forEach(function(tpl){
    var tplName = Object.keys(tpl)[0];
    templates[tplName] = tpl[tplName]
  });
  this.templatesBundler(templates);
}

senchaTouchTemplatesBundler.prototype.directoryWatchHandle = function(event, filename){
  if (this.updateTimer){
    clearTimeout(this.updateTimer);
  }
  this.updateTimer = setTimeout(this.directoryListener.bind(this), 200, event, filename);
}
