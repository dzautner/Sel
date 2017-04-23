import { openFile } from './utils.js';
import lex from './lexer.js';
import type { TokenType } from './lexer.js';
import parse from './parser.js';
import { toJS } from './compiler.js';

export const compile = async (raw: string): string => {
  const tokens: TokenType[] = lex(raw);
  const tree = parse(tokens);
  const builtins = await openFile('../src/builtins.js');
  const JS = toJS(tree);
  return `
    ${builtins}
    ${JS}
  `;
};
