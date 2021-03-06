import React, {Component} from 'react';
import {zones} from 'moment-timezone/data/meta/latest.json';
import {GradeData} from "../../common/systemData/gradeData";
import {ChinaAllCityList} from "../../common/systemData/chineseCityListData";
import Resources from '../../resources';
import QiniuDomain from '../../common/systemData/qiniuUrl';
import HeaderWithBack from '../../common/commonComponent/headerWithBack';
import MessageModal from '../../common/commonComponent/modalMessage';
import LoadingModal from '../../common/commonComponent/loadingModal';
import Button50px from '../../common/commonComponent/submitButtonRadius10Px';
import ConfirmationModal from '../../common/commonComponent/ConfirmationModal/index';
import ModifyMobileModal from '../modifyContact/modify-mobile-modal';
import ModifyEmailModal from '../modifyContact/modify-email-modal';
import UpdateTopicModal from '../updateModal';
import {browserHistory} from 'react-router';
import {MemberType} from "../../membership/member-type";
import CurrentUser from "../../membership/user";
import ServiceProxy from '../../service-proxy';
import Back from '../../common/back';
import ErrorHandler from "../../common/error-handler";
import BirthdayHelper from '../../common/birthdayFormat';
import Track from "../../common/track";
import './index.css';
import '../../common/Icon/style.css';
import {countryCodeMap} from "../../common/country-code-map";

const grade_list = GradeData.grade_list;
const grade_list_foreign = GradeData.grade_list_foreign;

const timeZones = Object.keys(zones).map(key => ({
    key, value: key, text: key
}));

const ChineseCityList = ChinaAllCityList.map((item, index) => {
    return {key: index, value: item.name, text: item.name}
});

class UserUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            canUpdate: true,
            profile: {},
            update: false,
            topicShow: false,
            waitSec: 0,
            code: '',
            mobileValid: false,
            emailValid: false,
            email_reg: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            showModifyMobileModal: false,
            showModifyEmailModal: false,
            new_phone: '',
            new_email: '',
            showingMobileConfirmationModal: false,
            showingEmailConfirmationModal: false
        };

        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.topicChange = this.topicChange.bind(this);
        this.topicToggle = this.topicToggle.bind(this);
        this.toggleModifyMobile = this.toggleModifyMobile.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.sms = this.sms.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateMobile = this.validateMobile.bind(this);
        this.handleContactChange = this.handleContactChange.bind(this);
        this.gotoModifyMobile = this.gotoModifyMobile.bind(this);
        this.closeMobileChangeConfirmationModal = this.closeMobileChangeConfirmationModal.bind(this);
        this.onCountryCodeChange = this.onCountryCodeChange.bind(this);
    }

    back() {
        Back.back();
    }

    async sms() {
        try {
            const {code} = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/mobile/sms`,
                    json: {
                        mobile: `00${countryCodeMap[this.state.mobileCountry]}${this.state.new_phone}`,
                        mobile_country: this.state.mobileCountry
                    },
                    method: 'POST'
                }
            });
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
        catch (ex) {
            ErrorHandler.notify('修改资料-发送手机验证码错误', ex);
        }
    }

    async sendEmail() {
        try {
            await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/mail/verification`,
                    json: {
                        mail: this.state.new_email,
                        name: this.state.profile.student_en_name
                    },
                    method: 'POST'
                }
            });
            this.setState({
                messageModal: true,
                messageContent: Resources.getInstance().emailUnkonwWrong
            });
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
        catch (ex){
            ErrorHandler.notify('修改信息-发送邮箱验证码错误', ex);
        }
    }


    async validateEmail() {
        try {
            await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/mail/verify`,
                    json: {
                        mail: this.state.new_email,
                        code: this.state.code
                    },
                    method: 'POST'
                }
            });

            let clonedProfile = this.state.profile;
            clonedProfile.email = this.state.new_email;

            this.setState({
                canUpdate: true,
                showModifyEmailModal: false,
                update: true,
                profile: clonedProfile
            });
        } catch (e) {
            console.log(e);

            this.setState({
                messageModal: true,
                messageContent: Resources.getInstance().emailWrongVerification,
                canUpdate: false
            });
            this.closeMessageModal();
        }
    }

    async validateMobile() {
        try {
            await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/mobile/verify`,
                    json: {
                        mobile: `00${countryCodeMap[this.state.mobileCountry]}${this.state.new_phone}`,
                        code: this.state.code
                    },
                    method: 'POST'
                }
            });

            let clonedProfile = this.state.profile;
            clonedProfile.phone = this.state.new_phone;

            this.setState({
                canUpdate: true,
                showModifyMobileModal: false,
                update: true,
                profile: clonedProfile
            });
        } catch (e) {
            console.log(e);

            this.setState({
                messageModal: true,
                messageContent: Resources.getInstance().emailWrongVerification,
                canUpdate: false
            });
            this.closeMessageModal();
        }
    }

    handleCodeChange(event) {
        this.setState({code: event.target.value});
    }

    topicToggle() {
        try{
            let clonedTopicShow = this.state.topicShow;

            if (clonedTopicShow) {
                document.getElementById('update-modal').style.animation = 'topic-move-hide .3s linear';

                let onceDisappear = setTimeout(() => {
                    this.setState({topicShow: !clonedTopicShow});
                    clearTimeout(onceDisappear);
                }, 300)
            } else {
                document.getElementById('update-modal').style.animation = 'topic-move-show .3s linear';

                this.setState({topicShow: !clonedTopicShow});
            }
        }
        catch (ex){
            ErrorHandler.notify('修改信息-topicModal出错', ex);
        }
    }


    toggleModifyMobile() {
        if (this.state.showingMobileConfirmationModal) {
            this.setState({
                showModifyMobileModal: !this.state.showModifyMobileModal,
                showingMobileConfirmationModal: false
            });
        } else {
            this.setState({showModifyMobileModal: !this.state.showModifyMobileModal});
        }
    }

    showModifyEmail = () => {
        this.setState({
            showingEmailConfirmationModal: false,
            showModifyEmailModal: true
        });
    };

    hideModifyEmail = () => {
        this.setState({showModifyEmailModal: false});
    };

    gotoModifyMobile() {
        if (this.state.profile.password && (this.state.profile.phone || this.state.profile.email)) {
            this.setState({showingMobileConfirmationModal: true});
        } else {
            this.toggleModifyMobile();
        }
    }

    closeMobileChangeConfirmationModal() {
        this.setState({showingMobileConfirmationModal: false});
    }

    topicChange(event) {
        event.stopPropagation();

        let clonedProfile = this.state.profile;
        let clonedTopics = clonedProfile.topics || [];

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

        this.setState({profile: clonedProfile, update: true, canUpdate: true});
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
            name: profile.student_en_name,
            gender: profile.gender,
            date_of_birth: BirthdayHelper.getBirthdayFromDbFormat(profile.date_of_birth),
            grade: profile.grade,
            time_zone: profile.time_zone,
            country: profile.country || 'china',
            city: profile.city,
            interests: newTopics,
            email: profile.email,
            mobile: '00' + countryCodeMap[this.state.mobileCountry] + profile.phone,
            avatar: profile.avatar
        };
    }

    async submit() {
        //check if has change
        try{
            if (this.state.update && this.state.canUpdate) {
                //save data
                this.setState({loadingModal: true});

                let profileData = this.validateForm();

                // await ServiceProxy.proxy(`/user-info`, {
                //     body: profileData,
                //     method: 'PUT'
                // });

                await CurrentUser.updateProfile(profileData);
            }

            this.setState({
                loadingModal: false,
                messageModal: true,
                messageName: 'success',
                messageContent: Resources.getInstance().saveSuccess
            });
            this.closeMessageModal();
        }
        catch (ex){
            ErrorHandler.notify('保存个人信息出错', ex);
        }
    }

    handleChange(event) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile[event.target.name] = event.target.value;

        this.setState({
            profile: clonedProfile,
            update: true,
            canUpdate: true
        });
    }

    handleContactChange(event) {
        if (event.target.name === 'phone') {
            this.setState({
                new_phone: event.target.value,
                mobileValid: event.target.value && event.target.value.length > 0
            });
        }

        if (event.target.name === 'email') {
            this.setState({
                new_email: event.target.value,
                emailValid: event.target.value && this.state.email_reg.test(event.target.value)
            });
        }
    }

    closeMessageModal() {
        const interval = setTimeout(() => {
            if (this.state.messageModal) {
                this.setState({messageModal: false});
            }

            clearTimeout(interval);

            //browserHistory.push('/user?refresh=true');
        }, 2000)
    }

    async handleAvatarChange(e) {
        try {
            if (this.fileInput.files[0].type !== 'image/jpeg' && this.fileInput.files[0].type !== 'image/png') {
                //error
                this.setState({
                    messageModal: true,
                    messageName: 'error',
                    messageContent: Resources.getInstance().userProfileAvatarWrongType
                });
                this.closeMessageModal();
                return;
            }

            this.setState({loadingModal: true});

            let qiniu_token = await ServiceProxy.proxyTo({
                body: {
                    uri: '{config.endPoints.buzzService}/api/v1/qiniu/token',
                    method: 'GET'
                }
            });

            if (!qiniu_token.uptoken) {
                throw new Error(Resources.getInstance().avatarTokenWrong);
            }

            let fileForm = new FormData();

            fileForm.append("name", this.fileInput.files[0].name);
            fileForm.append("file", this.fileInput.files[0]);
            fileForm.append("token", qiniu_token.uptoken);

            let result = await ServiceProxy.proxy(qiniu_token.upload_url, {
                method: 'POST',
                body: fileForm,
                credentials: undefined,
                headers: undefined
            });

            if (!result.key || !result.hash) {
                this.setState({
                    loadingModal: false,
                    messageModal: true,
                    messageContent: Resources.getInstance().errorUpload
                });
            } else {
                let clonedProfile = this.state.profile;
                clonedProfile.avatar = qiniu_token.resources_url + result.key + '?imageView2/1/w/400/h/400';

                this.setState({
                    profile: clonedProfile,
                    loadingModal: false,
                    update: true,
                    canUpdate: true
                });
            }
        } catch (ex) {
            //something wrong
            ErrorHandler.notify('上传头像出错', ex);
        }
    };

    async componentWillMount() {
        try{
            Track.event('我的_修改资料页面展示');

            let profile = UserUpdate.getProfileFromUserData(await CurrentUser.getProfile());
            if (!profile.role) {
                browserHistory.push('/select-role');
                return;
            }

            this.setState({
                profile: profile,
                mobileValid: profile && profile.phone && profile.phone.length > 0,
                emailValid: profile && profile.email && this.state.email_reg.test(profile.email) && profile.student_en_name,
                new_phone: profile.phone,
                new_email: profile.email,
                mobileCountry: profile.mobileCountry
            });
        }
        catch(ex){
            ErrorHandler.notify('我的_获取用户信息出错', ex);
        }
    }

    static getProfileFromUserData(userData) {
        return {
            parent_name: userData.parent_name || userData.display_name || userData.name || userData.facebook_name || userData.wechat_name || '',
            phone: userData.mobile_country ? userData.mobile_country.mobile || userData.mobile || '' : '',
            student_en_name: userData.name || '',
            gender: userData.gender,
            date_of_birth: BirthdayHelper.getBirthdayFromDbFormat(userData.date_of_birth),
            city: userData.city || '',
            grade: userData.grade || '',
            topics: userData.interests instanceof Array ? userData.interests : (userData.interests ? userData.interests.split(',') : []),
            user_id: userData.user_id,
            role: userData.role,
            email: userData.email || '',
            school: userData.school_name || '',
            country: userData.country || '',
            time_zone: userData.time_zone || '',
            avatar: userData.avatar || QiniuDomain + '/logo-image.svg',
            password: userData.password,
            mobileCountry: userData.mobile_country && userData.mobile_country.country && userData.mobile_country.country.country_long_name ? userData.mobile_country.country.country_long_name : ''
        };
    }

    render() {
        return (
            <div className="profile-update">
                <ConfirmationModal
                    cancel={this.closeMobileChangeConfirmationModal}
                    sure={this.toggleModifyMobile}
                    modal={this.state.showingMobileConfirmationModal}
                    sureText={Resources.getInstance().popSure}
                    cancelText={Resources.getInstance().popCancel}
                    info={Resources.getInstance().popUserUpdateAccountInfo}
                    title={Resources.getInstance().popTitle}
                />
                <ConfirmationModal
                    cancel={() => this.setState({showingEmailConfirmationModal: false})}
                    sure={this.showModifyEmail}
                    modal={this.state.showingEmailConfirmationModal}
                    sureText={Resources.getInstance().popSure}
                    cancelText={Resources.getInstance().popCancel}
                    info={Resources.getInstance().popUserUpdateAccountInfoEmail}
                    title={Resources.getInstance().popTitle}
                />
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <MessageModal modalName={this.state.messageName}
                              modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}/>
                <HeaderWithBack goBack={this.back}
                                title={Resources.getInstance().userUpdateTitle}/>
                <UpdateTopicModal topics={this.state.profile.topics || []}
                                  topicChange={this.topicChange}
                                  modalShow={this.state.topicShow}
                                  topicToggle={this.topicToggle}
                />
                <ModifyMobileModal modalShow={this.state.showModifyMobileModal}
                                   handleContactChange={this.handleContactChange}
                                   code={this.state.code || ''}
                                   handleCodeChange={this.handleCodeChange}
                                   mobileValid={this.state.mobileValid}
                                   sms={this.sms}
                                   waitSec={this.state.waitSec}
                                   role={this.state.profile.role || ''}
                                   modifyCheck={this.validateMobile}
                                   new_phone={this.state.new_phone}
                                   closeModal={this.toggleModifyMobile}
                                   mobileCountry={this.state.mobileCountry}
                                   onCountryCodeChange={this.onCountryCodeChange}
                />
                <ModifyEmailModal modalShow={this.state.showModifyEmailModal}
                                  handleContactChange={this.handleContactChange}
                                  code={this.state.code || ''}
                                  handleCodeChange={this.handleCodeChange}
                                  emailValid={this.state.emailValid}
                                  waitSec={this.state.waitSec}
                                  sendEmail={this.sendEmail}
                                  role={this.state.profile.role || ''}
                                  modifyCheck={this.validateEmail}
                                  new_email={this.state.new_email}
                                  closeModal={this.hideModifyEmail}
                />

                <div className="update-body">
                    <div className="avatar-update with-half-border">
                        <div className="avatar-img">
                            <img
                                src={this.state.profile.avatar || QiniuDomain + '/logo-image.svg'}
                                alt=""/>
                        </div>
                        <div className="update-right">
                            <span>{Resources.getInstance().userProfileChange}</span>
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                            <input id="avatar" className="avatar-input hidden"
                                   type="file" accept="image/*"
                                   onChange={(e) => this.handleAvatarChange(e)}
                                   ref={input => {
                                       this.fileInput = input;
                                   }}
                                   name="avatar"
                            />
                        </div>
                    </div>
                    <div className="item-update with-half-border">
                        <div className="update-left">
                            <span>{Resources.getInstance().profileChildName}</span>
                        </div>
                        <div className="update-right">
                            <input className="input-show" type="text"
                                   name="student_en_name"
                                   value={this.state.profile.student_en_name || ''}
                                   onChange={this.handleChange}/>
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                        </div>
                    </div>
                    <div className="item-update with-half-border">
                        <div className="update-left">
                            <span>{Resources.getInstance().profileGender}</span>
                        </div>
                        <div className="update-right">
                            <span>{this.state.profile.gender === 'f' ? Resources.getInstance().profileFemale : Resources.getInstance().profileMale}</span>
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                            <select name="gender" id="gender"
                                    value={this.state.profile.gender}
                                    onChange={this.handleChange}>
                                <option
                                    value="f">{Resources.getInstance().profileFemale}</option>
                                <option
                                    value="m">{Resources.getInstance().profileMale}</option>
                            </select>
                        </div>
                    </div>
                    <div className="item-update with-half-border">
                        <div className="update-left">
                            <span>{Resources.getInstance().profileBirthOnly}</span>
                        </div>
                        <div className="update-right">
                            <span>{this.state.profile.date_of_birth}</span>
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                            <input type="date" className="hidden"
                                   placeholder={Resources.getInstance().profileBirth}
                                   value={this.state.profile.date_of_birth || ''}
                                   onChange={this.handleChange}
                                   name='date_of_birth'/>
                        </div>
                    </div>
                    <div className="item-update with-half-border">
                        <div className="update-left">
                            <span>{Resources.getInstance().profileGradeOnly}</span>
                        </div>
                        <div className="update-right">
                            {this.state.profile.role === MemberType.Student &&
                            <span>{this.state.profile.grade ? grade_list[parseInt(this.state.profile.grade || 1, 10) - 1].text : ''}</span>
                            }
                            {this.state.profile.role === MemberType.Companion &&
                            <span>{this.state.profile.grade ? grade_list_foreign[parseInt(this.state.profile.grade || 1, 10) - 1].text : ''}</span>
                            }
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                            <select name="grade" placeholder=""
                                    value={this.state.profile.grade}
                                    onChange={this.handleChange}>
                                {
                                    this.state.profile.role === MemberType.Student &&
                                    grade_list.map((item, index) => {
                                        return <option key={index}
                                                       value={item.value}>{item.text}</option>
                                    })
                                }
                                {
                                    this.state.profile.role === MemberType.Companion &&
                                    grade_list_foreign.map((item, index) => {
                                        return <option key={index}
                                                       value={item.value}>{item.text}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    {
                        this.state.profile.role === MemberType.Student &&
                        <div className="item-update with-half-border">
                            <div className="update-left">
                                <span>{Resources.getInstance().profileCityOnly}</span>
                            </div>
                            <div className="update-right">
                                <span>{this.state.profile.city || '其他'}</span>
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                                <select name="city" placeholder=""
                                        value={this.state.profile.city}
                                        onChange={this.handleChange}>
                                    {
                                        ChineseCityList.map((item, index) => {
                                            return <option key={index}
                                                           value={item.value}>{item.text}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    }
                    {
                        this.state.profile.role === MemberType.Companion &&
                        <div className="item-update with-half-border">
                            <div className="update-left">
                                <span>Time zone</span>
                            </div>
                            <div className="update-right">
                                <span>{this.state.profile.time_zone}</span>
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                                <select name="time_zone"
                                        value={this.state.profile.time_zone}
                                        onChange={this.handleChange}>
                                    {
                                        timeZones.map((item, index) => {
                                            return <option key={index}
                                                           value={item.value}>{item.text}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    }
                    {
                        this.state.profile.role === MemberType.Companion &&
                        <div className="item-update with-half-border">
                            <div className="update-left">
                                <span>Country</span>
                            </div>
                            <div className="update-right">
                                <span>{this.state.profile.country}</span>
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                                <select name="country"
                                        value={this.state.profile.country}
                                        onChange={this.handleChange}>
                                    {
                                        ChineseCityList.map((item, index) => {
                                            return <option key={index}
                                                           value={item.value}>{item.text}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    }
                    <div className="item-update with-half-border">
                        <div className="update-left">
                            <span>{Resources.getInstance().profileStep3}</span>
                        </div>
                        <div className="update-right"
                             onClick={this.topicToggle}>
                            <span>{this.state.profile.topics && this.state.profile.topics.length ? this.state.profile.topics[0] + '...' : Resources.getInstance().profileTopicNone}</span>
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                        </div>
                    </div>
                    <div className="item-update">
                        <div className="update-left">
                            <span>{Resources.getInstance().phoneLabel}</span>
                        </div>
                        <div className="update-right"
                             onClick={this.gotoModifyMobile}>
                            <span>{this.state.profile.phone}</span>
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                        </div>
                    </div>
                    {
                        this.state.profile.role === MemberType.Companion &&
                        <div className="item-update">
                            <div className="update-left">
                                <span>Email</span>
                            </div>
                            <div className="update-right"
                                 onClick={this.gotoModifyEmail}>
                                <span>{this.state.profile.email}</span>
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                            </div>
                        </div>
                    }
                </div>
                <div className="update-btn">
                    <Button50px
                        disabled={!(this.state.update && this.state.canUpdate)}
                        text={Resources.getInstance().profileSunmitBtn}
                        submit={this.submit}/>
                </div>
            </div>
        );
    }

    gotoModifyEmail = () => {
        if (this.state.profile.password && (this.state.profile.phone || this.state.profile.email)) {
            this.setState({showingEmailConfirmationModal: true});
        } else {
            this.showModifyEmail();
        }
    };

    onCountryCodeChange(event, data){
        this.setState({mobileCountry: data.value});
    }
}

export default UserUpdate;
