import React, {Component} from 'react';
import {Form} from 'semantic-ui-react';
import Resources from '../resources';
import moment from 'moment-timezone'
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
import LoadingModal from '../common/commonComponent/loadingModal';
import MessageModal from '../common/commonComponent/modalMessage';
import ButtonBottom from '../common/commonComponent/submitButtonRadius10Px';
import ProfileFormStep1 from './profileFormStep1/index';
import ProfileFormStep2 from './profileFormStep2/index';
import {MemberType} from "../membership/member-type";
import {Topics} from "../common/systemData/topicData";
import Track from "../common/track";
import {zones} from 'moment-timezone/data/meta/latest.json';
import {countries} from 'moment-timezone/data/meta/latest.json';
import QuitModal from '../common/commonComponent/ConfirmationModal/index';
import ServiceProxy from '../service-proxy';
import BirthdayHelper from '../common/birthdayFormat';
import './my.css';
import {countryCodeMap, countryLongNameMap} from "../common/country-code-map";

const logger = require('../common/logger');

let interval = null;

class My extends Component {
    constructor(props) {
        super(props);

        this.state = {
            waitSec: 0,
            code: '',
            mobileValid: false,
            emailValid: false,
            birthdayLabel: '',
            step: Number(props.params.step) || 1,
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
            email_reg: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            placement_topics: Topics,
            mobileCountry: countryLongNameMap[zones[moment.tz.guess()].countries[0]],
            send: false
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
        this.signOut = this.signOut.bind(this);
        this.closePopModal = this.closePopModal.bind(this);
        this.openPopModal = this.openPopModal.bind(this);
        this.onCountryCodeChange = this.onCountryCodeChange.bind(this);
    }

    signOut() {
        Track.event('注册_点击退出');

        this.setState({signOutModal: false}, () => {
            window.location.href = '/sign-out';
        });
    }

    closePopModal() {
        this.setState({signOutModal: false});
    }

    openPopModal() {
        this.setState({signOutModal: true});
    }

    async sms() {
        let mobile = `00${countryCodeMap[this.state.mobileCountry]}${this.state.profile.phone}`;

        logger.fundebug.notify('发送手机验证码', mobile, {metaData: this.state});
        try {
            const phoneResult = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/mobile/sms`,
                    json: {
                        mobile: mobile,
                        mobile_country: this.state.mobileCountry
                    },
                    method: 'POST'
                }
            });

            if (phoneResult && phoneResult.error) {
                this.setState({
                    messageModal: true,
                    messageContent: Resources.getInstance().phoneSendWrong,
                    waitSec: 30,
                    send: true
                }, () => {
                    const interval = setInterval(() => {
                        if (this.state.waitSec) {
                            this.setState({waitSec: this.state.waitSec - 1});
                        } else {
                            clearInterval(interval)
                        }
                    }, 1000)
                });
            } else {
                this.setState({
                    messageModal: true,
                    messageContent: Resources.getInstance().profileSendSuccess,
                    waitSec: 60,
                    send: true
                }, () => {
                    const interval = setInterval(() => {
                        if (this.state.waitSec) {
                            this.setState({waitSec: this.state.waitSec - 1});
                        } else {
                            clearInterval(interval)
                        }
                    }, 1000)
                });
            }
        }
        catch (e) {
            this.setState({
                messageModal: true,
                messageContent: Resources.getInstance().emailSendWrong,
                waitSec: 10
            }, () => {
                const interval = setInterval(() => {
                    if (this.state.waitSec) {
                        this.setState({waitSec: this.state.waitSec - 1});
                    } else {
                        clearInterval(interval)
                    }
                }, 1000)
            });
        }
        finally {
            this.closeMessageModal();
        }
    }

    async sendEmail() {
        try {
            this.setState({waitSec: 60});

            let emailResult = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/mail/verification`,
                    json: {
                        mail: this.state.profile.email,
                        name: this.state.profile.student_en_name
                    },
                    method: 'POST'
                }
            });

