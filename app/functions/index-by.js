export default (items, fn) => {
  const index = {};
  for (let i = 0; i < items.length; ++i) {
    index[fn(items[i], i, items)] = items[i];
  }
  return index;
};
