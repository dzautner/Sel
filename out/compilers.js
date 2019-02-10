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
        return tokenHandlers.LAMBDA_APPLICATION(buildLambdaApplicationNode(...node.children), Compile, heap);
      }
      return node.children.map(Compile).join('');
    }
    return tokenHandlers[nodeType](node, Compile, heap);
  };
};

const javaScriptBuiltins = `
const toJSNumber = (number) => {
  let counter = 0;
  number(() => counter++)();
  return counter;
};

const show = (fn) => { //eslint-disable-line
  if (fn.name) {
    console.log(fn.name);
    return;
  }
  console.log(toJSNumber(fn));
};

const toJSInteger = (fn) => { //eslint-disable-line
  let sign, number;
  fn(s => n => {
    sign = s(() => sign = 1)(() => sign = -1)();
    number = toJSNumber(n);
  });
  return sign * number;
};

const showInteger = fn => console.log(toJSInteger(fn))
`;

const pythonBuiltins = `
class Counter():
  c = 0
  def inc(self, _):
    self.c += 1

'''
Convert Church Numeral to normal python number
'''
def toPythonNumber(number):
  counter = Counter()
  number(counter.inc)(0)
  return counter.c

def show(fn):
  print(toPythonNumber(fn))


# Compiled:


`;

const JavaScript = getCompiler({
  PROGRAM: (node, compile) => javaScriptBuiltins + node.children.map(compile).join(';\n') + ';',
  VAR_DEC: (node, compile) => `const ${node.body.name} = ${node.children.map(compile).join('')}`,
  LAMBDA_DEC: (node, compile) => `(${node.body.input} => ${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `${compile(node.body.lambda)}(${compile(node.body.argument)})`,
  ATOM: (node, compile) => node.body.name,
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