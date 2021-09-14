<template>
  <vue-waterfall-easy
    :imgs-arr="imgsArr"
    @scrollReachBottom="getData"
    @imgErro="testhere"
    :reach-bottom-distance="300"
    :img-width="200">
    <div class="img-info" slot-scope="props">
      <p class="some-info">
        picture index: {{ props.index }}
      </p>
      <p class="some-info">
        {{ props.value.info }}
      </p>
    </div>
  </vue-waterfall-easy>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
// @ts-ignore
import vueWaterfallEasy from 'vue-waterfall-easy'

@Component({
  components: {
    vueWaterfallEasy
  },
})
export default class TestWaterfall1 extends Vue {
  name = 'TestWaterfall1'

  private imgsArr = [
    {src: 'https://www.tsc.com'},
    {src: 'https://www.tsc.com'},
    {src: 'https://www.tsc.com'}
  ]

  private testhere () {
    console.log('图片加载失败')
  }

  private mounted () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this
    window.addEventListener('scroll', function () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop + window.innerHeight >= document.body.scrollHeight - 20) {
        console.log(scrollTop + window.innerHeight, document.body.scrollHeight)
        console.log('chufle')
        _that.getData()
      }
    })
  }

  private getData() {
    console.log('chufale')
    const arr = []
    for(let i = 0; i < 5; i++) {
      // const randomHeight = Math.floor(Math.random() * (300 - 100) + 100)
      // const randomWidth = Math.floor(Math.random() * (300 - 200) + 200)
      arr.push({
        src: 'https://www.tsc.com'
      })
    }
    this.imgsArr = this.imgsArr.concat(arr)
    console.log('x', this.imgsArr)
  }
}
</script>

<style lang="less" scoped>
.test {
  height: 100%;
}
</style>
