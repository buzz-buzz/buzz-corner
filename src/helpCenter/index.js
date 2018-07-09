import React from 'react';
import {browserHistory} from 'react-router';
import ServiceProxy from '../service-proxy';
import HeaderWithBack from '../common/commonComponent/headerWithBack';

import './index.css';

export default class HelpCenter extends React.Component{
    constructor(){
        super();

        this.state = {
            faq: {
                title: '帮助中心'
            },
            history: []
        };
    }

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

        let clonedHistory = this.state.history.slice();
        clonedHistory.push(updatedFaq);

        this.setState({
            faq: updatedFaq,
            history: clonedHistory
        });
    }

    async faqDetail(event, faq_id){
        await this.updateFaq(faq_id);
    }

    back(){
        if(this.state.faq && ( this.state.faq.type === 'student_index' ||  this.state.faq.type === 'companion_index' )){
            browserHistory.push('/');
        }else if(this.state.history.length && this.state.history.length > 1){
            //back last faq
            let clonedHistory = this.state.history.slice();
            let new_faq = clonedHistory[clonedHistory.length - 2];
            clonedHistory.pop();

            this.setState({
                faq: new_faq,
                history: clonedHistory
            });
        }
    }

    render(){
        return (
            <div className="help-center">
                <HeaderWithBack goBack={this.back} title={this.state.faq.title} />
                <div className="help-list">
                    {
                        this.state.faq && this.state.faq.related_faqs &&
                        this.state.faq.related_faqs.length && this.state.faq.show_related &&
                        <div className="help-title">相关问题</div>
                    }
                    {
                        this.state.faq && this.state.faq.related_faqs &&
                        this.state.faq.related_faqs.length && this.state.faq.show_related &&
                            this.state.faq.related_faqs.map((item, index) => {
                                return <div className="help-item" key={index}
                                            onClick={ (event) => this.faqDetail(event, item.faq_id)}
                                >
                                    <div className="item-name">{item.title}</div>
                                    <div className="item-btn">
                                        <span className="btn-word">{item.sub_title}</span>
                                        <i className="icon-icon_back_down"/>
                                    </div>
                                </div>
                            })
                    }
                </div>
            </div>
        )
    }
}