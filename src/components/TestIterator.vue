<template>
  <div class="iterator">
    <p>{{ defaultList }}</p>
    <button @click="raw">Raw Next</button>
    <button @click="halfRaw">HalfRaw next</button>
    <button @click="playArray">Array Iterator</button>
    <button @click="playString">String Iterator</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TestIterator extends Vue {
  name = 'TestIterator'

  private defaultList: string[] = ['apple', 'banana', 'cherry'] // default list
  private iteratorObj1 = this.getIterator(this.defaultList)
  private iteratorObj12 = {
    items: [100, 200, 300],
    [Symbol.iterator]: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _self = this
      let i = 0
      return {
        next: function () {
          let done = i > _self.items.length
          let value = !done ? _self.items[i++] : undefined
          return {
            done,
            value,
          }
        },
      }
    },
  }
  private iteratorObj3 = [1, 2, 3][Symbol.iterator]()
  private iteratorObj4 = 'abc'[Symbol.iterator]()

  // get the iterator
  private getIterator(list: string[]) {
    let i = 0
    return {
      next: function () {
        let done = i >= list.length
        console.log('done', done)
        let value = !done ? list[i++] : undefined
        console.log(i)
        return {
          done,
          value,
        }
      },
    }
  }

  // trigger raw action
  private raw() {
    console.log('next', this.iteratorObj1.next())
  }

  // trigger halfRaw action
  private halfRaw() {
    for (let i of this.iteratorObj12) {
      console.log('item', i)
    }
  }

  // trigger array iterator
  private playArray() {
    console.log('iterator3', this.iteratorObj3.next())
  }

  // trigger string iterator
  private playString() {
    console.log('iterator4', this.iteratorObj4.next())
  }
}
</script>

<style lang="less" scoped>
.iterator {
  display: inline-block;
}
</style>
