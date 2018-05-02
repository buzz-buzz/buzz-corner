import React, {Component} from 'react';
import Resources from '../../resources';
import HeaderWithBack from '../../common/commonComponent/headerWithBack';
import Hobby from '../../my/hobby';
import Track from "../../common/track";
import {Topics} from "../../common/systemData/topicData";
import './index.css';
import ServiceProxy from "../../service-proxy";


function getBirthDay(date_of_birth) {
    if (date_of_birth) {
        let date = new Date(date_of_birth);
        return String(date.getFullYear()) + '-' + String(date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + String(date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
    } else {
        return ''
    }
}

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_profile: {},
            topics: [],
            user_id: props.params.user_id
        };

        this.topicChange = this.topicChange.bind(this);
        this.back = this.back.bind(this);
    }

    topicChange(){}

    back(){
        window.history.back();
    }

    async componentWillMount(){
        //topics
        let user_profile = await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.user_id}?t=${new Date().getTime()}`
            }
        });

        let newTopics = [];

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

        user_profile.date_of_birth = getBirthDay(user_profile.date_of_birth);

        console.log('=========--------------==========')
        console.log(user_profile.date_of_birth)

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
                            <img src={ this.state.user_profile.avatar || "//p579tk2n2.bkt.clouddn.com/logo-image.svg"} alt=""/>
                        </div>
                        <div className="user-profile">
                            <div className="profile-name">{this.state.user_profile.name}</div>
                            <div className="profile-gender-birthday"><span style={{paddingRight: '20px'}}>{this.state.user_profile.gender === 'f' ? Resources.getInstance().profileFemale : Resources.getInstance().profileMale}</span>{this.state.user_profile.date_of_birth}</div>
                            <div className="profile-city-grade"><span style={{paddingRight: '20px'}}>{this.state.user_profile.city}</span>{this.state.user_profile.grade}年级</div>
                            <div className="profile-city-grade"><span style={{paddingRight: '20px'}}>{this.state.user_profile.city}</span>{this.state.user_profile.grade}年级</div>
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

export default User;