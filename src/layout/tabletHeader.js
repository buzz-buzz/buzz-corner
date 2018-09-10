import React, {Component} from 'react';
import {browserHistory} from "react-router";
import Resources from '../resources';
import Track from "../common/track";
import QiniuDomain from '../common/systemData/qiniuUrl';
import './tabletLayout.css';

class TabletHeader extends Component {
    constructor() {
        super();

        this.goHomePage = this.goHomePage.bind(this);
    }

    goHomePage(){
        Track.event('角色选择_logo点击', 'logo点击');

        browserHistory.push('/login');
    }

    render() {
        return (
            <div className="tablet-header">
                <div className="tablet-logo-left">
                    <img src={ QiniuDomain + "/new_buzz_logo.png"} alt="" onClick={this.goHomePage} />
                </div>
                <div className="tablet-middle">
                    <p onClick={this.goHomePage}>{Resources.getInstance().homeLogin}</p>
                </div>
            </div>
        );
    }
}

export default TabletHeader;
