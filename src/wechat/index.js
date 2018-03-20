import _ from 'lodash'
import wx from 'wechat-js-sdk'
import ServiceProxy from '../service-proxy'

export default {
  // 示例
  // const json = {
  //   debug: true,
  //   jsApiList: ['startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice'],
  //   url: window.location.href.split('#')[0],
  // }
  async getJsConfig(json) {
    return await ServiceProxy.proxyTo({
      body: {
        // uri: '{config.endPoints.buzzService}/api/v1/users/getWechatJsConfig',
        uri: 'http://127.0.0.1:16888/api/v1/users/getWechatJsConfig',
        method: 'POST',
        json
      }
    })
  },
  // 示例
  // const json = {
  //   serverId: '1237378768e7q8e7r8qwesafdasdfasdfaxss111',
  // }
  async updateVoice(json) {
    return await ServiceProxy.proxyTo({
      body: {
        // uri: '{config.endPoints.buzzService}/api/v1/users/wechatMedia',
        uri: 'http://127.0.0.1:16888/api/v1/users/wechatMedia',
        method: 'POST',
        json
      }
    })
  },
  // 初始化
  async init(opt) {
    return new Promise(async (resolve, reject) => {
      const {jsConfig} = await this.getJsConfig(opt)
      wx.config(jsConfig)
      wx.ready(() => {
        wx.checkJsApi({
          jsApiList: jsConfig.jsApiList,
          success: res => {
            const valid = _.chain(res).get('checkResult').thru(JSON.parse).every(i => i === true).value()
            valid
              ? resolve(wx)
              : reject(res)
          }
        })
      })
      wx.error(reject)
    })
  },
  // 上传语音
  async uploadVoice(localId, isShowProgressTips) {
    return new Promise((resolve, reject) => {
      wx.uploadVoice({
        localId,
        isShowProgressTips,
        success: res => {
          resolve(res.serverId)
        }
      })
    })
  },
  //  下载语音
  // async downloadVoice(serverId, isShowProgressTips) {
  //   new Promise((resolve, reject) => {
  //     wx.downloadVoice({
  //       serverId,
  //       isShowProgressTips,
  //       success: res => {
  //         resolve(res.localId)
  //       }
  //     })
  //   })
  // },
  // 开始录音
  startRecord(cb) {
    wx.startRecord()
    wx.onVoiceRecordEnd({
      // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      complete: res => {
        cb(res.localId)
      }
    })
  },
  // 主动结束录音, 返回 localId
  async stopRecord() {
    return new Promise((resolve, reject) => {
      wx.stopRecord({
        success: res => {
          resolve(res.localId);
        }
      })
    })
  },
  // 播放语音
  playVoice(localId) {
    wx.playVoice({localId})
  },
  // 停止播放语音
  stopVoice(localId) {
    wx.playVoice({localId})
  }
}
