import React, {Component} from 'react';
import Track from "../common/track";
import './index.css';
import {MemberType} from "../membership/member-type";
import StudentLoginEntryPoint from "./student";
import CompanionLoginEntryPoint from "./companion";
import {browserHistory} from "react-router";
import RoleDesider from "./RoleDesider";

class LoginEntryPoint extends Component {
    constructor() {
        super();

        this.state = {
            role: RoleDesider.getRole()
        };

        if (this.state.role === MemberType.Student) {
            Track.event('登录页面_中方登录页面');
            return;
        }

        if (this.state.role === MemberType.Companion) {
            Track.event('登录页面_外方登录页面');
            return;
        }

        browserHistory.push('/select-role')
    }

    render() {
        return (
            <div start={{height: '100%'}}>
                {
                    this.state.role === MemberType.Student &&
                    <StudentLoginEntryPoint/>
                }
                {
                    this.state.role === MemberType.Companion &&
                    <CompanionLoginEntryPoint/>
                }
            </div>
        );
    }
}

export default LoginEntryPoint;
