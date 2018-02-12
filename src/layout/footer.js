import React, {Component} from 'react';
import {Container, Icon} from "semantic-ui-react";
import './footer.css';

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div className="home-page">
                    <Icon name='home'/>
                    <p>
                        Home
                    </p>
                </div>
                <div className="friend-page">
                    <Icon name='users'/>
                    <p>
                        Friends
                    </p>
                </div>
                <div className="reward-page">
                    <Icon name='gift'/>
                    <p>
                        Reward
                    </p>
                </div>
                <div className="my-page">
                    <Icon name='user'/>
                    <p>
                        User
                    </p>
                </div>
            </div>
        );
    }
}

export default Footer;
