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

type TokenHandler = (node: ASTNode, compile: Compiler) => string;

type TokenHandlers = {
  PROGRAM: TokenHandler,
  VAR_DEC: TokenHandler,
  LAMBDA_DEC: TokenHandler,
  LAMBDA_APPLICATION: TokenHandler,
  ATOM: TokenHandler,
  LIST: TokenHandler,
};

const buildLambdaApplicationNode = (lambdaNode: ASTNode, argumentNode: ASTNode): ASTNode => ({
  type: 'LAMBDA_APPLICATION',
  body: {
    lambda: lambdaNode,
    argument: argumentNode,
  },
  children: [],
});

const getCompiler = (tokenHandlers: TokenHandlers): Compiler => {

  return function Compile(node: ASTNode): string {
    const nodeType = node.body.type;
    if (nodeType === 'LIST') {
      node.children.length === 0 && throwEmptyListError();
      if (isApplication(node)) {
        node.children.length < 2 && throwEmptyApplicationError();
        return tokenHandlers.LAMBDA_APPLICATION(buildLambdaApplicationNode(...node.children), Compile);
      }
      return node.children.map(Compile).join('');
    }
    return tokenHandlers[nodeType](node, Compile);
  };

};

const JavaScript = getCompiler({
  PROGRAM:            (node, compile) => node.children.map(compile).join(';\n') + ';',
  VAR_DEC:            (node, compile) => `const ${node.body.name} = ${node.children.map(compile).join('')}`,
  LAMBDA_DEC:         (node, compile) => `(${node.body.input} => ${node.children.map(compile).join('')})`,
  LAMBDA_APPLICATION: (node, compile) => `${compile(node.body.lambda)}(${compile(node.body.argument)})`,
  ATOM:               (node, compile) => node.body.name,
  LIST:               (node, compile) => node.children.map(compile).join(''),
});

export default {
  JavaScript,
};

const varMap = {};
export const toPointFreeJS: Compiler = node => {
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
      throwEmptyListError();
    }
    if (isApplication(node)) {
      if (node.children.length < 2) {
        throwEmptyApplicationError();
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
export const toChurchNotation: Compiler = node => {
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
      throwEmptyListError();
    }
    if (isApplication(node)) {
      if (node.children.length < 2) {
        throwEmptyApplicationError();
      }
      const namedLambdaNode = node.children[0];
      const lambdaArgumentNode = node.children[1];
      return `(${toChurchNotation(namedLambdaNode)} (${toChurchNotation(lambdaArgumentNode)}))`;
    }
    return node.children.map(toChurchNotation).join('');
  }
  return '';
};
