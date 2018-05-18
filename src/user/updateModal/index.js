import React, {Component} from 'react';
import Resources from '../../resources';
import {Topics} from "../../common/systemData/topicData";
import Hobby from '../../my/hobby';
import './index.css';

class UpdateModal extends Component {


    render() {
        return (
            <div className="update-modal" style={this.props.modalShow === true ? {display: 'flex'}:{display: 'none'}}>
                <div className="grey"  onClick={this.props.topicToggle}></div>
                <div className="update-hobbies" id="update-modal">
                    <div className="title">
                        <div className="title-word">{Resources.getInstance().profileStep3}</div>
                        <button className="title-btn" onClick={this.props.topicToggle}>{Resources.getInstance().profileSunmitBtn}</button>
                    </div>
                    <div className="hobby-content">
                        {
                            Topics.map((item, index) => {
                                return <Hobby key={index} src={item.url} circleColor={item.color_f}
                                              bgColor={item.color_b} word={item.name} wordColor={item.color_f} select={this.props.topicChange}
                                              name={item.value}
                                              selected={this.props.topics.indexOf(item.value) >= 0} />
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default UpdateModal;