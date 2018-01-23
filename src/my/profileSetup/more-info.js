import React, {Component} from 'react';
import {Button, Container, Form, Header, Icon, Modal} from 'semantic-ui-react';
import './avatar.css';
import ServiceProxy from '../../service-proxy';
import Resources from '../../resources';
import CurrentUser from "../../membership/user";

export default class profileSetup extends Component {
    constructor() {
        super();

        this.state = {
            avatar: 'https://resource.buzzbuzzenglish.com/ad-icon-1.png',
            mobile: '',
            email: ''
        }
    }

    handlePhoneChange = (e, {value}) => {
        this.setState({
            mobile: value
        });
    };

    handleEmailChange = (e, {value}) => {
        this.setState({
            email: value
        });
    };

    async handleAvatarChange(e) {
        //preview
        let reader = new FileReader();
        reader.onload = (evt) => {
            this.setState({
                avatar: evt.target.result || ''
            });
        };
        reader.readAsDataURL(this.fileInput.files[0]);

        let fileForm = new FormData();

        fileForm.append("avatar", this.fileInput.files[0]);

        let response = await  ServiceProxy.proxy('/avatar', {
            body: fileForm,
            method: 'PUT'
        });

        console.log(response);
    };

    closeModal() {
        this.setState({modal: false});
    };

    async componentDidMount() {
        let userId = await CurrentUser.getUserId();

        let profile = await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
            }
        });

        this.setState({
            avatar: profile.avatar || '',
            mobile: profile.mobile || '',
            email: profile.email || '',
            userData: profile,
            userId: userId
        });
    }

    async submit() {
        try {
            let profile = this.validateForm();

            console.log(profile);

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
        let phone = this.state.mobile;
        let email = this.state.email;
        let avatar = this.state.avatar;
        let userData = this.state.userData;

        console.log(phone, email, avatar);

        if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(phone))) {
            throw new Error(Resources.getInstance().phoneWrong)
        }

        if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))) {
            throw new Error(Resources.getInstance().emailWrong);
        }

        userData.mobile = phone;
        userData.email = email;

        return userData;
    }

    render() {
        return (
            <Container fluid>
                <h1 style={{margin: '14px 0', textAlign: 'center'}}>{Resources.getInstance().avatarTile}</h1>
                <Form>
                    <h4>{Resources.getInstance().avatarLabel}</h4>
                    <Form.Group widths='equal'>
                        <div className="avatar">
                            {
                                this.state.avatar ?
                                    ('')
                                    :
                                    (<div className="plus">
                                        <b>+</b>
                                    </div>)
                            }
                            <input type="file" id="avatar" accept="image/*;capture=camera"
                                   onChange={(e) => this.handleAvatarChange(e)}
                                   ref={input => {
                                       this.fileInput = input;
                                   }}
                                   name="avatar"/>
                            <div id="preview">
                                <img src={this.state.avatar || ''} alt=""/>
                            </div>
                        </div>
                    </Form.Group>
                    <h4>{Resources.getInstance().phoneLabel}</h4>
                    <Form.Group widths='equal'>
                        <Form.Input fluid icon='phone' iconPosition='left' type="number"
                                    placeholder={Resources.getInstance().phoneHolder} value={this.state.mobile}
                                    onChange={(e, {value}) => this.handlePhoneChange(e, {value})}
                                    name='mobile'
                                    error={!this.state.mobile || !(/^1[3|4|5|7|8][0-9]{9}$/.test(this.state.mobile))}/>
                    </Form.Group>
                    <h4>{Resources.getInstance().emailLabel}</h4>
                    <Form.Group widths='equal'>
                        <Form.Input fluid icon='mail' iconPosition='left'
                                    placeholder={Resources.getInstance().emailHolder} value={this.state.email}
                                    onChange={(e, {value}) => this.handleEmailChange(e, {value})}
                                    name='mail'
                                    error={!this.state.email || !(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.state.email))}/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content={Resources.getInstance().profileSunmitBtn}
                                    style={{margin: '2em auto', width: '100%', color: 'white', background: 'green'}}
                                    onClick={()=>this.submit()} />
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