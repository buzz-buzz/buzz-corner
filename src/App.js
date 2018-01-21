import React, {Component} from 'react';

import Header from './layout/header';
import Footer from './layout/footer';
import ProfilePage from './profileSetup';
import HomePage from './layout/homepage';
import {browserHistory, Route, Router} from "react-router";
import Login from "./login/index";
import Avatar from './profileSetup/more-info';
import LoginByFacebook from './login/facebook';
import {Container} from "semantic-ui-react";

class App extends Component {
    render() {
        return (
            <Container style={{height: '100%'}}>
                <Header/>
                <div className="content">
                    <Router history={browserHistory}>
                        <Route path='/' component={HomePage}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/login/facebook" component={LoginByFacebook}/>
                        <Route path='/profile' component={ProfilePage}/>
                        <Route path='/profile/avatar' component={Avatar}/>
                    </Router>
                </div>
                <Footer/>
            </Container>
        );
    }
}

export default App;
