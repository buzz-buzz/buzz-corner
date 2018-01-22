import React, {Component} from 'react';
import {Button, Checkbox, Container, Form, Header, Icon, Modal, TextArea} from 'semantic-ui-react';
import ServiceProxy from '../../service-proxy';
import Resources from '../../resources';
import CurrentUser from "../../membership/user";

const genderOptions = [
    {key: 'm', text: 'Male', value: 'm'},
    {key: 'f', text: 'Female', value: 'f'},
];

const dayOptions = [];

for (let i = 1; i <= 31; i++) {
    dayOptions.push({key: i, text: i + '', value: i > 9 ? i + '' : '0' + i});
}

const monthOptions = [
    {key: 1, text: '1', value: '01'},
    {key: 2, text: '2', value: '02'},
    {key: 3, text: '3', value: '03'},
    {key: 4, text: '4', value: '04'},
    {key: 5, text: '5', value: '05'},
    {key: 6, text: '6', value: '06'},
    {key: 7, text: '7', value: '07'},
    {key: 8, text: '8', value: '08'},
    {key: 9, text: '9', value: '09'},
    {key: 10, text: '10', value: '10'},
    {key: 11, text: '11', value: '11'},
    {key: 12, text: '12', value: '12'}
];

const yearOptions = [];

let yearNow = parseFloat((new Date).getFullYear());

for (let j = yearNow; j >= yearNow - 100; j--) {
    yearOptions.push({key: j, text: j + '', value: j + ''});
}

export default class profileSetup extends Component {
    handleProfileChange = (e, {name, value}) => {
        let clonedProfileInfo = Object.assign({}, this.state.profile);
        clonedProfileInfo[name] = value;

        this.setState({
            profile: clonedProfileInfo
        });
    };
    handleBirthChange = (e, {name, value}) => {
        let clonedBirthday = Object.assign({}, this.state.birthday);
        clonedBirthday[name] = value;

        this.setState({
            birthday: clonedBirthday
        });
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

    constructor() {
        super();

        this.state = {
            profile: {
                display_name: '',
                gender: '',
                location: '',
                avatar: '',
                interests: [],
                description: '',
                mobile: '',
                email: '',
                role: 's',
                date_of_birth: '',
            },
            birthday: {
                day: '',
                month: '',
                year: ''
            },
            msg: ''
        };

        this.submit = this.submit.bind(this);
    }

    closeModal() {
        this.setState({modal: false});
    };

    async submit() {
        try {
            let profile = this.validateForm();

            let response = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.userId}`,
                    json: profile,
                    method: 'PUT'
                }
            });

            this.setState({modal: true, msg: 'Save success!'});
        } catch (ex) {
            console.error(ex);
            this.setState({modal: true, msg: ex.message || 'Save failed!'});
        }
    }

    validateForm() {
        let profile = this.state.profile;
        if (!profile.location) {
            throw new Error('Please tell me your city!')
        }

        //data check if could save to db
        if (this.state.birthday.day && this.state.birthday.month && this.state.birthday.year) {
            profile.date_of_birth = new Date(this.state.birthday.year + '' + this.state.birthday.month + '' + this.state.birthday.day)
        } else {
            throw new Error('Please tell me your birthday!');
        }

        if (!profile.gender) {
            throw new Error('Please tell me your gender!');
        }

        if (!profile.display_name) {
            throw new Error('Please tell me your name!');
        }
        return profile;
    }

    async componentDidMount() {
        let userId = await CurrentUser.getUserId();

        let profile = this.getProfileFromUserData(await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
            }
        }));

        this.setState({
            userId: userId,
            profile: profile,
            birthday: {day: '05', month: '05', year: '2005'}
        });
    }

    getProfileFromUserData(userData) {
        return {
            interests: userData.interests instanceof Array ? userData.interests : (userData.interests ? [userData.interests] : []),
            display_name: userData.display_name || userData.name || userData.facebook_name || userData.wechat_name || '',
            date_of_birth: userData.date_of_birth,
            gender: userData.gender || '',
            location: userData.location || '',
            avatar: userData.avatar || '',
            description: userData.description || '',
            mobile: userData.mobile || '',
            email: userData.email || '',
            role: userData.role || ''
        };
    }

    render() {
        return (
            <Container fluid>
                <h1 style={{margin: '14px 0', textAlign: 'center'}}>{Resources.getInstance().profileTitle}</h1>
                <Form>
                    <h4>{Resources.getInstance().profileName}</h4>
                    <Form.Group widths='equal'>
                        <Form.Input fluid placeholder={Resources.getInstance().profileNameHolder}
                                    value={this.state.profile.display_name}
                                    onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                        name,
                                        value
                                    })}
                                    name='display_name' error={!this.state.profile.display_name}/>
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
                        <Form.Input placeholder='What city do you live in?' value={this.state.profile.location}
                                    onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                        name,
                                        value
                                    })}
                                    name='location' error={!this.state.profile.location}/>
                    </Form.Group>
                    <h4>Interests</h4>
                    <Form.Group widths='equal'>
                        <Form.Checkbox name='football' control={Checkbox} label='Football' width={4}
                                       checked={this.state.profile.interests.indexOf('football') >= 0}
                                       onChange={(e, data) => {
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
                                value={this.state.profile.description}
                                onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                    name,
                                    value
                                })}
                                name='description'/>
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content='Continue'
                                    style={{margin: '2em auto', width: '100%', color: 'white', background: 'green'}}
                                    onClick={this.submit}/>
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