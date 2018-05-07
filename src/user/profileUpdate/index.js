import React, {Component} from 'react';
import { zones } from 'moment-timezone/data/meta/latest.json';
import { countries } from 'moment-timezone/data/meta/latest.json';
import {GradeData} from "../../common/systemData/gradeData";
import {ChineseCityList} from "../../common/systemData/chineseCityListData";
import Resources from '../../resources';
import QiniuDomain from '../../common/systemData/qiniuUrl';
import HeaderWithBack from '../../common/commonComponent/headerWithBack';
import MessageModal from '../../common/commonComponent/modalMessage';
import LoadingModal from '../../common/commonComponent/loadingModal';
import Button50px from '../../common/commonComponent/submitButton50px';
import {browserHistory} from 'react-router';
import {MemberType} from "../../membership/member-type";
import CurrentUser from "../../membership/user";
import ServiceProxy from '../../service-proxy';
import './index.css';
import '../../common/Icon/style.css';

const grade_list = GradeData.grade_list;

const grade_list_foreign = GradeData.grade_list_foreign;

const timeZones = Object.keys(zones).map(key=>({
    key, value: key, text: key
}));

const countryList = Object.keys(countries).map(key=>({
    key, value: countries[key].name, text: countries[key].name
}));

function getBirthDay(date_of_birth) {
    if (date_of_birth) {
        let date = new Date(date_of_birth);
        return String(date.getFullYear()) + '-' + String(date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + String(date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
    } else {
        return ''
    }
}

class UserUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: {},
            update: false
        };

        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    back(){
        window.history.back();
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
            date_of_birth: getBirthDay(profile.date_of_birth),
            grade: profile.grade,
            time_zone: profile.time_zone,
            country: profile.country || 'China',
            city: profile.city,
            interests: newTopics,
            email: profile.email,
            mobile: profile.phone
        };
    }

    async submit(){
        //check if has change
        if(this.state.update){
            //save data
            this.setState({loadingModal: true});

            let profileData = this.validateForm();

            await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.profile.user_id}`,
                    json: profileData,
                    method: 'PUT'
                }
            });
        }

        this.setState({loadingModal: false, messageModal: true, messageName: 'success', messageContent: Resources.getInstance().saveSuccess});
        this.closeMessageModal();
    }

    handleChange(event) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile[event.target.name] = event.target.value;
        this.setState({
            profile: clonedProfile,
            update: true
        });
    }

    closeMessageModal() {
        const interval = setTimeout(() => {
            if (this.state.messageModal) {
                this.setState({messageModal: false});
            }

            clearTimeout(interval);
        }, 5000)
    }

    async handleAvatarChange(e) {
        try {
            if(this.fileInput.files[0].type !== 'image/jpeg' && this.fileInput.files[0].type !== 'image/png'){
                //error
                this.setState({messageModal: true, messageName: 'error', messageContent: Resources.getInstance().userProfileAvatarWrongType});
                this.closeMessageModal();
                return;
            }

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
                throw new Error(Resources.getInstance().avatarKeyWrong);
            } else {
                console.log('upload success!');
                console.log(qiniu_token.resources_url + result.key);

                let clonedProfile = this.state.profile;
                clonedProfile.avatar = qiniu_token.resources_url + result.key;

                this.setState({
                    profile: clonedProfile
                });
            }
        } catch (ex) {
            //something wrong
        }
    };

    async componentWillMount(){
        let profile = this.getProfileFromUserData(await CurrentUser.getProfile(true));
        if (!profile.role) {
            browserHistory.push('/select-role');
            return;
        }

        console.log(profile);

        this.setState({
            profile: profile
        });
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
            time_zone: userData.time_zone || '',
            avatar: userData.avatar ||  QiniuDomain + '/logo-image.svg'
        };
    }

    render() {
        return (
            <div className="profile-update">
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <MessageModal modalName={this.state.messageName} modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}/>
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().userUpdateTitle} />
                <div className="update-body">
                    <div className="avatar-update with-half-border">
                        <div className="avatar-img">
                            <img src={this.state.profile.avatar || QiniuDomain + '/logo-image.svg'} alt=""/>
                        </div>
                        <div className="update-right">
                            <span>{Resources.getInstance().userProfileChange}</span>
                            <i className="icon-icon_back_down"/>
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
                                   name="student_en_name" value={this.state.profile.student_en_name || ''} onChange={this.handleChange} />
                            <i className="icon-icon_back_down"/>
                        </div>
                    </div>
                    <div className="item-update with-half-border">
                        <div className="update-left">
                            <span>{Resources.getInstance().profileGender}</span>
                        </div>
                        <div className="update-right">
                            <span>{this.state.profile.gender === 'f' ? Resources.getInstance().profileFemale : Resources.getInstance().profileMale}</span>
                            <i className="icon-icon_back_down"/>
                            <select name="gender" id="gender" value={this.state.profile.gender} onChange={this.handleChange}>
                                <option value="f">{Resources.getInstance().profileFemale}</option>
                                <option value="m">{Resources.getInstance().profileMale}</option>
                            </select>
                        </div>
                    </div>
                    <div className="item-update with-half-border">
                        <div className="update-left">
                            <span>{Resources.getInstance().profileBirth}</span>
                        </div>
                        <div className="update-right">
                            <span>{this.state.profile.date_of_birth}</span>
                            <i className="icon-icon_back_down"/>
                            <input type="date" className="hidden"
                                   placeholder={Resources.getInstance().profileBirth}
                                   value={this.state.profile.date_of_birth || ''}
                                   onChange={this.handleChange}
                                   name='date_of_birth'/>
                        </div>
                    </div>
                    <div className="item-update with-half-border">
                        <div className="update-left">
                            <span>{Resources.getInstance().profileGrade}</span>
                        </div>
                        <div className="update-right">
                            <span>{this.state.profile.grade}</span>
                            <i className="icon-icon_back_down"/>
                            <select name="grade" placeholder="" value={this.state.profile.grade} onChange={this.handleChange}>
                                {
                                    this.state.profile.role === MemberType.Student &&
                                    grade_list.map((item, index)=>{
                                        return <option key={index} value={item.value}>{item.text}</option>
                                    })
                                }
                                {
                                    this.state.profile.role === MemberType.Companion &&
                                    grade_list_foreign.map((item, index)=>{
                                        return <option key={index} value={item.value}>{item.text}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    {
                        this.state.profile.role === MemberType.Student &&
                        <div className="item-update with-half-border">
                            <div className="update-left">
                                <span>{Resources.getInstance().profileCityNow}</span>
                            </div>
                            <div className="update-right">
                                <span>{this.state.profile.city || '其他'}</span>
                                <i className="icon-icon_back_down"/>
                                <select name="city" placeholder="" value={this.state.profile.city} onChange={this.handleChange}>
                                    {
                                        ChineseCityList.map((item, index)=>{
                                            return <option key={index} value={item.value}>{item.text}</option>
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
                                <i className="icon-icon_back_down"/>
                                <select name="time_zone" value={this.state.profile.time_zone} onChange={this.handleChange}>
                                    {
                                        timeZones.map((item, index)=>{
                                            return <option key={index} value={item.value}>{item.text}</option>
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
                                <i className="icon-icon_back_down"/>
                                <select name="country" value={this.state.profile.country} onChange={this.handleChange}>
                                    {
                                        countryList.map((item, index)=>{
                                            return <option key={index} value={item.value}>{item.text}</option>
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
                        <div className="update-right">
                            <span>abc、ab、ac等3项</span>
                            <i className="icon-icon_back_down"/>
                        </div>
                    </div>
                    <div className="item-update">
                        <div className="update-left">
                            <span>{ this.state.profile.role === MemberType.Student?  Resources.getInstance().phoneLabel : 'Email'}</span>
                        </div>
                        <div className="update-right">
                            <span>{ this.state.profile.role === MemberType.Student ? this.state.profile.phone : this.state.profile.email}</span>
                            <i className="icon-icon_back_down"/>
                        </div>
                    </div>
                </div>
                <div className="update-btn">
                    <Button50px disabled={false}  text={Resources.getInstance().profileSunmitBtn} submit={this.submit} />
                </div>
            </div>
        );
    }
}

export default UserUpdate;