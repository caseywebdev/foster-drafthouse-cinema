import _ from 'underscore';

export default (obj) => _.reduce(obj, (sum, n) => sum + n, 0);
