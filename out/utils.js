'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openPath = exports.openFile = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _errors = require('./errors.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const openFile = exports.openFile = name => {
  const pathName = _path2.default.join(__dirname, name);
  return openPath(pathName);
};

const openPath = exports.openPath = pathName => {
  return new Promise((resolve, reject) => {
    _fs2.default.readFile(pathName, (error, data) => {
      if (error) {
        reject((0, _errors.fileNotFoundError)(pathName));
      }
      resolve(data.toString());
    });
  });
};