<template>
  <div class="space">
    <div class="space-option">
      <p
        v-for="(item, index) in componentOptions"
        :key="index"
        :class="['space-option-item', currentComponent === item ? 'selected' : '']"
        @click="setDisplay(item)">
        {{ item }}
      </p>
    </div>
    <component :is="componentMap[currentComponent]" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TestUndo from '@/components/TestUndo.vue'
import TestIterator from '@/components/TestIterator.vue'
import TestWaterfall from '@/components/TestWaterfall.vue'
import TestPosition from '@/components/TestUndo.vue'
import TestLineBreak from '@/components/TestLineBreak.vue'
import TestOnceReload from '@/components/TestOnceReload.vue'

type ComponentType = 'undo' | 'iterator'

@Component({
  components: {
    TestUndo,
    TestIterator,
    TestWaterfall,
    TestPosition,
    TestLineBreak,
    TestOnceReload
  },
})
export default class Space extends Vue {
  name = 'Space'

  private componentOptions = ['undo', 'iterator', 'waterfall', 'position', 'line', 'reload'] // component lists
  private currentComponent: any = 'reload' // current component

  // decide which component will display
  private setDisplay(item: ComponentType) {
    this.currentComponent = item
  }

  // dynamic import component
  private componentMap: Record<string, string> = {
    undo: 'TestUndo',
    iterator: 'TestIterator',
    waterfall: 'TestWaterfall',
    position: 'TestPosition',
    line: 'TestLineBreak',
    reload: 'TestOnceReload'
  }
}
</script>

<style lang="less" scoped>
.space {
  height: 100%;
  width: 100%;
  &-option {
    height: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &-item {
      margin: 0 5px;
      cursor: pointer;
    }
  }
  .selected {
    color: #42b983;
  }
}
</style>
