#!/usr/bin/env node

import program from 'commander';
import { openPath, openFile } from './utils.js';
import { compile } from './sel.js';

const pathToJSCode = async (path, options) => {
  const baseCode = await openFile('../src/base.sel');
  let selCode;
  try {
    selCode = await openPath(path);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  try {
    return await compile(`
      ${options.removeBase ? '' : baseCode}
      ${selCode}
    `, options.compiler);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

program
  .command('compile [path]')
  .description('Compile the given SEL file to Javascript')
  .alias('c')
  .option('-rb, --remove-base', 'Set to true to remove base SEL lib')
  .option('-co, --compiler [type]', 'Select which compiler to use ([JavaScript]/PointFreeJavaScript)', 'JavaScript')
  .action(async (path, options) => {
    console.log(await pathToJSCode(path, options));
  });

program
  .command('run [path]')
  .description('Compile the given SEL file to Javascript and eval it')
  .alias('r')
  .option('-rb, --remove-base', 'Set to true to remove base SEL lib')
  .option('-co, --compiler [type]', 'Select which compiler to use ([JavaScript]/PointFreeJavaScript)', 'JavaScript')
  .action(async (path, options) => {
    eval(await pathToJSCode(path, options)); //eslint-disable-line
  });

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
program.parse(process.argv);
