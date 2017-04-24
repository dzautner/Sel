'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toChurchNotation = exports.toPointFreeJS = exports.toJS = undefined;

var _errors = require('./errors');

const firstChildType = node => node.children[0].body.type;

const isApplication = node => firstChildType(node) !== 'VAR_DEC' && firstChildType(node) !== 'LAMBDA_DEC';

const toJS = exports.toJS = node => {
  switch (node.body.type) {
    case 'PROGRAM':
      return node.children.map(toJS).join(';\n') + ';';
    case 'VAR_DEC':
      return `const ${node.body.name} = ${node.children.map(toJS).join('')}`;
    case 'LAMBDA_DEC':
      return `(${node.body.input} => ${node.children.map(toJS).join('')})`;
    case 'ATOM':
      return node.body.name;
    case 'LIST':
      if (node.children.length === 0) {
        (0, _errors.throwEmptyListError)();
      }
      if (isApplication(node)) {
        if (node.children.length < 2) {
          (0, _errors.throwEmptyApplicationError)();
        }
        const namedLambdaNode = node.children[0];
        const lambdaArgumentNode = node.children[1];
        return `${toJS(namedLambdaNode)}(${toJS(lambdaArgumentNode)})`;
      }
      return node.children.map(toJS).join('');
  }
  return '';
};

const varMap = {};
const toPointFreeJS = exports.toPointFreeJS = node => {
  switch (node.body.type) {
    case 'PROGRAM':
      return node.children.map(toPointFreeJS).join('');
    case 'VAR_DEC':
      varMap[node.body.name] = node.children.map(toPointFreeJS).join('');
      return '';
    case 'LAMBDA_DEC':
      return `(${node.body.input} => ${node.children.map(toPointFreeJS).join('')})`;
    case 'ATOM':
      return varMap[node.body.name] || node.body.name;
    case 'LIST':
      if (node.children.length === 0) {
        (0, _errors.throwEmptyListError)();
      }
      if (isApplication(node)) {
        if (node.children.length < 2) {
          (0, _errors.throwEmptyApplicationError)();
        }
        const namedLambdaNode = node.children[0];
        const lambdaArgumentNode = node.children[1];
        return `${toPointFreeJS(namedLambdaNode)}(${toPointFreeJS(lambdaArgumentNode)})`;
      }
      return node.children.map(toPointFreeJS).join('');
  }
  return '';
};

const churchVarMap = {};
const toChurchNotation = exports.toChurchNotation = node => {
  switch (node.body.type) {
    case 'PROGRAM':
      return node.children.map(toChurchNotation).join('');
    case 'VAR_DEC':
      churchVarMap[node.body.name] = node.children.map(toChurchNotation).join('');
      return '';
    case 'LAMBDA_DEC':
      return `(lambda ${node.body.input}.${node.children.map(toChurchNotation).join('')})`;
    case 'ATOM':
      return churchVarMap[node.body.name] || node.body.name;
    case 'LIST':
      if (node.children.length === 0) {
        (0, _errors.throwEmptyListError)();
      }
      if (isApplication(node)) {
        if (node.children.length < 2) {
          (0, _errors.throwEmptyApplicationError)();
        }
        const namedLambdaNode = node.children[0];
        const lambdaArgumentNode = node.children[1];
        return `(${toChurchNotation(namedLambdaNode)} (${toChurchNotation(lambdaArgumentNode)}))`;
      }
      return node.children.map(toChurchNotation).join('');
  }
  return '';
};