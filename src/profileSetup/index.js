import React, {Component} from 'react';
import {Container, Form, TextArea, Checkbox, Button, Modal, Header, Icon} from 'semantic-ui-react';
import ServiceProxy from '../service-proxy';


const genderOptions = [
    {key: 'm', text: 'Male', value: 'male'},
    {key: 'f', text: 'Female', value: 'female'},
];

const dayOptions = [];

for (let i = 1; i <= 31; i++) {
    dayOptions.push({key: i, text: i + '', value: i});
}

const monthOptions = [
    {key: 1, text: '1', value: 1},
    {key: 2, text: '2', value: 2},
    {key: 3, text: '3', value: 3},
    {key: 4, text: '4', value: 4},
    {key: 5, text: '5', value: 5},
    {key: 6, text: '6', value: 6},
    {key: 7, text: '7', value: 7},
    {key: 8, text: '8', value: 8},
    {key: 9, text: '9', value: 9},
    {key: 10, text: '10', value: 10},
    {key: 11, text: '11', value: 11},
    {key: 12, text: '12', value: 12}
];

const yearOptions = [];

let yearNow = parseFloat((new Date).getFullYear());

for (let j = yearNow; j >= yearNow - 100; j--) {
    yearOptions.push({key: j, text: j + '', value: j});
}

export default class profileSetup extends Component {
    constructor() {
        super();

        this.state = {
            profile: {
                name: '',
                gender: '',
                city: '',
                avatar: '',
                interests: [],
                introduction: '',
                phone: '',
                mail: '',
                user_type: 1
            },
            birthday: {
                day: '',
                month: '',
                year: ''
            },
            msg: ''
        }
    }

    handleProfileChange = (e, {name, value}) => {
        this.state.profile[name] = value;

        this.setState({
            profile: this.state.profile
        });

        console.log(this.state.profile);
    };

    handleBirthChange = (e, {name, value}) => {
        this.state.birthday[name] = value;

        this.setState({
            birthday: this.state.birthday
        });

        console.log(this.state.birthday);
    };

    handleInterestsChange = (e, {name, checked}) => {
        let clonedProfile = Object.assign({}, this.state.profile);
        if (checked) {
            if (clonedProfile.interests.indexOf(name) < 0) {
                clonedProfile.interests.push(name);
            }
        } else {
            let index = clonedProfile.interests.indexOf(name);
            if (index >= 0) {
                clonedProfile.interests.splice(index, 1);
            }
        }

        this.setState({
            profile: clonedProfile
        });
    };

    closeModal() {
        this.setState({modal: false});
    };

    async submit() {
        let config = await ServiceProxy.proxy('/config');
        let msg = '';
        let clonedSubmitProfile = Object.assign({}, this.state.profile);

        if (!clonedSubmitProfile.city) {
            msg = 'Please tell me your city!'
        }

        //data check if could save to db
        if (this.state.birthday.day && this.state.birthday.month && this.state.birthday.year) {
            clonedSubmitProfile.birthday = this.state.birthday.year + '' + (this.state.birthday.month > 9 ? this.state.birthday.month : '0' + this.state.birthday.month) + (this.state.birthday.day > 9 ? this.state.birthday.day : '0' + this.state.birthday.day);
        } else {
            msg = 'Please tell me your birthday!';
        }

        if (!clonedSubmitProfile.gender) {
            msg = 'Please tell me your gender!'
        }

        if (!clonedSubmitProfile.name) {
            msg = 'Please tell me your name!'
        }

        if (!msg) {
            msg = JSON.stringify(clonedSubmitProfile);
        }

        //save to db
        let response = await ServiceProxy.proxyTo({
            body: {
                uri:config.endPoints.buzzService + '/corner/profile/c7b6d3fb-32ea-4606-8358-3b7c70fb1dea',
                json: clonedSubmitProfile,
                method: 'POST'
            }
        });

        if(response && response.msg === 'success'){
            this.setState({modal: true, msg: 'Success!'});
        }else{
            this.setState({modal: true, msg: response.msg || 'something was wrong!'});
        }

    }

