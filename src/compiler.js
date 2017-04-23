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

export const toJS = (node: ASTNode): ?string => {
  switch (node.body.type) {
  case 'PROGRAM':
    return node.children.map(toJS).join(';\n') + ';';
  case 'VAR_DEC':
    return `const ${node.body.name} = `;
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
        break;
      }
      const namedLambdaNode = node.children[0];
      const lambdaArgumentNode = node.children[1];
      return `${toJS(namedLambdaNode)}(${toJS(lambdaArgumentNode)})`;
    }
    return node.children.map(toJS).join('');
  }
};
