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

let PREV_NODE: ?ASTNode;
export const toJS = (node: ASTNode): ?string => {
  const previousNodeType = PREV_NODE && PREV_NODE.body.type;
  const currentNodeType = node.body.type;
  let buffer = '';
  PREV_NODE = node;
  switch (currentNodeType) {
  case 'PROGRAM': buffer = node.children.map(toJS).join(';\n') + ';'; break;
  case 'VAR_DEC':
    buffer = `const ${node.body.name} = `;
    break;
  case 'LAMBDA_DEC':
    buffer = `${node.body.input} => `;
    break;
  case 'ATOM':
    buffer = node.body.name;
    break;
  case 'LIST':
    if (node.children.length === 0) {
      throwEmptyListError();
      return;
    }
    if (isApplication(node)) {
      if (node.children.length < 2) {
        throwEmptyApplicationError();
        return;
      }
      const namedLambdaNode = node.children[0];
      const lambdaArgumentNode = node.children[1];
      buffer = `${toJS(namedLambdaNode)}(${toJS(lambdaArgumentNode)})`;
    } else {
      buffer = node.children.map(toJS).join('');
    }
    break;
  }

  // Quite the hack, as the order of execution got a bit odd with deeply nested lambdas,
  // (And it was quite the visual mess tom make sense out of them)
  // Decided to simply wrap all Lambda blocks in extra set of parentheses.
  // Due to lambda node's body not being part of the node,
  // it's easier to simply check previous node type and current node type and see if any extra
  // parentheses needs to be inserted.
  //
  // TODO: Come up with a better way to do it.
  if (currentNodeType === 'LAMBDA_DEC') {
    return '(' + buffer;
  }
  if (previousNodeType === 'LAMBDA_DEC' && currentNodeType !== 'LAMBDA_DEC') {
    return buffer + ')';
  }
  return buffer;
};
