import React, {Component} from 'react';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import Button50px from '../common/commonComponent/submitButton50px';
import UserItem from '../common/commonComponent/userItem';
import Resources from '../resources';
import './index.css';

export default class AccountSelect extends Component{
    constructor(){
        super();

        this.state = {
            active: '',
            userList: []
        };

        this.selectUser = this.selectUser.bind(this);
        this.login = this.login.bind(this);
    }

    componentWillMount(){
        this.setState({
            userList: JSON.parse(sessionStorage.getItem('userList')) || []
        }, () => {
            sessionStorage.clear();
        });
    }

    selectUser(event, user_id){
        if(this.state.active !== user_id){
            this.setState({active: user_id});
        }
    }

    login(){
        console.log(this.state.active);
    }
    render(){
        return (
            <div className="account-select">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().accountSelectLogin}/>
                <div className="account-item">
                    {
                        this.state.userList.map((item, index) => {
                            return <UserItem active={this.state.active}  data={item}
                                             selectUser={this.selectUser} user_id={item.user_id} key={index}/>
                        })
                    }
                </div>
                <div className="account-btn">
                    <Button50px disabled={!this.state.active}
                                text={Resources.getInstance().accountSelectLoginSubmit} submit={this.login}/>
                </div>
            </div>
        )
    }
}