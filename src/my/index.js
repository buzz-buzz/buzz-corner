import React, {Component} from 'react';
import {Link} from 'react-router';
import {Form, Button} from 'semantic-ui-react';
import Resources from '../resources';
import HeaderWithBack from '../layout/header-with-go-back';
import './my.css';

class Homepage extends Component {
    constructor() {
        super();

        this.state = {
            step: 1
        }
    }

    render() {
        return (
            <div className="my-profile">
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
                <Form>
                    <h3 className="profile-title">仅用于课程学习相关通知与服务</h3>
                    <div className="parents-name">
                        <input type="text"  placeholder='家长姓名' style={{width: '100%'}}/>
                    </div>
                    <div className="phone-number">
                        <Button>中国(+86)</Button>
                        <input type="text" style={{width: '60%'}}/>
                    </div>
                    <div className="check-number">
                        <input type="text" style={{width: '60%'}}/>
                        <Button>获取验证码</Button>
                    </div>
                </Form>
                <br/>
            </div>
        );
    }
}

export default Homepage;