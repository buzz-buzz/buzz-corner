import React, {Component} from 'react';
import LoadingModal from '../../common/commonComponent/loadingModal';
import MessageModal from '../../common/commonComponent/modalMessage';
import ButtonBottom from '../../common/commonComponent/submitButtonRadius10Px';
import PhoneNumber from '../../my/phone-number';
import '../login-tablet.css';
import TabletHeader from '../../layout/tabletHeader';
import TabletFooter from '../../layout/tabletFooter';

export default class LoginTablet extends Component {
    render() {
        return (
            <div className="login-in-tablet" style={{height: '100%'}}>
                <TabletHeader/>
                <LoadingModal loadingModal={this.props.loadingModal}/>
                <MessageModal modalName={this.props.messageName}
                              modalContent={this.props.messageContent}
                              modalShow={this.props.messageModal}
                              style={{top: '0'}}
                />
                <div className="login-intro">
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/login_picture.png" alt=""/>
                    <div className="intro-content">
                        <div className="title">BUZZBUZZ</div>
                        <div className="content">
                            <p>结识英语学伴，对话英美少年！</p>
                            <p>开启你的国际交流旅程。</p>
                        </div>
                    </div>
                </div>
                <div className="login-tab">
                    <div className="tab-container" style={{
                        color: '#ffb117',
                        lineHeight: '100px'
                    }}>
                        绑定手机号
                    </div>
                    <div className="login-form">
                        <PhoneNumber profile={this.props.profile} handleChange={this.props.handleChange}
                                     code={this.props.code} handleCodeChange={this.props.handleCodeChange}
                                     waitSec={this.props.waitSec} mobileValid={this.props.mobileValid}
                                     sms={this.props.sms} send={this.props.send}
                                     mobileCountry={this.props.mobileCountry}
                                     onCountryCodeChange={this.props.onCountryCodeChange}
                                     dropDownStyle={{
                                         width: '100px',
                                         marginRight: '5px',
                                         minWidth: '120px',
                                         whiteSpace: 'nowrap',
                                         display: 'flex',
                                         paddingLeft: '15px',
                                         alignItems: 'center'
                                     }}/>

                        <div className="btn">
                            <ButtonBottom
                                disabled={this.props.disabled}
                                text='绑定'
                                submit={this.props.submit}/>
                        </div>
                        <div className="toggle-login">
                            <div className="line"></div>
                            <div className="toggle-word" style={{textDecoration: 'none'}}>BuzzBuzz虚拟英语角</div>
                            <div className="line"></div>
                        </div>
                    </div>
                </div>
                <TabletFooter/>
            </div>
        );
    }
}