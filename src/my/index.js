import React, {Component} from 'react';
import {Form, Button} from 'semantic-ui-react';
import HeaderWithBack from '../layout/header-with-go-back';
import './my.css';

class Homepage extends Component {
    constructor() {
        super();

        this.state = {
            step: 3,
            profile: {
                parents_name: '',
                phone: '',
                student_en_name: '',
                city: '',
                date_of_birth: '',
                gender: '',
                topics: []
            },
            profile_title: '仅用于课程学习相关通知与服务',
            topic_url: "https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.handleGender = this.handleGender.bind(this);
        this.topicChange = this.topicChange.bind(this);
    }

    topicChange(event){
        event.stopPropagation();
        console.log(event.target.name);

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

        console.log(this.state.profile.topics);
    }

    handleGender(event){
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile.gender =  event.target.value;
        this.setState({profile: clonedProfile});
    }

    handleChange(event) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile[event.target.name] =  event.target.value;
        this.setState({profile: clonedProfile});
    }

    async submit() {
        try {
            if(this.state.step < 4){
                let newStep = this.state.step +1;
                let newTitle = newStep === 2 ? '用于平台中呈现孩子的基本资料' : (newStep === 3 ? '用于匹配相似兴趣爱好的话题小组' : '建立孩子的语言档案');
                this.setState({
                    step: newStep,
                    profile_title: newTitle
                });
            }else{
                //done
                console.log('用户填写完毕');
                console.log(this.state.profile);
            }

            //this.setState({modal: true, message: Resources.getInstance().saveSuccess});
        } catch (ex) {
            console.error(ex);
            //this.setState({modal: true, message: ex.message || Resources.getInstance().saveFailed});
        }
    }

    render() {
        return (
            <div className="my-profile">
                <HeaderWithBack/>
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
                        <p>孩子信息</p>
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
                        <p>语言档案</p>
                    </div>
                </div>
                <Form>
                    <h3 className="profile-title">{this.state.profile_title}</h3>
                    {
                        this.state.step === 1 ?
                            (
                                <div>
                                    <div className="parents-name">
                                        <input type="text"  placeholder='家长姓名' style={{width: '100%'}}
                                               value={this.state.profile.parents_name}
                                               onChange={this.handleChange}
                                               name='parents_name' />
                                    </div>
                                    <div className="phone-number">
                                        <Button>中国(+86)</Button>
                                        <input type="text" style={{width: '60%'}}
                                               value={this.state.profile.phone}
                                               onChange={this.handleChange}
                                               name='phone'/>
                                    </div>
                                    <div className="check-number">
                                        <input type="text" style={{width: '60%'}}/>
                                        <Button>获取验证码</Button>
                                    </div>
                                </div>
                            ) : (
                                this.state.step === 2 ? (
                                    <div>
                                        <div className="parents-name">
                                            <input type="text"  placeholder='学生英文名' style={{width: '100%'}}
                                                   value={this.state.profile.student_en_name}
                                                   onChange={this.handleChange}
                                                   name='student_en_name' />
                                        </div>
                                        <div className="gender">
                                            <Button name="gender" value="male" onClick={this.handleGender} style={{border: this.state.profile.gender === 'male' ? '1px solid #f7b52a' : ''}} >男</Button>
                                            <Button name="gender" value="female" onClick={this.handleGender} style={{border: this.state.profile.gender === 'female' ? '1px solid #f7b52a' : ''}}>女</Button>
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
                                            (<div className='topic'>
                                                <p>Choose type</p>
                                                <div className="topic-items">
                                                    <div>
                                                        <div>
                                                            <img src={this.state.topic_url} />
                                                        </div>
                                                        <p>First</p>
                                                        <a  onClick={this.topicChange} name="first"
                                                            style={{border: this.state.profile.topics.indexOf('first') >=0 ? '1px solid #f7b52a' : '1px solid transparent'}}/>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <img src={this.state.topic_url} />
                                                        </div>
                                                        <p>Second</p>
                                                        <a  onClick={this.topicChange} name="second"
                                                            style={{border: this.state.profile.topics.indexOf('second') >=0 ? '1px solid #f7b52a' : '1px solid transparent'}}/>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <img src={this.state.topic_url} />
                                                        </div>
                                                        <p>Third</p>
                                                        <a  onClick={this.topicChange} name="third"
                                                            style={{border: this.state.profile.topics.indexOf('third') >=0 ? '1px solid #f7b52a' : '1px solid transparent'}}/>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <img src={this.state.topic_url} />
                                                        </div>
                                                        <p>Fourth</p>
                                                        <a  onClick={this.topicChange} name="fourth"
                                                            style={{border: this.state.profile.topics.indexOf('fourth') >=0 ? '1px solid #f7b52a' : '1px solid transparent'}}/>
                                                    </div>
                                                </div>
                                            </div>) :
                                            (
                                                <div></div>
                                            )
                                    )
                            )
                    }
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content={this.state.step < 4 ? '继续' : '完成'} disabled={this.state.step === 1 ? (!this.state.profile.phone || !this.state.profile.parents_name) : (this.state.step === 2 ? (!this.state.profile.student_en_name || !this.state.profile.date_of_birth || !this.state.profile.city || !this.state.profile.gender): (this.state.step === 3 ?  !this.state.profile.topics.length : false))}
                                    style={{margin: '2em auto', width: '100%', color: 'rgba(0,0,0,.6)', backgroundColor: '#f7b52a', height: '4em', letterSpacing: '4px', fontWeight: 'normal', borderRadius: '30px'}} onClick={this.submit} />
                    </Form.Group>
                </Form>
                <br/>
            </div>
        );
    }
}

export default Homepage;