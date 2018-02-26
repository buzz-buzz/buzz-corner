import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import './my.css';

function getBirthDay(date_of_birth) {
    if (date_of_birth) {
        let date = new Date(date_of_birth);
        return  String(date.getFullYear()) + '-' + String(date.getMonth() + 1 >9?date.getMonth() + 1:'0'+(date.getMonth() + 1)) + '-' + String(date.getDate()>9?date.getDate():'0'+date.getDate());
    } else {
        return ''
    }
}

class Homepage extends Component {
    constructor() {
        super();

        this.state = {
            step: 1,
            profile: {
                parents_name: '',
                phone: '',
                student_en_name: '',
                city: '',
                date_of_birth: '',
                gender: 'm',
                topics: []
            },
            profile_title: '仅用于课程学习相关通知与服务',
            topic_url: "https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd",
            agreement: false,
            placement_topics: [
                {
                    name: '宇宙',
                    value: '1'
                },
                {
                    name: '商业',
                    value: '2'
                },
                {
                    name: '艺术',
                    value: '3'
                },
                {
                    name: '食品',
                    value: '4'
                },
                {
                    name: '环境',
                    value: '5'
                },
                {
                    name: '生活方式',
                    value: '6'
                },
                {
                    name: '娱乐',
                    value: '7'
                }
            ]
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.changeGenderMale = this.changeGenderMale.bind(this);
        this.changeGenderFemale = this.changeGenderFemale.bind(this);
        this.topicChange = this.topicChange.bind(this);
        this.goBack = this.goBack.bind(this);
        this.agreementCheck = this.agreementCheck.bind(this);
    }

    goBack(){
        if(this.state.step === 1){
            browserHistory.push('/');
        }else if(this.state.step <= 4){
            let newStep = this.state.step - 1;
            this.setState({
                step: newStep
            });
        }
    }

    topicChange(event){
        event.stopPropagation();

        let clonedProfile = this.state.profile;
        let clonedTopics = clonedProfile.topics;

        if(clonedTopics.indexOf(event.target.name) < 0){
            clonedTopics.push(event.target.name);

            clonedProfile.topics = clonedTopics;
        }else{
            let newTopics = [];
            for(let i in clonedTopics){
                if(clonedTopics[i] !== event.target.name){
                    newTopics.push(clonedTopics[i]);
                }
            }

            clonedProfile.topics = newTopics;
        }

        this.setState({profile: clonedProfile});
    }

    changeGenderFemale(){
        let gender = this.state.profile.gender;

        if(gender !== 'f'){
            let clonedProfile = this.state.profile;
            clonedProfile.gender = 'f';
            this.setState({
                profile: clonedProfile
            });
        }
    }

    changeGenderMale(){
        let gender = this.state.profile.gender;

        if(gender !== 'm'){
            let clonedProfile = this.state.profile;
            clonedProfile.gender = 'm';
            this.setState({
                profile: clonedProfile
            });
        }
    }

    handleChange(event) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile[event.target.name] =  event.target.value;
        this.setState({profile: clonedProfile});
    }

    agreementCheck(){
        let agreement = this.state.agreement;
        this.setState({
            agreement: !agreement
        });
    }

    async submit() {
        try {
            if(this.state.step < 4){
                let newStep = this.state.step +1;
                let newTitle = newStep === 2 ? '用于平台中呈现少年的基本资料' : (newStep === 3 ? '用于匹配最优话题小组' : '建立少年的语言档案');
                this.setState({
                    step: newStep,
                    profile_title: newTitle
                });
            }else{
                //done
                let profileData = this.validateForm();

                console.log(profileData);

                // let response = await ServiceProxy.proxyTo({
                //     body: {
                //         uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.userId}`,
                //         json: profileData,
                //         method: 'PUT'
                //     }
                // });

                browserHistory.push('/placement');
            }

            //this.setState({modal: true, message: Resources.getInstance().saveSuccess});
        } catch (ex) {
            console.error(ex);
            //this.setState({modal: true, message: ex.message || Resources.getInstance().saveFailed});
        }
    }

    validateForm() {
        let profile = this.state.profile;

        return {
            display_name: profile.student_en_name,
            gender: profile.gender,
            location: profile.city,
            mobile: profile.phone,
            date_of_birth: getBirthDay(profile.date_of_birth)
        };
    }

    async componentDidMount() {
        // let userId = await CurrentUser.getUserId();
        //
        // let profile = this.getProfileFromUserData(await ServiceProxy.proxyTo({
        //     body: {
        //         uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
        //     }
        // }));
        //
        // this.setState({
        //     profile: profile,
        //     userId: userId
        // });
    }

    getProfileFromUserData(userData) {
        return {
            parents_name: '',
            phone: userData.mobile || '',
            student_en_name: userData.display_name || '',
            city: userData.location || '',
            date_of_birth: getBirthDay(userData.date_of_birth),
            gender: userData.gender,
            topics: []
        };
    }

