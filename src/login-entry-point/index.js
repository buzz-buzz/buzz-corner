import React, {Component} from 'react';
import Track from "../common/track";
import './index.css';
import {MemberType} from "../membership/member-type";
import URLHelper from "../common/url-helper";
import StudentLoginEntryPoint from "./student";
import CompanionLoginEntryPoint from "./companion";

class LoginEntryPoint extends Component {
    constructor() {
        super();

        this.state = {
            role: MemberType.Student
        };
    }

    componentDidMount() {
        this.setState({
            role: URLHelper.getSearchParam(window.location.search, 'role')
        }, () => {
            if (this.state.role === MemberType.Student) {
                Track.event('登录页面_中方登录页面');
            }

            if (this.state.role === MemberType.Companion) {
                Track.event('登录页面_外方登录页面');
            }
        })
    }

    render() {
        return (
            <div>
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
