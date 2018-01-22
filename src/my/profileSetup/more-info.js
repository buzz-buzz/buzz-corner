import React, {Component} from 'react';
import {Container, Form, Button, Modal, Header, Icon, Input} from 'semantic-ui-react';
import './avatar.css';
import ServiceProxy from '../../service-proxy';
import Resources from '../../resources';

export default class profileSetup extends Component {
    constructor() {
        super();

        this.state = {
            avatar: 'https://resource.buzzbuzzenglish.com/ad-icon-1.png',
            phone: ''
        }
    }

    handlePhoneChange = (e, {value}) => {
        this.setState({
            phone: value
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

    async componentDidMount() {

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
                                    placeholder={Resources.getInstance().phoneHolder} value={this.state.phone}
                                    onChange={(e, {value}) => this.handlePhoneChange(e, {value})}
                                    name='phone'
                                    error={!this.state.phone || !(/^1[3|4|5|7|8][0-9]{9}$/.test(this.state.phone))}/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field id='submit' control={Button} content={Resources.getInstance().profileSunmitBtn}
                                    style={{margin: '2em auto', width: '100%', color: 'white', background: 'green'}}/>
                    </Form.Group>
                </Form>
            </Container>
        );
    }
}