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

                <Footer />
            </div>
        );
    }
}

export default User;