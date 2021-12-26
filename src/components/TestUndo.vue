<template>
  <div class="test">
    <h1>space traveling</h1>
    <button @click="go">
      go
    </button>
    <button @click="undo">
      undo
    </button>
    <button @click="redo">
      redo
    </button>
    <p>{{ data }}</p>
    <div id="box" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import manager from '@/utils/testUndo'
@Component
export default class TestUndo extends Vue {
  name = 'TestUndo'
  private data = { left: 0 } // test data
  private box: HTMLElement | undefined = undefined
  private getBox(): HTMLElement {
    const box = document.getElementById('box') as HTMLElement
    return box
  }
  private moveBox(data: { left: number }): void {
    if (!this.box) {
      this.box = this.getBox()
    }
    this.box.style.left = data.left.toString() + 'px'
  }
  // action
  private action = {
    name: 'changePostion',
    params: {
      property: 'left',
      value: Number((Math.random() * 100).toFixed(2)),
    },
  }
  // trigger the go action
  private go() {
    // push actions to record array
    manager.actions.push(this.action)
    // find the funciton
    const execFn = manager.getFunction(
        this.action.name as 'changePostion' | 'changePostionUndo'
    )
    // execute the function
    manager.data = execFn(manager.data, this.action.params)
    console.log('manager', manager)
    this.data = manager.data
    this.moveBox(this.data as { left: number })
    // create undo record
    if (manager.undoActions.length) {
      manager.undoActions = []
    }
  }
  // trigger back action
  private undo() {
    const action= manager.actions.pop()
    const undoFn = manager.getFunction(
        `${action.name}Undo` as 'changePostion' | 'changePostionUndo'
    )
    manager.data = undoFn(manager.data, action.params)
    console.log('manager', manager)
    this.data = manager.data
    this.moveBox(this.data as { left: number })
    manager.undoActions.push(action)
  }
  // trigget redo action
  private redo() {
    if (!manager.undoActions.length) {
      return
    }
    const action = manager.undoActions.pop()
    console.log('ac', action)
    const execFn = manager.getFunction(action.name)
    manager.data = execFn(manager.data, action.params)
    console.log('manager', manager)
    this.data = manager.data
    this.moveBox(this.data as { left: number })
  }
}
</script>

<style lang="less" scoped>
.test {
  #box {
    width: 30px;
    height: 30px;
    background: black;
    position: absolute;
  }
}
</style>
