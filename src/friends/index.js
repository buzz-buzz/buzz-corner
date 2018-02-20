import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Footer from '../layout/footer';
import './index.css';

class Friends extends Component {
    constructor() {
        super();

        this.state = {
            friends_type: 1
        };

        this.friendTypeOne = this.friendTypeOne.bind(this);
        this.friendTypeTwo = this.friendTypeTwo.bind(this);
    }

    friendTypeOne(){
        let type = this.state.friends_type;

        if(type !== 1){
            this.setState({
                friends_type: 1
            });
        }
    }

    friendTypeTwo(){
        let type = this.state.friends_type;

        if(type !== 2){
            this.setState({
                friends_type: 2
            });
        }
    }


    async componentDidMount() {

    }

    render() {
        return (
            <div className="friends-page">
                <div className="header-without-go-back">
                    <div className="logo-without-back">
                        <div>
                            <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png"/>
                        </div>
                    </div>
                </div>
                <div className="friends-tab">
                    <div onClick={this.friendTypeOne} style={this.state.friends_type === 1 ? {color: '#f7b52a'} : {}}>
                        <span>外籍</span>
                    </div>
                    <div onClick={this.friendTypeTwo} style={this.state.friends_type === 2 ? {color: '#f7b52a'} : {}}>
                        <span>中方</span>
                    </div>
                </div>
                <div className="friends-content">
                    <span>你还没有好友哦</span>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Friends;