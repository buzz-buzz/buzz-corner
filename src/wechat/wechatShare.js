import _ from 'lodash'
import wx from 'wechat-js-sdk'
import ServiceProxy from '../service-proxy'

export default class WechatShare {
    constructor() {
        this.status = 'loading';
    }

    static async init(shareData) {
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

                wx.onMenuShareTimeline(shareData);

                wx.onMenuShareAppMessage(shareData);
            })
        });

        wx.error(err => {
            //alert('与微信 SDK 连接出现问题：' + JSON.stringify(err));
            throw err
        });

        return valid;
    }


}
