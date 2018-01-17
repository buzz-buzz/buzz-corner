import React, {Component} from 'react';
import './App.css';

import Header from './layout/header';
import Footer from './layout/footer';
import ProfilePage from './profileSetup';
import HomePage from './layout/homepage';
import {Router, Route, browserHistory} from "react-router";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <div className="content">
                    <Router history={browserHistory}>
                        <Route path='/' component={HomePage}/>
                        <Route path='/profile' component={ProfilePage}/>
                    </Router>
                </div>
                <Footer />
            </div>
        );
    }
}

export default App;
