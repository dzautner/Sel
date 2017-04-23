import colors from 'colors';

export const throwEmptyListError = () => {
  throwError('Compilation',
  `
  Encountered an empty list.
  Every list statement must have 2 members.
  `);
};

export const throwEmptyApplicationError = () => {
  throwError('Compilation',
  `
  Encountered a lambda application without any input.
  Every lambda application must have exactly one parameters in input.
  You may ignore those parmeters in the lambda's body, but they must be included.
  `);
};

export const fileNotFoundError = (path) => {
  throwError('CLI',
  `
  Could not open file in:
  ${path}
  `);
};

const throwError = (type, message) => {
  const error = `
${colors.red(`${type} Error: `)}
-------------
${colors.yellow(message)}

Stacktrace:
  `;
  throw Error(error);
};
