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
            avatar: 'https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd',
            mobile: '',
            email: ''
        };

        this.submit = this.submit.bind(this);
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
        try {
            let qiniu_token = await  ServiceProxy.proxy('/qiniu/token', {
                method: 'GET'
            });

            if(!qiniu_token.uptoken){
                throw new Error(Resources.getInstance().avatarTokenWrong);
            }

            let fileForm = new FormData();

            fileForm.append("name", this.fileInput.files[0].name);
            fileForm.append("file", this.fileInput.files[0]);
            fileForm.append("token", qiniu_token.uptoken);

            let result = await ServiceProxy.proxy(qiniu_token.upload_url,{
                method: 'POST',
                body: fileForm,
                credentials: undefined,
                headers: undefined
            });

            if(!result.key || !result.hash){
                throw new Error(Resources.getInstance().avatarKeyWrong);
            }else{
                this.setState({
                    avatar: qiniu_token.resources_url + result.key
                });
            }
        } catch (ex) {
            console.error(ex);
            this.setState({modal: true, message: ex.message || Resources.getInstance().avatarWrong});
        }
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
            userId: userId
        });
    }

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

            this.setState({modal: true, message: Resources.getInstance().saveSuccess});
        } catch (ex) {
            console.error(ex);
            this.setState({modal: true, message: ex.message || Resources.getInstance().saveFailed});
        }
    }

    validateForm() {
        let phone = this.state.mobile;
        let email = this.state.email;
        let avatar = this.state.avatar;

        if (!phone) {
            throw new Error(Resources.getInstance().phoneWrong)
        }

        if (!email) {
            throw new Error(Resources.getInstance().emailWrong);
        }

        return {
            mobile: phone,
            email: email,
            avatar: avatar
        };
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
                                    error={!this.state.mobile}/>
                    </Form.Group>
                    <h4>{Resources.getInstance().emailLabel}</h4>
                    <Form.Group widths='equal'>
                        <Form.Input fluid icon='mail' iconPosition='left'
                                    placeholder={Resources.getInstance().emailHolder} value={this.state.email}
                                    onChange={(e, {value}) => this.handleEmailChange(e, {value})}
                                    name='mail'
                                    error={!this.state.email}/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content={Resources.getInstance().profileSunmitBtn}
                                    style={{margin: '2em auto', width: '100%', color: 'white', background: 'green'}}
                                    onClick={this.submit} />
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