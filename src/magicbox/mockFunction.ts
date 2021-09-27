const NAME_LIST = [
  '王',
  '张',
  '李',
  '刘',
  '陈',
  '黎'
]



// 获取随机姓
const randomLastName = () => {
  const index = Math.floor(Math.random() * NAME_LIST.length)
  return NAME_LIST[index]
}

// 获取随机的中间字符
const randomHiddenText = () => {
  const times = Math.round(Math.random() * (3 - 2) + 2)
  return 'X'.repeat(times)
}

// 获取随机的尾部字符
const randomEndText = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const firstCharacter = chars[Math.floor(Math.random() * chars.length)]
  const secondCharacter = chars[Math.floor(Math.random() * chars.length)]
  return firstCharacter + secondCharacter
}

// 获取随机邀请数量和已提现金额
const randomNumber = () => {
  // 获得随机邀请数量
  const number = Math.floor(Math.random() * (31 - 5) + 5)
  // 获得随机的价格区间，5-8之间
  const randomPrice = Math.random() * (8 - 5) + 5
  // 获得随机的小数位，为0.36或者00
  const randomDecimal = Math.round(Math.random() * (2 - 1) + 1) === 1 ? '.36' : '.00'
  // 转化为10的整数
  const randomInteger = Math.floor(number * randomPrice).toString().split('')
  randomInteger[randomInteger.length - 1] = '0'
  const amount = randomInteger.join('') + randomDecimal
  return {
    number,
    amount
  }
}

// 产生随机的假数据
export const randomGenerator = (listNumber: number) => {
  const mockDataList: {name: string; number: number; amount: any}[] = []
  for (let i = 0; i < listNumber; i++) {
    const name = randomLastName() + randomHiddenText() + randomEndText()
    const { number, amount } = randomNumber()
    mockDataList.push({ name, number, amount })
  }
  return mockDataList
}
