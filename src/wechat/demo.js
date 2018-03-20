import React from 'react'
import {Button, Container, Segment} from "semantic-ui-react"
import wx from 'wechat-js-sdk'
import _ from 'lodash'
import ServiceProxy from '../service-proxy'

export default class WechatDemo extends React.Component {
  constructor() {
    super()
    this.start = this.start.bind(this)
    this.stopUploadUpdate = this.stopUploadUpdate.bind(this)
    this.stop = this.stop.bind(this)
    this.upload = this.upload.bind(this)
    this.update = this.update.bind(this)
    this.playVoice = this.playVoice.bind(this)
    this.stopVoice = this.stopVoice.bind(this)
    this.state = {
      isShowProgressTips: 1,
      localId: '',
      serverId: ''
    }
  }

  async componentDidMount() {
    try {
      if (!/MicroMessenger/.test(navigator.userAgent))
        return alert('非微信环境')
      const json = {
        debug: false,
        jsApiList: [
          'startRecord',
          'stopRecord',
          'playVoice',
          'pauseVoice',
          'stopVoice',
          'uploadVoice',
          'downloadVoice'
        ],
        url: window.location.href.split('#')[0]
      }
      const {jsConfig} = await ServiceProxy.proxyTo({
        body: {
          uri: '{config.endPoints.buzzService}/api/v1/users/getWechatJsConfig',
          method: 'POST',
          json
        }
      })
      wx.config(jsConfig)
      const valid = await new Promise((resolve, reject) => {
        wx.ready(() => {
          wx.checkJsApi({
            jsApiList: jsConfig.jsApiList,
            success: res => {
              const checkResult = _.chain(res).get('checkResult').thru(
                i => _.isString(i)
                ? JSON.parse(i)
                : i).value()
              const valid = _.every(checkResult, i => i === true)
              valid
                ? resolve(valid)
                : reject(res)
            },
            fail: res => {
              reject(res)
            }
          })
        })
      })
      wx.error(res => {
        throw res
      })
      if (!valid)
        return alert('接口不支持')
    } catch (e) {
      console.error('checkJsApi', e)
      alert('微信JS-SDK错误')
    }
  }

  async start() {
    wx.startRecord()
    // 超时自动结束
    await new Promise(resolve => setTimeout(resolve, 2 * 1000))
    alert('超时自动结束')
    await this.stopUploadUpdate()
  }
  async stop() {
    return new Promise((resolve, reject) => {
      wx.stopRecord({
        success: res => {
          const localId = res.localId
          this.setState({localId})
          resolve(localId)
        },
        fail: res => {
          reject(res)
        }
      })
    })
  }
  async upload({localId}) {
    return new Promise((resolve, reject) => {
      wx.uploadVoice({
        localId,
        isShowProgressTips: this.state.isShowProgressTips,
        success: res => {
          resolve(res.serverId)
        },
        fail: res => {
          reject(res)
        }
      })
    })
  }
  async update({serverId}) {
    const {url} = await ServiceProxy.proxyTo({
      body: {
        uri: '{config.endPoints.buzzService}/api/v1/users/wechatMedia',
        method: 'POST',
        json: {
          serverId
        }
      }
    })
    return url
  }
  async stopUploadUpdate() {
    const url = await this.update({
      serverId: await this.upload({localId: await this.stop()})
    })
    // await new Promise(resolve => setTimeout(resolve, 2 * 1000))
    if (window.confirm('跳转外链: ' + url) === true) {
      window.location.href = url
    }
  }

  playVoice() {
    wx.playVoice({localId: this.state.localId})
  }

  stopVoice() {
    wx.stopVoice({localId: this.state.localId})
  }

  render() {
    return (<Container textAlign="center">
      <Segment>
        微信 demo
      </Segment>
      <Button onClick={this.start}>开始录音</Button>
      <Button onClick={this.stopUploadUpdate}>结束录音</Button>
      <Button onClick={this.playVoice}>播放录音</Button>
      <Button onClick={this.stopVoice}>结束录音</Button>
    </Container>)
  }
}
