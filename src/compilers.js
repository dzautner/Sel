// @flow

import type { ASTNode } from '../src/parser.js';
import {
  throwEmptyListError,
  throwEmptyApplicationError,
} from './errors';

export type Compiler = (node: ASTNode) => string;

const firstChildType =
  (node: ASTNode): string => node.children[0].body.type;

const isApplication =
  (node: ASTNode): boolean => firstChildType(node) !== 'VAR_DEC' && firstChildType(node) !== 'LAMBDA_DEC';

type TokenHandler = (node: ASTNode, compile: Compiler, heap: {}) => string;

type TokenHandlers = {
  PROGRAM: TokenHandler,
  VAR_DEC: TokenHandler,
  LAMBDA_DEC: TokenHandler,
  LAMBDA_APPLICATION: TokenHandler,
  ATOM: TokenHandler,
  LIST: TokenHandler,
};

//TODO: move to parser
const buildLambdaApplicationNode = (lambdaNode: ASTNode, argumentNode: ASTNode): ASTNode => ({
  type: 'LAMBDA_APPLICATION',
  body: {
    lambda: lambdaNode,
    argument: argumentNode,
  },
  children: [],
});

const getCompiler = (tokenHandlers: TokenHandlers): Compiler => {
  const heap = {};
  return function Compile(node: ASTNode): string {
    const nodeType = node.body.type;
    if (nodeType === 'LIST') {
      node.children.length === 0 && throwEmptyListError();
      if (isApplication(node)) {
        node.children.length < 2 && throwEmptyApplicationError();
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
  PROGRAM:            (node, compile) => javaScriptBuiltins + node.children.map(compile).join(';\n') + ';',
  VAR_DEC:            (node, compile) => `const ${node.body.name} = ${node.children.map(compile).join('')}`,
  LAMBDA_DEC:         (node, compile) => `(${node.body.input} => ${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `${compile(node.body.lambda)}(${compile(node.body.argument)})`,
  ATOM:               (node, compile) => node.body.name,
  LIST:               (node, compile) => node.children.map(compile).join(''),
});

const LetFreeJavaScript = getCompiler({
  PROGRAM:            (node, compile) => javaScriptBuiltins + node.children.map(compile).join(''),
  LAMBDA_DEC:         (node, compile) => `(${node.body.input} => ${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `${compile(node.body.lambda)}(${compile(node.body.argument)})`,
  ATOM:               (node, compile, heap) => heap[node.body.name] || node.body.name,
  LIST:               (node, compile) => node.children.map(compile).join(''),
  VAR_DEC:            (node, compile, heap) => {
    heap[node.body.name] = node.children.map(compile).join('');
    return '';
  },
});

const ChurchNotation = getCompiler({
  PROGRAM:            (node, compile) => node.children.map(compile).join(''),
  LAMBDA_DEC:         (node, compile) => `(λ ${node.body.input}.${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `(${compile(node.body.lambda)}) (${compile(node.body.argument)})`,
  ATOM:               (node, compile, heap) => heap[node.body.name] || node.body.name,
  LIST:               (node, compile) => node.children.map(compile).join(''),
  VAR_DEC:            (node, compile, heap) => {
    heap[node.body.name] = node.children.map(compile).join('');
    return '';
  },
});


const Python = getCompiler({
  PROGRAM:            (node, compile) => pythonBuiltins + node.children.map(compile).join(''),
  LAMBDA_DEC:         (node, compile) => `(lambda ${node.body.input}: ${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `(${compile(node.body.lambda)})(${compile(node.body.argument)})`,
  ATOM:               (node, compile, heap) => heap[node.body.name] || node.body.name,
  LIST:               (node, compile) => node.children.map(compile).join(''),
  VAR_DEC:            (node, compile, heap) => {
    heap[node.body.name] = node.children.map(compile).join('');
    return '';
  },
});

export default {
  JavaScript,
  LetFreeJavaScript,
  ChurchNotation,
  Python,
};

