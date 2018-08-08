import _ from 'lodash'
import wx from 'wechat-js-sdk'
import ServiceProxy from '../service-proxy';
import Track from "../common/track";

export default class WechatShare {
    constructor() {
        this.status = 'loading';
    }

    static async init(shareData) {
        if (/MicroMessenger/.test(navigator.userAgent)) {
            if (!shareData) {
                shareData = {
                    title: 'BuzzBuzzEnglish',
                    desc: '还在想去哪里学英语？聪明的英语学习者都在这里。不出家门,对话世界。用聊天的方式学英语。',
                    link: window.location.href.split('.buzzbuzzenglish.com')[0] + '.buzzbuzzenglish.com',
                    imgUrl: 'https://cdn-corner.resource.buzzbuzzenglish.com/logo-1024px.png',
                    success: function () {
                        Track.event('微信通用分享', '微信分享', {'分享状态': '成功', '分享数据': window.location.href});
                    },
                    cancel: function () {
                        Track.event('微信通用分享', '微信分享', {'分享状态': '取消', '分享数据': window.location.href});
                    }
                };

                const json = {
                    debug: false,
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'],
                    url: window.location.href.split('#')[0]
                };

                const {jsConfig} = await ServiceProxy.proxyTo({
                    body: {
                        uri: '{config.endPoints.buzzService}/api/v1/wechat/js-config',
                        method: 'POST',
                        json
                    }
                });

                wx.config(jsConfig);
                wx.ready(() => {
                    wx.checkJsApi({
                        jsApiList: jsConfig.jsApiList,
                        success: function(){
                            console.log('wechat-share config success');
                            Track.event('微信通用分享初始化成功');
                        },
                        fail: function(){
                            console.log('wechat-share config failed');
                            Track.event('微信通用分享初始化失败');
                        }
                    });
                    wx.onMenuShareAppMessage(shareData);

                    wx.onMenuShareTimeline({
                        title: shareData.desc,
                        link: shareData.link,
                        imgUrl: shareData.imgUrl,
                        success: shareData.success,
                        cancel: shareData.cancel
                    });


                });

                wx.error(err => {
                    console.log('与微信 SDK 连接出现问题：' + JSON.stringify(err));
                    Track.event('与微信 SDK 连接出现问题');
                    //throw err
                });
            }else{
                const json = {
                    debug: false,
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'],
                    url: window.location.href.split('#')[0]
                };

                const {jsConfig} = await ServiceProxy.proxyTo({
                    body: {
                        uri: '{config.endPoints.buzzService}/api/v1/wechat/js-config',
                        method: 'POST',
                        json
                    }
                });

                wx.config(jsConfig);
                const valid = await new Promise((resolve, reject) => {
                    wx.ready(() => {
                        wx.checkJsApi({
                            jsApiList: jsConfig.jsApiList,
                            success: res => {
                                const checkResult = _.chain(res).get('checkResult').thru(
                                    i => _.isString(i)
                                        ? JSON.parse(i)
                                        : i).value();
                                const valid = _.every(checkResult, i => i === true)
                                valid
                                    ? resolve(valid)
                                    : reject(res)
                            },
                            fail: res => {
                                reject(res)
                            }
                        });

                        wx.onMenuShareAppMessage(shareData);

                        wx.onMenuShareTimeline({
                            title: shareData.desc,
                            link: shareData.link,
                            imgUrl: shareData.imgUrl,
                            success: shareData.success,
                            cancel: shareData.cancel
                        });
                    })
                });

                wx.error(err => {
                    console.log('与微信 SDK 连接出现问题：' + JSON.stringify(err));
                    Track.event('与微信 SDK 连接出现问题');
                    //throw err
                });

                return valid;
            }
        }
    }
}
