import './index.css'
import React from 'react';

export default class HeaderWithLogo extends React.Component {
    render() {
        return (
            <div className="header-with-logo">
                <div className="logo-without-back">
                    <div>
                        <img src="//p579tk2n2.bkt.clouddn.com/new_buzz_logo.png" alt="Buzzbuzz Logo"/>
                    </div>
                </div>
            </div>
        )
    }
}