<template>
  <div class="position">
    <div class="position-left">
      1
      <div class="sub">
        1.2
      </div>
    </div>
    <div class="position-right">
      2
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TestPosition extends Vue {
  name = 'TestUndo'
}
</script>

<style lang="less" scoped>
.position {
  display: flex;
  height: 100%;
  width: 100%;
  &-left {
    width: 50%;
    background-color: purple;
    position: relative;
    .sub{
      position: absolute;
      right: -20px;
      width: 100px;
      height: 100px;
      background-color: green;
    }
  }
  &-right {
    width: 50%;
    background-color: orange;
    //position: relative;
  }
}
</style>
