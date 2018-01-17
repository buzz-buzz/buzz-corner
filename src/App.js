import React, {Component} from 'react';
import './App.css';

import Header from './layout/header';
import Footer from './layout/footer';
import ProfilePage from './profileSetup';
import HomePage from './layout/homepage';
import {browserHistory, Route, Router} from "react-router";
import Login from "./login/index";
import Avatar from './profileSetup/more-info';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <div className="content">
                    <Router history={browserHistory}>
                        <Route path='/' component={HomePage}/>
                        <Route path="/login" component={Login}/>
                        <Route path='/profile' component={ProfilePage}/>
                        <Route path='/profile/avatar' component={Avatar}/>
                    </Router>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default App;
