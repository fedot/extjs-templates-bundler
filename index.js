var fs = require('fs');

exports.watch = function(options){
  return new TemplatesBundler(options);
}

/**
 * @params {object} options - Configuration options for template bundler
 *
 * @config {string} bundle - Name of the class for templates bundle, bundle file will be named according to Ext Class Naming convention
 * @config {object} bundle - Specify name of class and filename manually if default naming isn't works for you
 * @example bundle: {className: 'MyApp.Templates', 'fileName', 'MyApp/Templates.js'}
 *
 * @config {regex} templatesFilesPattern - Regex for matching templates files names (`/\.html$/` - default)
 * @example templatesFilesPattern: /\.html$/
 *
 * @config {string} templatesPath - Path where the templates files are located
 *
 * @config {string} templateNamingScheme - one of `camelCase` or `dashed`
 * @config {function} templateNamingScheme - Function for custom naming of templates in bundle
 * @example templateNamingScheme: function(templateFileName, templatesFilesPattern){ return templateName; }
 *
 * @config {boolean} bundleOnRun - indicates whenever templates should be bundled on run (default `true`)
 */
var TemplatesBundler = function(options){
  this.settings = this.bundleSettings(options || {});

  // Initial bundling
  if (this.settings.bundleOnRun){
    this.directoryWatchHandle();
  }

  // Bundling on templates change
  fs.watch(this.settings.templatesPath, this.directoryWatchHandle.bind(this));
}

var camelCaseNamingScheme = function(templateFile, templatesFilesPattern){
  return templateFile.replace(templatesFilesPattern,'').replace(/([\s-]+\w)/ig,function(v){
    return v[1].toUpperCase()
  });
}

var dashedNamingScheme = function(templateFile, templatesFilesPattern){
  return templateFile.replace(templatesFilesPattern,'').replace(/([\s]+\w)/ig, '-');
}

TemplatesBundler.prototype.bundleSettings = function(options){
  var settings = {
    templatesPath: options.templatesPath || process.cwd() + '/templates',
    templatesFilesPattern: options.templatesFilesPattern || /\.html$/,
    bundle: {},
    bundleOnRun: typeof options.bundleOnRun == 'boolean' ? options.bundleOnRun : true
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

TemplatesBundler.prototype.templateReader = function(templateFile, idx, templatesList){
  var tpl = {},
      templateName = this.settings.templatesNamingScheme(templateFile, this.settings.templatesFilesPattern);

  var templateContent = fs.readFileSync(this.settings.templatesPath+'/'+templateFile, 'utf8').replace(/^\s+/gm,'').replace(/\n/g,'');
  tpl[templateName] = templateContent;
  return tpl;
}

TemplatesBundler.prototype.templatesBundler = function(templates){
  var templatesBundleTemplate = '\
/**\n\
 * THIS IS GENERATED FILE, DO NOT EDIT!!! \n\
 * Instead edit templates files directly.\n\
 */\n\
Ext.define("'+this.settings.bundle.className+'", {statics:'
    +JSON.stringify(templates, null, 2)+
    '});';
  fs.writeFileSync(this.settings.bundle.fileName, templatesBundleTemplate);
  console.log('[',new Date().toISOString(),']','Updated templates bundle', this.settings.bundle.fileName );
  this.updateTimer = 0;
}

TemplatesBundler.prototype.directoryListener = function(event, filename){
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

TemplatesBundler.prototype.directoryWatchHandle = function(event, filename){
  if (this.updateTimer){
    clearTimeout(this.updateTimer);
  }
  this.updateTimer = setTimeout(this.directoryListener.bind(this), 200, event, filename);
}
