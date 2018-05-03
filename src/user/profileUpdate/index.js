import React, {Component} from 'react';
import Resources from '../../resources';
import HeaderWithBack from '../../common/commonComponent/headerWithBack';
import Button50px from '../../common/commonComponent/submitButton50px';
import {browserHistory} from 'react-router';
import {MemberType} from "../../membership/member-type";
import CurrentUser from "../../membership/user";
import ServiceProxy from '../../service-proxy';
import './index.css';
import '../../common/Icon/style.css';

const grade_list = [
    {key: '1', value: '1', text: Resources.getInstance().gradeOne},
    {key: '2', value: '2', text: Resources.getInstance().gradeTwo},
    {key: '3', value: '3', text: Resources.getInstance().gradeThr},
    {key: '4', value: '4', text: Resources.getInstance().gradeFou},
    {key: '5', value: '5', text: Resources.getInstance().gradeFiv},
    {key: '6', value: '6', text: Resources.getInstance().gradeSix},
    {key: '7', value: '7', text: Resources.getInstance().gradeSev},
    {key: '8', value: '8', text: Resources.getInstance().gradeEig},
    {key: '9', value: '9', text: Resources.getInstance().gradeNin},
];

const grade_list_foreign = [
    {key: '1', value: '1', text: 'Grade 1'},
    {key: '2', value: '2', text: 'Grade 2'},
    {key: '3', value: '3', text: 'Grade 3'},
    {key: '4', value: '4', text: 'Grade 4'},
    {key: '5', value: '5', text: 'Grade 5'},
    {key: '6', value: '6', text: 'Grade 6'},
    {key: '7', value: '7', text: 'Grade 7'},
    {key: '8', value: '8', text: 'Grade 8'},
    {key: '9', value: '9', text: 'Grade 9'},
    {key: '10', value: '10', text: 'Grade 10'},
    {key: '11', value: '11', text: 'Grade 11'},
    {key: '12', value: '12', text: 'Grade 12'},
];

const city_list = [
    {key: '0', value: '其他', text: Resources.getInstance().cityQT},
    {key: '1', value: '北京', text: Resources.getInstance().cityBJ},
    {key: '2', value: '上海', text: Resources.getInstance().citySH},
    {key: '3', value: '广州', text: Resources.getInstance().cityGZ},
    {key: '4', value: '深圳', text: Resources.getInstance().citySZ},
    {key: '5', value: '天津', text: Resources.getInstance().cityTJ},
    {key: '6', value: '杭州', text: Resources.getInstance().cityHZ},
    {key: '7', value: '南京', text: Resources.getInstance().cityNJ},
    {key: '8', value: '济南', text: Resources.getInstance().cityJN},
    {key: '9', value: '重庆', text: Resources.getInstance().cityCQ},
    {key: '10', value: '青岛', text: Resources.getInstance().cityQD},
    {key: '11', value: '大连', text: Resources.getInstance().cityDL},
    {key: '12', value: '宁波', text: Resources.getInstance().cityNB},
    {key: '13', value: '厦门', text: Resources.getInstance().cityXM},
    {key: '14', value: '重庆', text: Resources.getInstance().cityCQ},
    {key: '15', value: '成都', text: Resources.getInstance().cityCD},
    {key: '16', value: '武汉', text: Resources.getInstance().cityWH},
    {key: '17', value: '哈尔滨', text: Resources.getInstance().cityHEB},
    {key: '18', value: '沈阳', text: Resources.getInstance().citySY},
    {key: '19', value: '西安', text: Resources.getInstance().cityXA},
    {key: '20', value: '长春', text: Resources.getInstance().cityCC},
    {key: '21', value: '长沙', text: Resources.getInstance().cityCS},
    {key: '22', value: '福州', text: Resources.getInstance().cityFZ},
    {key: '23', value: '郑州', text: Resources.getInstance().cityZZ},
    {key: '24', value: '石家庄', text: Resources.getInstance().citySJZ},
    {key: '25', value: '苏州', text: Resources.getInstance().citySZ1},
    {key: '26', value: '佛山', text: Resources.getInstance().cityFS},
    {key: '27', value: '东莞', text: Resources.getInstance().cityDG},
    {key: '28', value: '无锡', text: Resources.getInstance().cityWX},
    {key: '29', value: '烟台', text: Resources.getInstance().cityYT},
    {key: '30', value: '太原', text: Resources.getInstance().cityTY},
    {key: '31', value: '合肥', text: Resources.getInstance().cityHF},
    {key: '32', value: '南昌', text: Resources.getInstance().cityNC},
    {key: '33', value: '南宁', text: Resources.getInstance().cityNN},
    {key: '34', value: '昆明', text: Resources.getInstance().cityKM},
    {key: '35', value: '温州', text: Resources.getInstance().cityWZ},
    {key: '36', value: '淄博', text: Resources.getInstance().cityZB},
    {key: '37', value: '唐山', text: Resources.getInstance().cityTS},
];

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
            profile: {}
        };

        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    back(){
        window.history.back();
    }

    async submit(){
        //check if has change

        //save data
    }

    handleChange(event) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile[event.target.name] = event.target.value;
        this.setState({
            profile: clonedProfile
        });
    }

    async handleAvatarChange(e) {
        try {
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
            avatar: userData.avatar || '//p579tk2n2.bkt.clouddn.com/logo-image.svg'
        };
    }

    render() {
        return (
            <div className="profile-update">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().userUpdateTitle} />
                <div className="update-body">
                    <div className="avatar-update with-half-border">
                        <div className="avatar-img">
                            <img src={this.state.profile.avatar || '//p579tk2n2.bkt.clouddn.com/logo-image.svg'} alt=""/>
                        </div>
                        <div className="update-right">
                            <span>{Resources.getInstance().userProfileChange}</span>
                            <i className="icon-icon_back_down"/>
                            <input id="avatar" className="avatar-input"
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
                            <input type="date"
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
                    <div className="item-update with-half-border">
                        <div className="update-left">
                            <span>{Resources.getInstance().profileCityNow}</span>
                        </div>
                        <div className="update-right">
                            <span>{this.state.profile.city || '其他'}</span>
                            <i className="icon-icon_back_down"/>
                            <select name="city" placeholder="" value={this.state.profile.city} onChange={this.handleChange}>
                                {
                                    city_list.map((item, index)=>{
                                        return <option key={index} value={item.value}>{item.text}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
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
                            <span>{Resources.getInstance().phoneLabel}</span>
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