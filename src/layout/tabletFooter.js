import React, {Component} from 'react';
import Resources from '../resources';
import Track from "../common/track";
import {Link} from "react-router";
import QiniuDomain from '../common/systemData/qiniuUrl';
import './tabletLayout.css';

class TabletFooter extends Component {
    render() {
        return (
            <div className="tablet-footer">
                <div className="tablet-logo-left">
                    <img src={QiniuDomain + '/new_buzz_logo.png'} alt=""/>
                </div>
                <div className="tablet-middle">
                    <p className="footer-word">© 2017  Copyrigts are Creative Commons</p>
                </div>
                <div className="tablet-language-right">

                </div>
            </div>
        );
    }
}

export default TabletFooter;
