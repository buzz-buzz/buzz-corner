import _ from 'lodash'
import wx from 'wechat-js-sdk'
import ServiceProxy from '../service-proxy'

export const WechatAudioStatus = {
    notStarted: 'not started',
    startingRecording: 'starting recording',
    stoppingRecording: 'stopping recording',
    uploadingRecording: 'uploading recording',
    uploadingToQiniu: 'uploading to qiniu',
    doneRecording: 'done recording',
    playingSound: 'playing sound',
    stoppingSound: 'stopping sound'
};

export default class WechatAudio {
    status = WechatAudioStatus.notStarted

    constructor() {
        this.status = WechatAudioStatus.notStarted;
        this.localId = null;
    }

    static async init() {
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
                uri: '{config.endPoints.buzzService}/api/v1/wechat/js-config',
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

        wx.error(err => {
            //alert('与微信 SDK 连接出现问题：' + JSON.stringify(err))
            throw err
        })
        return valid;
    }


    async stopRecording() {
        this.status = WechatAudioStatus.stoppingRecording;
        return new Promise((resolve, reject) => {
            wx.stopRecord({
                success: res => {
                    this.localId = res.localId;
                    resolve(res.localId);
                },
                fail: reject
            })
        })
    }


    async startRecording(timeoutCallback) {
        this.status = WechatAudioStatus.startingRecording;
        wx.startRecord();
        // await new Promise((resolve, reject) => setTimeout(resolve, 59 * 1000))
        // if (timeoutCallback) {
        //     timeoutCallback();
        // } else {
        //     alert('weChat --- timeout -- stop');
        //     await this.stopRecording()
        // }
    }


    async upload() {
        this.status = WechatAudioStatus.uploadingRecording;
        return new Promise((resolve, reject) => {
            wx.uploadVoice({
                localId: this.localId,
                isShowProgressTips: true,
                success: res => {
                    this.serverId = res.serverId;
                    resolve(res.serverId)
                },
                fail: reject
            })
        })
    }


    async getQiniuLink() {
        this.status = WechatAudioStatus.uploadingToQiniu;
        const {url} = await ServiceProxy.proxyTo({
            body: {
                uri: '{config.endPoints.buzzService}/api/v1/wechat/media',
                method: 'POST',
                json: {
                    serverId: this.serverId
                }
            }
        })

        this.status = WechatAudioStatus.doneRecording;
        return url
    }

    async stopRecordingWithQiniuLink() {
        await this.stopRecording();
        await this.upload()
        return await this.getQiniuLink()
    }

    play() {
        if (this.localId) {
            console.log('playing');
            this.status = WechatAudioStatus.playingSound;
            wx.playVoice({localId: this.localId})
            console.log('played');
        } else {
            throw new Error('还没有可播放的声音');
        }
    }

    stop() {
        if (this.localId) {
            this.status = WechatAudioStatus.stoppingSound;
            wx.stopVoice({localId: this.localId});
        }
    }
}
