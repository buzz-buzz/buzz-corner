import React from 'react';
import {browserHistory} from 'react-router';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import './index.css';

export default class HelpCenter extends React.Component{
    componentWillMount(){
        //get data from service
    }

    back(){
        if(window.history.length > 2){
            window.history.go(-1);
        }else{
            browserHistory.push('/');
        }
    }

    render(){
        return (
            <div className="help-center">
                <HeaderWithBack goBack={this.back} title='help center' />
            </div>
        )
    }
}