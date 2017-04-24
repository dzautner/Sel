// @flow

import type { ASTNode } from '../src/parser.js';
import {
  throwEmptyListError,
  throwEmptyApplicationError,
} from './errors';

const firstChildType =
  (node: ASTNode): string => node.children[0].body.type;

const isApplication =
  (node: ASTNode): boolean => firstChildType(node) !== 'VAR_DEC' && firstChildType(node) !== 'LAMBDA_DEC';

export const toJS = (node: ASTNode): string => {
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
      throwEmptyListError();
    }
    if (isApplication(node)) {
      if (node.children.length < 2) {
        throwEmptyApplicationError();
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
export const toPointFreeJS = (node: ASTNode): string => {
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
export const toChurchNotation = (node: ASTNode): string => {
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
