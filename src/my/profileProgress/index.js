import './index.css'
import Resources from '../../resources';
import React from 'react';
import {MemberType} from "../../membership/member-type";

export default class ProfileProgress extends React.Component {
    render() {
        return (
            this.props.role === MemberType.Student
                ?
                (<div className="profile-progress">
                    <div className={this.props.step > 1 ? 'done' : (this.props.step === 1 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>{Resources.getInstance().profileStep1}</p>
                    </div>
                    <div className={this.props.step > 2 ? 'done' : (this.props.step === 2 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>{Resources.getInstance().profileStep2}</p>
                    </div>
                    <div className={this.props.step > 3 ? 'done' : (this.props.step === 3 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>{Resources.getInstance().profileStep3}</p>
                    </div>
                    <div className={this.props.step > 4 ? 'done' : (this.props.step === 4 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left line-left-last"></div>
                            <div className="circle"></div>
                        </div>
                        <p>{Resources.getInstance().profileStep4}</p>
                    </div>
                </div>)
                :
                (<div className="profile-progress-foreign">
                    <div className={this.props.step > 1 ? 'done' : (this.props.step === 1 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>{Resources.getInstance().profileStep1}</p>
                    </div>
                    <div className={this.props.step > 2 ? 'done' : (this.props.step === 2 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>{Resources.getInstance().profileStep2}</p>
                    </div>
                    <div className={this.props.step > 3 ? 'done' : (this.props.step === 3 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left line-left-last"></div>
                            <div className="circle"></div>
                        </div>
                        <p>{Resources.getInstance().profileStep3}</p>
                    </div>
                </div>)
        )
    }
}