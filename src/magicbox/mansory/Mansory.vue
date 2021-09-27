<template>
  <van-list
    v-model="loadingStatus"
    :finished="finished"
    class="masonry"
    finished-text="没有更多内容了~~"
    offset="20"
    @load="onLoad">
    <waterfall
      ref="waterfall"
      :align="align"
      :line-gap="200"
      line="v"
      :min-line-gap="100"
      :max-line-gap="220"
      :single-max-width="300"
      :interval="1000"
      :watch="topicList"
      @reflowed="reflowed">
      <!-- 瀑布流子组件 -->
      <waterfall-slot
        v-for="(item, index) in topicList"
        :key="item.index"
        :width="(+item.metadata_width)"
        :height="(+item.metadata_height)"
        :order="index">
        <div class="waterfallItem">
          <!-- 用class类名标记列表项 -->
          <div
            :class="['waterfallItem-box', index ? `${index}` : '']"
            @click="toDetail(item.id)">
            <img v-if="item.isFree !== '1'" class="vipIcon" src="@/assets/picture/icon/vip.png">
            <div v-if="item.loaded === '0'" class="background" />
            <img v-if="item.loaded !== '2'" ref="cover" :src="item.imageUrl" class="cover">
            <div v-if="item.loaded === '2'" class="broken">
              <div class="broken-box">
                <img src="@/assets/picture/error/brokenImg.png" alt="broken" :x-index="1">
                <p>图片加载失败</p>
              </div>
            </div>
          </div>
        </div>
      </waterfall-slot>
    </waterfall>
  </van-list>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Waterfall from '~/components/common/waterfall/index.vue'
import WaterfallSlot from '~/components/common/waterfall/WaterfallSlot.vue'
// import { getTopicListByTag } from '~/api'
// import { ITopicItem, ITopicList } from '~/types/topic'
// const Imagesloaded = process.client ? require('imagesloaded') : null

@Component({

  components: {
    Waterfall,
    WaterfallSlot
  }
})
export default class Masonry extends Vue {
  name = 'Masonry'

  @Prop(String) id!: string //

  private align = 'center'
  private page = 0 // 分页页码
  private topicList: ITopicItem[] = [] // 模板列表
  private pagesize = 20 // 每页列表数量
  private loadingStatus= false // 列表加载状态
  private finished = false

  // 初始化参数
  private init () {
    this.page = 0
    this.topicList = []
    this.finished = false
  }

  // 获取数据
  private onLoad () {
    if (!this.id) { return }
    this.getTopicList()
  }

  // 发送请求获取列表数据
  private async getTopicList () {
    if (this.finished) { return }
    this.page += 1
    const { data: { list } } = await getTopicListByTag<ITopicList>(this.id, {
      page: this.page,
      pagesize: this.pagesize
    })
    // 复制数据源，并插入loaded属性
    const newList: ITopicItem[] = list.map((item: ITopicItem) => { return { ...item, loaded: '0' } })
    // 数组去重
    this.topicList = Array.from(new Set(this.topicList.concat(newList)))
    // 返回列表为空，则表示完成列表加载
    if (!list.length) {
      this.finished = true
      return
    }
    // 判断是否为最后一页
    if (list.length < 20) {
      this.finished = true
    }
    this.loadingStatus = false
  }

  // 延迟执行
  private delay (func: Function, delayTime: Number | any): void {
    setTimeout(() => { func() }, delayTime)
  }

  // 监听图片加载状态，更新ui显示状态
  private listenImgLoad (): void {
    const img = this.$refs.cover as any
    const instance = new Imagesloaded(img)
    const _that = this
    instance.on('always', function () {
      for (let i = 0, len = instance.images.length; i < len; i++) {
        const image = instance.images[i]
        image.isLoaded ? _that.topicList[i].loaded = '1' : _that.topicList[i].loaded = '2'
      }
    })
  }

  // 一旦触发瀑布流组件的重排事件， 开始监听图片加载情况
  private reflowed (): void {
    this.delay(this.listenImgLoad, 1000)
  }

  // 进入详情页
  private toDetail (id: number) {
    this.$router.push({ path: `/detail/${id}` })
  }

  // 监听传入的分类id, 获取数据
  @Watch('id', { immediate: true })
  private idChange (val: string) {
    if (!val) { return }
    this.init()
    this.onLoad()
  }
}
</script>

<style lang="less" scoped>
.test {
  height: 100%;
}
/deep/ .waterfallItem {
  //border: 1px solid green;
  width: 100%;
  height: 100%;
  padding: 2%;
  &-box {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    position: relative;
    overflow: hidden;
    .vipIcon {
      position: absolute;
      width:36px;
      height:23px;
      right: 10px;
      top: 10px;
      z-index: 1;
    }
    img {
      object-fit: cover;
      height: 99%;
      width: 99%;
      border-radius: 2px;
    }
    .background {
      position: absolute;
      width: 100%;
      height: 100%;
      top: -1px;
      left: -1px;
      border-radius: 2px;
      background: #202021;
    }
    .broken {
      border-radius: 2px;
      background: #202021;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      &-box {
        text-align: center;
        img {
          width: 45px;
          height: 40px;
        }
        p {
          .regular-400(15px, #FFFFFF);
          margin-top: 10px;
          color: #656566;
          line-height: 29px;
        }
      }
    }
  }

}
.item-move {
  transition: all .5s cubic-bezier(.55,0,.1,1);
  -webkit-transition: all .5s cubic-bezier(.55,0,.1,1);
}
</style>
