import React, {Component} from 'react';
import {Form} from 'semantic-ui-react';
import Resources from '../resources';
import moment from 'moment-timezone'
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
import LoadingModal from '../common/commonComponent/loadingModal';
import MessageModal from '../common/commonComponent/modalMessage';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import Button50px from '../common/commonComponent/submitButton50px';
import ProfileProgress from './profileProgress/index';
import ProfileFormStep1 from './profileFormStep1/index';
import ProfileFormStep2 from './profileFormStep2/index';
import Hobby from './hobby';
import {MemberType} from "../membership/member-type";
import {Topics} from "../common/systemData/topicData";
import Track from "../common/track";
import { zones } from 'moment-timezone/data/meta/latest.json';
import { countries } from 'moment-timezone/data/meta/latest.json';
import ServiceProxy from '../service-proxy';
import './my.css';

function getBirthDay(date_of_birth) {
    if (date_of_birth) {
        let date = new Date(date_of_birth);
        return String(date.getFullYear()) + '-' + String(date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + String(date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
    } else {
        return ''
    }
}

class My extends Component {
    constructor() {
        super();

        this.state = {
            waitSec: 0,
            code: '',
            mobileValid: false,
            emailValid: false,
            birthdayLabel: '',
            step: 1,
            profile: {
                parent_name: '',
                phone: '',
                student_en_name: '',
                city: '',
                date_of_birth: '',
                gender: '',
                grade: '',
                topics: [],
                email: '',
                school: '',
                country: '',
                time_zone: ''
            },
            profile_title: Resources.getInstance().profileStep1Info,
            agreement: true,
            email_reg: /^[a-zA-Z0-9._-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/,
            placement_topics: Topics
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleGradeChange = this.handleGradeChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleChangeBirthdayLabel = this.handleChangeBirthdayLabel.bind(this);
        this.handleTimeZoneChange = this.handleTimeZoneChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);

        this.submit = this.submit.bind(this);
        this.changeGenderMale = this.changeGenderMale.bind(this);
        this.changeGenderFemale = this.changeGenderFemale.bind(this);
        this.topicChange = this.topicChange.bind(this);
        this.goBack = this.goBack.bind(this);
        this.agreementCheck = this.agreementCheck.bind(this);
        this.skipPlacement = this.skipPlacement.bind(this);
        this.sms = this.sms.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }

    async sms() {
        const {code} = await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/mobile/sms`,
                json: {mobile: this.state.profile.phone},
                method: 'POST'
            }
        })
        if (code) {
            this.setState({code});
        }
        this.setState({waitSec: 60});
        const interval = setInterval(() => {
            if (this.state.waitSec) {
                this.setState({waitSec: this.state.waitSec - 1});
            } else {
                clearInterval(interval)
            }
        }, 1000)
    }

    async sendEmail() {
        await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/mail/verification`,
                json: {mail: this.state.profile.email, name: this.state.profile.student_en_name},
                method: 'POST'
            }
        });
        this.setState({messageModal: true, messageContent: Resources.getInstance().emailUnkonwWrong});
        this.closeMessageModal();
        this.setState({waitSec: 60});
        const interval = setInterval(() => {
            if (this.state.waitSec) {
                this.setState({waitSec: this.state.waitSec - 1});
            } else {
                clearInterval(interval)
            }
        }, 1000)
    }

    handleCodeChange(event) {
        this.setState({code: event.target.value});
    }

    goBack() {
        if (this.state.step === 1) {
            browserHistory.push('/');
        } else if (this.state.step <= 4 && this.state.step !== 2) {
            let newStep = this.state.step - 1;
            this.setState({
                step: newStep
            });
        }
    }

    skipPlacement() {
        Track.event('注册_对暗号页面-跳过');

        browserHistory.push('/home');
    }

    topicChange(event) {
        event.stopPropagation();

        let clonedProfile = this.state.profile;
        let clonedTopics = clonedProfile.topics;

        if (clonedTopics.indexOf(event.target.name) < 0) {
            clonedTopics.push(event.target.name);

            clonedProfile.topics = clonedTopics;
        } else {
            let newTopics = [];
            for (let i in clonedTopics) {
                if (clonedTopics[i] !== event.target.name) {
                    newTopics.push(clonedTopics[i]);
                }
            }

            clonedProfile.topics = newTopics;
        }

        this.setState({profile: clonedProfile});
    }

    changeGenderFemale() {
        let gender = this.state.profile.gender;

        if (gender !== 'f') {
            let clonedProfile = this.state.profile;
            clonedProfile.gender = 'f';
            this.setState({
                profile: clonedProfile
            });
        }
    }

    changeGenderMale() {
        let gender = this.state.profile.gender;

        if (gender !== 'm') {
            let clonedProfile = this.state.profile;
            clonedProfile.gender = 'm';
            this.setState({
                profile: clonedProfile
            });
        }
    }

    handleCityChange(event, data) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile.city = data.value;
        this.setState({profile: clonedProfile});
    }

    handleGradeChange(event, data) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile.grade = data.value;
        this.setState({profile: clonedProfile});
    }

    handleTimeZoneChange(event, data){
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile.time_zone = data.value;

        let countryCode = zones[data.value].countries[0];
        clonedProfile.country = countries[countryCode].name;

        this.setState({profile: clonedProfile});
    }

    handleCountryChange(event, data){
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile.country = data.value;
        this.setState({profile: clonedProfile});
    }

    handleChange(event) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile[event.target.name] = event.target.value;
        this.setState({profile: clonedProfile, mobileValid: clonedProfile.phone && clonedProfile.phone.length === 11, emailValid: clonedProfile.email && this.state.email_reg.test(clonedProfile.email) && clonedProfile.student_en_name});
    }

    handleChangeBirthdayLabel(event) {
        this.setState({birthdayLabel: event.target.value});
    }

    agreementCheck() {
        let agreement = this.state.agreement;
        this.setState({
            agreement: !agreement
        });
    }

    async submit(event) {
        try {
            event.stopPropagation();

            console.log('=================');

            if (this.state.step < 3) {
                if (this.state.step === 1 && this.state.profile.role === MemberType.Student) {
                    Track.event('注册_联系方式继续-中方');

                    try {
                        await ServiceProxy.proxyTo({
                            body: {
                                uri: `{config.endPoints.buzzService}/api/v1/mobile/verify`,
                                json: {mobile: this.state.profile.phone, code: this.state.code},
                                method: 'POST'
                            }
                        })
                    } catch (e) {
                        console.log(e)

                        Track.event('注册', '手机验证', { '消息状态': '错误', '验证数据':  this.state.profile.phone + '-' + this.state.code});

                        this.setState({messageModal: true, messageContent: '短信校验失败'});
                        this.closeMessageModal();
                        return;
                    }
                }

                if (this.state.step === 1 && this.state.profile.role === MemberType.Companion) {
                    Track.event('注册_联系方式继续-外籍');

                    try {
                        await ServiceProxy.proxyTo({
                            body: {
                                uri: `{config.endPoints.buzzService}/api/v1/mail/verify`,
                                json: {mail: this.state.profile.email, code: this.state.code},
                                method: 'POST'
                            }
                        })
                    } catch (e) {
                        console.log(e)

                        Track.event('注册', '邮箱验证', { '消息状态': '错误', '验证数据':  this.state.profile.email + '-' + this.state.code});

                        this.setState({messageModal: true, messageContent: Resources.getInstance().emailWrongVerification});
                        this.closeMessageModal();
                        return;
                    }
                }

                let newStep = this.state.step + 1;
                let newTitle = newStep === 2 ? Resources.getInstance().profileStep2Info : Resources.getInstance().profileStep3Info;

                if (newStep === 2) {
                    Track.event('注册_孩子信息页面-中方');
                } else if (newStep === 3) {
                    Track.event('注册_孩子信息页面-继续');
                    Track.event('注册_兴趣爱好页面-中方');
                }

                this.setState({
                    step: newStep,
                    profile_title: newTitle
                });
            } else if (this.state.step === 3) {
                Track.event('注册_兴趣爱好继续-中方');

                //loading
                this.setState({loadingModal: true});

                let profileData = this.validateForm();

                if (this.state.userId) {
                    await ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.userId}`,
                            json: profileData,
                            method: 'PUT'
                        }
                    });

                    //check if placement is done
                    if(this.state.profile.role === MemberType.Student){
                        let placementResult = await ServiceProxy.proxyTo({
                            body: {
                                uri: `{config.endPoints.buzzService}/api/v1/user-placement-tests/${this.state.userId}`
                            }
                        });

                        if (placementResult && placementResult.detail && placementResult.detail.length > 20) {
                            this.setState({loadingModal: false});

                            browserHistory.push('/home');
                        } else {
                            let newStep = this.state.step + 1;
                            let newTitle = Resources.getInstance().profileStep4Info;
                            this.setState({
                                step: newStep,
                                profile_title: newTitle,
                                loadingModal: false
                            });
                        }
                    }else{
                        this.setState({loadingModal: false});

                        browserHistory.push('/home');
                    }
                } else {
                    this.setState({
                        messageModal: true,
                        messageContent: Resources.getInstance().messageSaveFailed,
                        messageName: 'error'
                    });
                    this.closeMessageModal();
                }
            } else if (this.state.step === 4) {
                Track.event('注册_对暗号页面-继续');

               window.location.href = '/placement';
            }

            //this.setState({modal: true, message: Resources.getInstance().saveSuccess});
        } catch (ex) {
            console.error(ex);
            //this.setState({modal: true, message: ex.message || Resources.getInstance().saveFailed});
            this.setState({loadingModal: false});
        }
    }

    closeMessageModal() {
        const interval = setTimeout(() => {
            if (this.state.messageModal) {
                this.setState({messageModal: false});
            }

            clearTimeout(interval);
        }, 5000)
    }

    validateForm() {
        let profile = this.state.profile;

        let newTopics = [];

        for (let i in profile.topics) {
            if (profile.topics[i]) {
                newTopics.push(profile.topics[i]);
            }
        }

        return {
            parent_name: profile.parent_name,
            mobile: profile.phone,
            name: profile.student_en_name,
            gender: profile.gender,
            city: profile.city,
            date_of_birth: getBirthDay(profile.date_of_birth),
            grade: profile.grade,
            interests: newTopics,
            email: profile.email,
            school_name: profile.school,
            country: profile.country || this.state.profile.role === MemberType.Student ? 'China' : 'United States',
            time_zone: profile.time_zone
        };
    }

    async componentWillMount() {
        try {
            Track.event('注册_联系方式页面-中方');
            let profile = this.getProfileFromUserData(await CurrentUser.getProfile(true));
            if (!profile.role) {
                browserHistory.push('/select-role');
                return;
            }

            //guess time_zone
            if(!profile.time_zone){
                profile.time_zone = moment.tz.guess();
                let countryCode = zones[profile.time_zone].countries[0];
                profile.country = countries[countryCode].name;
            }

            this.setState({
                profile: profile,
                userId: profile.user_id,
                mobileValid: profile && profile.phone && profile.phone.length === 11,
                emailValid: profile &&profile.email && this.state.email_reg.test(profile.email) && profile.student_en_name
            })
        }
        catch (ex) {
            console.log(ex.toString());
            //browserHistory.push('/');
            this.setState({messageModal: true, messageContent: ex.toString(), messageName: 'error'});
            this.closeMessageModal();
        }
    }

    componentWillUnmount() {
        this.setState({messageModal: false});
    }

    getProfileFromUserData(userData) {
        return {
            parent_name: userData.parent_name || userData.display_name || userData.name || userData.facebook_name || userData.wechat_name || '',
            phone: userData.mobile || '',
            student_en_name: userData.name || '',
            gender: userData.gender,
            date_of_birth: getBirthDay(userData.date_of_birth),
            city: userData.city || '',
            grade: userData.grade || '',
            topics: userData.interests instanceof Array ? userData.interests : (userData.interests ? userData.interests.split(',') : []),
            user_id: userData.user_id,
            role: userData.role,
            email: userData.email || '',
            school: userData.school_name || '',
            country: userData.country || '',
            time_zone: userData.time_zone || ''
        };
    }

    render() {
        return (
            <div className="my-profile">
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <MessageModal modalName={this.state.messageName} modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}/>
                <HeaderWithBack goBack={this.goBack}/>
                <ProfileProgress step={this.state.step} role={this.state.profile.role} />
                <Form className='profile-body'>
                    <h3 className="profile-title">{this.state.profile_title}</h3>
                    {
                        this.state.step === 1 ?
                            (
                                <ProfileFormStep1 role={this.state.profile.role} profile={this.state.profile} handleChange={this.handleChange}
                                                  handleCodeChange={this.handleCodeChange} mobileValid={this.state.mobileValid} sms={this.sms}
                                                  waitSec={this.state.waitSec} agreementCheck={this.agreementCheck} agreement={this.state.agreement}
                                                  sendEmail={this.sendEmail} emailValid={this.state.emailValid}
                                />
                            ) : (
                                this.state.step === 2 ? (
                                        <ProfileFormStep2 role={this.state.profile.role}  profile={this.state.profile} handleChange={this.handleChange}
                                                          changeGenderMale={this.changeGenderMale} changeGenderFemale={this.changeGenderFemale}
                                                          handleChangeBirthdayLabel={this.handleChangeBirthdayLabel} handleCityChange={this.handleCityChange}
                                                          handleGradeChange={this.handleGradeChange} handleTimeZoneChange={this.handleTimeZoneChange}
                                                          time_zone={this.state.profile.time_zone} handleCountryChange={this.handleCountryChange}
                                        />
                                    ) : (
                                        this.state.step === 3 ?
                                            (<div className='topic form-content'>
                                                <p>{Resources.getInstance().profileStep3}</p>
                                                <div className="topic-items" style={{padding: '20px 0'}} >
                                                    {
                                                        this.state.placement_topics.map((item, index) => {
                                                            return <Hobby key={index} src={item.url} circleColor={item.color_f}
                                                                          bgColor={item.color_b} word={item.name} wordColor={item.color_f} select={this.topicChange}
                                                                          name={item.value}
                                                                          selected={this.state.profile.topics.indexOf(item.value) >= 0} />
                                                        })
                                                    }
                                                </div>
                                            </div>) :
                                            (
                                                <div className="form-content">
                                                    <h4>{Resources.getInstance().profileStep4InfoWord1}<span
                                                        style={{color: '#f7b52a'}}>{Resources.getInstance().profileStep4InfoWordBold}</span>
                                                    </h4>
                                                    <img className="profile-done-img"
                                                         src="//resource.buzzbuzzenglish.com/image/buzz-corner/friends.png"
                                                         alt=""/>
                                                </div>
                                            )
                                    )
                            )
                    }
                    <div className="profile-btn">
                        <Button50px  disabled={this.state.step === 1 ? (this.state.profile.role === MemberType.Student ? !this.state.profile.phone || this.state.profile.phone.length !== 11 || !this.state.profile.parent_name || !this.state.agreement || !this.state.code : !this.state.profile.student_en_name || !this.state.email_reg.test(this.state.profile.email) || !this.state.agreement || !this.state.code ) : (this.state.step === 2 ? ( this.state.profile.role === MemberType.Student ?  !this.state.profile.student_en_name || !this.state.profile.date_of_birth || !this.state.profile.city || !this.state.profile.gender || !this.state.profile.grade || this.state.profile.gender === 'u' :  !this.state.profile.date_of_birth || !this.state.profile.gender || !this.state.profile.grade || this.state.profile.gender === 'u' || !this.state.profile.country || !this.state.profile.time_zone) : (this.state.step === 3 ? !this.state.profile.topics.length : false))}
                                     text={Resources.getInstance().profileContinue} submit={this.submit} />
                        {
                            this.state.step === 4 ? (
                                    <div className="skip"
                                         onClick={this.skipPlacement}>{Resources.getInstance().profileSkipNow}</div>
                                ) : ('')
                        }
                    </div>
                </Form>
                <br/>
            </div>
        );
    }
}

export default My;
