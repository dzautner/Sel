'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errors = require('./errors');

const firstChildType = node => node.children[0].body.type;

const isApplication = node => firstChildType(node) !== 'VAR_DEC' && firstChildType(node) !== 'LAMBDA_DEC';

//TODO: move to parser
const buildLambdaApplicationNode = (lambdaNode, argumentNode) => ({
  type: 'LAMBDA_APPLICATION',
  body: {
    lambda: lambdaNode,
    argument: argumentNode
  },
  children: []
});

const getCompiler = tokenHandlers => {
  const heap = {};
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
    return tokenHandlers[nodeType](node, Compile, heap);
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

const PointFreeJavaScript = getCompiler({
  PROGRAM: (node, compile) => node.children.map(compile).join(''),
  LAMBDA_DEC: (node, compile) => `(${node.body.input} => ${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `${compile(node.body.lambda)}(${compile(node.body.argument)})`,
  ATOM: (node, compile, heap) => heap[node.body.name] || node.body.name,
  LIST: (node, compile) => node.children.map(compile).join(''),
  VAR_DEC: (node, compile, heap) => {
    heap[node.body.name] = node.children.map(compile).join('');
    return '';
  }
});

const ChurchNotation = getCompiler({
  PROGRAM: (node, compile) => node.children.map(compile).join(''),
  LAMBDA_DEC: (node, compile) => `(λ ${node.body.input}.${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `(${compile(node.body.lambda)}) (${compile(node.body.argument)})`,
  ATOM: (node, compile, heap) => heap[node.body.name] || node.body.name,
  LIST: (node, compile) => node.children.map(compile).join(''),
  VAR_DEC: (node, compile, heap) => {
    heap[node.body.name] = node.children.map(compile).join('');
    return '';
  }
});

exports.default = {
  JavaScript,
  PointFreeJavaScript,
  ChurchNotation
};