import Vue from 'vue'
import json2mq from 'json2mq'

// 原型插件地址：https://github.com/AlexandreBonaventure/vue-mq/blob/master/src/index.js

// 默认的媒体查询信息
const DEFAULT_BREAKPOINT = {
  mobile: 720,
  desktop: Infinity
}

// 将对象转化为媒体查询数据格式
export function convertBreakpointsToMediaQueries (breakpoints = DEFAULT_BREAKPOINT) {
  const keys = Object.keys(breakpoints)
  const values = keys.map(key => breakpoints[key])
  const breakpointValues = [0, ...values.slice(0, -1)]
  return breakpointValues.reduce((sum, value, index) => {
    const options = Object.assign(
      { minWidth: value },
      index < keys.length - 1 ? { maxWidth: breakpointValues[index + 1] - 1 } : {}
    )
    const query = json2mq(options)
    return Object.assign(sum, { [keys[index]]: query })
  }, {})
}

// 监听媒体查询
export function subscribeToMediaQuery (mediaQuery, enter) {
  const mql = window.matchMedia(mediaQuery)
  const callback = (mql) => {
    enter(mql.matches)
  }
  mql.addEventListener('change', callback)
  // 初始化就进行判断
  callback(mql)
}

// 自定义指令
const responsive = {
  install () {
    const mediaQueries = convertBreakpointsToMediaQueries()
    for (const area in mediaQueries) {
      Vue.directive(area, {
        inserted (el) {
          const enter = (matches) => {
            el.style.display = matches ? '' : 'none'
          }
          subscribeToMediaQuery(mediaQueries[area], enter)
        }
      })
    }
  }
}

Vue.use(responsive)
