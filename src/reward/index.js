import React, {Component} from 'react';
import {Icon} from 'semantic-ui-react';
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
                <div className="header-with-go-back">
                    <div className="logo-without-back">
                        <div>
                            <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png"/>
                        </div>
                    </div>
                </div>
                <div className="my-badge">
                    <div className="badge-title">
                        <p>My badge</p>
                    </div>
                    <div className="badge">
                        <div className="blue-diamond">
                            <Icon name='diamond' />
                            <p>Blue</p>
                            <p>Diamond</p>
                        </div>
                        <div className="red-diamond">
                            <Icon name='diamond' />
                            <p>Red</p>
                            <p>Diamond</p>
                        </div>
                        <div className="yellow-diamond">
                            <Icon name='diamond' />
                            <p>Yellow</p>
                            <p>Diamond</p>
                        </div>
                    </div>
                    <div className="badge-rule">
                        <p>查看获取规则</p>
                    </div>
                </div>
                <div className="miles">
                    <div className="title">BuzzBuzz Miles</div>
                    <div className="buzz-miles">
                        <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"/>
                        <span>0</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Reward;