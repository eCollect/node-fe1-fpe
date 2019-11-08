'use strict';

module.exports = (function(_round) {
  function getRound() { return _round; }

  function setRound(round) {
    if (round < 1 || !Number.isInteger(round)) {
      throw Error('Parameter <round> must be a positive integer.');
    }
    _round = round;
  }

  return { getRound, setRound };
}(3));
