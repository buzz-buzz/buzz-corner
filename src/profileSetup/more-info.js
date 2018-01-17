import React, {Component} from 'react';
import {Container, Form, Button, Modal, Header, Icon, Input} from 'semantic-ui-react';
import './avatar.css';
import ServiceProxy from '../service-proxy';

export default class profileSetup extends Component {
    constructor() {
        super();

        this.state = {
            avatar: '',
            phone: ''
        }
    }

    handlePhoneChange = (e, {value}) => {
        this.setState({
            phone: value
        });
    };

    handleAvatarChange = (e) => {
        var prevDiv = document.getElementById('preview');
        console.log(this.fileInput.files[0].name);
        //preview
        let reader = new FileReader();
        reader.onload = function (evt) {
            prevDiv.innerHTML = '<img src="' + evt.target.result + '" />';
        };
        reader.readAsDataURL(this.fileInput.files[0]);
    };

    async componentDidMount() {

    }

    render() {
        return (
            <Container fluid>
                <h1 style={{margin: '14px 0', textAlign: 'center'}}>Setup your avatar</h1>
                <Form>
                    <h4>avatar</h4>
                    <Form.Group widths='equal'>
                        <div className="avatar">
                            {
                                this.state.avatar ?
                                    (<img src={this.state.avatar} alt="loading" />)
                                    :
                                    (<div className="plus">
                                        <b>+</b>
                                    </div>)
                            }
                            <input type="file" id="avatar" accept="image/*;capture=camera"
                                   onChange={(e) => this.handleAvatarChange(e)}
                                   ref={input => {this.fileInput = input;}}
                                   name="avatar" />
                            <div id="preview"></div>
                        </div>
                    </Form.Group>
                    <h4>phone number</h4>
                    <Form.Group widths='equal'>
                        <Form.Input fluid icon='phone' iconPosition='left'
                                    placeholder='Your phone number'  value={this.state.phone}
                                    onChange={(e, {value}) => this.handlePhoneChange(e, {value})}
                                    name='phone' error={!this.state.phone || !(/^1[3|4|5|7|8][0-9]{9}$/.test(this.state.phone))} />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field id='submit' control={Button} content='Continue'
                                    style={{margin: '2em auto', width: '100%', color: 'white', background: 'green'}} />
                    </Form.Group>
                </Form>
            </Container>
        );
    }
}