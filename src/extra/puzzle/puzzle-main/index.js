import randomImage from '../static/images'

const position = [
  { x: 0, y: 0 },
  { x: 230, y: 0 },
  { x: 460, y: 0 },
  { x: 0, y: 350 },
  { x: 230, y: 350 },
  { x: 460, y: 350 },
  { x: 0, y: 700 },
  { x: 230, y: 700 },
  { x: 460, y: 700 },
]
let curImageIndex = null
let preImageIndex = null

Component({

  properties: {
    status: {
      type: String,
      value: 'init',
      observer(newVal) {
        switch (newVal) {
          case 'init':
            this.setData({
              images: randomImage()
            })
            this.randomImages()
            this.init()
            break
          default:
            break
        }
      }
    },
    score: {
      type: String
    }
  },

  data: {
    status: 'init',
    images: randomImage()
  },

  methods: {

    randomImages() {
      const random = [];
      const oldImages = this.data.images
      this.data.images.forEach((item, index) => {
        item.originX = position[index].x
        item.originY = position[index].y
      })
      for (let i = 0, len = oldImages.length; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * oldImages.length);
        random[i] = oldImages[randomIndex]
        oldImages.splice(randomIndex, 1);
      }
      this.setData({
        images: random
      })
    },

    init() {
      this.data.images.forEach((item, index) => {
        item.x = position[index].x
        item.y = position[index].y
      })
      this.setData({
        images: this.data.images
      })
    },

    check() {
      console.log(3333333333)
      console.log(this.data.images)
      const checkPosition = this.data.images.every(value => value.x === value.originX && value.y === value.originY)
      if (checkPosition) {
        this.triggerEvent('finished')
      }
    },

    onImageClick(e) {
      const seletedImageIndex = e.currentTarget.dataset.index
      const images = this.data.images

      if (curImageIndex === null) {
        curImageIndex = seletedImageIndex
        this.setData({
          [`images[${seletedImageIndex}].extraClass`]: 'selected'
        })
      } else if (curImageIndex !== seletedImageIndex) {
        preImageIndex = curImageIndex
        curImageIndex = seletedImageIndex
        this.setData({
          [`images[${curImageIndex}].x`]: images[preImageIndex].x,
          [`images[${curImageIndex}].y`]: images[preImageIndex].y,
          [`images[${preImageIndex}].x`]: images[curImageIndex].x,
          [`images[${preImageIndex}].y`]: images[curImageIndex].y,
          [`images[${preImageIndex}].extraClass`]: ''
        })
        preImageIndex = null
        curImageIndex = null
        this.check()
      } else {
        this.setData({
          [`images[${seletedImageIndex}].extraClass`]: ''
        })
        curImageIndex = null
      }
    },
  },

  attached() {
    this.randomImages()
    this.init()
  },

})