import React, {Component} from 'react';
import {Form, Button} from 'semantic-ui-react';
import HeaderWithBack from '../layout/header-with-go-back';
import './my.css';

class Homepage extends Component {
    constructor() {
        super();

        this.state = {
            step: 1,
            parents_name: 'aa',
            phone: '123'
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
    }

    handlePhoneChange(event) {
        console.log(event.target);
        this.setState({phone: event.target.value});
    }

    handleNameChange(event) {
        console.log(event.target);
        this.setState({parents_name: event.target.value});
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
                        <input type="text"  placeholder='家长姓名' style={{width: '100%'}}
                               value={this.state.parents_name}
                               onChange={this.handleNameChange}
                               name='parents_name' />
                    </div>
                    <div className="phone-number">
                        <Button>中国(+86)</Button>
                        <input type="text" style={{width: '60%'}}
                               value={this.state.phone}
                               onChange={this.handlePhoneChange}
                               name='phone'/>
                    </div>
                    <div className="check-number">
                        <input type="text" style={{width: '60%'}}/>
                        <Button>获取验证码</Button>
                    </div>
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content='继续'
                                    style={{margin: '2em auto', width: '100%', color: 'rgba(0,0,0,.6)', background: '#eee', height: '4em', letterSpacing: '2px', fontWeight: 'normal', borderRadius: '30px'}}/>
                    </Form.Group>
                </Form>
                <br/>
            </div>
        );
    }
}

export default Homepage;