'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errors = require('./errors');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        return tokenHandlers.LAMBDA_APPLICATION(buildLambdaApplicationNode(...node.children), Compile, heap);
      }
      return node.children.map(Compile).join('');
    }
    return tokenHandlers[nodeType](node, Compile, heap);
  };
};

const BUILTINS_PREFIXER = 'BUILTIN__';

const normalizeName = name => {
  const isDigit = /^\d+$/.test(name);
  if (isDigit) {
    return `${BUILTINS_PREFIXER}_${name}`;
  }
  const transformations = [['-', 'T_MINUS'], ['-', 'T_MINUS'], ['+', 'T_PLUS'], ['*', 'T_MULTIPICATION'], ['=', 'T_EQUAL'], ['≠', 'T_NOT_EQUAL'], ['∅', 'T_NULL'], ['∧', 'T_AND'], ['∨', 'T_OR'], ['¬', 'T_NOT'], ['If', 'T_IF'], ['True', 'T_TRUE'], ['False', 'T_FALSE'], ['<', 'T_IS_L_THAN'], ['≤', 'T_IS_L_THAN_EQ'], ['>', 'T_IS_G_THAN'], ['≥', 'T_IS_G_THAN_EQ'], ['::', '_NS_'], ['-', '_'], ['?', 'T_Q_MARK'], ['⟶', 'T_ARROW'], ['/', 'T_DIVISION']];
  return transformations.reduce((symbol, [from, to]) => symbol.replace(new RegExp('\\' + from, 'g'), to), name);
};

const javaScriptBuiltins = _fs2.default.readFileSync(_path2.default.resolve(__dirname, './builtins.js')) + '\n';

const pythonBuiltins = _fs2.default.readFileSync(_path2.default.resolve(__dirname, './builtins.py')) + '\n';

const JavaScript = getCompiler({
  PROGRAM: (node, compile) => javaScriptBuiltins + node.children.map(compile).join(';\n') + ';',
  VAR_DEC: (node, compile) => `const ${normalizeName(node.body.name)} = ${node.children.map(compile).join('')}`,
  LAMBDA_DEC: (node, compile) => `(${node.body.input} => ${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `${compile(node.body.lambda)}(${compile(node.body.argument)})`,
  ATOM: (node, compile) => normalizeName(node.body.name),
  LIST: (node, compile) => node.children.map(compile).join('')
});

const LetFreeJavaScript = getCompiler({
  PROGRAM: (node, compile) => javaScriptBuiltins + node.children.map(compile).join(''),
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

const Python = getCompiler({
  PROGRAM: (node, compile) => pythonBuiltins + node.children.map(compile).join(''),
  LAMBDA_DEC: (node, compile) => `(lambda ${node.body.input}: ${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `(${compile(node.body.lambda)})(${compile(node.body.argument)})`,
  ATOM: (node, compile, heap) => heap[node.body.name] || node.body.name,
  LIST: (node, compile) => node.children.map(compile).join(''),
  VAR_DEC: (node, compile, heap) => {
    heap[node.body.name] = node.children.map(compile).join('');
    return '';
  }
});

exports.default = {
  JavaScript,
  LetFreeJavaScript,
  ChurchNotation,
  Python
};