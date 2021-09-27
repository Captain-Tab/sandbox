<template>
  <van-list
    v-model="loadingStatus"
    :finished="finished"
    class="masonry"
    finished-text="没有更多内容了~~"
    offset="20"
    @load="onLoad">
    <no-ssr>
      <slot name="title" />
      <div
        v-masonry
        transition-duration="0.3s"
        item-selector=".item"
        class="masonry-container"
        :origin-top="true">
        <div
          v-for="(item, index) in topicList"
          :key="index"
          v-masonry-tile
          class="item">
          <view-card
            class="view-container-box"
            :value="item"
            @go="goDetail(item, arguments)" />
        </div>
      </div>

      <!-- PC端预览弹窗 -->
      <preview-model
        ref="preview"
        :amount="topicDetail.price"
        :url="topicDetail.videoUrl"
        :height="topicDetail.metadata_height"
        :width="topicDetail.width"
        :image-ratio="topicDetail.imageRatio"
        @go="toCreate" />
    </no-ssr>
  </van-list>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import PreviewModel from '@/components/views/home/PreviewModel.vue'
import ViewCard from './ViewCard.vue'

export default {
  name: 'Masonry',
  components: {
    'no-ssr': NoSSR,
    ViewCard,
    PreviewModel
  },
  props: {
    // 模板id
    id: {
      type: String,
      default: ''
    },
    // 模板名称
    name: {
      type: String,
      default: ''
    },
    // 类型
    type: {
      type: String,
      default: ''
    },
    // 设置列数
    columns: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      page: 0, // 分页页码
      topicList: [], // 模板列表
      showButton: false, // 是否显示
      topicDetail: {}, // 模板详情
      pagesize: 20, // 每页列表数量
      loadingStatus: false, // 列表加载状态
      finished: false // 列表完成全部加载
    }
  },
  computed: {
  },
  // 监听分类id, 获取模板列表
  watch: {
    id: {
      immediate: true,
      handler (newVal) {
        if (!newVal) { return }
        this.init()
        this.onLoad()
      }
    }
  },
  // 页面尺寸发生变化，重新计算瀑布流排列
  mounted () {
    if (typeof this.$redrawVueMasonry === 'function') {
      this.$redrawVueMasonry()
    }
  },
  methods: {
    // 初始化参数
    init () {
      this.page = 0
      this.topicList = []
      this.finished = false
    },
    // 获取列表参数
    onLoad () {
      if (!this.id) { return }
      this.getTopicList(this.id)
    },
    // 进入模板详情
    goDetail (item) {
      if (arguments[1][0]) {
        this.$router.push({ path: `/detail/${item.id}` })
      } else {
        this.topicDetail = item
        this.$refs.preview.open()
      }
    },
    // 预览弹窗去制作按钮
    toCreate () {
      this.$router.push({ path: `/detail/${this.topicDetail.id}` })
    },
    // 结束加载
    endLoad () {
      this.finished = true
    },
    // 获取分类下的模板列表
    async getTopicList (id) {
      if (this.finished) { return }
      this.page += 1
      const { data } = await this.$axios.get(`/topics/tag/${id}`, {
        params: {
          page: this.page,
          pagesize: this.pagesize
        }
      })
      // 返回列表为空，则表示完成列表加载
      if (!data.list.length) {
        this.endLoad()
        return
      }
      this.topicList = Array.from(new Set(this.topicList.concat(data.list)))
      // 判断是否为最后一页
      if (data.list.length < 20) {
        this.endLoad()
      }
      this.loadingStatus = false
    },
    // 加载模板
    loadMore () {
      this.getTopicList(this.id)
    }
  }
}
</script>

<style lang="less" scoped>
.masonry {
  padding-bottom: 20px;
  &-container {
    height: auto;
    width: 100%;
    margin-bottom: 10px;
    .item {
      padding: 0 5px;
      width: 20%;
      img {
        width: 100%;
        max-height: 300px;
      }
    }
  }
  &-bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
  }
}

/** 适配移动端 */
@media @mobile {
  .masonry {
    &-container {
      .item {
        width: 50%;
      }
    }
    &-bottom {
      &-button {
        width: 87px;
        height: 34px;
        background: #2C2C30;
        .medium-500(14px, #666666);
        line-height: 34px;
      }
    }
  }
}
.waterfall {
  display: flex;
  &-list {
    &:first-child {
      margin-right: 5px;
    }
    flex: 1;
  }
  &-item {
    // margin-bottom: 5px;
    img {
      width: 100%;
    }
  }
}
</style>
