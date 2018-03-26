import React, {Component} from 'react';
import {Button, Dropdown, Form} from 'semantic-ui-react';
import Resources from '../resources';
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
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

const grade_list = [
    {key: '1', value: '1', text: '一年级'},
    {key: '2', value: '2', text: '二年级'},
    {key: '3', value: '3', text: '三年级'},
    {key: '4', value: '4', text: '四年级'},
    {key: '5', value: '5', text: '五年级'},
    {key: '6', value: '6', text: '六年级'},
    {key: '7', value: '7', text: '七年级'},
    {key: '8', value: '8', text: '八年级'},
    {key: '9', value: '9', text: '九年级'},
];

const city_list = [
    {key: '0', value: '其他', text: '其他'},
    {key: '1', value: '北京', text: '北京'},
    {key: '2', value: '上海', text: '上海'},
    {key: '3', value: '广州', text: '广州'},
    {key: '4', value: '深圳', text: '深圳'},
    {key: '5', value: '天津', text: '天津'},
    {key: '6', value: '杭州', text: '杭州'},
    {key: '7', value: '南京', text: '南京'},
    {key: '8', value: '济南', text: '济南'},
    {key: '9', value: '重庆', text: '重庆'},
    {key: '10', value: '青岛', text: '青岛'},
    {key: '11', value: '大连', text: '大连'},
    {key: '12', value: '宁波', text: '宁波'},
    {key: '13', value: '厦门', text: '厦门'},
    {key: '14', value: '重庆', text: '重庆'},
    {key: '15', value: '成都', text: '成都'},
    {key: '16', value: '武汉', text: '武汉'},
    {key: '17', value: '哈尔滨', text: '哈尔滨'},
    {key: '18', value: '沈阳', text: '沈阳'},
    {key: '19', value: '西安', text: '西安'},
    {key: '20', value: '长春', text: '长春'},
    {key: '21', value: '长沙', text: '长沙'},
    {key: '22', value: '福州', text: '福州'},
    {key: '23', value: '郑州', text: '郑州'},
    {key: '24', value: '石家庄', text: '石家庄'},
    {key: '25', value: '苏州', text: '苏州'},
    {key: '26', value: '佛山', text: '佛山'},
    {key: '27', value: '东莞', text: '东莞'},
    {key: '28', value: '无锡', text: '无锡'},
    {key: '29', value: '烟台', text: '烟台'},
    {key: '30', value: '太原', text: '太原'},
    {key: '31', value: '合肥', text: '合肥'},
    {key: '32', value: '南昌', text: '南昌'},
    {key: '33', value: '南宁', text: '南宁'},
    {key: '34', value: '昆明', text: '昆明'},
    {key: '35', value: '温州', text: '温州'},
    {key: '36', value: '淄博', text: '淄博'},
    {key: '37', value: '唐山', text: '唐山'},
];

