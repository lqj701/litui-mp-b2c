export default function (result = {}, repeat = {}) {
  if (typeof result === 'object' && typeof repeat === 'object') {
    Object.keys(repeat).forEach((repeatKey) => {
      const key = repeatKey // 需要重复的key
      const count = repeat[key] // 重复的次数

      if (Array.isArray(result.data[key])) {
        // 如果要重复的是数组
        result.data[key] = Array(count).fill(result.data[key][0], 0, count)
      } else {
        // 如果要重复的是对象（非数组）
        for (let i = 0; i < count; i++) {
          Object.assign({}, result, result.data[key])
        }
      }
    })
    return result
  } else {
    console.log('输入内容错误')
  }
}