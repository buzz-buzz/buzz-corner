import React, {Component} from 'react';
import Track from "../common/track";
import './index.css';
import {MemberType} from "../membership/member-type";
import StudentLoginEntryPoint from "./student";
import CompanionLoginEntryPoint from "./companion";
import {browserHistory} from "react-router";
import URLHelper from "../common/url-helper";
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

        let return_url = URLHelper.getSearchParam(window.location.search, 'return_url');

        if(return_url){
            browserHistory.push(`/login?return_url=${URLHelper.getSearchParam(window.location.search, 'return_url')}`);
        }else{
            browserHistory.push('/login');
        }

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
