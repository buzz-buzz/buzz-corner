import React, {Component} from 'react';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import Button50px from '../common/commonComponent/submitButton50px';
import UserItem from '../common/commonComponent/userItem';
import Resources from '../resources';
import './index.css';

export default class AccountSelect extends Component{
    constructor(){
        super();

        this.state = {active: ''};

        this.selectUser = this.selectUser.bind(this);
        this.login = this.login.bind(this);
    }

    selectUser(event, user_id){
        if(this.state.active !== user_id){
            this.setState({active: user_id});
        }
    }

    login(){


    }
    render(){
        return (
            <div className="account-select">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().accountSelectLogin}/>
                <div className="account-item">
                    <UserItem active={this.state.active} selectUser={this.selectUser} user_id={1} />
                    <UserItem active={this.state.active} selectUser={this.selectUser} user_id={2} />
                </div>
                <div className="account-btn">
                    <Button50px disabled={!this.state.active}
                                text={Resources.getInstance().accountSelectLoginSubmit} submit={this.login}/>
                </div>
            </div>
        )
    }
}