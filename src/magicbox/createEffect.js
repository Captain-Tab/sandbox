import request from '@/utils/request'
import { v4 as uuidv4 } from 'uuid'

/**
 * 开始制作&返回制作状态ID
 * @param id
 * @param imgUrl
 * @param effectsList
 * @param price
 * @return {Promise}
 */
export function getEffectTaskId (id, imgUrl, effectsList, price) {
  return request({
    method: 'POST',
    url: '/v2/tasks/create/effects',
    data: {
      coinPrice: price,
      topicId: id,
      data: [{
        srcId: '',
        url: imgUrl, // 图片的oss地址
        type: 'image',
        fileHash: `${uuidv4()}`, // 目前暂时不需要hash, 只要保证照片唯一即可
        effectsList,
        isCombination: 'false',
        isClientEdit: 'false',
        faceCognition: 'false'
      }]
    }
  })
}

/**
 * 特效任务查询结果
 * @param id
 * @return
 */
export function pollCheck (id) {
  return request({
    url: `/v2/tasks/create/effects/${id}`
  })
}

/**
 * 创建新版特效
 * @param {String} topicId 请求模板ID
 * @param {String} imgUrl oss图片地址
 */
export class CreateEffect {
  constructor (topicItem, imgUrl, price) {
    this.topicItem = topicItem
    this.imgUrl = imgUrl
    this.price = price
    return this
  }

  /** 获取effectsList参数 */
  getEffectsListInfo (typeList, effectsList) {
    return typeList.map((item, index) => {
      return {
        type: item,
        effectsId: effectsList[index],
        isCombination: false,
        isClientEdit: false,
        faceCognition: false
      }
    })
  }

  /**
   * 开始制作特效
   */
  async create () {
    const effectsList = this.getEffectsListInfo(this.topicItem.effectsList, this.topicItem.materialIdList)
    // 开始制作
    const { data, code } = await getEffectTaskId(this.topicItem.id, this.imgUrl, effectsList, this.price)
    if (code === 0) {
      throw new Error('创建特效任务失败')
    }
    return data.taskId
  }

  /**
   * 查询制作结果
   */
  async listen () {
    let result
    const taskId = await this.create()

    const check = ({ code, data } = {}) => {
      if (code !== 0 || data.status === 2) {
        return false
      }
      if (code === 0 && data.status === 1) {
        return data.videoId
      }
      return false
    }

    for (let data, i = 10; (data = await pollCheck(taskId)) && !(result = check(data)) && i; i--) {
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
    return result
  }
}

export default CreateEffect
