'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = tokens => {
  const PROGRAM = {
    body: { type: 'PROGRAM' },
    children: []
  };
  const currentNodePath = [];
  const getCurrentNode = () => currentNodePath.reduce((n, idx) => n.children[idx], PROGRAM);
  const addToCurrentNode = child => getCurrentNode().children.push({
    body: child,
    children: []
  });

  const addAndMoveToNode = child => currentNodePath.push(addToCurrentNode(child) - 1);
  const closeCurrentNode = () => currentNodePath.pop();
  let tokenPointer = 0;
  while (tokenPointer < tokens.length) {
    const token = tokens[tokenPointer];
    const nextToken = tokens[tokenPointer + 1];
    switch (token.type) {
      case 'OPEN_PARA':
        if (nextToken.type === 'VAR_DEC') {
          addAndMoveToNode(_extends({}, tokens[++tokenPointer], {
            name: tokens[++tokenPointer].name
          }));
          break;
        }
        if (nextToken.type === 'LAMBDA_DEC') {
          addAndMoveToNode(_extends({}, tokens[++tokenPointer], {
            input: tokens[++tokenPointer].name
          }));
          break;
        } else {
          addAndMoveToNode({ type: 'LIST' });
          break;
        }
      case 'CLOSE_PARA':
        closeCurrentNode();break;
      default:
        addToCurrentNode(token);
    }
    tokenPointer++;
  }
  return PROGRAM;
};