class Homepage extends Component {
    constructor() {
        super();

        this.state = {
            waitSec: 0,
            code: '',
            mobileValid: false,
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
                topics: []
            },
            profile_title: Resources.getInstance().profileStep1Info,
            agreement: true,
            placement_topics: [
                {
                    name: '宇宙',
                    value: 'universe',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Universe.png',
                    color_b: 'rgba(6, 125, 241, .2)',
                    color_f: 'rgba(6, 125, 241, .8)'
                },
                {
                    name: '商业',
                    value: 'busines',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Business.png',
                    color_b: 'rgba( 252, 78, 82, .2)',
                    color_f: 'rgba( 252, 78, 82, .8)'
                },
                {
                    name: '艺术',
                    value: 'art',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Art.png',
                    color_b: 'rgba( 255, 112, 82, .2)',
                    color_f: 'rgba( 255, 112, 82, .8)'
                },
                {
                    name: '食品',
                    value: 'food',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Food.png',
                    color_b: 'rgba( 117, 64, 238, .2)',
                    color_f: 'rgba( 117, 64, 238, .8)'
                },
                {
                    name: '环境',
                    value: 'environment',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Environment.png',
                    color_b: 'rgba(6, 125, 241, .2)',
                    color_f: 'rgba(6, 125, 241, .8)'
                },
                {
                    name: '生活方式',
                    value: 'lifestyle',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Lifestyle.png',
                    color_b: 'rgba(0, 216, 90, .2)',
                    color_f: 'rgba(0, 216, 90, .8)'
                },
                {
                    name: '娱乐',
                    value: 'enterainment',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Enterainment.png',
                    color_b: 'rgba( 237, 207, 0, .2)',
                    color_f: 'rgba( 237, 207, 0, .8)'
                },
                {
                    name: '科学',
                    value: 'science',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Science.png',
                    color_b: 'rgba(255, 112, 82, .2)',
                    color_f: 'rgba(255, 112, 82, .8)'
                },
                {
                    name: '技术',
                    value: 'technology',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Technology.png',
                    color_b: 'rgba(87, 113, 148, .2)',
                    color_f: 'rgba(87, 113, 148, .8)'
                },
                {
                    name: '健康',
                    value: 'health',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Health.png',
                    color_b: 'rgba(0, 216, 90, .2)',
                    color_f: 'rgba(0, 216, 90, .8)'
                },
                {
                    name: '体育',
                    value: 'sports',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Sports.png',
                    color_b: 'rgba(6, 125, 241, .2)',
                    color_f: 'rgba(6, 125, 241, .8)'
                },
                {
                    name: '动物',
                    value: 'animal',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Animal.png',
                    color_b: 'rgba( 237, 207, 0, .2)',
                    color_f: 'rgba( 237, 207, 0, .8)'
                },
                {
                    name: '音乐',
                    value: 'music',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Music.png',
                    color_b: 'rgba( 255, 112, 82, .2)',
                    color_f: 'rgba( 255, 112, 82, .8)'
                },
                {
                    name: '人',
                    value: 'people',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_People.png',
                    color_b: 'rgba(87, 113, 148, .2)',
                    color_f: 'rgba(87, 113, 148, .8)'
                },
                {
                    name: '政治',
                    value: 'politics',
                    url: '//resource.buzzbuzzenglish.com/image/buzz-corner/topics/icon_Politics.png',
                    color_b: 'rgba(0, 216, 90, .2)',
                    color_f: 'rgba(0, 216, 90, .8)'
                }
            ]
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.submit = this.submit.bind(this);
        this.changeGenderMale = this.changeGenderMale.bind(this);
        this.changeGenderFemale = this.changeGenderFemale.bind(this);
        this.topicChange = this.topicChange.bind(this);
        this.goBack = this.goBack.bind(this);
        this.agreementCheck = this.agreementCheck.bind(this);
        this.skipPlacement = this.skipPlacement.bind(this);
        this.sms = this.sms.bind(this);
    }

    async sms() {
      const { code } = await ServiceProxy.proxyTo({
          body: {
              uri: `{config.endPoints.buzzService}/api/v1/mobile/sms`,
              json: { mobile: this.state.profile.phone },
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

    handleCodeChange(event) {
        this.setState({code:event.target.value});
    }

    goBack() {
        if (this.state.step === 1) {
            browserHistory.push('/');
        } else if (this.state.step <= 4) {
            let newStep = this.state.step - 1;
            this.setState({
                step: newStep
            });
        }
    }

    skipPlacement() {
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

    handleChange(event) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile[event.target.name] = event.target.value;
        this.setState({profile: clonedProfile, mobileValid: clonedProfile.phone && clonedProfile.phone.length === 11});
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

            if (this.state.step < 3) {
                if (this.state.step === 1) {
                  try {
                    await ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/mobile/verify`,
                            json: { mobile: this.state.profile.phone, code: this.state.code },
                            method: 'POST'
                        }
                    })
                  } catch (e) {
                    console.log(e)
                    alert(Resources.getInstance().profilePhoneCheckError)
                    return
                  }
                }
                let newStep = this.state.step + 1;
                let newTitle = newStep === 2 ? Resources.getInstance().profileStep2Info : Resources.getInstance().profileStep3Info;
                this.setState({
                    step: newStep,
                    profile_title: newTitle
                });
            } else if (this.state.step === 3) {
                //loading
                document.getElementById('loadingModal').style.display = 'flex';

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
                    let placementResult = await ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/user-placement-tests/${this.state.userId}`
                        }
                    });

                    if (placementResult && placementResult.detail && placementResult.detail.length > 20) {
                        if (document.getElementById('loadingModal')) {
                            document.getElementById('loadingModal').style.display = 'none';
                        }
                        browserHistory.push('/home');
                    } else {
                        let newStep = this.state.step + 1;
                        let newTitle = Resources.getInstance().profileStep4Info;
                        this.setState({
                            step: newStep,
                            profile_title: newTitle
                        });

                        if (document.getElementById('loadingModal')) {
                            document.getElementById('loadingModal').style.display = 'none';
                        }
                    }
                } else {
                    alert('save failed!')
                }
            } else if (this.state.step === 4) {
                browserHistory.push('/placement');
            }

            //this.setState({modal: true, message: Resources.getInstance().saveSuccess});
        } catch (ex) {
            console.error(ex);
            //this.setState({modal: true, message: ex.message || Resources.getInstance().saveFailed});
            if (document.getElementById('loadingModal')) {
                document.getElementById('loadingModal').style.display = 'none';
            }
        }
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
            interests: newTopics
        };
    }

