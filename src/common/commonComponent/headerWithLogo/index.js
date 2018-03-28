import './index.css'
import React from 'react';

export default class HeaderWithLogo extends React.Component {
    render() {
        return (
            <div className="header-with-go-back">
                <div className="logo-without-back">
                    <div>
                        <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png" alt="Buzzbuzz Logo"/>
                    </div>
                </div>
            </div>
        )
    }
}