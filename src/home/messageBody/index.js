import React from 'react';
import {Link} from "react-router";
import './index.css';

export default class MessageBody extends React.Component{
    render(){
        return <Link
            className={ this.props.line ? "message-item message-item-line" : "message-item"}
            onClick={event => this.props.clickEventPlacement(event, this.props.item)}>
            <div className="message-item-avatar">
                <div className="img">
                    <img src={this.props.item.message_avatar} alt=""/>
                </div>
                <div className="message-red-circle"
                    style={this.props.item.hasRead === 'read' ? {display: 'none'} : {display: 'block'}}/>
            </div>
            <div className="message-body">
                <div
                    className="message-title">{this.props.item.message_title}</div>
                <div
                    className="message-content">{this.props.item.message_content}</div>
            </div>
            <div className="message-icon">
                <i className="icon-icon_back_down"/>
            </div>
        </Link>
    }
}