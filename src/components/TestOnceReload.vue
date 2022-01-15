<template>
  <div class="test">
    <h1>hello test</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import cacheCenter from '@/utils/cacheCenter'

@Component
export default class testOnceReload extends Vue {
  private mounted() {
    // method 1
    // const reload = cacheCenter.read('reload') === 'true'
    // const action = cacheCenter.read('reloadAction') === 'true'
    // if(reload) {
    //   cacheCenter.remove('reload')
    //   return
    // }
    // if(action) {
    //   cacheCenter.add('reload', 'true')
    //   cacheCenter.remove('reloadAction')
    //   location.reload()
    // }

    // method 2
    const reload = cacheCenter.read('reload') === 'true'
    reload && location.reload()



  }
}
</script>

<style lang="less" scoped>
.test {
  background: #42b983;
}
</style>
