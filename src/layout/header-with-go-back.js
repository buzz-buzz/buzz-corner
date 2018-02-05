import React, {Component} from 'react';
import './header-with-go-back.css';
import {Icon} from "semantic-ui-react";

class Header extends Component {
    constructor() {
        super();

        this.state = {}
    }

    render() {
        return (
            <div className="header-with-go-back">
                <div className="go-back">
                    <div className="arrow-left">
                    </div>
                    <div className="circle-border">
                        <Icon className='arrow left'  />
                    </div>
                </div>
                <div className="logo">
                    <div>
                        <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
