"use strict";

// Built in functions:
const toJSNumber = number => {
  let counter = 0;
  number(() => counter++)();
  return counter;
};

const show = fn => {
  if (fn.name) {
    console.log(fn.name);
    return;
  }
  console.log(toJSNumber(fn));
};

const toJSInteger = fn => {
  let sign, number;
  fn(s => n => {
    sign = s(() => sign = 1)(() => sign = -1)();
    number = toJSNumber(n);
  });
  return sign * number;
};

const showInteger = fn => {
  console.log(toJSInteger(fn));
};

// End of built in functions.

// Start of compiled program: