// Library that demostrates something throwing when it's init() is called

// Container for the module
const example = {};

example.init = function () {
  // This is an error created intentionally (bar is not defined)
  const foo = bar;
};

module.exports = example;