'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toChurchNotation = undefined;

var _errors = require('./errors');

const firstChildType = node => node.children[0].body.type;

const isApplication = node => firstChildType(node) !== 'VAR_DEC' && firstChildType(node) !== 'LAMBDA_DEC';

const buildLambdaApplicationNode = (lambdaNode, argumentNode) => ({
  type: 'LAMBDA_APPLICATION',
  body: {
    lambda: lambdaNode,
    argument: argumentNode
  },
  children: []
});

const getCompiler = tokenHandlers => {

  return function Compile(node) {
    const nodeType = node.body.type;
    if (nodeType === 'LIST') {
      node.children.length === 0 && (0, _errors.throwEmptyListError)();
      if (isApplication(node)) {
        node.children.length < 2 && (0, _errors.throwEmptyApplicationError)();
        return tokenHandlers.LAMBDA_APPLICATION(buildLambdaApplicationNode(...node.children), Compile);
      }
      return node.children.map(Compile).join('');
    }
    return tokenHandlers[nodeType](node, Compile);
  };
};

const JavaScript = getCompiler({
  PROGRAM: (node, compile) => node.children.map(compile).join(';\n') + ';',
  VAR_DEC: (node, compile) => `const ${node.body.name} = ${node.children.map(compile).join('')}`,
  LAMBDA_DEC: (node, compile) => `(${node.body.input} => ${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `${compile(node.body.lambda)}(${compile(node.body.argument)})`,
  ATOM: (node, compile) => node.body.name,
  LIST: (node, compile) => node.children.map(compile).join('')
});

const heap = {};
const PointFreeJavaScript = getCompiler({
  PROGRAM: (node, compile) => node.children.map(compile).join(''),
  LAMBDA_DEC: (node, compile) => `(${node.body.input} => ${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `${compile(node.body.lambda)}(${compile(node.body.argument)})`,
  ATOM: (node, compile) => heap[node.body.name] || node.body.name,
  LIST: (node, compile) => node.children.map(compile).join(''),
  VAR_DEC: (node, compile) => {
    heap[node.body.name] = node.children.map(compile).join('');
    return '';
  }
});

exports.default = {
  JavaScript,
  PointFreeJavaScript
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