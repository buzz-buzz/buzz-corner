import React from 'react';
import {browserHistory} from 'react-router';
import ServiceProxy from '../service-proxy';
import {MemberType} from "../membership/member-type";
import HeaderWithBack from '../common/commonComponent/headerWithBack';

import './index.css';

export default class HelpCenter extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            faq: {
                title: '帮助中心'
            },
            history: [],
            role: props.location.query.role,
            faq_id: props.params.faq_id
        };

        this.back = this.back.bind(this);
        this.showHtml = this.showHtml.bind(this);
    }

    async componentWillMount(){
        //get data from service
        await this.updateFaq(this.state.faq_id);
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
        // browserHistory.push(`/help/${faq_id}`);
        window.location.href = `/help/${faq_id}`;
        //await this.updateFaq(faq_id);
    }

    back() {
        if(window.history.length > 2){
            window.history.go(-1);
        }else{
            browserHistory.push('/');
        }
    }

    showHtml(content){
        return   <div dangerouslySetInnerHTML={{__html: content}}></div> ;
    }

    render(){
        return (
            <div className="help-center">
                <HeaderWithBack goBack={this.back} title={this.state.faq.title} />
                <div className="help-content">{ this.state.faq && this.state.faq.content ? this.showHtml(this.state.faq.content) : ''}</div>
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