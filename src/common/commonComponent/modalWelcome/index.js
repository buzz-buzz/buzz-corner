import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import Resources from '../../../resources';
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
            <div className="modal" style={this.state.welcome ? {display: 'none'} : {display: 'flex'}} onClick={this.closeWelcome}>
                <div className="content">
                    <div>
                        <div className="welcome-title">
                            <p>{Resources.getInstance().welcomePageTitle1}</p>
                            <p>{Resources.getInstance().welcomePageTitle2}</p>
                        </div>
                        {
                            window.navigator.language === 'zh-CN' ?
                                (
                                    <div className="welcome-info">
                                        <p>{Resources.getInstance().welcomePageWord1}</p>
                                        <p>{Resources.getInstance().welcomePageWord2}</p>
                                </div>
                                ):
                                (
                                    <div className="welcome-info">
                                        <p>{Resources.getInstance().welcomePageWord1 + Resources.getInstance().welcomePageWord2}</p>
                                    </div>
                                )
                        }
                        <div className="begin">
                            <div onClick={this.signUp}>
                                <p>{Resources.getInstance().welcomePageBooking}</p>
                            </div>
                        </div>
                        {/*<div className="skip" onClick={this.closeWelcome}>*/}
                            {/*<p>{Resources.getInstance().welcomePageSkip}</p>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalWelcome;