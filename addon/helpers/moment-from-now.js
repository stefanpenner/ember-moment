import Ember from 'ember';
import moment from 'moment';

const { later:runLater } = Ember.run;

export var helperFactory = function(cb) {
  let fromNow;

  if (Ember.Helper) {
    fromNow = Ember.Helper.extend({
      compute: function(params, hash) {
        if (typeof cb === 'function') {
          cb();
        }
        if (params.length === 0) {
          throw new TypeError('Invalid Number of arguments, expected at least 1');
        }
        if (hash.interval) {
          runLater(this, this.recompute, parseInt(hash.interval, 10));
        }
        return moment.apply(this, params).fromNow(hash.hideSuffix);
      }
    });
  }
  else {
    fromNow = function(params, hash) {
      if (typeof cb === 'function') {
        cb();
      }
      if (params.length === 0) {
        throw new TypeError('Invalid Number of arguments, expected at least 1');
      }
      return moment.apply(this, params).fromNow(hash.hideSuffix);
    };
  }
  return fromNow;
};

export default helperFactory();
