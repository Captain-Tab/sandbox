<template>
  <div class="vue-waterfall" :style="style">
    <slot />
  </div>
</template>

<script>

const MOVE_CLASS_PROP = '_wfMoveClass'

function autoResizeHandler (autoResize) {
  if (autoResize === false || !this.autoResize) {
    off(window, 'resize', this.reflowHandler, false)
  } else {
    on(window, 'resize', this.reflowHandler, false)
  }
}
function tidyUpAnimations (event) {
  const node = event.target
  const moveClass = node[MOVE_CLASS_PROP]
  if (moveClass) {
    removeClass(node, moveClass)
  }
}
function reflowHandler () {
  clearTimeout(this.token)
  this.token = setTimeout(this.reflow, this.interval)
}
function reflow () {
  if (!this.$el) { return }
  const width = this.$el.clientWidth
  const metas = this.$children.map(slot => slot.getMeta())
  metas.sort((a, b) => a.order - b.order)
  this.virtualRects = metas.map(() => ({}))
  calculate(this, metas, this.virtualRects)
  setTimeout(() => {
    if (isScrollBarVisibilityChange(this.$el, width)) {
      calculate(this, metas, this.virtualRects)
    }
    this.style.overflow = 'hidden'
    render(this.virtualRects, metas)
    this.$emit('reflowed', this)
  }, 0)
}
function isScrollBarVisibilityChange (el, lastClientWidth) {
  return lastClientWidth !== el.clientWidth
}
// 计算排列方式
function calculate (vm, metas, styles) {
  const options = getOptions(vm)
  const processor = vm.line === 'h' ? horizontalLineProcessor : verticalLineProcessor
  processor.calculate(vm, options, metas, styles)
}
// 获取设置参数
function getOptions (vm) {
  const maxLineGap = vm.maxLineGap ? +vm.maxLineGap : vm.lineGap
  return {
    align: ~['left', 'right', 'center'].indexOf(vm.align) ? vm.align : 'left',
    line: ~['v', 'h'].indexOf(vm.line) ? vm.line : 'v',
    lineGap: +vm.lineGap,
    minLineGap: vm.minLineGap ? +vm.minLineGap : vm.lineGap,
    maxLineGap,
    singleMaxWidth: Math.max(vm.singleMaxWidth || 0, maxLineGap),
    fixedHeight: !!vm.fixedHeight,
    grow: vm.grow && vm.grow.map(val => +val)
  }
}
// 计算竖排的布局
const verticalLineProcessor = (() => {
  function calculate (vm, options, metas, rects) {
    const width = vm.$el.clientWidth
    const grow = options.grow
    const strategy = grow
        ? getRowStrategyWithGrow(width, grow)
        : getRowStrategy(width, options)
    const tops = getArrayFillWith(0, strategy.count)
    metas.forEach((meta, index) => {
      const offset = tops.reduce((last, top, i) => top < tops[last] ? i : last, 0)
      const width = strategy.width[offset % strategy.count]
      const rect = rects[index]
      rect.top = tops[offset]
      rect.left = strategy.left + (offset ? sum(strategy.width.slice(0, offset)) : 0)
      rect.width = width
      rect.height = meta.height * (options.fixedHeight ? 1 : width / meta.width)
      tops[offset] = tops[offset] + rect.height
    })
    vm.style.height = Math.max.apply(Math, tops) + 'px'
  }
  function getRowStrategy (width, options) {
    let count = width / options.lineGap
    let slotWidth
    if (options.singleMaxWidth >= width) {
      count = 1
      slotWidth = Math.max(width, options.minLineGap)
    } else {
      const maxContentWidth = options.maxLineGap * ~~count
      const minGreedyContentWidth = options.minLineGap * ~~(count + 1)
      const canFit = maxContentWidth >= width
      const canFitGreedy = minGreedyContentWidth <= width
      if (canFit && canFitGreedy) {
        count = Math.round(count)
        slotWidth = width / count
      } else if (canFit) {
        count = ~~count
        slotWidth = width / count
      } else if (canFitGreedy) {
        count = ~~(count + 1)
        slotWidth = width / count
      } else {
        count = ~~count
        slotWidth = options.maxLineGap
      }
      if (count === 1) {
        slotWidth = Math.min(width, options.singleMaxWidth)
        slotWidth = Math.max(slotWidth, options.minLineGap)
      }
    }
    return {
      width: getArrayFillWith(slotWidth, count),
      count,
      left: getLeft(width, slotWidth * count, options.align)
    }
  }
  function getRowStrategyWithGrow (width, grow) {
    const total = sum(grow)
    return {
      width: grow.map(val => width * val / total),
      count: grow.length,
      left: 0
    }
  }
  return {
    calculate
  }
})()
// 计算横拍的布局
const horizontalLineProcessor = (() => {
  function calculate (vm, options, metas, rects) {
    const width = vm.$el.clientWidth
    const total = metas.length
    let top = 0
    let offset = 0
    while (offset < total) {
      const strategy = getRowStrategy(width, options, metas, offset)
      for (let i = 0, left = 0, meta, rect; i < strategy.count; i++) {
        meta = metas[offset + i]
        rect = rects[offset + i]
        rect.top = top
        rect.left = strategy.left + left
        rect.width = meta.width * strategy.height / meta.height
        rect.height = strategy.height
        left += rect.width
      }
      offset += strategy.count
      top += strategy.height
    }
    vm.style.height = top + 'px'
  }
  function getRowStrategy (width, options, metas, offset) {
    const greedyCount = getGreedyCount(width, options.lineGap, metas, offset)
    const lazyCount = Math.max(greedyCount - 1, 1)
    const greedySize = getContentSize(width, options, metas, offset, greedyCount)
    const lazySize = getContentSize(width, options, metas, offset, lazyCount)
    const finalSize = chooseFinalSize(lazySize, greedySize, width)
    let height = finalSize.height
    let fitContentWidth = finalSize.width
    if (finalSize.count === 1) {
      fitContentWidth = Math.min(options.singleMaxWidth, width)
      height = metas[offset].height * fitContentWidth / metas[offset].width
    }
    return {
      left: getLeft(width, fitContentWidth, options.align),
      count: finalSize.count,
      height
    }
  }
  function getGreedyCount (rowWidth, rowHeight, metas, offset) {
    let count = 0
    for (let i = offset, width = 0; i < metas.length && width <= rowWidth; i++) {
      width += metas[i].width * rowHeight / metas[i].height
      count++
    }
    return count
  }
  function getContentSize (rowWidth, options, metas, offset, count) {
    let originWidth = 0
    for (let i = count - 1; i >= 0; i--) {
      const meta = metas[offset + i]
      originWidth += meta.width * options.lineGap / meta.height
    }
    const fitHeight = options.lineGap * rowWidth / originWidth
    const canFit = (fitHeight <= options.maxLineGap && fitHeight >= options.minLineGap)
    if (canFit) {
      return {
        cost: Math.abs(options.lineGap - fitHeight),
        count,
        width: rowWidth,
        height: fitHeight
      }
    } else {
      const height = originWidth > rowWidth ? options.minLineGap : options.maxLineGap
      return {
        cost: Infinity,
        count,
        width: originWidth * height / options.lineGap,
        height
      }
    }
  }
  function chooseFinalSize (lazySize, greedySize, rowWidth) {
    if (lazySize.cost === Infinity && greedySize.cost === Infinity) {
      return greedySize.width < rowWidth ? greedySize : lazySize
    } else {
      return greedySize.cost >= lazySize.cost ? lazySize : greedySize
    }
  }
  return {
    calculate
  }
})()
// 获取元素距离左侧距离
function getLeft (width, contentWidth, align) {
  switch (align) {
    case 'right':
      return width - contentWidth
    case 'center':
      return (width - contentWidth) / 2
    default:
      return 0
  }
}
// 获取总数
function sum (arr) {
  return arr.reduce((sum, val) => sum + val)
}
// 渲染瀑布流
function render (rects, metas) {
  const metasNeedToMoveByTransform = metas.filter(meta => meta.moveClass)
  const firstRects = getRects(metasNeedToMoveByTransform)
  applyRects(rects, metas)
  const lastRects = getRects(metasNeedToMoveByTransform)
  metasNeedToMoveByTransform.forEach((meta, i) => {
    meta.node[MOVE_CLASS_PROP] = meta.moveClass
    setTransform(meta.node, firstRects[i], lastRects[i])
  })
  // eslint-disable-next-line no-unused-expressions
  // document.body.clientWidth // forced reflow
  metasNeedToMoveByTransform.forEach((meta) => {
    addClass(meta.node, meta.moveClass)
    clearTransform(meta.node)
  })
}
// 获取元素尺寸信息
function getRects (metas) {
  return metas.map(meta => meta.vm.rect)
}
// 设置元素尺寸信息
function applyRects (rects, metas) {
  rects.forEach((rect, i) => {
    const style = metas[i].node.style
    metas[i].vm.rect = rect
    for (const prop in rect) {
      style[prop] = rect[prop] + 'px'
    }
  })
}
// 设置偏移量
function setTransform (node, firstRect, lastRect) {
  const dx = firstRect.left - lastRect.left
  const dy = firstRect.top - lastRect.top
  const sw = firstRect.width / lastRect.width
  const sh = firstRect.height / lastRect.height
  node.style.transform =
      node.style.WebkitTransform = `translate(${dx}px,${dy}px) scale(${sw},${sh})`
  node.style.transitionDuration = '0s'
}
// 清理偏移量
function clearTransform (node) {
  node.style.transform = node.style.WebkitTransform = ''
  node.style.transitionDuration = ''
}
// 获取偏移介绍事件
function getTransitionEndEvent () {
  const isWebkitTrans =
      window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
  const transitionEndEvent = isWebkitTrans
      ? 'webkitTransitionEnd'
      : 'transitionend'
  return transitionEndEvent
}
// 复制属性
function getArrayFillWith (item, count) {
  const getter = (typeof item === 'function') ? () => item() : () => item
  const arr = []
  for (let i = 0; i < count; i++) {
    arr[i] = getter()
  }
  return arr
}
// 添加class
function addClass (elem, name) {
  if (!hasClass(elem, name)) {
    const cur = attr(elem, 'class').trim()
    const res = (cur + ' ' + name).trim()
    attr(elem, 'class', res)
  }
}
// 移除class
function removeClass (elem, name) {
  const reg = new RegExp('\\s*\\b' + name + '\\b\\s*', 'g')
  const res = attr(elem, 'class').replace(reg, ' ').trim()
  attr(elem, 'class', res)
}
// 判断是否有class
function hasClass (elem, name) {
  return (new RegExp('\\b' + name + '\\b')).test(attr(elem, 'class'))
}
// 获取属性值或者修改属性值
function attr (elem, name, value) {
  if (typeof value !== 'undefined') {
    elem.setAttribute(name, value)
  } else {
    return elem.getAttribute(name) || ''
  }
}
// 监听事件
function on (elem, type, listener, useCapture = false) {
  elem.addEventListener(type, listener, useCapture)
}
// 移除事件
function off (elem, type, listener, useCapture = false) {
  elem.removeEventListener(type, listener, useCapture)
}
export default {
  props: {
    autoResize: {
      default: true
    },
    interval: {
      default: 200,
      validator: val => val >= 0
    },
    align: {
      default: 'left',
      validator: val => ~['left', 'right', 'center'].indexOf(val)
    },
    line: {
      default: 'v',
      validator: val => ~['v', 'h'].indexOf(val)
    },
    lineGap: {
      required: true,
      validator: val => val >= 0
    },
    minLineGap: {
      validator: val => val >= 0
    },
    maxLineGap: {
      validator: val => val >= 0
    },
    singleMaxWidth: {
      validator: val => val >= 0
    },
    fixedHeight: {
      default: false
    },
    grow: {
      validator: val => val instanceof Array
    },
    watch: {
      default: () => ({})
    }
  },
  data: () => ({
    style: {
      height: '',
      overflow: ''
    },
    token: null
  }),
  created () {
    this.virtualRects = []
    this.$on('reflow', () => {
      this.reflowHandler()
    })
    this.$watch(() => (
        this.align,
            this.line,
            this.lineGap,
            this.minLineGap,
            this.maxLineGap,
            this.singleMaxWidth,
            this.fixedHeight,
            this.watch
    ), this.reflowHandler)
    this.$watch('grow', this.reflowHandler)
  },
  mounted () {
    this.$watch('autoResize', this.autoResizeHandler)
    on(this.$el, getTransitionEndEvent(), tidyUpAnimations, true)
    this.autoResizeHandler(this.autoResize)
  },
  beforeDestroy () {
    this.autoResizeHandler(false)
    off(this.$el, getTransitionEndEvent(), tidyUpAnimations, true)
  },
  methods: {
    reflowHandler,
    autoResizeHandler,
    reflow
  }
}
</script>

<style>
.vue-waterfall {
  position: relative;
  /*overflow: hidden; cause clientWidth = 0 in IE if height not bigger than 0 */
}
</style>
