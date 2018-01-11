import React, {Component} from 'react';
import {Container, Form, TextArea, Checkbox, Button, Modal, Header, Icon} from 'semantic-ui-react';

const genderOptions = [
    { key: 'm', text: 'Male', value: 'male' },
    { key: 'f', text: 'Female', value: 'female' },
];

const dayOptions = [];

for(let i=1; i<= 31; i++){
    dayOptions.push({key: i, text: i + '', value: i});
}

const monthOptions = [
    { key: 1, text: '1', value: 1 },
    { key: 2, text: '2', value: 2 },
    { key: 3, text: '3', value: 3 },
    { key: 4, text: '4', value: 4 },
    { key: 5, text: '5', value: 5 },
    { key: 6, text: '6', value: 6 },
    { key: 7, text: '7', value: 7 },
    { key: 8, text: '8', value: 8 },
    { key: 9, text: '9', value: 9 },
    { key: 10, text: '10', value: 10 },
    { key: 11, text: '11', value: 11 },
    { key: 12, text: '12', value: 12 }
];

const yearOptions = [];

let yearNow = parseFloat((new Date).getFullYear());

for(let j= yearNow; j >= yearNow - 100; j--){
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
                interests: {},
                introduction: ''
            },
            birthday: {
                day: '',
                month: '',
                year: ''
            }
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

    handleInterestsChange = (e, {name}) => {
        this.state.profile.interests[name] = !this.state.profile.interests[name];

        this.setState({
            profile: this.state.profile
        });
    };

    closeModal(){
        this.setState({modal: false});
    };

    submit(){
        let newInterests = [];
        for (var i in this.state.profile.interests) {
            if(this.state.profile.interests[i]){
                newInterests.push(i);
            }
        }

        this.state.profile.interestsSubmit = newInterests;

        this.setState({modal: true, profile: this.state.profile});
    }

    render() {
        return (
            <Container fluid>
                <h1>Setup your profile</h1>
                <Form>
                    <h4>Name</h4>
                    <Form.Group widths='equal'>
                        <Form.Input fluid placeholder='Your name' value={this.state.profile.name}
                                    onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                        name,
                                        value
                                    })}
                                    name='name' />
                    </Form.Group>
                    <h4>Gender</h4>
                    <Form.Select options={genderOptions} placeholder='Gender' value={this.state.profile.gender}
                                 onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                     name,
                                     value
                                 })}
                                 name='gender' />
                    <h4>Birthday</h4>
                    <Form.Group widths='equal'>
                        <Form.Select options={dayOptions} placeholder='Day' value={this.state.birthday.day}
                                     onChange={(e, {name, value}) => this.handleBirthChange(e, {
                                         name,
                                         value
                                     })}
                                     name='day' />
                        <Form.Select options={monthOptions} placeholder='Month'  value={this.state.birthday.month}
                                     onChange={(e, {name, value}) => this.handleBirthChange(e, {
                                         name,
                                         value
                                     })}
                                     name='month'/>
                        <Form.Select options={yearOptions} placeholder='Year'  value={this.state.birthday.year}
                                     onChange={(e, {name, value}) => this.handleBirthChange(e, {
                                         name,
                                         value
                                     })}
                                     name='year'/>
                    </Form.Group>
                    <h4>Where do you live?</h4>
                    <Form.Group widths='equal'>
                        <Form.Input placeholder='What city do you live in?' value={this.state.profile.city}
                                    onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                        name,
                                        value
                                    })}
                                    name='city' />
                    </Form.Group>
                    <h4>Interests</h4>
                    <Form.Group widths='equal'>
                        <Form.Checkbox name='football' control={Checkbox}  label='Football' width={4} checked={this.state.profile.interests.football}
                                       onChange={(e, {name, checked}) => this.handleInterestsChange(e, {name, checked})} />
                        <Form.Checkbox name='Ping-pang' control={Checkbox}  label='Ping-pang' width={4} checked={this.state.profile.interests['Pingpang']}
                                       onChange={(e, {name}) => this.handleInterestsChange(e, {name})} />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Checkbox  name='volleyball' control={Checkbox}  label='Volleyball' width={4} checked={this.state.profile.interests.volleyball}
                                        onChange={(e, {name}) => this.handleInterestsChange(e, {name})}/>
                        <Form.Checkbox  name='basketball' control={Checkbox}  label='Basketball' width={4} checked={this.state.profile.interests.basketball}
                                        onChange={(e, {name}) => this.handleInterestsChange(e, {name})}/>
                    </Form.Group>
                    <h4>Describe yourself</h4>
                    <Form.Field id='form-opinion' control={TextArea} placeholder='Write a short introduction about yourself.' value={this.state.profile.introduction}
                                onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                    name,
                                    value
                                })}
                                name='introduction' />
                    <Form.Group widths='equal'>
                        <Form.Field id='submit' control={Button} content='Continue' style={{margin: '2em auto', width: '100%', color: 'white', background: 'green'}}
                                                onClick={()=>this.submit()}/>
                    </Form.Group>
                </Form>
                <Modal open={this.state.modal}  closeIcon onClose={() => this.closeModal()}>
                    <Header icon='archive' content='你填写的个人信息为' />
                    <Modal.Content>
                        <p>{JSON.stringify(this.state.profile)}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' onClick={() => this.closeModal()}>
                            <Icon name='checkmark' /> Yes
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Container>
        );
    }
}