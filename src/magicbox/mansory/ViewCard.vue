<template>
  <div class="viewCard">
    <!-- <div v-desktop class="viewCard-item" @click="$emit('go')">
      <img
        v-if="value.isFree !== '1'"
        class="vipIcon"
        src="@/assets/picture/icon/vip.png">
      <img class="viewCard-item-img" :src="value.imageUrl">
    </div> -->

    <div v-mobile class="viewCard-item" @click="$emit('go', 'mobile')">
      <img
        v-if="value.isFree !== '1'"
        class="vipIcon"
        src="@/assets/picture/icon/vip.png">
      <img class="viewCard-item-img" :src="value.imageUrl">
      <!-- <div class="viewCard-mask-button">
        {{ $t('info.create') }}
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
  }
})
export default class ViewCard extends Vue {
  name = 'ViewCard'

  @Prop(Object)private value!:object // 图片地址
}
</script>

<style lang="less" scoped>
.viewCard {
  position: relative;
  line-height: 1;
  background-color: #fff;
  box-sizing: border-box;
  font-size: 0;
  vertical-align: middle;
  margin-bottom: 10px;
  height: 100%;
  width: 100%;
  text-align: center;
  cursor: pointer;
  &-item {
    vertical-align: middle;
    overflow: hidden;
    &:hover .viewCard-item-img{
      transform: scale(1.1);
    }
    &:hover .viewCard-mask-button{
      opacity: 1;
    }
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 1;
    }
    * {
      width: 100%;
    }
    .vipIcon {
      position: absolute;
      width:36px;
      height:23px;
      right: 10px;
      top: 10px;
      z-index: 1;
    }
    &-img {
      transition: .3s;
    }
  }
  &-mask-button {
    width: 111px;
    height: 33px;
    background: linear-gradient(270deg, #00FFCC 0%, #0F81FF 100%);
    .medium-500(13px, #fff);
    line-height: 33px !important;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: .3s;
  }
}
</style>
