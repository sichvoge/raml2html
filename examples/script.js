#!/usr/bin/env node

'use strict';

/*
 Example of using raml2html as a script.
 Run this as `node script.js`
 */

const raml2html = require('..');
const path = require('path');
const ramlFile = path.join(__dirname, 'helloworld.raml');

/**
 * Using the default templates.
 *
 * raml2html.render() needs a config object with at least a `processRamlObj` property.
 * Instead of creating this config object ourselves, we can just ask for raml2html.getDefaultConfig():
 */
const config1 = raml2html.getConfigForTheme('raml2html-default-theme');

raml2html.render(ramlFile, config1).then(
  result => {
    console.log('1: ', result.length);
  },
  error => {
    console.log('error! ', error);
  }
);

/**
 * Using your own templates using the default processRamlObj function.
 */
const config2 = raml2html.getConfigForTemplate(
  './custom-template-test/template.nunjucks'
);

raml2html.render(ramlFile, config2).then(
  result => {
    console.log('2: ', result.trim().length);
  },
  error => {
    console.log('error! ', error);
  }
);

/**
 * If you want to customize everything, just create the config object yourself from scratch.
 *
 * The important thing is to have a processRamlObj property: a function that takes a raw RAML object and returns
 * a promise with the finished output
 */
const config3 = {
  processRamlObj() {
    return new Promise(resolve => {
      resolve('<h1>\n\n\n<!--This is a test-->Hi!</h1>');
    });
  },

  postProcessHtml: config1.postProcessHtml,
};

raml2html.render(ramlFile, config3).then(
  result => {
    console.log('3: ', result.length);
  },
  error => {
    console.log('error! ', error);
  }
);

/**
 * You can also customize the postProcessHtml function.
 */
const config4 = {
  processRamlObj() {
    return new Promise(resolve => {
      resolve('<h1>Hi!</h1>');
    });
  },

  postProcessHtml() {
    return new Promise(resolve => {
      resolve('ABC');
    });
  },
};

raml2html.render(ramlFile, config4).then(
  result => {
    console.log('4: ', result.length);
  },
  error => {
    console.log('error! ', error);
  }
);

/**
 * Testing if it works with no config at all. It outputs a JSON version of the RAML file.
 */
raml2html.render(ramlFile, {}).then(
  result => {
    console.log('5: ', Object.keys(result).length);
  },
  error => {
    console.log('error! ', error);
  }
);

/**
 * If you want to only customize the Nunjucks configuration, just add a setupNunjucks function to the default config.
 */
const config6 = raml2html.getConfigForTheme('raml2html-default-theme');
config6.setupNunjucks = function(env) {
  // Do stuff with env here
  env.bla = 'bla';
};

raml2html.render(ramlFile, config6).then(
  result => {
    console.log('6: ', result.length);
  },
  error => {
    console.log('error! ', error);
  }
);
