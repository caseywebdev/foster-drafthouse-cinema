/** @param {(string | false | 0 | null | undefined)[]} args */
export default (...args) => {
  let className;
  for (const arg of args) {
    if (arg) {
      if (className) className += ` ${arg}`;
      else className = arg;
    }
  }
  return className;
};
