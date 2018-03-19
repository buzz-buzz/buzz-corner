import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import './index.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class ModalWelcome extends Component {
    constructor() {
        super();

        let welcome = false;

        if (cookies.get('welcomeModalShowed')) {
            welcome = true;
        }

        this.state = {
            welcome: welcome
        };

        this.closeWelcome = this.closeWelcome.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    signUp() {
        this.setCookie("welcomeModalShowed", true);

        browserHistory.push('/consult');
    }

    closeWelcome() {
        this.setCookie("welcomeModalShowed", true);

        this.setState({
            welcome: true
        });
    }

    setCookie(name, value, days = 300) {
        let exp = new Date();

        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        cookies.set(name, encodeURIComponent(value), {
            path: '/',
            expires: exp
        })
    }

    render() {
        return (
            <div className="modal" style={this.state.welcome ? {display: 'none'} : {display: 'flex'}}>
                <div className="content">
                    <div>
                        <div className="welcome-title">
                            <p>欢迎加入</p>
                            <p>BuzzBuzz虚拟英语角</p>
                        </div>
                        <div className="welcome-info">
                            <p>轻松提高英语听说</p>
                            <p>结识外籍伙伴</p>
                        </div>
                        <div className="begin">
                            <div onClick={this.signUp}>
                                <p>开始预定课程</p>
                            </div>
                        </div>
                        <div className="skip" onClick={this.closeWelcome}>
                            跳过, 稍后完成
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalWelcome;