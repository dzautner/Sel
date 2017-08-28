import lex from './lexer.js';
import type { TokenType } from './lexer.js';
import parse from './parser.js';
import Compilers from './compilers.js';


export const compile = async (raw: string, compilerName: string = 'JavaScript'): string => {
  const compiler = Compilers[compilerName];
  const tokens: TokenType[] = lex(raw);
  const tree = parse(tokens);
  const code = compiler(tree);
  return code;
};
