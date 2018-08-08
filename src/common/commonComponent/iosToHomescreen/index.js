import React from 'react';
import {Link} from 'react-router';
import './addtohomescreen.js';
import './addtohomescreen.css';

export default class IosToHomeScreen extends React.Component {
    constructor(){
        super();

        this.toHomeScreen = this.toHomeScreen.bind(this);
    }

    async toHomeScreen() {
        try{
            if (!!window.addToHomescreen) {
                window.addToHomescreen({
                    startDelay: 0,
                    skipFirstVisit: false,
                    maxDisplayCount: 20
                });
            } else {
                alert('添加失败');
            }
        }
        catch(ex){
            alert('添加失败:'+ ex);
        }
    }

    render() {
        return !!window.addToHomescreen ?
            <Link  onClick={this.toHomeScreen}>
                <div className="icon">
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_account_user.svg" alt=""/>
                    <div className="name">
                        固定到主屏幕
                    </div>
                </div>
                <div className="link">
                    <div className="class-numbers">点击固定</div>
                    <div className="right-icon">
                        <i className="icon-icon_back_down"/>
                    </div>
                </div>
            </Link> : ''
    }
}