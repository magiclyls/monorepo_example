import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 挂载插件
dayjs.extend(utc);
dayjs.extend(timezone);


const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const TIMEZONE_KEY = 'user.timezone';
export const TIME_ZONE_CONFIG = [
  {
    label: '北京',
    value: 'Asia/Shanghai',
    format: 'YYYY-MM-DD HH:mm:ss'
  }, {
    label: '迪拜',
    value: 'Asia/Dubai',
    format: 'DD-MM-YYYY HH:mm'
  }, {
    label: '泰国',
    value: 'Asia/Bangkok',
    format: 'DD MMMM YYYY HH:mm'
  }, {
    label: '巴西',
    value: 'America/Sao_Paulo',
    format: 'DD/MM/YYYY HH:mm'
  }
]

/**
 * 获取国家名称
 */
export function getCountryName() {
  return TIME_ZONE_CONFIG.find(i => i.value === getCurrentTimezone())?.label || '';
}

/**
 * 获取当前用户时区（优先从 localStorage 获取）
 */
export function getCurrentTimezone() {
  return localStorage.getItem(TIMEZONE_KEY) || DEFAULT_TIMEZONE;
}

/**
 * 设置当前用户时区（存到 localStorage）
 * @param {string} tz
 */
export function setCurrentTimezone(tz) {
  localStorage.setItem(TIMEZONE_KEY, tz);
}

/**
 * 格式化时间
 * @param {string|number|Date} date - 日期
 * @param options
 */
export function formatDate(date, options) {

  const {
    format = TIME_ZONE_CONFIG.find(i => i.value === getCurrentTimezone())?.format || 'YYYY-MM-DD HH:mm:ss',
    timezone = getCurrentTimezone()
  } = options || {};

  return dayjs.utc(date).tz(timezone).format(format);
}

/**
 * 返回 ISO 字符串
 * @param {string|number|Date} date
 * @returns {string}
 */
export function toISOString(date) {
  return dayjs(date).toISOString();
}

/**
 * 解析后端时间戳（秒级 or 毫秒级）
 * @param {number} timestamp
 * @returns {dayjs.Dayjs}
 */
export function parseTimestamp(timestamp) {
  return timestamp.toString().length === 10
    ? dayjs.unix(timestamp) // 秒级
    : dayjs(timestamp);     // 毫秒级
}

/**
 * 获取时间差（单位：秒）
 * @param {string|Date} date1
 * @param {string|Date} date2
 * @returns {number}
 */
export function diffInSeconds(date1, date2) {
  return dayjs(date1).diff(dayjs(date2), 'second');
}

/**
 * 检查时间是否已过
 * @param {string|Date} date
 * @returns {boolean}
 */
export function isExpired(date) {
  return dayjs().isAfter(dayjs(date));
}

/**
 * 获取当前时间（按当前用户时区）
 * @returns {dayjs.Dayjs}
 */
export function now() {
  return dayjs().tz(getCurrentTimezone());
}

/**
 * 判断对象是不是Moment.js类型
 * @param obj
 * @returns {boolean}
 */
export const isMoment = (obj) => !!(obj && obj._isAMomentObject);