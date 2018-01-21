import React, {Component} from 'react';
import {Container, Segment} from "semantic-ui-react";

class Header extends Component {
    render() {
        return (
            <Container>
                <Segment inverted>
                    <a href="/">
                        <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png" className="" alt="logo"
                             style={{maxWidth: '100%', maxHeight: '50px'}}/>
                    </a>
                    <h1 className="App-title">Welcome to Buzzbuzz English Corner</h1>
                </Segment>
            </Container>
        );
    }
}

export default Header;
