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
    return { type: 'ATOM', name: symbol };
  }
};

export default (text: RawText): TokenType[] => {
  const tokens = cleanSpaces(split(cleanNewLines(pad(removeComments(text)))));
  return tokens.map(classify);
};
