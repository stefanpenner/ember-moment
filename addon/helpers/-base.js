import { run } from '@ember/runloop';
import Helper from '@ember/component/helper';
import { get, observer } from '@ember/object';
import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Helper.extend({
  moment: service(),
  disableInterval: false,
  globalAllowEmpty: bool('moment.__config__.allowEmpty'),
  supportsGlobalAllowEmpty: true,
  localeOrTimeZoneChanged: observer('moment.locale', 'moment.timeZone', function() {
    this.recompute();
  }),

  compute(value, { interval }) {
    if (get(this, 'disableInterval')) { return; }

    this.clearTimer();

    if (interval) {
      /*
       * NOTE: intentionally a setTimeout so tests do not block on it
       * as the run loop queue is never clear so tests will stay locked waiting
       * for queue to clear.
       */
      this.intervalTimer = setTimeout(() => {
        run(() => this.recompute());
      }, parseInt(interval, 10));
    }
  },

  morphMoment(time, { locale, timeZone }) {
    const momentService = get(this, 'moment');

    locale = locale || get(momentService, 'locale');
    timeZone = timeZone || get(momentService, 'timeZone');

    if (locale && time.locale) {
      time = time.locale(locale);
    }

    if (timeZone && time.tz) {
      time = time.tz(timeZone);
    }

    return time;
  },

  clearTimer() {
    clearTimeout(this.intervalTimer);
  },

  destroy() {
    this.clearTimer();
    this._super(...arguments);
  }
});
