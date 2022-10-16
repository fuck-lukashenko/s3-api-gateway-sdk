export const sleep = (ms) => (
  new Promise(r => setTimeout(r, ms))
);

export const isUndefinedType = (typeString) => (
  typeString === typeof undefined
);
