//运行的环境
export const inBrowser = typeof window !== 'undefined'
export const ua = inBrowser && navigator.userAgent.toLowerCase()
export const isWeChatDevTools = ua && /wechatdevtools/.test(ua)
export const isAndroid = ua && ua.indexOf('android') > 0
//当前环境是否支持touch事件
export const hasTouch = inBrowser && 'ontouchstart' in window;