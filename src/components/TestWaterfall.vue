<template>
  <waterfall
    :align="align"
    :line-gap="200"
    :min-line-gap="100"
    :max-line-gap="220"
    :single-max-width="300"
    :watch="items"
    @reflowed="reflowed"
    ref="waterfall">
    <!-- each component is wrapped by a waterfall slot -->
    <waterfall-slot
      v-for="(item, index) in items"
      :key="item.index"
      :width="item.width"
      :height="item.height"
      :order="index">
      <div class="item-box">
        {{ index }}
      </div>
    </waterfall-slot>
  </waterfall>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Waterfall from '@/components/testWaterfall/Index.vue'
import WaterfallSlot from '@/components/testWaterfall/WaterfallSlot.vue'

@Component({
  components: {
    Waterfall,
    WaterfallSlot,
  },
})
export default class Test extends Vue {
  name = 'Test'

  private align = 'center'

  private items = [
    { width: 207, height: 330 },
    { width: 207, height: 210 },
    { width: 230, height: 170 },
    { width: 120, height: 103 },
  ]

  private addItem () {
    const arr = []
    for(let i = 0; i < 5; i++) {
      const randomHeight = Math.floor(Math.random() * (300 - 100) + 100)
      const randomWidth = Math.floor(Math.random() * (300 - 200) + 200)
      arr.push({
        width: randomWidth as number,
        height: randomHeight as number
      })
    }
    this.items = this.items.concat(arr)
    console.log(this.items)
  }

  private mounted () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this
    window.addEventListener('scroll', function () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop + window.innerHeight >= document.body.scrollHeight - 20) {
        console.log(scrollTop + window.innerHeight, document.body.scrollHeight)
        console.log('chufle')
        _that.addItem()
      }
    })
  }

  private reflowed() {
    console.log('hello')
  }
}
</script>

<style lang="less" scoped>
.test {
  height: 100%;
}
/deep/ .item-box {
  border: 1px solid green;
  width: 100%;
  height: 100%;
  background: white;
}
.item-move {
  transition: all .5s cubic-bezier(.55,0,.1,1);
  -webkit-transition: all .5s cubic-bezier(.55,0,.1,1);
}
</style>