    async componentDidMount() {
        let config = await ServiceProxy.proxy('/config');

        let userInfo = await ServiceProxy.proxy('/user-info');

        if(!userInfo.member_id){
            alert('You haven\'t Login');
        }

        //get profile first
        let profile = await ServiceProxy.proxyTo({
            body: {
                uri:config.endPoints.buzzService  + `/corner/profile/` + userInfo.member_id
            }
        });

        if(!profile.member_id){
            //first login
        }else{
            profile.interests = profile.interests || [];

            if(profile.birthday && profile.birthday.length === 8){
                profile.birthday = {
                    day: parseFloat(profile.birthday.substring(6)),
                    month: parseFloat(profile.birthday.substring(4, 6)),
                    year: parseFloat(profile.birthday.substring(0, 4))
                }
            }

            if (profile.member_id) {
                this.setState({
                    profile: profile,
                    birthday: profile.birthday
                });
            }
        }
    }

    render() {
        return (
            <Container fluid>
                <h1 style={{margin: '14px 0', textAlign: 'center'}}>Setup your profile</h1>
                <Form>
                    <h4>Name</h4>
                    <Form.Group widths='equal'>
                        <Form.Input fluid placeholder='Your name' value={this.state.profile.name}
                                    onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                        name,
                                        value
                                    })}
                                    name='name' error={!this.state.profile.name}/>
                    </Form.Group>
                    <h4>Gender</h4>
                    <Form.Select options={genderOptions} placeholder='Gender' value={this.state.profile.gender}
                                 onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                     name,
                                     value
                                 })}
                                 name='gender' error={!this.state.profile.gender}/>
                    <h4>Birthday</h4>
                    <Form.Group widths='equal'>
                        <Form.Select options={dayOptions} placeholder='Day' value={this.state.birthday.day}
                                     onChange={(e, {name, value}) => this.handleBirthChange(e, {
                                         name,
                                         value
                                     })}
                                     name='day' error={!this.state.birthday.day}/>
                        <Form.Select options={monthOptions} placeholder='Month' value={this.state.birthday.month}
                                     onChange={(e, {name, value}) => this.handleBirthChange(e, {
                                         name,
                                         value
                                     })}
                                     name='month' error={!this.state.birthday.month}/>
                        <Form.Select options={yearOptions} placeholder='Year' value={this.state.birthday.year}
                                     onChange={(e, {name, value}) => this.handleBirthChange(e, {
                                         name,
                                         value
                                     })}
                                     name='year' error={!this.state.birthday.year}/>
                    </Form.Group>
                    <h4>Where do you live?</h4>
                    <Form.Group widths='equal'>
                        <Form.Input placeholder='What city do you live in?' value={this.state.profile.city}
                                    onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                        name,
                                        value
                                    })}
                                    name='city' error={!this.state.profile.city}/>
                    </Form.Group>
                    <h4>Interests</h4>
                    <Form.Group widths='equal'>
                        <Form.Checkbox name='football' control={Checkbox} label='Football' width={4}
                                       checked={this.state.profile.interests.indexOf('football') >= 0}
                                       onChange={ (e, data) => {
                                           this.handleInterestsChange(e, data);
                                       }}/>
                        <Form.Checkbox name='pingpang' control={Checkbox} label='Ping-pang' width={4}
                                       checked={this.state.profile.interests.indexOf('pingpang') >= 0}
                                       onChange={(e, data) => this.handleInterestsChange(e, data)}/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Checkbox name='volleyball' control={Checkbox} label='Volleyball' width={4}
                                       checked={this.state.profile.interests.indexOf('volleyball') >= 0}
                                       onChange={(e, data) => this.handleInterestsChange(e, data)}/>
                        <Form.Checkbox name='basketball' control={Checkbox} label='Basketball' width={4}
                                       checked={this.state.profile.interests.indexOf('basketball') >= 0}
                                       onChange={(e, data) => this.handleInterestsChange(e, data)}/>
                    </Form.Group>
                    <h4>Describe yourself</h4>
                    <Form.Field id='form-opinion' control={TextArea}
                                placeholder='Write a short introduction about yourself.'
                                value={this.state.profile.introduction}
                                onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                    name,
                                    value
                                })}
                                name='introduction'/>
                    <Form.Group widths='equal'>
                        <Form.Field id='submit' control={Button} content='Continue'
                                    style={{margin: '2em auto', width: '100%', color: 'white', background: 'green'}}
                                    onClick={() => this.submit()}/>
                    </Form.Group>
                </Form>
                <Modal open={this.state.modal} closeIcon onClose={() => this.closeModal()}>
                    <Header icon='archive' content='Message'/>
                    <Modal.Content>
                        <p>{this.state.msg}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' onClick={() => this.closeModal()}>
                            <Icon name='checkmark'/> Yes
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Container>
        );
    }
}