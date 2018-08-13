import React, {Component} from 'react';
import {Button, Checkbox, Container, Form, Header, Icon, Modal, TextArea} from 'semantic-ui-react';
import ServiceProxy from '../../service-proxy';
import Resources from '../../resources';
import CurrentUser from "../../membership/user";
import BirthdayHelper from '../../common/birthdayFormat';
import ErrorHandler from "../../common/error-handler";

const genderOptions = [
    {key: 'm', text: 'Male', value: 'm'},
    {key: 'f', text: 'Female', value: 'f'},
];

export default class profileSetup extends Component {
    handleProfileChange = (e, {name, value}) => {
        let clonedProfileInfo = Object.assign({}, this.state.profile);
        clonedProfileInfo[name] = value;

        this.setState({
            profile: clonedProfileInfo
        });
    };
    handleInterestsChange = (e, {name, checked}) => {
        let clonedProfile = Object.assign({}, this.state.profile);
        if (checked) {
            if (clonedProfile.interests.indexOf(name) < 0) {
                let newInterests = [];
                for (let i in clonedProfile.interests) {
                    if (clonedProfile.interests[i] && newInterests.indexOf(clonedProfile.interests[i]) < 0) {
                        newInterests.push(clonedProfile.interests[i]);
                    }
                }

                newInterests.push(name);

                clonedProfile.interests = newInterests;
            }
        } else {
            let index = clonedProfile.interests.indexOf(name);
            if (index >= 0) {
                let newInterests = [];
                for (let i in clonedProfile.interests) {
                    if (clonedProfile.interests[i] && clonedProfile.interests[i] !== name && newInterests.indexOf(clonedProfile.interests[i]) < 0) {
                        newInterests.push(clonedProfile.interests[i]);
                    }
                }

                clonedProfile.interests = newInterests;
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
                language: ''
            },
            message: ''
        };

        this.submit = this.submit.bind(this);
    }

    closeModal() {
        this.setState({modal: false});
    };

    async submit() {
        let profile = this.validateForm();
        
        try {
            await CurrentUser.updateProfile(profile)

            this.setState({modal: true, message: Resources.getInstance().saveSuccess});
        } catch (ex) {
            ErrorHandler.notify('更新用户资料出错', ex, profile)
            this.setState({modal: true, message: ex.message || Resources.getInstance().saveFailed});
        }
    }

    validateForm() {
        let profile = this.state.profile;
        if (!profile.location) {
            throw new Error('Please tell me your city!')
        }

        //data check if could save to db
        if (profile.date_of_birth) {
            profile.date_of_birth = BirthdayHelper.getBirthdayFromDbFormat(profile.date_of_birth);
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

        let profile = profileSetup.getProfileFromUserData(await CurrentUser.getProfile());

        profile.date_of_birth = BirthdayHelper.getBirthdayFromDbFormat(profile.date_of_birth);

        this.setState({
            profile: profile,
            userId: userId
        });
    }

    static getProfileFromUserData(userData) {
        return {
            interests: userData.interests instanceof Array ? userData.interests : (userData.interests ? userData.interests.split(',') : []),
            display_name: userData.display_name || userData.name || userData.facebook_name || userData.wechat_name || '',
            date_of_birth: BirthdayHelper.getBirthdayFromDbFormat(userData.date_of_birth),
            gender: userData.gender || '',
            location: userData.location || '',
            avatar: userData.avatar || '',
            description: userData.description || '',
            mobile: userData.mobile || '',
            email: userData.email || '',
            role: userData.role || '',
            language: userData.language || ''
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
                    <h4>{Resources.getInstance().profileGender}</h4>
                    <Form.Select options={genderOptions} placeholder={Resources.getInstance().profileGenderHolder}
                                 value={this.state.profile.gender}
                                 onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                     name,
                                     value
                                 })}
                                 name='gender' error={!this.state.profile.gender}/>
                    <h4>{Resources.getInstance().profileBirthday}</h4>
                    <Form.Group widths='equal'>
                        <Form.Input value={this.state.profile.date_of_birth} type="date"
                                    onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                        name,
                                        value
                                    })}
                                    name='date_of_birth' error={!this.state.profile.date_of_birth}/>
                    </Form.Group>
                    <h4>{Resources.getInstance().profileCity}</h4>
                    <Form.Group widths='equal'>
                        <Form.Input placeholder={Resources.getInstance().profileCityHolder}
                                    value={this.state.profile.location}
                                    onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                        name,
                                        value
                                    })}
                                    name='location' error={!this.state.profile.location}/>
                    </Form.Group>
                    <h4>{Resources.getInstance().profileInterests}</h4>
                    <Form.Group widths='equal'>
                        <Form.Checkbox name='football' control={Checkbox} label='Football' width={4}
                                       checked={this.state.profile.interests.indexOf('football') >= 0}
                                       onChange={(e, data) => {
                                           this.handleInterestsChange(e, data);
                                       }}/>
                        <Form.Checkbox name='ping-pang' control={Checkbox} label='Ping-pang' width={4}
                                       checked={this.state.profile.interests.indexOf('ping-pang') >= 0}
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
                    {/*<h4>Language</h4>*/}
                    {/*<Form.Group widths='equal'>*/}
                    {/*<Form.Input placeholder='Language' value={this.state.profile.language}*/}
                    {/*onChange={(e, {name, value}) => this.handleProfileChange(e, {*/}
                    {/*name,*/}
                    {/*value*/}
                    {/*})}*/}
                    {/*name='language' error={!this.state.profile.language}/>*/}
                    {/*</Form.Group>*/}
                    <h4>{Resources.getInstance().profileIntroduction}</h4>
                    <Form.Field id='form-opinion' control={TextArea}
                                placeholder={Resources.getInstance().profileIntroductionHolder}
                                value={this.state.profile.description}
                                onChange={(e, {name, value}) => this.handleProfileChange(e, {
                                    name,
                                    value
                                })}
                                name='description'/>
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content={Resources.getInstance().profileSunmitBtn}
                                    style={{margin: '2em auto', width: '100%', color: 'white', background: 'green'}}
                                    onClick={this.submit}/>
                    </Form.Group>
                </Form>
                <Modal open={this.state.modal} closeIcon onClose={() => this.closeModal()}>
                    <Header icon='archive' content={Resources.getInstance().modalTitle}/>
                    <Modal.Content>
                        <p>{this.state.message}</p>
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
