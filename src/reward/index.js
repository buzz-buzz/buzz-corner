import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Footer from '../layout/footer';
import './index.css';

class Reward extends Component {
    constructor() {
        super();


    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="reward-page">

                <Footer />
            </div>
        );
    }
}

export default Reward;