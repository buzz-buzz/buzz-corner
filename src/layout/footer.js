import React, {Component} from 'react';
import {Container} from "semantic-ui-react";
import './footer.css';

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div className="home-page"></div>
                <div className="friend-page"></div>
                <div className="reward-page"></div>
                <div className="my-page"></div>
            </div>
        );
    }
}

export default Footer;
