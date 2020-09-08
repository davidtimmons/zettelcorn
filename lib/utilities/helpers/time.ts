/**
 * Utilities that make it easier to work with time and dates.
 * @protected
 * @module utilities/helpers/time
 * @see module:utilities/helpers/mod
 * @see module:utilities/mod
 */

// TYPES //

// TODO: Use an enum to generalize functions that return a numeric timestamp.
// enum TDateCodes {
//   d, // Day of month (01..31)
//   H, // Hour in 24-hour clock format (00..23)
//   M, // Minutes (00..59)
//   m, // Number of month (01..12)
//   S, // Seconds (00..59)
//   Y, // Full 4-digit year
// }

// LOGIC //

export function getYear(date?: Date): number {
  const _date = date ?? new Date();
  return _date.getFullYear();
}

export function getMonth(date?: Date): number {
  const _date = date ?? new Date();
  return 1 + _date.getMonth();
}

export function getDay(date?: Date): number {
  const _date = date ?? new Date();
  return _date.getDate();
}

export function getHour(date?: Date): number {
  const _date = date ?? new Date();
  return _date.getHours();
}

export function getMinute(date?: Date): number {
  const _date = date ?? new Date();
  return _date.getMinutes();
}

export function getSecond(date?: Date): number {
  const _date = date ?? new Date();
  return _date.getSeconds();
}

/**
 * Get a numeric timestamp based on the pattern %Y%m%d%H%M%S.
 * @example
 * // returns 20200907173412
 * getTimestamp()
 */
export function getTimestamp(date?: Date): number {
  const _date = date ?? new Date();
  const timestamp = getSecond(_date) +
    getMinute(_date) * 100 +
    getHour(_date) * 10_000 +
    getDay(_date) * 1_000_000 +
    getMonth(_date) * 100_000_000 +
    getYear(_date) * 10_000_000_000;
  return timestamp;
}