            if (emailResult && emailResult.error) {
                this.setState({
                    messageModal: true,
                    messageContent: Resources.getInstance().emailSendWrong,
                    waitSec: 10
                }, () => {
                    const interval = setInterval(() => {
                        if (this.state.waitSec) {
                            this.setState({waitSec: this.state.waitSec - 1});
                        } else {
                            clearInterval(interval)
                        }
                    }, 1000)
                });
            } else {
                this.setState({
                    messageModal: true,
                    messageContent: Resources.getInstance().emailUnkonwWrong,
                    waitSec: 60
                }, () => {
                    const interval = setInterval(() => {
                        if (this.state.waitSec) {
                            this.setState({waitSec: this.state.waitSec - 1});
                        } else {
                            clearInterval(interval)
                        }
                    }, 1000)
                });
            }
        }
        catch (e) {
            this.setState({
                messageModal: true,
                messageContent: Resources.getInstance().emailSendWrong,
                waitSec: 10
            }, () => {
                const interval = setInterval(() => {
                    if (this.state.waitSec) {
                        this.setState({waitSec: this.state.waitSec - 1});
                    } else {
                        clearInterval(interval)
                    }
                }, 1000)
            });
        }
        finally {
            this.closeMessageModal();
        }
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

    handleTimeZoneChange(event, data) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile.time_zone = data.value;

        let countryCode = zones[data.value].countries[0];
        clonedProfile.country = countries[countryCode].name;

        this.setState({profile: clonedProfile});
    }

    handleCountryChange(event, data) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile.country = data.value;
        this.setState({profile: clonedProfile});
    }

    handleChange(event) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile[event.target.name] = event.target.value;
        this.setState({
            profile: clonedProfile,
            mobileValid: clonedProfile.phone && clonedProfile.phone.length > 0,
            emailValid: clonedProfile.email && this.state.email_reg.test(clonedProfile.email) && clonedProfile.student_en_name
        });

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

            if (this.state.step === 1) {
                if (this.state.profile.role === MemberType.Student && !this.state.withPhone) {
                    Track.event('注册_联系方式继续-中方');

                    try {
                        await this.validateMobilePhone();
                    } catch (e) {
                        console.log(e);

                        Track.event('注册', '手机验证', {
                            '消息状态': '错误',
                            '验证数据': this.state.profile.phone + '-' + this.state.code
                        });

                        this.setState({
                            messageModal: true,
                            messageContent: '短信校验失败'
                        });
                        this.closeMessageModal();
                        return;
                    }
                }

                if (this.state.profile.role === MemberType.Companion  && !this.state.withPhone) {
                    Track.event('注册_联系方式继续-外籍');

                    try {
                        await this.validateMobilePhone();
                    } catch (e) {
                        console.log(e);

                        Track.event('注册', '邮箱验证', {
                            '消息状态': '错误',
                            '验证数据': this.state.profile.email + '-' + this.state.code
                        });

                        this.setState({
                            messageModal: true,
                            messageContent: Resources.getInstance().emailWrongVerification
                        });
                        this.closeMessageModal();
                        return;
                    }
                }

                let newStep = this.state.step + 1;
                let newTitle = newStep === 2 ? Resources.getInstance().profileStep2Info : Resources.getInstance().profileStep3Info;

                if (newStep === 2) {
                    Track.event('注册_孩子信息页面-中方');
                }

                this.setState({
                    step: newStep,
                    profile_title: newTitle
                });
            } else if (this.state.step === 2) {
                Track.event('注册_完成提交信息-' + this.state.profile.role === MemberType.Student ? '中方' : '外籍');

                this.setState({loadingModal: true});

                let profileData = this.validateForm();

                if (this.state.userId && profileData) {
                    await CurrentUser.updateProfile(profileData);

                    browserHistory.push('/home?intro=1');
                } else {
                    this.setState({
                        messageModal: true,
                        messageContent: this.state.userId ? Resources.getInstance().messageSaveFailed : (!profileData ? Resources.getInstance().messageSaveFailedPhone : Resources.getInstance().messageSaveFailedNoWhy),
                        messageName: 'error',
                        loadingModal: false
                    });
                    this.closeMessageModal();
                }
            }
        } catch (ex) {
            console.error(ex);
            //this.setState({modal: true, message: ex.message || Resources.getInstance().saveFailed});
            this.setState({
                messageModal: true,
                messageContent: Resources.getInstance().messageSaveFailedNoWhy,
                messageName: 'error',
                loadingModal: false
            });
            this.closeMessageModal();
        }
    }

    async validateMobilePhone() {
        await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/mobile/verify`,
                json: {
                    mobile: `00${countryCodeMap[this.state.mobileCountry]}${this.state.profile.phone}`,
                    code: this.state.code
                },
                method: 'POST'
            }
        })
    }

    closeMessageModal() {
        interval = setTimeout(() => {
            if (this.state.messageModal) {
                this.setState({messageModal: false});
            }

            clearTimeout(interval);
        }, 5000)
    }

    validateForm() {
        let profile = this.state.profile;

        if(this.state.withPhone){
            return {
                name: profile.student_en_name,
                gender: profile.gender,
                city: profile.city,
                date_of_birth: BirthdayHelper.getBirthdayFromDbFormat(profile.date_of_birth),
                grade: profile.grade,
                email: profile.email,
                school_name: profile.school,
                country: profile.role === MemberType.Student ? 'china' : ( profile.country || 'united States'),
                time_zone: profile.time_zone
            };
        }else{
            if(!profile.phone || ! countryCodeMap[this.state.mobileCountry]){
                return false;
            }

            return {
                parent_name: profile.parent_name,
                mobile: '00' + countryCodeMap[this.state.mobileCountry] + profile.phone,
                name: profile.student_en_name,
                gender: profile.gender,
                city: profile.city,
                date_of_birth: BirthdayHelper.getBirthdayFromDbFormat(profile.date_of_birth),
                grade: profile.grade,
                email: profile.email,
                school_name: profile.school,
                country: profile.role === MemberType.Student ? 'china' : ( profile.country || 'united States'),
                time_zone: profile.time_zone
            };
        }
    }

    async componentWillMount() {
        try {
            Track.event('注册_联系方式页面-中方');
            let profile = this.getProfileFromUserData(await CurrentUser.getProfile());
            if (!profile.role) {
                browserHistory.push('/select-role');
                return;
            }

            //guess time_zone
            if (!profile.time_zone) {
                profile.time_zone = moment.tz.guess();
                let countryCode = zones[profile.time_zone].countries[0];
                profile.country = countries[countryCode].name;
            }

            this.setState({
                profile: profile,
                userId: profile.user_id,
                withPhone: profile.phone && profile.phone.length && profile.phone.length >= 5 && profile.mobile_confirmed,
                mobileValid: profile && profile.phone && profile.phone.length > 0,
                emailValid: profile && profile.email && this.state.email_reg.test(profile.email) &&
                profile.student_en_name,
                mobileCountry: profile.mobile_country ? profile.mobile_country.country.country_long_name || this.state.mobileCountry : this.state.mobileCountry
            })
        }
        catch (ex) {
            console.log(ex.toString());
            this.setState({
                messageModal: true,
                messageContent: ex.toString(),
                messageName: 'error'
            });
            this.closeMessageModal();
        }
    }

    componentWillUnmount() {
        if (interval) {
            clearTimeout(interval);
        }

        this.setState = (state, callback) => {
            return false;
        };
    }

    getProfileFromUserData(userData) {
        return {
            parent_name: userData.parent_name || userData.display_name || userData.name || userData.facebook_name || userData.wechat_name || '',
            phone: userData.mobile_country ? userData.mobile_country.mobile : userData.mobile || '',
            mobile_country: userData.mobile_country,
            student_en_name: userData.name || '',
            gender: userData.gender,
            date_of_birth: BirthdayHelper.getBirthdayFromDbFormat(userData.date_of_birth),
            city: userData.city || '',
            grade: userData.grade || '',
            user_id: userData.user_id,
            role: userData.role,
            email: userData.email || '',
            school: userData.school_name || '',
            country: userData.country || '',
            time_zone: userData.time_zone || '',
            mobile_confirmed: userData.mobile_confirmed
        };
    }

    render() {
        return (
            <div className="my-profile">
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <MessageModal modalName={this.state.messageName}
                              modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}/>
                <QuitModal cancel={this.closePopModal} sure={this.signOut} modal={this.state.signOutModal}
                       sureText={Resources.getInstance().popSure} cancelText={Resources.getInstance().popCancel}
                       info={Resources.getInstance().popInfo} title={Resources.getInstance().popTitle}
                />
                <div className="quit" onClick={this.openPopModal}>
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_quit.svg" alt=""/>
                </div>
                <Form className='profile-body'>
                    <h3 className="profile-title">{this.state.profile_title}</h3>
                    {
                        this.state.step === 1 &&
                        <ProfileFormStep1 role={this.state.profile.role}
                                          profile={this.state.profile}
                                          handleChange={this.handleChange}
                                          code={this.state.code}
                                          handleCodeChange={this.handleCodeChange}
                                          mobileValid={this.state.mobileValid}
                                          sms={this.sms}
                                          waitSec={this.state.waitSec}
                                          agreementCheck={this.agreementCheck}
                                          agreement={this.state.agreement}
                                          sendEmail={this.sendEmail}
                                          emailValid={this.state.emailValid}
                                          mobileCountry={this.state.mobileCountry}
                                          onCountryCodeChange={this.onCountryCodeChange}
                                          send={this.state.send}
                                          withPhone={this.state.withPhone}
                        />
                    }
                    {
                        this.state.step === 2 &&
                        <ProfileFormStep2 role={this.state.profile.role}
                                          profile={this.state.profile}
                                          handleChange={this.handleChange}
                                          changeGenderMale={this.changeGenderMale}
                                          changeGenderFemale={this.changeGenderFemale}
                                          handleChangeBirthdayLabel={this.handleChangeBirthdayLabel}
                                          handleCityChange={this.handleCityChange}
                                          handleGradeChange={this.handleGradeChange}
                                          handleTimeZoneChange={this.handleTimeZoneChange}
                                          time_zone={this.state.profile.time_zone}
                                          handleCountryChange={this.handleCountryChange}
                        />
                    }
                    <div className="profile-btn">
                        <ButtonBottom
                            disabled={this.formIsInvalid()}
                            text={this.state.step === 1 ? Resources.getInstance().profileContinue : Resources.getInstance().profileDone}
                            submit={this.submit}/>
                    </div>
                </Form>
            </div>
        );
    }

    formIsInvalid() {
        if (this.state.step === 1) {
            return this.contactInfoFormIsInvalid();
        }
        if (this.state.step === 2) {
            return this.personalInformationFormIsInvalid();
        }
        return false;
    }

    personalInformationFormIsInvalid() {
        if (this.state.profile.role === MemberType.Student) {
            return this.studentPersonalInformationFormIsInvalid();
        }
        if (this.state.profile.role === MemberType.Companion) {
            return this.companionPersonalInformationFormIsInvalid();
        }
        return true;
    }

    companionPersonalInformationFormIsInvalid() {
        return !this.state.profile.date_of_birth || !this.state.profile.gender || !this.state.profile.grade || this.state.profile.gender === 'u' || !this.state.profile.country || !this.state.profile.time_zone;
    }

    studentPersonalInformationFormIsInvalid() {
        return !this.state.profile.student_en_name || !this.state.profile.date_of_birth || !this.state.profile.city || !this.state.profile.gender || !this.state.profile.grade || this.state.profile.gender === 'u';
    }

    contactInfoFormIsInvalid() {
        if (this.state.profile.role === MemberType.Student) {
            return this.studentContactInformationFormIsInvalid();
        }
        if (this.state.profile.role === MemberType.Companion) {
            return this.companionContactInformationFormIsInvalid();
        }
        return true;
    }

    companionContactInformationFormIsInvalid() {
        return !this.state.withPhone ? !this.state.profile.student_en_name || !this.state.email_reg.test(this.state.profile.email) || !this.state.agreement || !this.state.code || !this.state.profile.phone || !this.state.send :  !this.state.profile.student_en_name || !this.state.email_reg.test(this.state.profile.email) ;
    }

    studentContactInformationFormIsInvalid() {
        return !this.state.withPhone ? !this.state.profile.phone || this.state.profile.phone.length !== 11 || !this.state.profile.parent_name || !this.state.agreement || !this.state.code || !this.state.send : !this.state.profile.parent_name;
    }

    onCountryCodeChange(event, data){
        this.setState({mobileCountry: data.value});
    }
}

export default My;
