import './index.css'
import React from 'react';
import QiniuDomain from '../../systemData/qiniuUrl';

export default class HeaderWithLogo extends React.Component {
    render() {
        return (
            <div className="header-with-logo">
                <div className="logo-without-back">
                    <div>
                        <img src={QiniuDomain + "/new_buzz_logo.png"} alt="Buzzbuzz Logo"/>
                    </div>
                </div>
            </div>
        )
    }
}