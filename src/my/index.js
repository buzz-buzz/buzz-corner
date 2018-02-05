import React, {Component} from 'react';
import {Link} from 'react-router';
import Resources from '../resources';
import HeaderWithBack from '../layout/header-with-go-back';
import './my.css';

class Homepage extends Component {
    constructor() {
        super();

        this.state = {
            step: 3
        }
    }

    render() {
        return (
            <div className="my-profile">
                <br/>
                <br/>
                <br/>
                <HeaderWithBack/>
                <div className="profile-progress">
                    <div className={this.state.step > 1 ? 'done' : (this.state.step === 1 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>联系方式</p>
                    </div>
                    <div className={this.state.step > 2 ? 'done' : (this.state.step === 2 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>孩子信息</p>
                    </div>
                    <div className={this.state.step > 3 ? 'done' : (this.state.step === 3 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>兴趣爱好</p>
                    </div>
                    <div className={this.state.step > 4 ? 'done' : (this.state.step === 4 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>语言档案</p>
                    </div>
                </div>
                <br/>
            </div>
        );
    }
}

export default Homepage;