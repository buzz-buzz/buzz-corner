import React, { Component } from 'react';
import Button50px from '../common/commonComponent/submitButton50px';
import UserItem from '../common/commonComponent/userItem';
import Resources from '../resources';
import './index.css';

import { connect } from 'react-redux';

class AccountSelect extends Component {
    constructor() {
        super();

        this.state = { active: '' };

        this.selectUser = this.selectUser.bind(this);
        this.login = this.login.bind(this);
    }

    selectUser(event, user_id) {
        if (this.state.active !== user_id) {
            this.setState({ active: user_id });
        }
    }

    login() {
        console.log(this.state.active);
        this.props.onSelectUser(this.state.active);
    }

    render() {
        return (
            <div className="account-select">
                <div className="account-item">
                    {
                        this.props.users && this.props.users.map(u =>
                            <UserItem active={this.state.active} selectUser={this.selectUser} user={u} key={u.user_id} />
                        )
                    }
                </div>
                <div className="account-btn">
                    <Button50px disabled={!this.state.active}
                        text={Resources.getInstance().accountSelectLoginSubmit} submit={this.login} />
                </div>
            </div>
        )
    }
}

export default connect(state => {
    return {
        users: state.users
    }
}, null)(AccountSelect);