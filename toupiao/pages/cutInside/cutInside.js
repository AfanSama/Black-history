/**
 * Created by sail on 2017/6/1.
 */
const util = require('../../utils/util.js')
import weCropper from '../../dist/weCropper.js'

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
	data: {
		cropperOpt: {
			id: 'cropper',
			width,
			height,
			scale: 1,
			zoom: 8,
			cut: {
				x: (width - 375) / 2,
				y: (height - 280) / 2,
				width: 375,
				height: 280
			}
		}
	},
	touchStart (e) {
		this.wecropper.touchStart(e)
	},
	touchMove (e) {
		this.wecropper.touchMove(e)
	},
	touchEnd (e) {
		this.wecropper.touchEnd(e)
	},
	getCropperImage () {
		this.wecropper.getCropperImage((src) => {
			if (src) {
				// wx.previewImage({
				// 	current: '', // 当前显示图片的http链接
				// 	urls: [src] // 需要预览的图片http链接列表
				// })

        wx.uploadFile({
          url: util.service + 'File/file', //仅为示例，非真实的接口地址
          filePath: src,
          name: 'file',
          success: function (res) {
              var data = JSON.parse(res.data)
              //do something
              console.log(data.data.key);
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面
              prevPage.setData({
                cover: data.data.key
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 2
                })
              },500)
          },
          fail: err => {
            console.log(err);
          }
        })
			} else {
				console.log('获取图片地址失败，请稍后重试')
			}
		})
	},
	uploadTap () {
		const self = this

		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success (res) {
				const src = res.tempFilePaths[0]
				//  获取裁剪图片资源后，给data添加src属性及其值

				self.wecropper.pushOrign(src)
			}
		})
	},
	onLoad (option) {
		const { cropperOpt } = this.data

		new weCropper(cropperOpt)
			.on('ready', (ctx) => {
				console.log(`wecropper is ready for work!`)
			})
			.on('beforeImageLoad', (ctx) => {
				console.log(`before picture loaded, i can do something`)
				console.log(`current canvas context:`, ctx)
				wx.showToast({
					title: '上传中',
					icon: 'loading',
					duration: 20000
				})
			})
			.on('imageLoad', (ctx) => {
				console.log(`picture loaded`)
				console.log(`current canvas context:`, ctx)
				wx.hideToast()
			})
			.on('beforeDraw', (ctx, instance) => {
				console.log(`before canvas draw,i can do something`)
				console.log(`current canvas context:`, ctx)
			})
			.updateCanvas()
	}
})