    async componentDidMount() {
        try {
            //await CurrentUser.getUserId()
            let userId = await CurrentUser.getUserId();

            let profile = this.getProfileFromUserData(await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
                }
            }));

            console.log(profile);

            this.setState({
                profile: profile,
                userId: userId
            });
        }
        catch (ex) {
            console.log(ex.toString());
            //browserHistory.push('/');
        }
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
        };
    }

    render() {
        return (
            <div className="my-profile">
                <div id='loadingModal' style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 888,
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'white'
                }}>
                    <embed src="//p579tk2n2.bkt.clouddn.com/index.earth-globe-map-spinner.svg" width="240" height="80"
                           type="image/svg+xml"
                           pluginspage="http://www.adobe.com/svg/viewer/install/" />
                </div>
                <div className="header-with-go-back">
                    <div className="go-back" onClick={this.goBack}>
                        <div className="arrow-left">
                        </div>
                        <div className="circle-border">
                            <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt=""/>
                        </div>
                    </div>
                    <div className="logo">
                        <div>
                            <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png" alt="Buzzbuzz"/>
                        </div>
                    </div>
                </div>
                <div className="profile-progress">
                    <div className={this.state.step > 1 ? 'done' : (this.state.step === 1 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>{Resources.getInstance().profileStep1}</p>
                    </div>
                    <div className={this.state.step > 2 ? 'done' : (this.state.step === 2 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>{Resources.getInstance().profileStep2}</p>
                    </div>
                    <div className={this.state.step > 3 ? 'done' : (this.state.step === 3 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>{Resources.getInstance().profileStep3}</p>
                    </div>
                    <div className={this.state.step > 4 ? 'done' : (this.state.step === 4 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left line-left-last"></div>
                            <div className="circle"></div>
                        </div>
                        <p>{Resources.getInstance().profileStep4}</p>
                    </div>
                </div>
                <Form className='profile-body'>
                    <h3 className="profile-title">{this.state.profile_title}</h3>
                    {
                        this.state.step === 1 ?
                            (
                                <div className="form-content">
                                    <div className="parents-name">
                                        <input type="text" placeholder={Resources.getInstance().profileParentsName} style={{width: '100%'}}
                                               value={this.state.profile.parent_name}
                                               onChange={this.handleChange}
                                               name='parent_name'/>
                                    </div>
                                    <div className="phone-number">
                                        <Button>{Resources.getInstance().profilePhoneInfo}</Button>
                                        <input type="number" style={{width: '60%'}}
                                               value={this.state.profile.phone}
                                               placeholder={Resources.getInstance().profilePhoneHolder}
                                               onChange={this.handleChange}
                                               name='phone'/>
                                    </div>
                                    <div className="check-number">
                                        <input type="text"
                                          value={this.state.code}
                                          onChange={this.handleCodeChange}  disabled={!this.state.mobileValid} style={{width: '60%'}} placeholder={Resources.getInstance().profilePhoneCheck}/>
                                        <Button onClick={this.sms} disabled={!this.state.mobileValid || this.state.waitSec > 0 }>{ this.state.waitSec ||  Resources.getInstance().profilePhoneCheck }</Button>
                                    </div>
                                    <div className="agreement" onClick={this.agreementCheck}>
                                        <img
                                            src={this.state.agreement === true ? "//resource.buzzbuzzenglish.com/image/buzz-corner/icon_select_active.png" : "//resource.buzzbuzzenglish.com/image/buzz-corner/icon_select.png"}
                                            alt=""/>
                                        <span>{Resources.getInstance().profileAgreement}</span>
                                    </div>
                                </div>
                            ) : (
                                this.state.step === 2 ? (
                                    <div className="form-content">
                                        <div className="parents-name">
                                            <input type="text" placeholder={Resources.getInstance().profileChildName} style={{width: '100%'}}
                                                   value={this.state.profile.student_en_name}
                                                   onChange={this.handleChange}
                                                   name='student_en_name'/>
                                        </div>
                                        <div className="gender">
                                            <div className="male" onClick={this.changeGenderMale}>
                                                <div
                                                    className={this.state.profile.gender === 'm' ? 'avatar active' : 'avatar'}>
                                                    <img
                                                        src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_boy.png"
                                                        alt=""/>
                                                </div>
                                                <span
                                                    style={this.state.profile.gender === 'm' ? {color: '#f7b52a'} : {}}>{Resources.getInstance().profileMale}</span>
                                            </div>
                                            <div className="female" onClick={this.changeGenderFemale}>
                                                <div
                                                    className={this.state.profile.gender === 'f' ? 'avatar active' : 'avatar'}>
                                                    <img
                                                        src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_girl.png"
                                                        alt=""/>
                                                </div>
                                                <span
                                                    style={this.state.profile.gender === 'f' ? {color: '#f7b52a'} : {}}>{Resources.getInstance().profileFemale}</span>
                                            </div>
                                        </div>
                                        <Form.Group widths='equal' className="position-relative">
                                            <Form.Input
                                                style={this.state.profile.date_of_birth ? {opacity: '1'} : {opacity: '0'}}
                                                value={this.state.profile.date_of_birth} type="date"
                                                onChange={this.handleChange} name='date_of_birth'/>
                                            <div className="field birthday-label">
                                                <input type="text" placeholder={Resources.getInstance().profileBirth} style={{width: '100%'}}
                                                       value={this.state.birthdayLabel || ''}
                                                       onChange={this.handleChangeBirthdayLabel}
                                                       name='birthdayLabel'/>
                                            </div>
                                        </Form.Group>
                                        <div className="selection-options">
                                            <Dropdown placeholder={Resources.getInstance().profileCity} search selection noResultsMessage="没有这个城市哦"
                                                      onChange={(event, data) => {
                                                          this.handleCityChange(event, data)
                                                      }} value={this.state.profile.city}
                                                      options={city_list}/>
                                            <Dropdown placeholder={Resources.getInstance().profileGrade} search selection noResultsMessage="例如: 六年级"
                                                      onChange={(event, data) => {
                                                          this.handleGradeChange(event, data)
                                                      }} value={this.state.profile.grade}
                                                      options={grade_list}/>
                                        </div>
                                    </div>
                                ) : (
                                    this.state.step === 3 ?
                                        (<div className='topic form-content'>
                                            <p>{Resources.getInstance().profileStep3}</p>
                                            <div className="topic-items">
                                                {
                                                    this.state.placement_topics.map((item, index) => {
                                                        return <div key={index}
                                                                    style={{backgroundColor: item.color_b}}>
                                                            <div>
                                                                <img src={item.url} alt="topic"/>
                                                            </div>
                                                            <p style={{color: item.color_f}}>{item.name}</p>
                                                            <a onClick={this.topicChange} name={item.value}
                                                               style={{border: this.state.profile.topics.indexOf(item.value) >= 0 ? '1px solid #f7b52a' : '1px solid transparent'}}>&nbsp;</a>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>) :
                                        (
                                            <div className="form-content">
                                                <h4>{Resources.getInstance().profileStep4InfoWord1}<span style={{color: '#f7b52a'}}>{Resources.getInstance().profileStep4InfoWordBold}</span></h4>
                                                <img className="profile-done-img"
                                                     src="//resource.buzzbuzzenglish.com/image/buzz-corner/friends.png"
                                                     alt=""/>
                                            </div>
                                        )
                                )
                            )
                    }
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content={this.state.step < 4 ? Resources.getInstance().profileContinue : Resources.getInstance().profileDone}
                                    disabled={this.state.step === 1 ? (!this.state.profile.phone || this.state.profile.phone.length !== 11 || !this.state.profile.parent_name || !this.state.agreement) : (this.state.step === 2 ? (!this.state.profile.student_en_name || !this.state.profile.date_of_birth || !this.state.profile.city || !this.state.profile.gender || !this.state.profile.grade || this.state.profile.gender === 'u') : (this.state.step === 3 ? !this.state.profile.topics.length : false))}
                                    style={!(this.state.step === 1 ? (!this.state.profile.phone || this.state.profile.phone.length !== 11 || !this.state.profile.parent_name || !this.state.agreement) : (this.state.step === 2 ? (!this.state.profile.student_en_name || !this.state.profile.date_of_birth || !this.state.profile.city || !this.state.profile.gender) : (this.state.step === 3 ? !this.state.profile.topics.length : false))) ? {
                                        margin: '2em auto .5em auto',
                                        width: '100%',
                                        color: 'rgb(255,255,255)',
                                        background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))',
                                        height: '4em',
                                        letterSpacing: '4px',
                                        fontWeight: 'normal',
                                        borderRadius: '30px',
                                        opacity: '1 !important'
                                    } : {
                                        margin: '2em auto .5em auto',
                                        width: '100%',
                                        color: 'rgb(255,255,255)',
                                        backgroundColor: 'rgb(223, 223, 228)',
                                        height: '4em',
                                        letterSpacing: '4px',
                                        fontWeight: 'normal',
                                        borderRadius: '30px',
                                        opacity: '1 !important'
                                    }} onClick={this.submit}/>
                    </Form.Group>
                    {
                        this.state.step === 4 ? (
                            <div className="skip" onClick={this.skipPlacement}>{Resources.getInstance().profileSkipNow}</div>
                        ) : ('')
                    }
                </Form>
                <br/>
            </div>
        );
    }
}

export default Homepage;
