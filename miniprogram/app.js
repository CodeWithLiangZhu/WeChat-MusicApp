//app.js

import regeneratorRuntime from '../../utils/runtime.js'

App({
  onLaunch: function(options) {
    console.log('onLaunch 执行')
    console.log(options)
    this.checkUpate()

    //生命周期函数
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      //检查是否支持云开发，检查基础库版本
    } else {
      wx.cloud.init({
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        env: 'artemis-zl',
        traceUser: true, //记录访问用户（倒序）
      })
    }
    this.getOpenid()
    //设置全局属性与方法
    this.globalData = {
      playingMusicId: -1,
      openid: -1,
    }
  },
  onShow(options) {
    console.log('onShow 执行')
    console.log(options)
  },

  setPlayMusicId(musicId) {
    this.globalData.playingMusicId = musicId
  },

  getPlayMusicId() {
    return this.globalData.playingMusicId
  },

  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then((res) => {
      const openid = res.result.openid
      this.globalData.openid = openid
      if (wx.getStorageSync(openid) == '') {
        wx.setStorageSync(openid, [])
      }
    })
  },

  checkUpate() {
    const updateManager = wx.getUpdateManager()
    // 检测版本更新
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
  },


})