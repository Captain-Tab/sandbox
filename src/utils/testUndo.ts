/**
 * https://juejin.cn/post/6844903921878564872#heading-2
 */

// do
const changePostion = (data: any, params: any) => {
  const { property, value } = params
  const newData = { ...data }
  newData[property] += value
  return newData
}

//  undo
const changePostionUndo = (data: any, params: any) => {
  const { property, value } = params
  const newData = { ...data }
  newData[property] -= value
  return newData
}

// actions
const functions = {
  changePostion,
  changePostionUndo,
}

// action
const actions: any[] = []

// undoAction
const undoActions: any[] = []

// data
const data: any = {}

export default {
  data: { left: 0 },
  actions,
  undoActions,
  getFunction(name: 'changePostion' | 'changePostionUndo'): (data: any, params: any) => any {
    return functions[name]
  },
}
