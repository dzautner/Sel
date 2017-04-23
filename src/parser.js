export type ASTNode = {
  body: {
    type: string,
    name?: any,
    input?: any,
  },
  name?: string,
  children: ASTNode[],
}

type TokenType = {
  type: TokenType,
  name: ?string,
}

export default (tokens: TokenType[]): ASTNode => {
  const PROGRAM: ASTNode = {
    body: { type: 'PROGRAM' },
    children: [],
  };
  const currentNodePath = [];
  const getCurrentNode = () => currentNodePath.reduce((n, idx) => n.children[idx], PROGRAM);
  const addToCurrentNode = child => getCurrentNode().children.push({
    body: child,
    children: [],
  });

  const addAndMoveToNode = child => currentNodePath.push(addToCurrentNode(child) - 1);
  const closeCurrentNode = () => currentNodePath.pop();
  let tokenPointer = 0;
  while (tokenPointer < tokens.length) {
    const token: TokenType = tokens[tokenPointer];
    const nextToken: TokenType = tokens[tokenPointer + 1];
    switch (token.type) {
    case 'OPEN_PARA':
      if (nextToken.type === 'LAMBDA_DEC') {
        addAndMoveToNode({
          ...(tokens[++tokenPointer]),
          input: tokens[++tokenPointer].name,
        });
        break;
      } else {
        addAndMoveToNode({ type: 'LIST' });
        break;
      }
    case 'CLOSE_PARA': closeCurrentNode(); break;
    case 'VAR_DEC':
      addToCurrentNode({
        ...token,
        name: tokens[++tokenPointer].name,
      });
      break;
    default: addToCurrentNode(token);
    }
    tokenPointer++;
  }
  return PROGRAM;
};
