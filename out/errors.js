'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileNotFoundError = exports.throwEmptyApplicationError = exports.throwEmptyListError = undefined;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const throwEmptyListError = exports.throwEmptyListError = () => {
  throwError('Compilation', `
  Encountered an empty list.
  Every list statement must have 2 members.
  `);
};

const throwEmptyApplicationError = exports.throwEmptyApplicationError = () => {
  throwError('Compilation', `
  Encountered a lambda application without any input.
  Every lambda application must have exactly one parameters in input.
  You may ignore those parmeters in the lambda's body, but they must be included.
  `);
};

const fileNotFoundError = exports.fileNotFoundError = path => {
  throwError('CLI', `
  Could not open file in:
  ${path}
  `);
};

const throwError = (type, message) => {
  const error = `
${_colors2.default.red(`${type} Error: `)}
-------------
${_colors2.default.yellow(message)}

Stacktrace:
  `;
  throw Error(error);
};