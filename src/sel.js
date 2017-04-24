import { openFile } from './utils.js';
import lex from './lexer.js';
import type { TokenType } from './lexer.js';
import parse from './parser.js';
import Compilers from './compilers.js';


export const compile = async (raw: string, compilerName: string = 'JavaScript'): string => {
  const compiler = Compilers[compilerName];
  const tokens: TokenType[] = lex(raw);
  const tree = parse(tokens);
  const builtins = await openFile('../src/builtins.js');
  const code = compiler(tree);
  const churchNotation = Compilers.ChurchNotation(tree);
  return `
${builtins}

/**
The corresponding code in Church Encoding:

${churchNotation}

**/

${code}
  `;
};
