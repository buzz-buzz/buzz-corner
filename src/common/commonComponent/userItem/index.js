import React, {Component} from 'react';
import {Flag} from 'semantic-ui-react';
import Avatar from '../avatar';
import './index.css';

export default class UserItem extends Component{
    render(){
        return (
            <div className="user-item" style={this.props.active === this.props.user_id ? {border: '1px solid #f6b40c'} : {}}
                 onClick={(event) => this.props.selectUser(event, this.props.user_id)} >
                <div className="user-item-avatar">
                    <Avatar width="70px" height="70px"
                        src="https://buzz-corner.user.resource.buzzbuzzenglish.com/Fkg6KH2vB8Eu1Hnl7rH9cNP14CAq?imageView2/1/w/400/h/400"/>
                    <Flag
                        name='united states'/>
                </div>
                <div className="user-item-info">
                    <p className="your-name" style={{
                        fontWeight: '500',
                        fontSize: '15px',
                        color: '#000'
                    }}>{'BuzzBuzz'}</p>
                    <p className="gender-birthday" style={{
                        color: '#666',
                        fontSize: '11px'
                    }}>{'No topic'}</p>
                    <p className="city-grade"
                       style={{fontSize: '11px', color: '#666'}}>asfasf</p>
                </div>
            </div>
        )
    }
}