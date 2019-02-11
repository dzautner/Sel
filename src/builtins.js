// Built in functions:

const toJSNumber = (number) => {
  let counter = 0;
  number(() => counter++)();
  return counter;
};

const show = (fn) => { //eslint-disable-line
  if (fn.name) {
    console.log(fn.name);
    return;
  }
  console.log(toJSNumber(fn));
};


const showInteger = (fn) => { //eslint-disable-line
  let sign, number;
  fn(s => n => {
    sign = s(() => sign = 1)(() => sign = -1)();
    number = toJSNumber(n);
  });
  console.log(sign * number);
};

// End of built in functions.

// Start of compiled program:

