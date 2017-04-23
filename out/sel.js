'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = undefined;

var _utils = require('./utils.js');

var _lexer = require('./lexer.js');

var _lexer2 = _interopRequireDefault(_lexer);

var _parser = require('./parser.js');

var _parser2 = _interopRequireDefault(_parser);

var _compiler = require('./compiler.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const compile = exports.compile = async raw => {
  const tokens = (0, _lexer2.default)(raw);
  const tree = (0, _parser2.default)(tokens);
  const builtins = await (0, _utils.openFile)('../src/builtins.js');
  const JS = (0, _compiler.toJS)(tree);
  return `
    ${builtins}
    ${JS}
  `;
};