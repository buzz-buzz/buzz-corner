import React, {Component} from 'react';
import {Container, Segment} from "semantic-ui-react";
import Resources from '../resources';
import {Link} from 'react-router';

class Header extends Component {
    render() {
        return (
            <Container>
                <Segment inverted>
                    <Link to="/" key="home" history="/">
                        <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png" className="" alt="logo" style={{maxWidth: '100%', maxHeight: '50px'}}/>
                    </Link>
                    <h1 className="App-title">{Resources.getInstance().header}</h1>
                </Segment>
            </Container>
        );
    }
}

export default Header;
