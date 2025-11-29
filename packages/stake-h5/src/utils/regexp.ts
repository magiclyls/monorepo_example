/** 用户名(3-14字符,数字和字母) */
export const usernameReg = /^[a-zA-Z0-9_]{3,30}$/
/** 用户名2(6-18字符,数字和字母) */
export const usernameReg2 = /^[a-zA-Z0-9_]{6,30}$/
/** 必须含有大写和小写字母 */
export const upperLowerReg = /^(?=.*[a-z])(?=.*[A-Z]).+$/
/** 至少一位数字 */
export const lastOneNumberReg = /.*[0-9].*/
/** 邮箱 */
export const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
/** 支付密码(6位数字) */
export const payPasswordReg = /^\d{6}$/
/** 虚拟币地址 */
export const virtualCoinAddressReg = /^[a-zA-Z0-9]{5,100}$/
/** 仅数字 */
export const numberReg = /^[0-9]+$/
/** 数字开头 */
export const startWithNumber = /^\d/
/** 中文 */
export const chineseRegex = /[\u4E00-\u9FA5\u3000-\u303F\uFF00-\uFFEF]/
/** 中国手机号码 */
export const chinaPhoneReg = /^1[3-9]\d{9}$/
/** 菲律宾手机号码 */
export const philippinePhoneReg = /^(09|\+639)\d{9}$/ // /^(09|\+639|\+6309)\d{9}$/
/** 巴西手机号码 */
export const brazilPhoneReg = /^(\+55\s?)?(\(?\d{2}\)?\s?)?9\d{4}-?\d{4}$/
/** 兑换码 */
export const couponReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8}$/

/** 印度手机号码 */
export const indiaPhoneReg = /^[6-9]\d{9}$/ // 6，7，8，9开头的10位数字
/** IFSC */
export const ifscReg = /^[A-Z]{4}0[a-zA-Z0-9]{6}$/ // 前4位大写字母 + 数字0 + 6位字母数字混合
/** 印度imps卡 */
export const indiaCardReg = /^\d{6,18}$/ // 6-18位数字
/** 印度UPI卡 */
export const indiaUPIReg = /^[a-z0-9._-]{2,}@[a-z0-9._-]{2,}$/ // 英文数字250字符以内