    render() {
        return (
            <div className="my-profile">
                <div className="header-with-go-back">
                    <div className="go-back" onClick={this.goBack}>
                        <div className="arrow-left">
                        </div>
                        <div className="circle-border">
                            <Icon className='arrow left'  />
                        </div>
                    </div>
                    <div className="logo">
                        <div>
                            <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png"/>
                        </div>
                    </div>
                </div>
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
                        <p>少年信息</p>
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
                        <p>解密暗号</p>
                    </div>
                </div>
                <Form className='profile-body'>
                    <h3 className="profile-title">{this.state.profile_title}</h3>
                    {
                        this.state.step === 1 ?
                            (
                                <div className="form-content">
                                    <div className="parents-name">
                                        <input type="text"  placeholder='家长姓名' style={{width: '100%'}}
                                               value={this.state.profile.parents_name}
                                               onChange={this.handleChange}
                                               name='parents_name' />
                                    </div>
                                    <div className="phone-number">
                                        <Button>中国(+86)</Button>
                                        <input type="number" style={{width: '60%'}}
                                               value={this.state.profile.phone}
                                               onChange={this.handleChange}
                                               name='phone' />
                                    </div>
                                    <div className="check-number">
                                        <input type="text" style={{width: '60%'}}/>
                                        <Button>获取验证码</Button>
                                    </div>
                                    <div className="agreement" onClick={this.agreementCheck}>
                                        <Icon className='check circle' style={this.state.agreement === true ? {color: '#f7b52a'} : {}}  />
                                        <span>我已接受并遵守BuzzBuzz的相关用户协议与条款</span>
                                    </div>
                                </div>
                            ) : (
                                this.state.step === 2 ? (
                                    <div className="form-content">
                                        <div className="parents-name">
                                            <input type="text"  placeholder='少年英文名' style={{width: '100%'}}
                                                   value={this.state.profile.student_en_name}
                                                   onChange={this.handleChange}
                                                   name='student_en_name' />
                                        </div>
                                        <div className="gender">
                                            <div className="male" onClick={this.changeGenderMale}>
                                                <div className={this.state.profile.gender === 'm' ? 'avatar active' : 'avatar'}>
                                                    <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                                </div>
                                                <span style={this.state.profile.gender === 'm' ? {color: '#f7b52a'} : {}}>男</span>
                                            </div>
                                            <div className="female"  onClick={this.changeGenderFemale}>
                                                <div className={ this.state.profile.gender === 'f' ? 'avatar active' : 'avatar'}>
                                                    <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                                </div>
                                                <span style={this.state.profile.gender === 'f' ? {color: '#f7b52a'} : {}}>女</span>
                                            </div>
                                        </div>
                                        <Form.Group widths='equal'>
                                            <Form.Input value={this.state.profile.date_of_birth} type="date" onChange={this.handleChange} name='date_of_birth' />
                                        </Form.Group>
                                        <div className="parents-name">
                                            <input type="text"  placeholder='所在城市' style={{width: '100%'}}
                                                   value={this.state.profile.city}
                                                   onChange={this.handleChange}
                                                   name='city' />
                                        </div>
                                    </div>
                                    ): (
                                        this.state.step === 3 ?
                                            (<div className='topic form-content'>
                                                <p>兴趣爱好</p>
                                                <div className="topic-items">
                                                    {
                                                        this.state.placement_topics.map((item, index) => {
                                                            return <div  key={index}>
                                                                <div>
                                                                    <img src={this.state.topic_url} />
                                                                </div>
                                                                <p>{item.name}</p>
                                                                <a  onClick={this.topicChange} name={item.value}
                                                                    style={{border: this.state.profile.topics.indexOf(item.value) >=0 ? '1px solid #f7b52a' : '1px solid transparent'}}/>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            </div>) :
                                            (
                                                <div className="form-content">
                                                    <h4>通过4道小问题帮助我们了解并为你的</h4>
                                                    <h4>孩子优先匹配最合适<span style={{color: '#f7b52a'}}>外籍伙伴</span></h4>
                                                </div>
                                            )
                                    )
                            )
                    }
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content={this.state.step < 4 ? '继续' : '完成'} disabled={this.state.step === 1 ? (!this.state.profile.phone || !this.state.profile.parents_name || !this.state.agreement) : (this.state.step === 2 ? (!this.state.profile.student_en_name || !this.state.profile.date_of_birth || !this.state.profile.city || !this.state.profile.gender): (this.state.step === 3 ?  !this.state.profile.topics.length : false))}
                                    style={!(this.state.step === 1 ? (!this.state.profile.phone || !this.state.profile.parents_name || !this.state.agreement) : (this.state.step === 2 ? (!this.state.profile.student_en_name || !this.state.profile.date_of_birth || !this.state.profile.city || !this.state.profile.gender): (this.state.step === 3 ?  !this.state.profile.topics.length : false))) ? {margin: '2em auto .5em auto', width: '100%', color: 'rgba(0,0,0,.6)', background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))', height: '4em', letterSpacing: '4px', fontWeight: 'normal', borderRadius: '30px'} : {margin: '2em auto .5em auto', width: '100%', color: 'white', backgroundColor: 'rgb(223, 223, 228)', height: '4em', letterSpacing: '4px', fontWeight: 'normal', borderRadius: '30px', opacity: '1 !important'}} onClick={this.submit} />
                    </Form.Group>
                    {
                        this.state.step === 4 ? (
                                <div className="skip">Skip and setup later</div>
                            ):('')
                    }
                </Form>
                <br/>
            </div>
        );
    }
}

export default Homepage;