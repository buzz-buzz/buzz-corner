import React, {Component} from 'react';
import {browserHistory} from "react-router";
import Resources from '../resources';
import Track from "../common/track";
import {Link} from "react-router";
import QiniuDomain from '../common/systemData/qiniuUrl';
import './tabletLayout.css';

class TabletHeader extends Component {
    constructor() {
        super();

        this.goHomePage = this.goHomePage.bind(this);
    }

    goHomePage(){
        browserHistory.push('/');
    }

    render() {
        return (
            <div className="tablet-header">
                <div className="tablet-logo-left">
                    <img src={ QiniuDomain + "/new_buzz_logo.png"} alt="" onClick={this.goHomePage} />
                </div>
                <div className="tablet-middle">
                    <p>Login</p>
                </div>
                <div className="tablet-language-right">

                </div>
            </div>
        );
    }
}

export default TabletHeader;
