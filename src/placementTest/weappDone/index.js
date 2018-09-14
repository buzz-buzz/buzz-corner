import React from 'react';
import './index.css';

export default class WeappDone extends React.Component{
    render(){
        return (
            <div className="weapp-done">
                <div className="placement-img">
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/placement/icon_Language_profile.svg" alt=""/>
                </div>
                <div className="placement-word">
                    非常感谢完成了语言档案的建立
                </div>
                <div className="placement-good">
                    你可以免费领取最新一期的由外籍语伴领读的BuzzBuzz线上阅读俱乐部资格
                </div>
                <div className="placement-qr-code">
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/qr-code.svg" alt=""/>
                </div>
            </div>
        )
    }
}