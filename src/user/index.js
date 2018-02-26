import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Footer from '../layout/footer';
import './index.css';

class User extends Component {
    constructor() {
        super();


    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="user-page">
                <div className="header-with-go-back">
                    <div className="logo-without-back">
                        <div>
                            <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png"/>
                        </div>
                    </div>
                </div>
                <div className="user-content">
                    <div className="user-my">
                        <div className="user-avatar">
                            <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                        </div>
                        <div className="user-info">
                            <p className="name">Your Name</p>
                            <p className="nationality">USA</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default User;