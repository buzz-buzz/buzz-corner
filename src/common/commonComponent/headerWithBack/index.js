import './index.css'
import React from 'react';
import QiniuDomain from '../../systemData/qiniuUrl';

export default class HeaderWithBack extends React.Component {
    render() {
        return (
            <div className={this.props.title ? "header-with-go-back half-line" : "header-with-go-back"}>
                <div className="go-back" onClick={this.props.goBack}>
                    <div className="arrow-left">
                    </div>
                    <div className="circle-border">
                        <img src={ QiniuDomain + "/icon_back.png"} alt=""/>
                    </div>
                </div>
                <div className="logo">
                    {this.props.title ?
                        <div>
                            <span>{this.props.title === 'none' ? '' : this.props.title}</span>
                        </div>
                        :
                        <div>
                            <img src= { QiniuDomain + "/new_buzz_logo.png"} alt="Buzzbuzz"/>
                        </div>
                    }
                </div>
            </div>
        )
    }
}