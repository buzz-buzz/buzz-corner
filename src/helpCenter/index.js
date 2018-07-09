import React from 'react';
import {browserHistory} from 'react-router';
import ServiceProxy from '../service-proxy';
import HeaderWithBack from '../common/commonComponent/headerWithBack';

import './index.css';

export default class HelpCenter extends React.Component{
    async componentWillMount(){
        //get data from service
        await this.updateFaq('student_index');
    }

    async updateFaq(faq_id){
        let updatedFaq = await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/faq/${faq_id}`
            }
        });

        this.setState({
            faq: updatedFaq
        });
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
                <div className="help-list">
                    <div className="help-title">常见问题</div>
                    <div className="help-item">
                        <div className="item-name">如何上课</div>
                        <div className="item-btn">
                            <span className="btn-word">支持mac</span>
                            <i className="icon-icon_back_down"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}