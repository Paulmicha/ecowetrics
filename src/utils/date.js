/**
 * @file
 * Date related shared utilities.
 */

const pad = n => n < 10 ? '0' + n : n;

const dateString = (d, sep = '/') => [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getUTCDate())
  ].join(sep);

const timeString = (d, sep = '-') => [
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join(sep);

module.exports = { dateString, timeString };
