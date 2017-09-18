#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _utils = require('./utils.js');

var _sel = require('./sel.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pathToJSCode = async (path, options) => {
  const baseCode = await (0, _utils.openFile)('../src/base.sel');
  let selCode;
  try {
    selCode = await (0, _utils.openPath)(path);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  try {
    return await (0, _sel.compile)(`
      ${options.removeBase ? '' : baseCode}
      ${selCode}
    `, options.compiler);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

_commander2.default.command('compile [path]').description('Compile the given SEL file to Javascript').alias('c').option('-rb, --remove-base', 'Set to true to remove base SEL lib').option('-co, --compiler [type]', 'Select which compiler to use ([JavaScript]/LetFreeJavaScript/Python)', 'JavaScript').action(async (path, options) => {
  console.log((await pathToJSCode(path, options)));
});

_commander2.default.command('run [path]').description('Compile the given SEL file to Javascript and eval it').alias('r').option('-rb, --remove-base', 'Set to true to remove base SEL lib').option('-co, --compiler [type]', 'Select which compiler to use ([JavaScript]/LetFreeJavaScript/Python)', 'JavaScript').action(async (path, options) => {
  eval((await pathToJSCode(path, options))); //eslint-disable-line
});

if (!process.argv.slice(2).length) {
  _commander2.default.outputHelp();
}
_commander2.default.parse(process.argv);