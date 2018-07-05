import React, {Component} from 'react';
import Resources from '../../resources';
import HeaderWithBack from '../../common/commonComponent/headerWithBack';
import QiniuDomain from '../../common/systemData/qiniuUrl';
import {GradeData} from "../../common/systemData/gradeData";
import Hobby from '../../my/hobby';
import {Topics} from "../../common/systemData/topicData";
import {MemberType} from "../../membership/member-type";
import Track from "../../common/track";
import BirthdayHelper from '../../common/birthdayFormat';
import './index.css';
import ServiceProxy from "../../service-proxy";

const grade_list = GradeData.grade_list;
const grade_list_foreign = GradeData.grade_list_foreign;

class UserShow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_profile: {

            },
            topics: [],
            user_id: props.params.user_id
        };

        this.topicChange = this.topicChange.bind(this);
        this.back = this.back.bind(this);
    }

    topicChange(){}

    back(){
        window.history.go(-1);
    }

    async componentWillMount(){
        Track.event('用户中心_用户中心展示');

        //topics
        let user_profile = await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.user_id}?t=${new Date().getTime()}`
            }
        });

        let newTopics = [];

        if(user_profile.interests && user_profile.interests.length){
            user_profile.topics = user_profile.interests.split(',');

            for (let i in user_profile.topics) {
                if (user_profile.topics[i]) {
                    //check Topics
                    for(let f in Topics){
                        if(Topics[f].value === user_profile.topics[i]){
                            newTopics.push(Topics[f]);
                            break;
                        }
                    }
                }
            }
        }

        user_profile.date_of_birth = BirthdayHelper.getBirthdayFromDbFormat(user_profile.date_of_birth);

        this.setState({
            user_profile: user_profile,
            topics: newTopics
        });
    }

    render() {
        return (
            <div className="profile-show">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().userCenterTitle} />
                <div className="user">
                    <div className="user-info">
                        <div className="user-avatar">
                            <img src={ this.state.user_profile.avatar || QiniuDomain + "/logo-image.svg"} alt=""/>
                        </div>
                        <div className="user-profile">
                            <div className="profile-name">{this.state.user_profile.name}</div>
                            <div className="profile-gender-birthday"><span style={{paddingRight: '20px'}}>{this.state.user_profile.gender === 'f' ? Resources.getInstance().profileFemale : Resources.getInstance().profileMale}</span></div>
                            <div className="profile-city-grade">{this.state.user_profile.date_of_birth}</div>
                            {
                                this.state.user_profile.role === MemberType.Student &&
                                <div className="profile-city-grade"><span style={{paddingRight: '20px'}}>{this.state.user_profile.city}</span>
                                    {grade_list[parseInt(this.state.user_profile.grade || 1, 10) - 1].text}</div>
                            }
                            {
                                this.state.user_profile.role === MemberType.Companion &&
                                <div className="profile-city-grade"><span style={{paddingRight: '20px'}}>{this.state.user_profile.time_zone ? this.state.user_profile.time_zone.split('/')[1] : 'unknown'}</span>{grade_list_foreign[parseInt(this.state.user_profile.grade || 1, 10) - 1].text}</div>
                            }
                        </div>
                    </div>
                    <div className="user-country">{this.state.user_profile.country}</div>
                </div>
                <div className="user-hobby">
                    <div className="hobby-title">{Resources.getInstance().userCenterHobby}</div>
                    <div className="hobby-items">
                        {
                            this.state.topics.map((item, index) => {
                                return <Hobby key={index} src={item.url} circleColor={item.color_f}
                                              bgColor={item.color_b} word={item.name} wordColor={item.color_f} select={this.topicChange}
                                              name={item.value}
                                              selected={true}/>
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default UserShow;