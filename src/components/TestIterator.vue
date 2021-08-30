<template>
  <div class="iterator">
    <p>{{ defaultList }}</p>
    <button @click="next">Next</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TestIterator extends Vue {
  name = 'TestIterator'

  private defaultList: string[] = ['apple', 'banana', 'cherry'] // default list
  private iteratorObj = this.getIterator(this.defaultList) // 迭代器对象

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

  // trigger next action
  private next() {
    console.log('next', this.iteratorObj.next())
  }
}
</script>

<style lang="less" scoped></style>
