'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toJS = undefined;

var _errors = require('./errors');

const firstChildType = node => node.children[0].body.type;

const isApplication = node => firstChildType(node) !== 'VAR_DEC' && firstChildType(node) !== 'LAMBDA_DEC';

const toJS = exports.toJS = node => {
  const currentNodeType = node.body.type;
  let buffer = '';
  switch (currentNodeType) {
    case 'PROGRAM':
      buffer = node.children.map(toJS).join(';\n') + ';';break;
    case 'VAR_DEC':
      buffer = `const ${node.body.name} = `;
      break;
    case 'LAMBDA_DEC':
      buffer = `(${node.body.input} => ${node.children.map(toJS).join('')})`;
      break;
    case 'ATOM':
      buffer = node.body.name;
      break;
    case 'LIST':
      if (node.children.length === 0) {
        (0, _errors.throwEmptyListError)();
        break;
      }
      if (isApplication(node)) {
        if (node.children.length < 2) {
          (0, _errors.throwEmptyApplicationError)();
          break;
        }
        const namedLambdaNode = node.children[0];
        const lambdaArgumentNode = node.children[1];
        buffer = `${toJS(namedLambdaNode)}(${toJS(lambdaArgumentNode)})`;
      } else {
        buffer = node.children.map(toJS).join('');
      }
      break;
  }

  return buffer;
};