type SymbolType = string;

export type TokenType = {
  type: TokenType,
  name: ?string,
}

type RawText = string;

type SplitText = string;

const BUILTINS_PREFIXER = 'BUILTIN__';

const SymbolMap = {
  COMMENT    : ';',
  OPEN_PARA  : '(',
  CLOSE_PARA : ')',
  LAMBDA_DEC : 'λ',
  VAR_DEC    : 'let',
  NEW_LINE   : '\n',
};

const padSymbol = (text, symbol) => {
  return text.split(symbol).join(` ${symbol} `);
};

const pad = (text: RawText): SplitText => {
  const toPad = [SymbolMap.OPEN_PARA, SymbolMap.CLOSE_PARA];
  return toPad.reduce(padSymbol, text);
};

const split = raw => raw.split(' ');

const removeComments = (text: string): string => {
  const S = SymbolMap.COMMENT;
  const commentRegex = new RegExp(S + '[\\s\\S]*?' + '\n', 'g');
  return text.replace(commentRegex, '');
};

const cleanNewLines = (text: string) => text.replace(/\n/g, ``);

const cleanSpaces = (symbols: SymbolType[]) => symbols.filter(t => t !== '');

const normalizeName = (name: string): string => {
  //TODO: move digit cleaning to parser?
  const isDigit = /^\d+$/.test(name);
  if (isDigit) {
    return `${BUILTINS_PREFIXER}_${name}`;
  }
  switch (name) {
  case '-': return 'T_MINUS';
  case '+': return 'T_PLUS';
  case '*': return 'T_MULTIPICATION';
  case '=': return 'T_EQUAL';
  case '≠': return 'T_NOT_EQUAL';
  case '∅': return 'T_NULL';
  case '∧': return 'T_AND';
  case '∨': return 'T_OR';
  case '¬': return 'T_NOT';
  case 'If': return 'T_IF';
  case 'True': return 'T_TRUE';
  case 'False': return 'T_FALSE';
  case '<': return 'T_IS_L_THAN';
  case '≤': return 'T_IS_L_THAN_EQ';
  case '>': return 'T_IS_G_THAN';
  case '≥': return 'T_IS_G_THAN_EQ';
  case ' ∈ ': return '_IN_SET_';
  default:  return name.replace(/\-/g, '_');
  }
};

const classify = (symbol: SymbolType): TokenType => {
  switch (symbol) {
  case SymbolMap.COMMENT:
    return { type: 'COMMENT' };
  case SymbolMap.OPEN_PARA:
    return { type: 'OPEN_PARA' };
  case SymbolMap.CLOSE_PARA:
    return { type: 'CLOSE_PARA' };
  case SymbolMap.LAMBDA_DEC:
    return { type: 'LAMBDA_DEC' };
  case SymbolMap.VAR_DEC:
    return { type: 'VAR_DEC' };
  case SymbolMap.NEW_LINE:
    return { type: 'NEW_LINE' };
  default:
    return { type: 'ATOM', name: normalizeName(symbol) };
  }
};

export default (text: RawText): TokenType[] => {
  const tokens = cleanSpaces(split(cleanNewLines(pad(removeComments(text)))));
  return tokens.map(classify);
};
