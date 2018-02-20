import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Footer from '../layout/footer';
import './index.css';

class Friends extends Component {
    constructor() {
        super();


    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="friends-page">
                <div className="header-without-go-back">
                    <div className="logo-without-back">
                        <div>
                            <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png"/>
                        </div>
                    </div>
                </div>
                <div className="friends-tab">
                    <div>
                        <span>外籍</span>
                    </div>
                    <div>
                        <span>中方</span>
                    </div>
                </div>
                <div className="friends-content">
                    <span>你还没有好友哦</span>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Friends;